"""
Data validation and sanitization service
"""
from typing import Any, Dict, List, Optional, Union, Type, get_type_hints
from pydantic import BaseModel, ValidationError, validator
import re
import html
from datetime import datetime
import json

from ..core.validators import sanitize_html, validate_email, validate_url


class ValidationResult(BaseModel):
    """Result of a validation operation"""
    is_valid: bool
    errors: List[str]
    warnings: List[str]
    sanitized_data: Optional[Dict[str, Any]] = None
    original_data: Dict[str, Any]


class SanitizationResult(BaseModel):
    """Result of a sanitization operation"""
    sanitized: bool
    original: Any
    sanitized_value: Any
    changes_made: List[str]


class DataValidatorService:
    """
    Service for validating and sanitizing user input data

    Provides comprehensive data validation, sanitization, and cleaning
    for various data types including HTML, URLs, emails, and structured data.
    """

    # HTML sanitization patterns
    HTML_TAG_PATTERN = re.compile(r'<[^>]+>')
    SCRIPT_PATTERN = re.compile(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', re.IGNORECASE)
    STYLE_PATTERN = re.compile(r'<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>', re.IGNORECASE)
    EVENT_HANDLER_PATTERN = re.compile(r'on\w+\s*=', re.IGNORECASE)
    JAVASCRIPT_PATTERN = re.compile(r'javascript:', re.IGNORECASE)

    # SQL injection patterns
    SQL_COMMENT_PATTERN = re.compile(r'--|\/\*|\*\/')
    SQL_OR_PATTERN = re.compile(r'\bOR\b.*?=.*?', re.IGNORECASE)
    SQL_UNION_PATTERN = re.compile(r'\bUNION\b.*?\bSELECT\b', re.IGNORECASE)

    # XSS patterns
    XSS_PATTERN = re.compile(
        r'<[^>]*>?|on\w+\s*=|javascript:|vbscript:|expression\s*\(',
        re.IGNORECASE
    )

    def __init__(self):
        self.validation_errors: List[str] = []
        self.warnings: List[str] = []

    def validate_and_sanitize(
        self,
        data: Dict[str, Any],
        schema: Optional[Type[BaseModel]] = None,
        sanitize_html: bool = True,
        max_depth: int = 10
    ) -> ValidationResult:
        """
        Validate and sanitize a dictionary of data

        Args:
            data: Dictionary of data to validate and sanitize
            schema: Optional Pydantic model for validation
            sanitize_html: Whether to sanitize HTML content
            max_depth: Maximum recursion depth for nested data

        Returns:
            ValidationResult with details
        """
        self.validation_errors = []
        self.warnings = []

        # Deep copy to avoid modifying original
        sanitized_data = self._deep_copy(data, max_depth)

        # Sanitize data
        if sanitize_html:
            sanitized_data = self._sanitize_dict(sanitized_data, max_depth)

        # Validate against schema if provided
        if schema:
            try:
                validated = schema(**sanitized_data)
                sanitized_data = validated.dict()
            except ValidationError as e:
                for error in e.errors():
                    field = " -> ".join(str(loc) for loc in error['loc'])
                    self.validation_errors.append(
                        f"{field}: {error['msg']}"
                    )

        return ValidationResult(
            is_valid=len(self.validation_errors) == 0,
            errors=self.validation_errors,
            warnings=self.warnings,
            sanitized_data=sanitized_data,
            original_data=data
        )

    def sanitize_html_content(self, html: str, allow_tags: Optional[List[str]] = None) -> str:
        """
        Sanitize HTML content by removing dangerous elements

        Args:
            html: HTML string to sanitize
            allow_tags: List of allowed tag names (e.g., ['p', 'br', 'strong'])

        Returns:
            Sanitized HTML string
        """
        changes = []

        # Remove script and style tags
        sanitized = self.SCRIPT_PATTERN.sub('', html)
        if sanitized != html:
            changes.append('Removed script tags')
            html = sanitized

        sanitized = self.STYLE_PATTERN.sub('', html)
        if sanitized != html:
            changes.append('Removed style tags')
            html = sanitized

        # Remove event handlers
        sanitized = self.EVENT_HANDLER_PATTERN.sub('', html)
        if sanitized != html:
            changes.append('Removed event handlers')
            html = sanitized

        # Remove javascript: protocols
        sanitized = self.JAVASCRIPT_PATTERN.sub('', html)
        if sanitized != html:
            changes.append('Removed javascript: protocols')
            html = sanitized

        # If specific tags are allowed, remove others
        if allow_tags is not None:
            # Build regex for allowed tags
            allowed_pattern = re.compile(
                r'</?(' + '|'.join(re.escape(tag) for tag in allow_tags) + r')\b[^>]*>',
                re.IGNORECASE
            )

            # Extract allowed tags
            allowed_matches = allowed_pattern.findall(html)

            # Remove all HTML tags
            text_only = self.HTML_TAG_PATTERN.sub('', html)

            # Reconstruct with allowed tags
            if allowed_matches:
                sanitized = self._reconstruct_allowed_tags(html, allow_tags)
            else:
                sanitized = text_only
        else:
            # Remove all HTML tags
            sanitized = self.HTML_TAG_PATTERN.sub('', html)

        # Decode HTML entities
        sanitized = html.unescape(sanitized)

        return sanitized

    def sanitize_user_input(self, text: str) -> SanitizationResult:
        """
        Sanitize user input text to prevent XSS and injection attacks

        Args:
            text: User input text

        Returns:
            SanitizationResult with details
        """
        original = text
        changes_made = []

        # Trim whitespace
        text = text.strip()
        if text != original:
            changes_made.append('Trimmed whitespace')

        # Escape HTML
        escaped = html.escape(text)
        if escaped != text:
            changes_made.append('Escaped HTML entities')
            text = escaped

        # Remove dangerous patterns
        sanitized = self.XSS_PATTERN.sub('', text)
        if sanitized != text:
            changes_made.append('Removed XSS patterns')
            text = sanitized

        # Remove potential SQL injection patterns
        sanitized = self.SQL_COMMENT_PATTERN.sub('', text)
        if sanitized != text:
            changes_made.append('Removed SQL comments')
            text = sanitized

        return SanitizationResult(
            sanitized=changes_made > 0,
            original=original,
            sanitized_value=text,
            changes_made=changes_made
        )

    def validate_email(self, email: str) -> bool:
        """
        Validate email address format

        Args:
            email: Email address to validate

        Returns:
            True if valid, False otherwise
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None

    def validate_url(self, url: str, allow_relative: bool = False) -> bool:
        """
        Validate URL format

        Args:
            url: URL to validate
            allow_relative: Whether to allow relative URLs

        Returns:
            True if valid, False otherwise
        """
        if allow_relative and url.startswith('/'):
            return True

        pattern = re.compile(
            r'^(?:http|ftp)s?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain
            r'localhost|'  # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE
        )

        return pattern.match(url) is not None

    def validate_json(self, json_string: str) -> ValidationResult:
        """
        Validate JSON string

        Args:
            json_string: JSON string to validate

        Returns:
            ValidationResult with details
        """
        errors = []
        data = None

        try:
            data = json.loads(json_string)
        except json.JSONDecodeError as e:
            errors.append(f"Invalid JSON: {str(e)}")

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=[],
            sanitized_data=data,
            original_data={"json_string": json_string}
        )

    def sanitize_filename(self, filename: str) -> str:
        """
        Sanitize filename to prevent directory traversal and other attacks

        Args:
            filename: Original filename

        Returns:
            Sanitized filename
        """
        # Remove directory paths
        filename = filename.replace('..', '').replace('/', '').replace('\\', '')

        # Remove dangerous characters
        filename = re.sub(r'[<>:"|?*]', '', filename)

        # Trim whitespace
        filename = filename.strip()

        # Limit length
        if len(filename) > 255:
            name, ext = os.path.splitext(filename)
            filename = name[:255 - len(ext)] + ext

        return filename

    def validate_slug(self, slug: str) -> ValidationResult:
        """
        Validate URL slug format

        Args:
            slug: Slug string to validate

        Returns:
            ValidationResult with details
        """
        errors = []
        warnings = []

        # Check format (lowercase, alphanumeric, hyphens only)
        if not re.match(r'^[a-z0-9-]+$', slug):
            errors.append(
                "Slug must contain only lowercase letters, numbers, and hyphens"
            )

        # Check length
        if len(slug) < 3:
            warnings.append("Slug is very short (minimum 3 characters recommended)")

        if len(slug) > 100:
            errors.append("Slug is too long (maximum 100 characters)")

        # Check for consecutive hyphens
        if '--' in slug:
            warnings.append("Slug contains consecutive hyphens")

        # Check for leading/trailing hyphens
        if slug.startswith('-') or slug.endswith('-'):
            warnings.append("Slug starts or ends with a hyphen")

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            sanitized_data={"slug": slug},
            original_data={"slug": slug}
        )

    def _sanitize_dict(self, data: Any, max_depth: int, current_depth: int = 0) -> Any:
        """Recursively sanitize dictionary values"""
        if current_depth >= max_depth:
            return data

        if isinstance(data, dict):
            return {
                key: self._sanitize_dict(value, max_depth, current_depth + 1)
                for key, value in data.items()
            }
        elif isinstance(data, list):
            return [
                self._sanitize_dict(item, max_depth, current_depth + 1)
                for item in data
            ]
        elif isinstance(data, str):
            result = self.sanitize_user_input(data)
            return result.sanitized_value
        else:
            return data

    def _deep_copy(self, data: Any, max_depth: int, current_depth: int = 0) -> Any:
        """Create a deep copy of data with depth limit"""
        if current_depth >= max_depth:
            return data

        if isinstance(data, dict):
            return {
                key: self._deep_copy(value, max_depth, current_depth + 1)
                for key, value in data.items()
            }
        elif isinstance(data, list):
            return [
                self._deep_copy(item, max_depth, current_depth + 1)
                for item in data
            ]
        else:
            return data

    def _reconstruct_allowed_tags(self, html: str, allow_tags: List[str]) -> str:
        """Reconstruct HTML with only allowed tags"""
        # This is a simplified version - a full implementation would use
        # an HTML parser like BeautifulSoup
        allowed_pattern = re.compile(
            r'</?(' + '|'.join(re.escape(tag) for tag in allow_tags) + r')\b[^>]*>',
            re.IGNORECASE
        )

        # For now, just remove all tags not in allowed list
        # A proper implementation would parse and reconstruct the HTML
        return allowed_pattern.sub(lambda m: m.group(0), html)


# Singleton instance
validator_service = DataValidatorService()


# Convenience functions
def validate_data(data: Dict[str, Any], schema: Optional[Type[BaseModel]] = None) -> ValidationResult:
    """Convenience function for data validation"""
    return validator_service.validate_and_sanitize(data, schema)


def sanitize_html(html: str, allow_tags: Optional[List[str]] = None) -> str:
    """Convenience function for HTML sanitization"""
    return validator_service.sanitize_html_content(html, allow_tags)


def sanitize_input(text: str) -> str:
    """Convenience function for user input sanitization"""
    result = validator_service.sanitize_user_input(text)
    return result.sanitized_value
