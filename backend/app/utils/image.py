"""
Image Processing Utilities
图像处理工具
"""

import os
from typing import Optional, Tuple
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter
import io


class ImageProcessor:
    """图像处理器"""

    # 支持的图片格式
    SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}

    # 最大文件大小 (10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024

    @staticmethod
    def is_supported_format(filename: str) -> bool:
        """
        检查文件格式是否支持

        Args:
            filename: 文件名

        Returns:
            是否支持
        """
        ext = Path(filename).suffix.lower()
        return ext in ImageProcessor.SUPPORTED_FORMATS

    @staticmethod
    def validate_image(file_path: str) -> bool:
        """
        验证图片文件

        Args:
            file_path: 文件路径

        Returns:
            是否有效
        """
        try:
            with Image.open(file_path) as img:
                img.verify()
            return True
        except Exception:
            return False

    @staticmethod
    def get_image_info(file_path: str) -> dict:
        """
        获取图片信息

        Args:
            file_path: 文件路径

        Returns:
            图片信息字典
        """
        with Image.open(file_path) as img:
            return {
                'format': img.format,
                'mode': img.mode,
                'size': img.size,
                'width': img.width,
                'height': img.height,
                'file_size': os.path.getsize(file_path)
            }

    @staticmethod
    def resize_image(
        file_path: str,
        output_path: str,
        size: Tuple[int, int],
        maintain_aspect: bool = True,
        quality: int = 85
    ) -> bool:
        """
        调整图片大小

        Args:
            file_path: 输入文件路径
            output_path: 输出文件路径
            size: 目标尺寸 (width, height)
            maintain_aspect: 是否保持宽高比
            quality: JPEG质量 (1-100)

        Returns:
            是否成功
        """
        try:
            with Image.open(file_path) as img:
                # 转换RGBA为RGB
                if img.mode == 'RGBA':
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])
                    img = background

                # 调整大小
                if maintain_aspect:
                    img.thumbnail(size, Image.Resampling.LANCZOS)
                else:
                    img = img.resize(size, Image.Resampling.LANCZOS)

                # 保存
                img.save(output_path, 'JPEG', quality=quality, optimize=True)
                return True
        except Exception as e:
            print(f"Error resizing image: {e}")
            return False

    @staticmethod
    def generate_thumbnail(
        file_path: str,
        output_path: str,
        size: Tuple[int, int] = (150, 150),
        quality: int = 85
    ) -> bool:
        """
        生成缩略图

        Args:
            file_path: 输入文件路径
            output_path: 输出文件路径
            size: 缩略图尺寸
            quality: JPEG质量

        Returns:
            是否成功
        """
        try:
            with Image.open(file_path) as img:
                # 创建缩略图
                img.thumbnail(size, Image.Resampling.LANCZOS)

                # 创建正方形画布
                thumbnail = Image.new('RGB', size, (255, 255, 255))

                # 居中粘贴
                x = (size[0] - img.width) // 2
                y = (size[1] - img.height) // 2
                thumbnail.paste(img, (x, y))

                thumbnail.save(output_path, 'JPEG', quality=quality, optimize=True)
                return True
        except Exception as e:
            print(f"Error generating thumbnail: {e}")
            return False

    @staticmethod
    def crop_image(
        file_path: str,
        output_path: str,
        box: Tuple[int, int, int, int]
    ) -> bool:
        """
        裁剪图片

        Args:
            file_path: 输入文件路径
            output_path: 输出文件路径
            box: 裁剪区域 (left, top, right, bottom)

        Returns:
            是否成功
        """
        try:
            with Image.open(file_path) as img:
                cropped = img.crop(box)
                cropped.save(output_path)
                return True
        except Exception as e:
            print(f"Error cropping image: {e}")
            return False

    @staticmethod
    def rotate_image(
        file_path: str,
        output_path: str,
        degrees: float
    ) -> bool:
        """
        旋转图片

        Args:
            file_path: 输入文件路径
            output_path: 输出文件路径
            degrees: 旋转角度

        Returns:
            是否成功
        """
        try:
            with Image.open(file_path) as img:
                rotated = img.rotate(degrees, expand=True)
                rotated.save(output_path)
                return True
        except Exception as e:
            print(f"Error rotating image: {e}")
            return False

    @staticmethod
    def apply_filter(
        file_path: str,
        output_path: str,
        filter_type: str = 'blur'
    ) -> bool:
        """
        应用滤镜

        Args:
            file_path: 输入文件路径
            output_path: 输出文件路径
            filter_type: 滤镜类型 (blur, sharpen, edge_enhance)

        Returns:
            是否成功
        """
        try:
            with Image.open(file_path) as img:
                if filter_type == 'blur':
                    filtered = img.filter(ImageFilter.BLUR)
                elif filter_type == 'sharpen':
                    filtered = img.filter(ImageFilter.SHARPEN)
                elif filter_type == 'edge_enhance':
                    filtered = img.filter(ImageFilter.EDGE_ENHANCE)
                else:
                    filtered = img

                filtered.save(output_path)
                return True
        except Exception as e:
            print(f"Error applying filter: {e}")
            return False

    @staticmethod
    def convert_format(
        file_path: str,
        output_path: str,
        output_format: str = 'JPEG'
    ) -> bool:
        """
        转换图片格式

        Args:
            file_path: 输入文件路径
            output_path: 输出文件路径
            output_format: 输出格式 (JPEG, PNG, WEBP)

        Returns:
            是否成功
        """
        try:
            with Image.open(file_path) as img:
                # 转换RGBA为RGB (用于JPEG)
                if output_format == 'JPEG' and img.mode == 'RGBA':
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])
                    img = background

                img.save(output_path, format=output_format)
                return True
        except Exception as e:
            print(f"Error converting format: {e}")
            return False

    @staticmethod
    def optimize_image(
        file_path: str,
        output_path: Optional[str] = None,
        quality: int = 85
    ) -> bool:
        """
        优化图片

        Args:
            file_path: 输入文件路径
            output_path: 输出文件路径 (None则覆盖原文件)
            quality: JPEG质量

        Returns:
            是否成功
        """
        if output_path is None:
            output_path = file_path

        try:
            with Image.open(file_path) as img:
                # 转换为RGB (如果是RGBA)
                if img.mode == 'RGBA':
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])
                    img = background

                # 保存为优化格式
                img.save(output_path, 'JPEG', quality=quality, optimize=True)
                return True
        except Exception as e:
            print(f"Error optimizing image: {e}")
            return False

    @staticmethod
    def create_watermark(
        file_path: str,
        output_path: str,
        text: str,
        position: str = 'bottom-right'
    ) -> bool:
        """
        添加水印

        Args:
            file_path: 输入文件路径
            output_path: 输出文件路径
            text: 水印文本
            position: 水印位置

        Returns:
            是否成功
        """
        try:
            from PIL import ImageDraw, ImageFont

            with Image.open(file_path) as img:
                # 创建绘图对象
                draw = ImageDraw.Draw(img)

                # 加载字体 (使用默认字体)
                try:
                    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
                except:
                    font = ImageFont.load_default()

                # 获取文本尺寸
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]

                # 计算位置
                margin = 10
                if position == 'top-left':
                    x, y = margin, margin
                elif position == 'top-right':
                    x, y = img.width - text_width - margin, margin
                elif position == 'bottom-left':
                    x, y = margin, img.height - text_height - margin
                else:  # bottom-right
                    x, y = img.width - text_width - margin, img.height - text_height - margin

                # 绘制半透明背景
                draw.rectangle(
                    [x - 5, y - 5, x + text_width + 5, y + text_height + 5],
                    fill=(255, 255, 255, 128)
                )

                # 绘制文本
                draw.text((x, y), text, font=font, fill=(0, 0, 0, 200))

                img.save(output_path)
                return True
        except Exception as e:
            print(f"Error creating watermark: {e}")
            return False


