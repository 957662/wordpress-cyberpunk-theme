"""
Batch operations service for handling bulk operations efficiently
"""
from typing import List, Dict, Any, TypeVar, Generic, Optional, Callable
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
import asyncio
from datetime import datetime

from ..models.base import Base
from ..core.database import get_db


T = TypeVar('T', bound=Base)


class BatchOperationResult(BaseModel):
    """Result of a batch operation"""
    total: int
    successful: int
    failed: int
    errors: List[Dict[str, Any]]
    duration_ms: float


class BatchOperationConfig(BaseModel):
    """Configuration for batch operations"""
    batch_size: int = 100
    max_parallel_tasks: int = 5
    continue_on_error: bool = True
    retry_failed: bool = False
    max_retries: int = 3


class BatchOperationsService(Generic[T]):
    """
    Service for handling batch operations on database models

    Provides efficient bulk operations with error handling and progress tracking.
    """

    def __init__(
        self,
        model: type[T],
        db: AsyncSession,
        config: Optional[BatchOperationConfig] = None
    ):
        self.model = model
        self.db = db
        self.config = config or BatchOperationConfig()
        self._results: List[Dict[str, Any]] = []
        self._start_time: Optional[float] = None

    async def batch_create(
        self,
        items: List[Dict[str, Any]],
        preprocess: Optional[Callable[[Dict[str, Any]], Dict[str, Any]]] = None
    ) -> BatchOperationResult:
        """
        Create multiple records in batches

        Args:
            items: List of dictionaries containing record data
            preprocess: Optional function to preprocess each item before creation

        Returns:
            BatchOperationResult with statistics
        """
        self._start_time = datetime.utcnow().timestamp()
        successful = 0
        failed = 0
        errors = []

        # Process in batches
        for i in range(0, len(items), self.config.batch_size):
            batch = items[i:i + self.config.batch_size]

            # Create tasks for parallel processing
            tasks = []
            for item in batch:
                if preprocess:
                    item = preprocess(item)

                task = self._create_single(item)
                tasks.append(task)

            # Execute batch
            batch_results = await asyncio.gather(
                *tasks,
                return_exceptions=True
            )

            # Process results
            for result in batch_results:
                if isinstance(result, Exception):
                    failed += 1
                    errors.append({
                        "error": str(result),
                        "type": type(result).__name__
                    })
                    if not self.config.continue_on_error:
                        raise result
                else:
                    successful += 1

            # Commit batch
            await self.db.commit()

        duration = (datetime.utcnow().timestamp() - self._start_time) * 1000

        return BatchOperationResult(
            total=len(items),
            successful=successful,
            failed=failed,
            errors=errors[:100],  # Limit error details
            duration_ms=duration
        )

    async def batch_update(
        self,
        ids: List[Any],
        update_data: Dict[str, Any],
        id_field: str = "id"
    ) -> BatchOperationResult:
        """
        Update multiple records by their IDs

        Args:
            ids: List of record IDs to update
            update_data: Dictionary of fields to update
            id_field: Name of the ID field (default: "id")

        Returns:
            BatchOperationResult with statistics
        """
        self._start_time = datetime.utcnow().timestamp()
        successful = 0
        failed = 0
        errors = []

        # Process in batches
        for i in range(0, len(ids), self.config.batch_size):
            batch_ids = ids[i:i + self.config.batch_size]

            try:
                # Build update query
                stmt = (
                    update(self.model)
                    .where(getattr(self.model, id_field).in_(batch_ids))
                    .values(**update_data)
                )

                result = await self.db.execute(stmt)
                successful += result.rowcount
                await self.db.commit()

            except Exception as e:
                failed += len(batch_ids)
                errors.append({
                    "error": str(e),
                    "batch": batch_ids
                })
                await self.db.rollback()
                if not self.config.continue_on_error:
                    raise

        duration = (datetime.utcnow().timestamp() - self._start_time) * 1000

        return BatchOperationResult(
            total=len(ids),
            successful=successful,
            failed=failed,
            errors=errors,
            duration_ms=duration
        )

    async def batch_delete(
        self,
        ids: List[Any],
        id_field: str = "id"
    ) -> BatchOperationResult:
        """
        Delete multiple records by their IDs

        Args:
            ids: List of record IDs to delete
            id_field: Name of the ID field (default: "id")

        Returns:
            BatchOperationResult with statistics
        """
        self._start_time = datetime.utcnow().timestamp()
        successful = 0
        failed = 0
        errors = []

        # Process in batches
        for i in range(0, len(ids), self.config.batch_size):
            batch_ids = ids[i:i + self.config.batch_size]

            try:
                # Build delete query
                stmt = (
                    delete(self.model)
                    .where(getattr(self.model, id_field).in_(batch_ids))
                )

                result = await self.db.execute(stmt)
                successful += result.rowcount
                await self.db.commit()

            except Exception as e:
                failed += len(batch_ids)
                errors.append({
                    "error": str(e),
                    "batch": batch_ids
                })
                await self.db.rollback()
                if not self.config.continue_on_error:
                    raise

        duration = (datetime.utcnow().timestamp() - self._start_time) * 1000

        return BatchOperationResult(
            total=len(ids),
            successful=successful,
            failed=failed,
            errors=errors,
            duration_ms=duration
        )

    async def batch_get(
        self,
        ids: List[Any],
        id_field: str = "id"
    ) -> List[T]:
        """
        Retrieve multiple records by their IDs

        Args:
            ids: List of record IDs to retrieve
            id_field: Name of the ID field (default: "id")

        Returns:
            List of model instances
        """
        results = []

        # Process in batches
        for i in range(0, len(ids), self.config.batch_size):
            batch_ids = ids[i:i + self.config.batch_size]

            stmt = (
                select(self.model)
                .where(getattr(self.model, id_field).in_(batch_ids))
            )

            result = await self.db.execute(stmt)
            batch_results = result.scalars().all()
            results.extend(batch_results)

        return results

    async def batch_upsert(
        self,
        items: List[Dict[str, Any]],
        unique_fields: List[str],
        update_data: Optional[Dict[str, Any]] = None
    ) -> BatchOperationResult:
        """
        Bulk upsert (insert or update) records

        Args:
            items: List of dictionaries containing record data
            unique_fields: Fields that determine uniqueness
            update_data: Optional dictionary of fields to update on conflict

        Returns:
            BatchOperationResult with statistics
        """
        self._start_time = datetime.utcnow().timestamp()
        successful = 0
        failed = 0
        errors = []

        for item in items:
            try:
                # Build filter condition
                conditions = [
                    getattr(self.model, field) == item[field]
                    for field in unique_fields
                    if field in item
                ]

                # Check if exists
                stmt = select(self.model).where(*conditions)
                result = await self.db.execute(stmt)
                existing = result.scalar_one_or_none()

                if existing:
                    # Update
                    update_dict = update_data or {k: v for k, v in item.items() if k != 'id'}
                    for key, value in update_dict.items():
                        setattr(existing, key, value)
                else:
                    # Create
                    new_record = self.model(**item)
                    self.db.add(new_record)

                successful += 1

            except Exception as e:
                failed += 1
                errors.append({
                    "error": str(e),
                    "item": item
                })
                if not self.config.continue_on_error:
                    raise

        await self.db.commit()

        duration = (datetime.utcnow().timestamp() - self._start_time) * 1000

        return BatchOperationResult(
            total=len(items),
            successful=successful,
            failed=failed,
            errors=errors[:100],
            duration_ms=duration
        )

    async def _create_single(self, item_data: Dict[str, Any]) -> T:
        """Create a single record"""
        instance = self.model(**item_data)
        self.db.add(instance)
        await self.db.flush()
        return instance


