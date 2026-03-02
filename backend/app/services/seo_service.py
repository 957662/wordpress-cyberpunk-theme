"""SEO Service for CyberPress Platform

This module handles SEO-related operations including:
- Meta tag generation
- Sitemap generation
- Robots.txt generation
- Open Graph tags
- Twitter Card tags
- Schema.org structured data
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class SEOService:
    """Service for SEO-related operations"""

    def __init__(self):
        """Initialize SEO service"""
        self.site_name = "CyberPress"
        self.site_url = "https://cyberpress.dev"
        self.default_description = "A cyberpunk-powered blogging platform"

    def generate_meta_tags(
        self,
        title: str,
        description: str,
        keywords: Optional[List[str]] = None,
        image: Optional[str] = None,
        url: Optional[str] = None,
        noindex: bool = False,
        canonical: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate meta tags for a page

        Args:
            title: Page title
            description: Page description
            keywords: List of keywords
            image: Featured image URL
            url: Page URL
            noindex: Whether to noindex this page
            canonical: Canonical URL

        Returns:
            Dictionary containing meta tags
        """
        full_title = f"{title} | {self.site_name}" if title != self.site_name else title

        meta_tags = {
            "title": full_title,
            "description": description[:160] if len(description) > 160 else description,
            "keywords": ", ".join(keywords) if keywords else "",
            "canonical": canonical or url,
            "noindex": noindex,
            "open_graph": self._generate_open_graph_tags(
                title=title,
                description=description,
                image=image,
                url=url,
            ),
            "twitter_card": self._generate_twitter_card_tags(
                title=title,
                description=description,
                image=image,
            ),
        }

        return meta_tags

    def _generate_open_graph_tags(
        self,
        title: str,
        description: str,
        image: Optional[str] = None,
        url: Optional[str] = None,
    ) -> Dict[str, str]:
        """Generate Open Graph tags

        Args:
            title: Page title
            description: Page description
            image: Featured image URL
            url: Page URL

        Returns:
            Dictionary of Open Graph tags
        """
        og_tags = {
            "og:title": title,
            "og:description": description,
            "og:type": "website",
            "og:site_name": self.site_name,
        }

        if image:
            og_tags["og:image"] = image
            og_tags["og:image:alt"] = title

        if url:
            og_tags["og:url"] = url

        return og_tags

    def _generate_twitter_card_tags(
        self,
        title: str,
        description: str,
        image: Optional[str] = None,
    ) -> Dict[str, str]:
        """Generate Twitter Card tags

        Args:
            title: Page title
            description: Page description
            image: Featured image URL

        Returns:
            Dictionary of Twitter Card tags
        """
        twitter_tags = {
            "twitter:card": "summary_large_image",
            "twitter:title": title,
            "twitter:description": description,
        }

        if image:
            twitter_tags["twitter:image"] = image

        return twitter_tags

    def generate_schema_org_data(
        self,
        schema_type: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Generate Schema.org structured data

        Args:
            schema_type: Type of schema (Article, BlogPosting, WebSite, etc.)
            data: Data for the schema

        Returns:
            Schema.org structured data as dictionary
        """
        schema = {
            "@context": "https://schema.org",
            "@type": schema_type,
        }

        schema.update(data)

        # Add common fields
        if schema_type in ["Article", "BlogPosting"]:
            schema.setdefault("publisher", {
                "@type": "Organization",
                "name": self.site_name,
                "url": self.site_url,
            })

        return schema

    def generate_article_schema(
        self,
        title: str,
        description: str,
        url: str,
        image: Optional[str] = None,
        author_name: Optional[str] = None,
        published_date: Optional[datetime] = None,
        modified_date: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Generate schema for an article/blog post

        Args:
            title: Article title
            description: Article description
            url: Article URL
            image: Featured image URL
            author_name: Author name
            published_date: Publication date
            modified_date: Last modified date

        Returns:
            Schema.org structured data
        """
        data = {
            "headline": title,
            "description": description,
            "url": url,
        }

        if image:
            data["image"] = image

        if author_name:
            data["author"] = {
                "@type": "Person",
                "name": author_name,
            }

        if published_date:
            data["datePublished"] = published_date.isoformat()

        if modified_date:
            data["dateModified"] = modified_date.isoformat()

        return self.generate_schema_org_data("BlogPosting", data)

    def generate_breadcrumb_schema(
        self,
        breadcrumbs: List[Dict[str, str]],
    ) -> Dict[str, Any]:
        """Generate schema for breadcrumbs

        Args:
            breadcrumbs: List of breadcrumb items with 'name' and 'url'

        Returns:
            Schema.org structured data for breadcrumbs
        """
        items = []
        for i, crumb in enumerate(breadcrumbs, 1):
            items.append({
                "@type": "ListItem",
                "position": i,
                "name": crumb["name"],
                "item": crumb["url"],
            })

        return self.generate_schema_org_data("BreadcrumbList", {
            "itemListElement": items,
        })

    def generate_robots_txt(
        self,
        disallow_paths: Optional[List[str]] = None,
        allow_paths: Optional[List[str]] = None,
        sitemap_url: Optional[str] = None,
    ) -> str:
        """Generate robots.txt content

        Args:
            disallow_paths: Paths to disallow
            allow_paths: Paths to allow (overrides disallow)
            sitemap_url: Sitemap URL

        Returns:
            robots.txt content
        """
        lines = ["User-agent: *"]

        # Allow specific paths
        if allow_paths:
            for path in allow_paths:
                lines.append(f"Allow: {path}")

        # Disallow specific paths
        if disallow_paths:
            for path in disallow_paths:
                lines.append(f"Disallow: {path}")

        # Add sitemap
        if sitemap_url:
            lines.append(f"\nSitemap: {sitemap_url}")

        return "\n".join(lines)

    def generate_sitemap_entry(
        self,
        url: str,
        last_modified: Optional[datetime] = None,
        change_frequency: Optional[str] = None,
        priority: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Generate a single sitemap entry

        Args:
            url: Page URL
            last_modified: Last modified date
            change_frequency: Change frequency (always, hourly, daily, weekly, monthly, yearly, never)
            priority: Priority (0.0 to 1.0)

        Returns:
            Sitemap entry dictionary
        """
        entry = {"loc": url}

        if last_modified:
            entry["lastmod"] = last_modified.isoformat()

        if change_frequency:
            entry["changefreq"] = change_frequency

        if priority is not None:
            entry["priority"] = str(priority)

        return entry

    def generate_sitemap_xml(
        self,
        entries: List[Dict[str, Any]],
    ) -> str:
        """Generate sitemap XML

        Args:
            entries: List of sitemap entries

        Returns:
            Sitemap XML string
        """
        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ]

        for entry in entries:
            xml_lines.append("  <url>")
            xml_lines.append(f"    <loc>{entry['loc']}</loc>")

            if "lastmod" in entry:
                xml_lines.append(f"    <lastmod>{entry['lastmod']}</lastmod>")

            if "changefreq" in entry:
                xml_lines.append(f"    <changefreq>{entry['changefreq']}</changefreq>")

            if "priority" in entry:
                xml_lines.append(f"    <priority>{entry['priority']}</priority>")

            xml_lines.append("  </url>")

        xml_lines.append("</urlset>")

        return "\n".join(xml_lines)

    def slugify(self, text: str) -> str:
        """Convert text to URL-friendly slug

        Args:
            text: Text to slugify

        Returns:
            URL-friendly slug
        """
        import re
        import unicodedata

        # Normalize unicode characters
        text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')

        # Convert to lowercase and replace spaces with hyphens
        text = text.lower()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '-', text)

        return text.strip('-')

    def extract_keywords(self, content: str, max_keywords: int = 10) -> List[str]:
        """Extract keywords from content

        Args:
            content: Content to extract keywords from
            max_keywords: Maximum number of keywords to extract

        Returns:
            List of keywords
        """
        from collections import Counter
        import re

        # Common words to ignore
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
            'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
        }

        # Extract words
        words = re.findall(r'\b[a-z]{3,}\b', content.lower())

        # Filter stop words
        words = [w for w in words if w not in stop_words]

        # Count occurrences
        word_counts = Counter(words)

        # Get top keywords
        keywords = [word for word, count in word_counts.most_common(max_keywords)]

        return keywords


# Global SEO service instance
seo_service = SEOService()
