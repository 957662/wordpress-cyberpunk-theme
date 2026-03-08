"""
Content Analysis Service Tests
内容分析服务测试
"""

import pytest
from datetime import datetime
from app.services.content_analysis_service import ContentAnalysisService
from app.schemas.content_analysis import ContentAnalysisRequest


class TestContentAnalysisService:
    """内容分析服务测试"""

    def test_analyze_content_basic(self):
        """测试基本内容分析"""
        request = ContentAnalysisRequest(
            content="这是一个测试内容。我们用来测试内容分析功能。",
            title="测试标题",
            language="zh",
            analyze_seo=True,
            analyze_readability=True,
        )

        result = ContentAnalysisService.analyze_content(request)

        assert result.id is not None
        assert result.seo_analysis is not None
        assert result.readability_analysis is not None
        assert isinstance(result.seo_analysis.overall_score, int)

    def test_seo_analysis_with_title(self):
        """测试带标题的SEO分析"""
        content = "这是一篇关于Next.js的文章，包含了大量技术细节。"
        title = "Next.js 14 完全指南 - 从入门到精通"

        result = ContentAnalysisService._analyze_seo(content, title, "zh")

        assert result.title_score > 0
        assert result.content_score > 0
        assert len(result.suggestions) >= 0
        assert len(result.keywords) > 0

    def test_seo_analysis_without_title(self):
        """测试不带标题的SEO分析"""
        content = "这是一篇没有标题的内容。"
        title = None

        result = ContentAnalysisService._analyze_seo(content, title, "zh")

        assert result.title_score == 0
        assert any("缺少标题" in s for s in result.suggestions)

    def test_readability_analysis_chinese(self):
        """测试中文可读性分析"""
        content = "这是一段测试内容。用来分析可读性。我们要确保分析准确。"

        result = ContentAnalysisService._analyze_readability(content, "zh")

        assert result.word_count > 0
        assert result.sentence_count > 0
        assert result.reading_time_minutes >= 1
        assert result.level in ["非常容易", "容易", "较容易", "中等", "较难", "难", "非常难"]

    def test_readability_analysis_english(self):
        """测试英文可读性分析"""
        content = "This is a test content. We use it to analyze readability. Make sure it's accurate."

        result = ContentAnalysisService._analyze_readability(content, "en")

        assert result.word_count > 0
        assert result.sentence_count > 0
        assert result.reading_time_minutes >= 1

    def test_sentiment_analysis(self):
        """测试情感分析"""
        content = "这篇文章非常好，我很喜欢！"

        result = ContentAnalysisService._analyze_sentiment(content, "zh")

        assert result.sentiment in ["positive", "negative", "neutral"]
        assert 0 <= result.confidence <= 1
        assert isinstance(result.emotions, dict)

    def test_quality_analysis(self):
        """测试质量分析"""
        content = "这是一篇高质量的文章内容。" * 20  # 增加长度
        title = "高质量文章标题"

        result = ContentAnalysisService._analyze_quality(content, title, "zh")

        assert 0 <= result.originality_score <= 1
        assert 0 <= result.grammar_score <= 1
        assert 0 <= result.structure_score <= 1
        assert 0 <= result.engagement_score <= 1
        assert isinstance(result.issues, list)
        assert isinstance(result.improvements, list)

    def test_extract_keywords_chinese(self):
        """测试中文关键词提取"""
        content = "Next.js是一个React框架，它提供了很多强大的功能。"

        keywords = ContentAnalysisService._extract_keywords(content, "zh", top_n=5)

        assert len(keywords) > 0
        assert all(isinstance(k, str) for k in keywords)

    def test_extract_keywords_english(self):
        """测试英文关键词提取"""
        content = "Next.js is a React framework that provides many powerful features."

        keywords = ContentAnalysisService._extract_keywords(content, "en", top_n=5)

        assert len(keywords) > 0
        assert all(isinstance(k, str) for k in keywords)

    def test_keyword_suggestions(self):
        """测试关键词建议"""
        content = "这是一篇关于Next.js和React的技术文章。"

        suggestions = ContentAnalysisService.get_keyword_suggestions(content, "zh")

        assert len(suggestions) > 0
        assert all(s.keyword for s in suggestions)
        assert all(0 <= s.relevance <= 1 for s in suggestions)

    def test_content_recommendations(self):
        """测试内容推荐"""
        request = ContentAnalysisRequest(
            content="测试内容",
            title="测试标题",
            analyze_seo=True,
            analyze_readability=True,
            analyze_quality=True,
        )

        analysis = ContentAnalysisService.analyze_content(request)
        recommendations = ContentAnalysisService.get_content_recommendations(analysis)

        assert isinstance(recommendations, list)
        for rec in recommendations:
            assert rec.type in ["seo", "readability", "engagement"]
            assert rec.title
            assert rec.description
            assert rec.priority in ["high", "medium", "low"]

    def test_short_content_score(self):
        """测试短内容的评分"""
        content = "短内容"

        result = ContentAnalysisService._analyze_seo(content, "标题", "zh")

        assert result.content_score < 100
        assert any("内容过短" in s or "内容偏短" in s for s in result.suggestions)

    def test_long_content_score(self):
        """测试长内容的评分"""
        content = "这是一段内容。" * 100  # 长内容

        result = ContentAnalysisService._analyze_seo(content, "标题", "zh")

        assert result.content_score == 100

    def test_optimal_title_length(self):
        """测试最佳标题长度"""
        # 30-60个字符的标题应该得高分
        title = "这是一个恰到好处的标题长度示例"
        content = "内容内容" * 50

        result = ContentAnalysisService._analyze_seo(content, title, "zh")

        assert result.title_score > 80

    def test_readability_time_calculation(self):
        """测试阅读时间计算"""
        # 中文约400字/分钟
        content = "字" * 800
        result = ContentAnalysisService._analyze_readability(content, "zh")

        assert result.reading_time_minutes >= 2

        # 英文约200词/分钟
        content_en = "word " * 400
        result_en = ContentAnalysisService._analyze_readability(content_en, "en")

        assert result_en.reading_time_minutes >= 2
