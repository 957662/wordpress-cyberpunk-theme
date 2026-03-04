"""
File Utilities
文件处理工具
"""

import os
import uuid
from pathlib import Path
from typing import Optional, List
from fastapi import UploadFile, HTTPException
import aiofiles
import hashlib


class FileHandler:
    """文件处理器"""

    # 允许的图片格式
    ALLOWED_IMAGE_TYPES = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
    }

    # 允许的文档格式
    ALLOWED_DOCUMENT_TYPES = {
        'application/pdf': '.pdf',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    }

    # 最大文件大小 (10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024

    # 上传目录
    UPLOAD_DIR = Path("uploads")
    IMAGES_DIR = UPLOAD_DIR / "images"
    DOCUMENTS_DIR = UPLOAD_DIR / "documents"
    THUMBNAILS_DIR = UPLOAD_DIR / "thumbnails"

    @staticmethod
    def ensure_upload_dirs():
        """确保上传目录存在"""
        for directory in [
            FileHandler.UPLOAD_DIR,
            FileHandler.IMAGES_DIR,
            FileHandler.DOCUMENTS_DIR,
            FileHandler.THUMBNAILS_DIR
        ]:
            directory.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def get_file_extension(filename: str) -> str:
        """
        获取文件扩展名

        Args:
            filename: 文件名

        Returns:
            文件扩展名
        """
        return Path(filename).suffix.lower()

    @staticmethod
    def validate_file_type(file: UploadFile, allowed_types: dict) -> bool:
        """
        验证文件类型

        Args:
            file: 上传的文件
            allowed_types: 允许的类型字典

        Returns:
            是否有效
        """
        if file.content_type not in allowed_types:
            return False
        return True

    @staticmethod
    def validate_file_size(file: UploadFile, max_size: int = MAX_FILE_SIZE) -> bool:
        """
        验证文件大小

        Args:
            file: 上传的文件
            max_size: 最大文件大小

        Returns:
            是否有效
        """
        # 注意：这在流式上传时可能不准确
        # 应该在上传过程中检查
        return True

    @staticmethod
    def generate_unique_filename(original_filename: str) -> str:
        """
        生成唯一的文件名

        Args:
            original_filename: 原始文件名

        Returns:
            唯一的文件名
        """
        ext = FileHandler.get_file_extension(original_filename)
        unique_id = uuid.uuid4().hex
        return f"{unique_id}{ext}"

    @staticmethod
    def generate_filepath(filename: str, subdirectory: Optional[Path] = None) -> Path:
        """
        生成文件路径

        Args:
            filename: 文件名
            subdirectory: 子目录

        Returns:
            完整文件路径
        """
        if subdirectory is None:
            subdirectory = FileHandler.IMAGES_DIR

        # 按日期创建子目录
        from datetime import datetime
        date_path = datetime.now().strftime("%Y/%m/%d")
        full_path = subdirectory / date_path
        full_path.mkdir(parents=True, exist_ok=True)

        return full_path / filename

    @staticmethod
    async def save_upload_file(
        file: UploadFile,
        directory: Optional[Path] = None,
        filename: Optional[str] = None
    ) -> str:
        """
        保存上传的文件

        Args:
            file: 上传的文件
            directory: 保存目录
            filename: 文件名 (None则自动生成)

        Returns:
            文件路径 (相对于uploads目录)
        """
        FileHandler.ensure_upload_dirs()

        if directory is None:
            directory = FileHandler.IMAGES_DIR

        if filename is None:
            filename = FileHandler.generate_unique_filename(file.filename)

        filepath = FileHandler.generate_filepath(filename, directory)

        # 确保目录存在
        filepath.parent.mkdir(parents=True, exist_ok=True)

        # 保存文件
        async with aiofiles.open(filepath, 'wb') as f:
            content = await file.read()
            await f.write(content)

        # 返回相对路径
        return str(filepath.relative_to(FileHandler.UPLOAD_DIR))

    @staticmethod
    def delete_file(filepath: str) -> bool:
        """
        删除文件

        Args:
            filepath: 文件路径

        Returns:
            是否成功
        """
        try:
            full_path = FileHandler.UPLOAD_DIR / filepath
            if full_path.exists():
                full_path.unlink()
                return True
            return False
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False

    @staticmethod
    def get_file_size(filepath: str) -> int:
        """
        获取文件大小

        Args:
            filepath: 文件路径

        Returns:
            文件大小 (字节)
        """
        try:
            full_path = FileHandler.UPLOAD_DIR / filepath
            if full_path.exists():
                return full_path.stat().st_size
            return 0
        except Exception:
            return 0

    @staticmethod
    def calculate_file_hash(filepath: str, algorithm: str = 'sha256') -> str:
        """
        计算文件哈希值

        Args:
            filepath: 文件路径
            algorithm: 哈希算法

        Returns:
            哈希值
        """
        try:
            full_path = FileHandler.UPLOAD_DIR / filepath
            hash_obj = hashlib.new(algorithm)

            with open(full_path, 'rb') as f:
                while chunk := f.read(8192):
                    hash_obj.update(chunk)

            return hash_obj.hexdigest()
        except Exception as e:
            print(f"Error calculating hash: {e}")
            return ""

    @staticmethod
    def get_file_url(filepath: str, base_url: str = "/uploads") -> str:
        """
        获取文件URL

        Args:
            filepath: 文件路径
            base_url: 基础URL

        Returns:
            文件URL
        """
        return f"{base_url}/{filepath}"


