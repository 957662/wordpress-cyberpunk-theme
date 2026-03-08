"""
Content Analysis API Routes
内容分析相关API端点
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from app.core.database import get_db
from app.services.content_analysis_service import ContentAnalysisService

router = APIRouter()


class TextAnalysisRequest(BaseModel):
    """文本分析请求"""
    text: str = Field(..., min_length=1, description="要分析的文本内容")
    analysis_type: str = Field(
        default="full",
        description="分析类型: full, sentiment, keywords, readability, seo"
    )


class TextAnalysisResponse(BaseModel):
    """文本分析响应"""
    summary: str
    sentiment: dict
    keywords: List[str]
    readability_score: float
    seo_score: float
    suggestions: List[str]
    word_count: int
    reading_time: int


class SEOAnalysisRequest(BaseModel):
    """SEO分析请求"""
    title: str
    content: str
    meta_description: Optional[str] = None
    keywords: List[str] = []
    target_audience: Optional[str] = None


class SEOAnalysisResponse(BaseModel):
    """SEO分析响应"""
    score: float
    title_analysis: dict
    content_analysis: dict
    keyword_analysis: dict
    readability_analysis: dict
    suggestions: List[str]
    missing_elements: List[str]


class PlagiarismCheckRequest(BaseModel):
    """抄袭检查请求"""
    text: str
    check_sources: bool = True


class PlagiarismCheckResponse(BaseModel):
    """抄袭检查响应"""
    is_unique: bool
    similarity_score: float
    matched_sources: List[dict]
    suggestions: List[str]


@router.post("/analyze", response_model=TextAnalysisResponse)
async def analyze_text(
    request: TextAnalysisRequest,
    db: Session = Depends(get_db),
):
    """
    分析文本内容
    
    分析内容包括：
    - 摘要生成
    - 情感分析
    - 关键词提取
    - 可读性评分
    - SEO评分
    - 改进建议
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        result = analysis_service.analyze_text(
            text=request.text,
            analysis_type=request.analysis_type
        )
        
        return TextAnalysisResponse(**result)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"文本分析失败: {str(e)}"
        )


@router.post("/seo", response_model=SEOAnalysisResponse)
async def analyze_seo(
    request: SEOAnalysisRequest,
    db: Session = Depends(get_db),
):
    """
    分析内容SEO
    
    检查项目：
    - 标题优化
    - 内容结构
    - 关键词密度
    - 元描述
    - 内部链接
    - 可读性
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        result = analysis_service.analyze_seo(
            title=request.title,
            content=request.content,
            meta_description=request.meta_description,
            keywords=request.keywords,
            target_audience=request.target_audience
        )
        
        return SEOAnalysisResponse(**result)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"SEO分析失败: {str(e)}"
        )


@router.post("/plagiarism", response_model=PlagiarismCheckResponse)
async def check_plagiarism(
    request: PlagiarismCheckRequest,
    db: Session = Depends(get_db),
):
    """
    检查内容原创性
    
    功能：
    - 文本相似度检测
    - 来源匹配
    - 原创性评分
    - 改写建议
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        result = analysis_service.check_plagiarism(
            text=request.text,
            check_sources=request.check_sources
        )
        
        return PlagiarismCheckResponse(**result)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"抄袭检查失败: {str(e)}"
        )


@router.post("/summarize")
async def summarize_text(
    text: str,
    max_length: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """
    生成文本摘要
    
    参数：
    - text: 要摘要的文本
    - max_length: 摘要最大长度
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        summary = analysis_service.summarize_text(
            text=text,
            max_length=max_length
        )
        
        return {
            "summary": summary,
            "original_length": len(text),
            "summary_length": len(summary),
            "compression_ratio": len(summary) / len(text)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"摘要生成失败: {str(e)}"
        )


@router.post("/keywords")
async def extract_keywords(
    text: str,
    max_keywords: Optional[int] = 10,
    db: Session = Depends(get_db),
):
    """
    提取文本关键词
    
    参数：
    - text: 要分析的文本
    - max_keywords: 最多返回关键词数量
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        keywords = analysis_service.extract_keywords(
            text=text,
            max_keywords=max_keywords
        )
        
        return {
            "keywords": keywords,
            "count": len(keywords)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"关键词提取失败: {str(e)}"
        )


@router.post("/sentiment")
async def analyze_sentiment(
    text: str,
    db: Session = Depends(get_db),
):
    """
    分析文本情感
    
    返回：
    - 情感类别（正面/负面/中性）
    - 置信度
    - 情感强度
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        sentiment = analysis_service.analyze_sentiment(text=text)
        
        return sentiment
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"情感分析失败: {str(e)}"
        )


@router.post("/readability")
async def analyze_readability(
    text: str,
    db: Session = Depends(get_db),
):
    """
    分析文本可读性
    
    指标：
    - Flesch Reading Ease
    - Flesch-Kincaid Grade
    - Gunning Fog Index
    - 平均句子长度
    - 平均词长
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        readability = analysis_service.analyze_readability(text=text)
        
        return readability
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"可读性分析失败: {str(e)}"
        )


@router.post("/suggestions")
async def get_suggestions(
    text: str,
    suggestion_type: str = "general",
    db: Session = Depends(get_db),
):
    """
    获取内容改进建议
    
    类型：
    - general: 通用建议
    - seo: SEO优化建议
    - readability: 可读性建议
    - engagement: 用户参与度建议
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        suggestions = analysis_service.get_suggestions(
            text=text,
            suggestion_type=suggestion_type
        )
        
        return {
            "suggestions": suggestions,
            "type": suggestion_type,
            "count": len(suggestions)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"建议生成失败: {str(e)}"
        )


@router.post("/quality-score")
async def calculate_quality_score(
    title: str,
    content: str,
    db: Session = Depends(get_db),
):
    """
    计算内容质量分数
    
    评分维度：
    - 原创性 (30%)
    - 可读性 (25%)
    - SEO优化 (20%)
    - 信息价值 (15%)
    - 用户参与度 (10%)
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        quality_score = analysis_service.calculate_quality_score(
            title=title,
            content=content
        )
        
        return quality_score
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"质量评分失败: {str(e)}"
        )


@router.post("/optimize")
async def optimize_content(
    title: str,
    content: str,
    target_keywords: List[str] = [],
    db: Session = Depends(get_db),
):
    """
    优化内容
    
    功能：
    - 自动优化标题
    - 改进内容结构
    - 增加关键词密度
    - 提升可读性
    - 增强SEO
    """
    try:
        analysis_service = ContentAnalysisService(db=db)
        
        optimized = analysis_service.optimize_content(
            title=title,
            content=content,
            target_keywords=target_keywords
        )
        
        return optimized
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"内容优化失败: {str(e)}"
        )
