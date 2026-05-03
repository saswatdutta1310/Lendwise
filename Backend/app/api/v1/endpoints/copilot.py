from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from app.api import deps
from app.models.models import User
from app.services.ai_engine import ai_engine
import json
import asyncio

router = APIRouter()

@router.post("/chat")
async def chat_streaming(
    request: Request,
    current_user: Annotated[User, Depends(deps.get_current_user)],
):
    """
    RAG Chat with Server-Sent Events (SSE) for streaming responses.
    """
    body = await request.json()
    user_message = body.get("content")
    
    async def event_generator():
        # 1. Simulate AI logic or call streaming LLM
        # In a real app, this would use LangChain's astream
        full_response = f"Hello {current_user.name}, I am processing your query about: {user_message}"
        
        # Stream word by word for effect
        for word in full_response.split():
            yield f"data: {json.dumps({'content': word + ' '})}\n\n"
            await asyncio.sleep(0.1)
        
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
