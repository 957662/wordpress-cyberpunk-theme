"""
OpenAPI documentation configuration for FastAPI
"""

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi


def custom_openapi(app: FastAPI):
    """
    Custom OpenAPI schema generator with enhanced documentation
    """

    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="CyberPress Platform API",
        version="1.0.0",
        description="""
        # CyberPress Platform RESTful API

        Complete API documentation for CyberPress Platform - A cyberpunk-styled blogging platform.

        ## Features

        * **Authentication**: JWT-based authentication system
        * **User Management**: Complete user profile management
        * **Blog System**: Create, read, update, delete posts
        * **Social Features**: Follow, like, comment systems
        * **Notifications**: Real-time notification system
        * **Media Management**: File upload and management
        * **Categories & Tags**: Organize content with taxonomies

        ## Authentication

        Most endpoints require authentication. Include your JWT token in the Authorization header:

        ```
        Authorization: Bearer <your_token>
        ```

        ## Rate Limiting

        * **Anonymous**: 100 requests/15min
        * **Authenticated**: 1000 requests/15min

        ## Error Codes

        | Code | Description |
        |------|-------------|
        | 400  | Bad Request |
        | 401  | Unauthorized |
        | 403  | Forbidden |
        | 404  | Not Found |
        | 422  | Validation Error |
        | 429  | Rate Limit Exceeded |
        | 500  | Internal Server Error |
        """,
        routes=app.routes,
        tags=[
            {
                "name": "Authentication",
                "description": "User authentication and authorization endpoints"
            },
            {
                "name": "Users",
                "description": "User profile and management"
            },
            {
                "name": "Posts",
                "description": "Blog post CRUD operations"
            },
            {
                "name": "Categories",
                "description": "Post category management"
            },
            {
                "name": "Tags",
                "description": "Post tag management"
            },
            {
                "name": "Comments",
                "description": "Comment system"
            },
            {
                "name": "Social",
                "description": "Social features (follow, like)"
            },
            {
                "name": "Notifications",
                "description": "User notifications"
            },
            {
                "name": "Media",
                "description": "File upload and management"
            },
        ],
    )

    # Add security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token obtained from /api/v1/auth/login"
        }
    }

    # Add global security requirement (optional, can be overridden per endpoint)
    # openapi_schema["security"] = [{"BearerAuth": []}]

    # Add common schemas
    openapi_schema["components"]["schemas"].update({
        "SuccessResponse": {
            "type": "object",
            "properties": {
                "success": {"type": "boolean", "example": True},
                "message": {"type": "string", "example": "Operation successful"},
                "data": {"type": "object"}
            }
        },
        "ErrorResponse": {
            "type": "object",
            "properties": {
                "success": {"type": "boolean", "example": False},
                "error": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "string"},
                        "message": {"type": "string"},
                        "details": {"type": "object"}
                    }
                }
            }
        },
        "ValidationError": {
            "type": "object",
            "properties": {
                "success": {"type": "boolean", "example": False},
                "error": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "string", "example": "VALIDATION_ERROR"},
                        "message": {"type": "string"},
                        "details": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "array",
                                "items": {"type": "string"}
                            }
                        }
                    }
                }
            }
        }
    })

    # Add contact information
    openapi_schema["info"]["contact"] = {
        "name": "CyberPress Team",
        "email": "support@cyberpress.com",
        "url": "https://cyberpress.com"
    }

    # Add license
    openapi_schema["info"]["license"] = {
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    }

    # Add servers
    openapi_schema["servers"] = [
        {
            "url": "http://localhost:8000",
            "description": "Development server"
        },
        {
            "url": "https://api.cyberpress.com",
            "description": "Production server"
        }
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


def setup_openapi(app: FastAPI):
    """Setup custom OpenAPI schema for the app"""
    app.openapi = lambda: custom_openapi(app)
