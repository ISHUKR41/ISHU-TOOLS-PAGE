from typing import Any, Literal

from pydantic import BaseModel


class ToolCategory(BaseModel):
    id: str
    label: str
    description: str


class ToolDefinition(BaseModel):
    slug: str
    title: str
    description: str
    category: str
    tags: list[str]
    input_kind: Literal["files", "text", "url", "mixed"]
    accepts_multiple: bool = False


class ToolRunResult(BaseModel):
    status: Literal["success", "error"]
    message: str
    data: dict[str, Any] | None = None
