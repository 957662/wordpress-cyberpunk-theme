"""
Search API endpoints
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.services.search_service import SearchService
from app.core.logging import get_logger

router = APIRouter(prefix="/search", tags=["search"])
logger = get_logger(__name__)


@router.get("/posts")
async def search_posts(
    query: str = Query(..., min_length=1, description="Search query"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    tag_ids: Optional[str] = Query(None, description="Comma-separated tag IDs"),
    author_id: Optional[int] = Query(None, description="Filter by author ID"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Search posts with various filters

    - **query**: Search query string (required)
    - **category_id**: Optional category filter
    - **tag_ids**: Optional comma-separated tag IDs
    - **author_id**: Optional author filter
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    """
    search_service = SearchService(db)

    tag_ids_list = None
    if tag_ids:
        tag_ids_list = [int(tid.strip()) for tid in tag_ids.split(",") if tid.strip().isdigit()]

    results = search_service.search_posts(
        query=query,
        category_id=category_id,
        tag_ids=tag_ids_list,
        author_id=author_id,
        page=page,
        page_size=page_size
    )

    return results


@router.get("/suggestions")
async def search_suggestions(
    query: str = Query(..., min_length=2, description="Partial search query"),
    limit: int = Query(10, ge=1, le=20, description="Max suggestions"),
    db: Session = Depends(get_db)
):
    """
    Get search suggestions

    - **query**: Partial search query (min 2 characters)
    - **limit**: Maximum number of suggestions (default: 10, max: 20)
    """
    search_service = SearchService(db)
    suggestions = search_service.search_suggestions(query=query, limit=limit)

    return {"suggestions": suggestions}


@router.get("/trending")
async def get_trending_searches(
    limit: int = Query(10, ge=1, le=20, description="Max trending items"),
    db: Session = Depends(get_db)
):
    """
    Get trending search terms

    - **limit**: Maximum number of trending items (default: 10, max: 20)
    """
    search_service = SearchService(db)
    trending = search_service.get_trending_searches(limit=limit)

    return {"trending": trending}


@router.get("/advanced")
async def advanced_search(
    query: str = Query(..., min_length=1, description="Search query"),
    categories: Optional[str] = Query(None, description="Comma-separated category slugs"),
    tags: Optional[str] = Query(None, description="Comma-separated tag slugs"),
    date_from: Optional[str] = Query(None, description="Start date (ISO format)"),
    date_to: Optional[str] = Query(None, description="End date (ISO format)"),
    sort_by: Optional[str] = Query("relevance", description="Sort by: relevance, date, popularity"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Advanced search with multiple filters

    - **query**: Search query string
    - **categories**: Comma-separated category slugs
    - **tags**: Comma-separated tag slugs
    - **date_from**: Optional start date
    - **date_to**: Optional end date
    - **sort_by**: Sort field (relevance, date, popularity)
    - **page**: Page number
    - **page_size**: Items per page
    """
    # This would implement more complex search logic
    # For now, delegate to basic search
    search_service = SearchService(db)

    results = search_service.search_posts(
        query=query,
        page=page,
        page_size=page_size
    )

    return results
