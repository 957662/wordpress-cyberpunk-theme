"""
AI Service - AI 服务
提供文本生成、摘要、分类等 AI 功能
"""

import httpx
from typing import Any, Dict, List, Optional
from datetime import datetime
import logging
from app.core.config import settings
import json

logger = logging.getLogger(__name__)


class AIService:
    """AI 服务类"""

    def __init__(self):
        """初始化 AI 服务"""
        self.api_key = None
        self.base_url = None
        self.model = "gpt-3.5-turbo"
        self.timeout = 30
        self.client: Optional[httpx.AsyncClient] = None
        self.is_mock = True  # 默认使用模拟模式

        # 从环境变量读取配置
        self._load_config()

    def _load_config(self):
        """加载配置"""
        # 这里可以从环境变量或配置文件读取
        # 如果没有配置 API key，则使用模拟模式
        pass

    async def __aenter__(self):
        """异步上下文管理器入口"""
        if not self.is_mock and self.base_url:
            self.client = httpx.AsyncClient(
                base_url=self.base_url,
                timeout=self.timeout,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
            )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """异步上下文管理器退出"""
        if self.client:
            await self.client.aclose()

    async def generate_summary(
        self,
        content: str,
        max_length: int = 200,
        language: str = "zh"
    ) -> Dict[str, Any]:
        """
        生成文章摘要

        Args:
            content: 文章内容
            max_length: 摘要最大长度
            language: 语言（zh, en）
        """
        try:
            if self.is_mock:
                return self._mock_summary(content, max_length)

            # 调用真实 AI API
            prompt = f"""请为以下文章生成一个简洁的摘要（不超过{max_length}字）：

{content[:1000]}

摘要："""

            response = await self._call_ai_api(prompt)
            return {
                "success": True,
                "summary": response.strip(),
                "original_length": len(content),
                "summary_length": len(response.strip())
            }

        except Exception as e:
            logger.error(f"Summary generation failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def classify_text(self, text: str) -> Dict[str, Any]:
        """
        文本分类

        Args:
            text: 待分类文本
        """
        try:
            if self.is_mock:
                return self._mock_classify(text)

            prompt = f"""请对以下文本进行分类，给出最匹配的分类和标签：

{text[:500]}

请以JSON格式返回：
{{
  "category": "分类名称",
  "confidence": 0.95,
  "tags": ["标签1", "标签2", "标签3"]
}}"""

            response = await self._call_ai_api(prompt)

            # 尝试解析 JSON 响应
            try:
                result = json.loads(response)
                return {
                    "success": True,
                    **result
                }
            except json.JSONDecodeError:
                # 如果不是有效 JSON，使用模拟响应
                return self._mock_classify(text)

        except Exception as e:
            logger.error(f"Text classification failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def extract_keywords(self, text: str, max_keywords: int = 10) -> Dict[str, Any]:
        """
        提取关键词

        Args:
            text: 文本内容
            max_keywords: 最大关键词数量
        """
        try:
            if self.is_mock:
                return self._mock_keywords(text, max_keywords)

            prompt = f"""从以下文本中提取 {max_keywords} 个最重要的关键词：

{text[:1000]}

请只返回关键词列表，用逗号分隔："""

            response = await self._call_ai_api(prompt)
            keywords = [k.strip() for k in response.split(",")[:max_keywords]]

            return {
                "success": True,
                "keywords": keywords,
                "count": len(keywords)
            }

        except Exception as e:
            logger.error(f"Keyword extraction failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def suggest_tags(self, title: str, content: str) -> Dict[str, Any]:
        """
        推荐标签

        Args:
            title: 文章标题
            content: 文章内容
        """
        try:
            if self.is_mock:
                return self._mock_tags(title, content)

            prompt = f"""根据以下文章标题和内容，推荐 5-10 个相关标签：

标题：{title}

内容：{content[:500]}

请以 JSON 数组格式返回标签：
["标签1", "标签2", "标签3"]"""

            response = await self._call_ai_api(prompt)

            try:
                tags = json.loads(response)
                return {
                    "success": True,
                    "tags": tags[:10]
                }
            except json.JSONDecodeError:
                return self._mock_tags(title, content)

        except Exception as e:
            logger.error(f"Tag suggestion failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def grammar_check(self, text: str) -> Dict[str, Any]:
        """
        语法检查

        Args:
            text: 待检查文本
        """
        try:
            if self.is_mock:
                return {
                    "success": True,
                    "is_correct": True,
                    "suggestions": []
                }

            prompt = f"""检查以下文本的语法和拼写错误：

{text}

如果没有错误，返回 "无错误"。
如果有错误，请指出并给出修改建议。"""

            response = await self._call_ai_api(prompt)

            return {
                "success": True,
                "is_correct": "无错误" in response or "没有错误" in response,
                "suggestions": [response]
            }

        except Exception as e:
            logger.error(f"Grammar check failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def recommend_content(self, current_post_id: int, tags: List[str]) -> Dict[str, Any]:
        """
        内容推荐

        Args:
            current_post_id: 当前文章 ID
            tags: 当前文章标签
        """
        try:
            if self.is_mock:
                return {
                    "success": True,
                    "recommended_ids": [],
                    "reason": "模拟模式：基于标签的相关文章推荐"
                }

            # 实际应用中，这里应该结合数据库查询和 AI 分析
            prompt = f"""基于以下标签：{', '.join(tags)}

推荐相关的文章主题和方向。"""

            response = await self._call_ai_api(prompt)

            return {
                "success": True,
                "recommendations": response,
                "reason": "基于标签相似度的内容推荐"
            }

        except Exception as e:
            logger.error(f"Content recommendation failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def _call_ai_api(self, prompt: str) -> str:
        """调用 AI API（真实模式）"""
        if not self.client:
            raise RuntimeError("AI client not initialized")

        response = await self.client.post(
            "/chat/completions",
            json={
                "model": self.model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 500
            }
        )
        response.raise_for_status()

        data = response.json()
        return data["choices"][0]["message"]["content"]

    # ========== 模拟方法（用于测试和开发） ==========

    def _mock_summary(self, content: str, max_length: int) -> Dict[str, Any]:
        """模拟摘要生成"""
        # 简单提取前几句话作为摘要
        sentences = content.split("。")
        summary = ""
        for sentence in sentences[:3]:
            if len(summary + sentence) <= max_length:
                summary += sentence + "。"
            else:
                break

        if not summary:
            summary = content[:max_length] + "..."

        return {
            "success": True,
            "summary": summary.strip(),
            "original_length": len(content),
            "summary_length": len(summary.strip()),
            "mock": True
        }

    def _mock_classify(self, text: str) -> Dict[str, Any]:
        """模拟分类"""
        # 简单的关键词匹配
        categories = {
            "技术": ["编程", "开发", "代码", "算法", "技术"],
            "生活": ["日常", "生活", "美食", "旅行", "心情"],
            "设计": ["UI", "UX", "设计", "创意", "视觉"],
            "产品": ["产品", "需求", "用户", "功能", "体验"]
        }

        best_category = "未分类"
        best_score = 0

        for category, keywords in categories.items():
            score = sum(1 for kw in keywords if kw in text)
            if score > best_score:
                best_score = score
                best_category = category

        return {
            "success": True,
            "category": best_category,
            "confidence": min(0.9, 0.5 + best_score * 0.1),
            "tags": [best_category],
            "mock": True
        }

    def _mock_keywords(self, text: str, max_keywords: int) -> Dict[str, Any]:
        """模拟关键词提取"""
        # 简单的词频统计
        words = text.split()
        word_freq = {}

        for word in words:
            if len(word) > 2:  # 忽略短词
                word_freq[word] = word_freq.get(word, 0) + 1

        # 按频率排序
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        keywords = [word for word, freq in sorted_words[:max_keywords]]

        return {
            "success": True,
            "keywords": keywords,
            "count": len(keywords),
            "mock": True
        }

    def _mock_tags(self, title: str, content: str) -> Dict[str, Any]:
        """模拟标签推荐"""
        # 基于标题和内容提取可能的标签
        common_tags = [
            "技术", "教程", "分享", "经验",
            "开发", "设计", "产品", "测试",
            "前端", "后端", "全栈", "架构"
        ]

        # 随机选择几个标签
        import random
        selected_tags = random.sample(common_tags, min(5, len(common_tags)))

        return {
            "success": True,
            "tags": selected_tags,
            "mock": True
        }


# 创建全局服务实例的辅助函数
async def get_ai_service() -> AIService:
    """获取 AI 服务实例"""
    return AIService()


# 使用示例
# async with AIService() as ai:
#     result = await ai.generate_summary("文章内容...")
#     print(result)
