"""
Content Analysis Service
内容分析服务
"""

import re
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from app.schemas.content_analysis import (
    ContentAnalysisRequest,
    ContentAnalysisResponse,
    SEOAnalysis,
    ReadabilityAnalysis,
    SentimentAnalysis,
    ContentQuality,
    KeywordSuggestion,
    ContentRecommendation,
)


class ContentAnalysisService:
    """内容分析服务"""

    # 中文停用词
    STOP_WORDS_ZH = {
        '的', '了', '在', '是', '我', '有', '和', '就', '不', '人',
        '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去',
        '你', '会', '着', '没有', '看', '好', '自己', '这'
    }

    # 英文停用词
    STOP_WORDS_EN = {
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
        'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
        'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they'
    }

    @staticmethod
    def analyze_content(request: ContentAnalysisRequest) -> ContentAnalysisResponse:
        """分析内容"""

        response = ContentAnalysisResponse(
            id=str(uuid.uuid4()),
            created_at=datetime.utcnow(),
            metadata={}
        )

        content = request.content

        # SEO分析
        if request.analyze_seo:
            response.seo_analysis = ContentAnalysisService._analyze_seo(
                content=content,
                title=request.title,
                language=request.language
            )

        # 可读性分析
        if request.analyze_readability:
            response.readability_analysis = ContentAnalysisService._analyze_readability(
                content=content,
                language=request.language
            )

        # 情感分析
        if request.analyze_sentiment:
            response.sentiment_analysis = ContentAnalysisService._analyze_sentiment(
                content=content,
                language=request.language
            )

        # 质量分析
        if request.analyze_quality:
            response.quality_analysis = ContentAnalysisService._analyze_quality(
                content=content,
                title=request.title,
                language=request.language
            )

        return response

    @staticmethod
    def _analyze_seo(content: str, title: Optional[str], language: str) -> SEOAnalysis:
        """SEO分析"""

        suggestions = []
        title_score = 0
        description_score = 0
        content_score = 0

        # 标题分析
        if title:
            if 30 <= len(title) <= 60:
                title_score = 100
            elif len(title) < 30:
                title_score = 60
                suggestions.append("标题过短，建议30-60个字符")
            else:
                title_score = 70
                suggestions.append("标题过长，建议30-60个字符")
        else:
            title_score = 0
            suggestions.append("缺少标题")

        # 内容长度分析
        content_length = len(content)
        if content_length >= 300:
            content_score = 100
        elif content_length >= 150:
            content_score = 70
            suggestions.append("内容偏短，建议至少300字")
        else:
            content_score = 40
            suggestions.append("内容过短，建议至少300字")

        # 关键词提取
        keywords = ContentAnalysisService._extract_keywords(content, language)

        # 段落结构分析
        paragraphs = content.split('\n\n')
        if len(paragraphs) >= 3:
            description_score = 100
        else:
            description_score = 60
            suggestions.append("建议增加段落数量，提高可读性")

        overall_score = int((title_score + description_score + content_score) / 3)

        return SEOAnalysis(
            title_score=title_score,
            description_score=description_score,
            content_score=content_score,
            overall_score=overall_score,
            suggestions=suggestions,
            keywords=keywords[:10]
        )

    @staticmethod
    def _analyze_readability(content: str, language: str) -> ReadabilityAnalysis:
        """可读性分析"""

        # 分词（简化版）
        if language == 'zh':
            words = list(content)
            sentences = re.split(r'[。！？]', content)
        else:
            words = content.split()
            sentences = re.split(r'[.!?]', content)

        # 过滤空句子
        sentences = [s.strip() for s in sentences if s.strip()]
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]

        word_count = len(words)
        sentence_count = len(sentences)
        paragraph_count = len(paragraphs)

        # 计算平均长度
        avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0
        avg_word_length = sum(len(w) for w in words) / word_count if word_count > 0 else 0

        # 计算阅读时间（中文400字/分钟，英文200词/分钟）
        if language == 'zh':
            reading_time = max(1, word_count // 400)
        else:
            reading_time = max(1, word_count // 200)

        # 简化的Flesch可读性分数
        # 这里使用简化公式，实际应用中可以使用更复杂的算法
        flesch_score = max(0, min(100, 100 - (avg_sentence_length * 1.5) - (avg_word_length * 0.5)))

        # 确定阅读等级
        if flesch_score >= 90:
            level = "非常容易"
        elif flesch_score >= 80:
            level = "容易"
        elif flesch_score >= 70:
            level = "较容易"
        elif flesch_score >= 60:
            level = "中等"
        elif flesch_score >= 50:
            level = "较难"
        elif flesch_score >= 30:
            level = "难"
        else:
            level = "非常难"

        return ReadabilityAnalysis(
            flesch_score=round(flesch_score, 2),
            reading_time_minutes=reading_time,
            word_count=word_count,
            sentence_count=sentence_count,
            paragraph_count=paragraph_count,
            avg_sentence_length=round(avg_sentence_length, 2),
            avg_word_length=round(avg_word_length, 2),
            level=level
        )

    @staticmethod
    def _analyze_sentiment(content: str, language: str) -> SentimentAnalysis:
        """情感分析（简化版）"""

        # 这里应该使用实际的NLP模型，这里只是示例
        # 实际应用中可以集成像百度AI、腾讯AI等API

        positive_words = {'好', '优秀', '喜欢', '爱', '棒', '赞', 'excellent', 'good', 'great', 'love'}
        negative_words = {'差', '坏', '讨厌', '恨', '糟糕', 'bad', 'terrible', 'hate', 'awful'}

        positive_count = sum(1 for word in content if word in positive_words)
        negative_count = sum(1 for word in content if word in negative_words)

        if positive_count > negative_count:
            sentiment = 'positive'
            confidence = 0.7
        elif negative_count > positive_count:
            sentiment = 'negative'
            confidence = 0.7
        else:
            sentiment = 'neutral'
            confidence = 0.6

        return SentimentAnalysis(
            sentiment=sentiment,
            confidence=confidence,
            emotions={
                'joy': 0.3,
                'sadness': 0.2,
                'anger': 0.1,
                'fear': 0.1,
                'surprise': 0.3
            },
            topics=[]
        )

    @staticmethod
    def _analyze_quality(content: str, title: Optional[str], language: str) -> ContentQuality:
        """质量分析"""

        issues = []
        improvements = []

        # 原创度检查（简化版 - 实际需要查重API）
        originality_score = 0.85

        # 语法检查（简化版）
        grammar_score = 0.90

        # 结构检查
        structure_issues = []
        if not title:
            structure_issues.append("缺少标题")
        if len(content) < 300:
            structure_issues.append("内容过短")

        paragraphs = content.split('\n\n')
        if len(paragraphs) < 3:
            structure_issues.append("段落过少")

        structure_score = max(0, 1 - len(structure_issues) * 0.2)

        if structure_issues:
            issues.extend(structure_issues)
            improvements.append("增加内容长度和段落结构")

        # 互动潜力评估
        engagement_indicators = 0
        if '?' in content:
            engagement_indicators += 1
        if '!' in content:
            engagement_indicators += 1

        engagement_score = min(1, 0.5 + engagement_indicators * 0.15)

        if engagement_score < 0.7:
            improvements.append("增加互动元素，如提问、号召行动等")

        return ContentQuality(
            originality_score=round(originality_score, 2),
            grammar_score=round(grammar_score, 2),
            structure_score=round(structure_score, 2),
            engagement_score=round(engagement_score, 2),
            issues=issues,
            improvements=improvements
        )

    @staticmethod
    def _extract_keywords(content: str, language: str, top_n: int = 20) -> List[str]:
        """提取关键词"""

        # 移除标点符号
        content = re.sub(r'[^\w\s]', ' ', content)

        # 分词
        if language == 'zh':
            # 简化：按字符分割（实际应使用jieba等分词工具）
            words = [w for w in content if w.strip() and len(w) > 1]
            stop_words = ContentAnalysisService.STOP_WORDS_ZH
        else:
            words = content.lower().split()
            stop_words = ContentAnalysisService.STOP_WORDS_EN

        # 去除停用词
        words = [w for w in words if w not in stop_words and len(w) > 1]

        # 统计词频
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1

        # 按频率排序
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)

        return [word for word, freq in sorted_words[:top_n]]

    @staticmethod
    def get_keyword_suggestions(content: str, language: str) -> List[KeywordSuggestion]:
        """获取关键词建议"""

        keywords = ContentAnalysisService._extract_keywords(content, language)

        suggestions = []
        for keyword in keywords[:10]:
            suggestions.append(KeywordSuggestion(
                keyword=keyword,
                relevance=0.8,
                volume=None,
                difficulty=0.5
            ))

        return suggestions

    @staticmethod
    def get_content_recommendations(analysis: ContentAnalysisResponse) -> List[ContentRecommendation]:
        """获取内容优化推荐"""

        recommendations = []

        # 基于SEO分析
        if analysis.seo_analysis:
            if analysis.seo_analysis.overall_score < 70:
                recommendations.append(ContentRecommendation(
                    type="seo",
                    title="优化SEO",
                    description="提高内容SEO评分，增加搜索引擎可见性",
                    priority="high",
                    impact="高"
                ))

        # 基于可读性分析
        if analysis.readability_analysis:
            if analysis.readability_analysis.flesch_score < 60:
                recommendations.append(ContentRecommendation(
                    type="readability",
                    title="提高可读性",
                    description="简化句子结构，提高内容可读性",
                    priority="medium",
                    impact="中"
                ))

        # 基于质量分析
        if analysis.quality_analysis:
            if analysis.quality_analysis.engagement_score < 0.7:
                recommendations.append(ContentRecommendation(
                    type="engagement",
                    title="增强互动性",
                    description="增加提问、号召行动等互动元素",
                    priority="medium",
                    impact="中"
                ))

        return recommendations