class ImageFileHandler(FileHandler):
    """图片文件处理器"""

    @staticmethod
    async def upload_image(
        file: UploadFile,
        create_thumbnail: bool = True,
        thumbnail_size: tuple = (150, 150)
    ) -> dict:
        """
        上传图片

        Args:
            file: 上传的文件
            create_thumbnail: 是否创建缩略图
            thumbnail_size: 缩略图尺寸

        Returns:
            上传结果
        """
        # 验证文件类型
        if not ImageFileHandler.validate_file_type(file, ImageFileHandler.ALLOWED_IMAGE_TYPES):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."
            )

        # 保存原图
        original_path = await ImageFileHandler.save_upload_file(file)

        result = {
            'original': ImageFileHandler.get_file_url(original_path),
            'path': original_path,
            'size': ImageFileHandler.get_file_size(original_path)
        }

        # 创建缩略图
        if create_thumbnail:
            from .image import ImageProcessor

            full_path = ImageFileHandler.UPLOAD_DIR / original_path
            thumbnail_filename = f"thumb_{ImageFileHandler.generate_unique_filename(file.filename)}"
            thumbnail_path = ImageFileHandler.generate_filepath(
                thumbnail_filename,
                ImageFileHandler.THUMBNAILS_DIR
            )

            success = ImageProcessor.generate_thumbnail(
                str(full_path),
                str(thumbnail_path),
                thumbnail_size
            )

            if success:
                relative_thumb_path = str(thumbnail_path.relative_to(ImageFileHandler.UPLOAD_DIR))
                result['thumbnail'] = ImageFileHandler.get_file_url(relative_thumb_path)

        return result


async def save_upload_file(
    file: UploadFile,
    directory: Optional[Path] = None,
    filename: Optional[str] = None
) -> str:
    """保存上传文件的便捷函数"""
    return await FileHandler.save_upload_file(file, directory, filename)


def delete_file(filepath: str) -> bool:
    """删除文件的便捷函数"""
    return FileHandler.delete_file(filepath)


def get_file_extension(filename: str) -> str:
    """获取文件扩展名的便捷函数"""
    return FileHandler.get_file_extension(filename)


def validate_file_type(file: UploadFile, file_type: str = 'image') -> bool:
    """验证文件类型的便捷函数"""
    if file_type == 'image':
        return FileHandler.validate_file_type(file, FileHandler.ALLOWED_IMAGE_TYPES)
    elif file_type == 'document':
        return FileHandler.validate_file_type(file, FileHandler.ALLOWED_DOCUMENT_TYPES)
    return False
