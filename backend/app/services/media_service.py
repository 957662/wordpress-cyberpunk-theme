"""
Media Service - 媒体服务
处理文件上传、图像处理、媒体管理等
"""

import os
import uuid
from typing import Optional, Dict, List, Any
from datetime import datetime
from pathlib import Path
import aiofiles
import aiohttp
from fastapi import UploadFile, HTTPException
from PIL import Image
import io
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class MediaService:
    """媒体服务类"""

    def __init__(self):
        """初始化媒体服务"""
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.base_url = settings.WORDPRESS_URL
        self.allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}
        self.max_file_size = settings.MAX_UPLOAD_SIZE

        # 确保上传目录存在
        self.upload_dir.mkdir(parents=True, exist_ok=True)

        # 创建子目录
        (self.upload_dir / "images").mkdir(exist_ok=True)
        (self.upload_dir / "videos").mkdir(exist_ok=True)
        (self.upload_dir / "documents").mkdir(exist_ok=True)
        (self.upload_dir / "thumbnails").mkdir(exist_ok=True)

    def _get_file_extension(self, filename: str) -> str:
        """获取文件扩展名"""
        return Path(filename).suffix.lower()

    def _is_allowed_file(self, filename: str) -> bool:
        """检查文件类型是否允许"""
        ext = self._get_file_extension(filename)
        return ext in self.allowed_extensions

    def _generate_filename(self, original_filename: str) -> str:
        """生成唯一文件名"""
        ext = self._get_file_extension(original_filename)
        unique_name = f"{uuid.uuid4().hex}{ext}"
        return unique_name

    def _get_subdirectory(self, filename: str) -> str:
        """根据文件类型获取子目录"""
        ext = self._get_file_extension(filename)

        if ext in {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}:
            return "images"
        elif ext in {'.mp4', '.webm', '.mov'}:
            return "videos"
        else:
            return "documents"

    async def upload_file(
        self,
        file: UploadFile,
        optimize: bool = True,
        create_thumbnail: bool = True
    ) -> Dict[str, Any]:
        """
        上传文件

        Args:
            file: 上传的文件
            optimize: 是否优化图像
            create_thumbnail: 是否创建缩略图
        """
        try:
            # 验证文件
            if not self._is_allowed_file(file.filename or ""):
                raise HTTPException(
                    status_code=400,
                    detail=f"File type not allowed. Allowed types: {self.allowed_extensions}"
                )

            # 读取文件内容
            content = await file.read()

            # 检查文件大小
            if len(content) > self.max_file_size:
                raise HTTPException(
                    status_code=400,
                    detail=f"File too large. Maximum size: {self.max_file_size} bytes"
                )

            # 生成文件名和路径
            filename = self._generate_filename(file.filename or "file")
            subdirectory = self._get_subdirectory(filename)
            file_path = self.upload_dir / subdirectory / filename

            # 保存文件
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)

            # 获取文件信息
            file_size = len(content)
            file_type = file.content_type or "application/octet-stream"

            result = {
                "id": str(uuid.uuid4()),
                "filename": filename,
                "original_filename": file.filename,
                "file_path": str(file_path.relative_to(self.upload_dir)),
                "url": f"{self.base_url}/uploads/{subdirectory}/{filename}",
                "file_size": file_size,
                "file_type": file_type,
                "uploaded_at": datetime.now().isoformat()
            }

            # 如果是图像，进行处理
            if self._is_image(filename):
                image_info = await self._process_image(
                    file_path,
                    optimize=optimize,
                    create_thumbnail=create_thumbnail
                )
                result.update(image_info)

            logger.info(f"File uploaded successfully: {filename}")
            return result

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"File upload failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    def _is_image(self, filename: str) -> bool:
        """检查是否为图像文件"""
        ext = self._get_file_extension(filename)
        return ext in {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

    async def _process_image(
        self,
        file_path: Path,
        optimize: bool = True,
        create_thumbnail: bool = True
    ) -> Dict[str, Any]:
        """
        处理图像：优化和创建缩略图
        """
        try:
            # 打开图像
            with Image.open(file_path) as img:
                width, height = img.size
                format = img.format or "JPEG"
                mode = img.mode

                # 转换为 RGB（如果需要）
                if mode in ('RGBA', 'LA', 'P'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background

                info = {
                    "width": width,
                    "height": height,
                    "format": format,
                    "aspect_ratio": round(width / height, 2)
                }

                # 优化图像
                if optimize:
                    optimized_path = await self._optimize_image(img, file_path)
                    info["optimized_url"] = f"{self.base_url}/uploads/{optimized_path.relative_to(self.upload_dir)}"
                    info["optimized_size"] = optimized_path.stat().st_size

                # 创建缩略图
                if create_thumbnail:
                    thumbnail_path = await self._create_thumbnail(img, file_path)
                    info["thumbnail_url"] = f"{self.base_url}/uploads/{thumbnail_path.relative_to(self.upload_dir)}"

                return info

        except Exception as e:
            logger.error(f"Image processing failed: {e}")
            return {}

    async def _optimize_image(self, img: Image.Image, original_path: Path) -> Path:
        """优化图像"""
        try:
            # 创建优化文件名
            optimized_filename = f"{original_path.stem}_optimized{original_path.suffix}"
            optimized_path = original_path.parent / optimized_filename

            # 保存优化的图像
            img.save(
                optimized_path,
                format='JPEG',
                quality=85,
                optimize=True,
                progressive=True
            )

            logger.info(f"Image optimized: {optimized_filename}")
            return optimized_path

        except Exception as e:
            logger.error(f"Image optimization failed: {e}")
            return original_path

    async def _create_thumbnail(
        self,
        img: Image.Image,
        original_path: Path,
        size: tuple = (300, 300)
    ) -> Path:
        """创建缩略图"""
        try:
            # 创建缩略图文件名
            thumbnail_filename = f"{original_path.stem}_thumb{original_path.suffix}"
            thumbnail_path = self.upload_dir / "thumbnails" / thumbnail_filename

            # 创建缩略图
            img_copy = img.copy()
            img_copy.thumbnail(size, Image.Resampling.LANCZOS)

            # 保存缩略图
            img_copy.save(thumbnail_path, format='JPEG', quality=80)

            logger.info(f"Thumbnail created: {thumbnail_filename}")
            return thumbnail_path

        except Exception as e:
            logger.error(f"Thumbnail creation failed: {e}")
            return original_path

    async def delete_file(self, file_path: str) -> bool:
        """
        删除文件

        Args:
            file_path: 文件相对路径
        """
        try:
            full_path = self.upload_dir / file_path

            if full_path.exists():
                full_path.unlink()

                # 也删除相关的缩略图和优化版本
                stem = Path(file_path).stem
                parent = full_path.parent

                # 删除缩略图
                thumbnail_path = self.upload_dir / "thumbnails" / f"{stem}_thumb.jpg"
                if thumbnail_path.exists():
                    thumbnail_path.unlink()

                # 删除优化版本
                optimized_path = parent / f"{stem}_optimized{full_path.suffix}"
                if optimized_path.exists():
                    optimized_path.unlink()

                logger.info(f"File deleted: {file_path}")
                return True

            return False

        except Exception as e:
            logger.error(f"File deletion failed: {e}")
            return False

    async def get_file_info(self, file_path: str) -> Optional[Dict[str, Any]]:
        """获取文件信息"""
        try:
            full_path = self.upload_dir / file_path

            if not full_path.exists():
                return None

            stat = full_path.stat()
            ext = self._get_file_extension(file_path)

            info = {
                "filename": full_path.name,
                "file_path": file_path,
                "url": f"{self.base_url}/uploads/{file_path}",
                "file_size": stat.st_size,
                "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "modified_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "extension": ext
            }

            # 如果是图像，获取尺寸信息
            if self._is_image(file_path):
                with Image.open(full_path) as img:
                    info["width"] = img.width
                    info["height"] = img.height
                    info["format"] = img.format

            return info

        except Exception as e:
            logger.error(f"Failed to get file info: {e}")
            return None

    async def list_files(
        self,
        subdirectory: str = "",
        limit: int = 50,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """列出文件"""
        try:
            search_path = self.upload_dir / subdirectory if subdirectory else self.upload_dir

            if not search_path.exists():
                return []

            files = []
            for file_path in search_path.iterdir():
                if file_path.is_file():
                    info = await self.get_file_info(str(file_path.relative_to(self.upload_dir)))
                    if info:
                        files.append(info)

            # 分页
            return files[offset:offset + limit]

        except Exception as e:
            logger.error(f"Failed to list files: {e}")
            return []

    async def upload_from_url(
        self,
        url: str,
        filename: Optional[str] = None,
        optimize: bool = True
    ) -> Dict[str, Any]:
        """
        从 URL 上传文件

        Args:
            url: 文件 URL
            filename: 可选的文件名
            optimize: 是否优化图像
        """
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        raise HTTPException(status_code=400, detail="Failed to download file")

                    content = await response.read()

            # 生成文件名
            original_filename = filename or url.split('/')[-1]
            new_filename = self._generate_filename(original_filename)

            # 保存文件
            subdirectory = self._get_subdirectory(new_filename)
            file_path = self.upload_dir / subdirectory / new_filename

            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)

            result = {
                "id": str(uuid.uuid4()),
                "filename": new_filename,
                "original_filename": original_filename,
                "file_path": str(file_path.relative_to(self.upload_dir)),
                "url": f"{self.base_url}/uploads/{subdirectory}/{new_filename}",
                "file_size": len(content),
                "source_url": url,
                "uploaded_at": datetime.now().isoformat()
            }

            # 如果是图像，进行处理
            if self._is_image(new_filename):
                image_info = await self._process_image(
                    file_path,
                    optimize=optimize,
                    create_thumbnail=True
                )
                result.update(image_info)

            logger.info(f"File uploaded from URL: {url}")
            return result

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"URL upload failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))


# 创建全局媒体服务实例
media_service = MediaService()