# 便捷函数
def process_image(file_path: str, **kwargs) -> bool:
    """处理图片的便捷函数"""
    processor = ImageProcessor()

    output_path = kwargs.get('output_path', file_path)
    operation = kwargs.get('operation', 'optimize')

    if operation == 'resize':
        return processor.resize_image(
            file_path,
            output_path,
            kwargs.get('size', (800, 600)),
            kwargs.get('maintain_aspect', True)
        )
    elif operation == 'thumbnail':
        return processor.generate_thumbnail(
            file_path,
            output_path,
            kwargs.get('size', (150, 150))
        )
    elif operation == 'optimize':
        return processor.optimize_image(file_path, output_path)
    else:
        return False


def resize_image(file_path: str, size: tuple, output_path: Optional[str] = None) -> bool:
    """调整图片大小的便捷函数"""
    if output_path is None:
        output_path = file_path
    return ImageProcessor.resize_image(file_path, output_path, size)


def generate_thumbnail(file_path: str, output_path: str, size: tuple = (150, 150)) -> bool:
    """生成缩略图的便捷函数"""
    return ImageProcessor.generate_thumbnail(file_path, output_path, size)


def optimize_image(file_path: str, output_path: Optional[str] = None, quality: int = 85) -> bool:
    """优化图片的便捷函数"""
    return ImageProcessor.optimize_image(file_path, output_path, quality)
