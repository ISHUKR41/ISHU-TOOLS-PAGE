from typing import Any, Literal

try:
    from pydantic import BaseModel
except ModuleNotFoundError:
    # Lightweight fallback for build-time scripts when pydantic is not installed.
    class BaseModel:  # type: ignore[no-redef]
        def __init__(self, **data: Any):
            fields = getattr(self.__class__, "__annotations__", {})
            for name in fields:
                if name in data:
                    setattr(self, name, data[name])
                elif hasattr(self.__class__, name):
                    setattr(self, name, getattr(self.__class__, name))
                else:
                    setattr(self, name, None)

        def model_dump(self) -> dict[str, Any]:
            return {k: getattr(self, k) for k in getattr(self.__class__, "__annotations__", {})}


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