# Convenience functions
async def batch_create_records(
    model: type[T],
    items: List[Dict[str, Any]],
    db: AsyncSession,
    batch_size: int = 100
) -> BatchOperationResult:
    """
    Convenience function for batch creating records

    Args:
        model: SQLAlchemy model class
        items: List of record data dictionaries
        db: Database session
        batch_size: Number of records per batch

    Returns:
        BatchOperationResult with statistics
    """
    config = BatchOperationConfig(batch_size=batch_size)
    service = BatchOperationsService(model, db, config)
    return await service.batch_create(items)


async def batch_update_records(
    model: type[T],
    ids: List[Any],
    update_data: Dict[str, Any],
    db: AsyncSession,
    batch_size: int = 100
) -> BatchOperationResult:
    """
    Convenience function for batch updating records

    Args:
        model: SQLAlchemy model class
        ids: List of record IDs
        update_data: Dictionary of fields to update
        db: Database session
        batch_size: Number of records per batch

    Returns:
        BatchOperationResult with statistics
    """
    config = BatchOperationConfig(batch_size=batch_size)
    service = BatchOperationsService(model, db, config)
    return await service.batch_update(ids, update_data)


async def batch_delete_records(
    model: type[T],
    ids: List[Any],
    db: AsyncSession,
    batch_size: int = 100
) -> BatchOperationResult:
    """
    Convenience function for batch deleting records

    Args:
        model: SQLAlchemy model class
        ids: List of record IDs
        db: Database session
        batch_size: Number of records per batch

    Returns:
        BatchOperationResult with statistics
    """
    config = BatchOperationConfig(batch_size=batch_size)
    service = BatchOperationsService(model, db, config)
    return await service.batch_delete(ids)
