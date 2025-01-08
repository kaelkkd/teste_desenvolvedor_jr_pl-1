import sys
from dotenv import load_dotenv
from .utils import constants

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.llm_service import LLMService

app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str
    language: str

@app.post("/summarize")
async def summarize(data: TextData):
    if data.language not in constants.SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail="Language not supported")
    
    try:
        summary = llm_service.summarize_text(data.text, data.language)
        return {"summary": summary}
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))

#Rota inicial    
@app.get("/")
async def root():
    return {"message": "API is live"}