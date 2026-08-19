from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.services.recommender_service import recommender_service

router = APIRouter()

class QuizPayload(BaseModel):
    age: Optional[int] = 28
    country: Optional[str] = "United States"
    climate: Optional[str] = "Temperate"
    teaFrequency: Optional[str] = "Daily (1-2 cups)"
    favoriteFlavours: Optional[List[str]] = ["Floral", "Honey", "Citrus"]
    teaStrength: Optional[str] = "Medium Balanced"
    sugarPreference: Optional[str] = "No Sugar / Pure"
    milkPreference: Optional[str] = "Pure Black/Clear Tea (No Milk)"
    spicePreference: Optional[float] = 3.0
    floralPreference: Optional[float] = 6.0
    aromaPreference: Optional[float] = 8.0
    mood: Optional[str] = "Calm"
    stressLevel: Optional[int] = 4
    sleepQuality: Optional[str] = "Deep & Restful"
    healthGoals: Optional[List[str]] = ["Stress Relief", "Antioxidant Boost"]
    budget: Optional[str] = "Premium Artisan ($18 - $30)"
    teaBrands: Optional[str] = "Artisan Estate"
    caffeineTolerance: Optional[str] = "Moderate Caffeine"
    preparationStyle: Optional[str] = "Western Teapot Infuser"
    modelOverride: Optional[str] = None
    topK: Optional[int] = 5

class ChatPayload(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

@router.post("/predict")
async def predict_recommendations(payload: QuizPayload):
    try:
        quiz_data = payload.model_dump()
        top_k = payload.topK or 5
        model_override = payload.modelOverride
        result = recommender_service.predict(quiz_data, top_k=top_k, model_override=model_override)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/retrain")
async def retrain_models():
    try:
        result = recommender_service.retrain_all()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics")
async def get_metrics():
    return recommender_service.get_metrics()

@router.get("/models/compare")
async def get_models_comparison():
    return recommender_service.get_models_comparison()

@router.post("/chat")
async def sommelier_chat(payload: ChatPayload):
    try:
        return recommender_service.chat(payload.message, payload.context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dataset/sample")
async def get_sample_dataset(limit: int = 10):
    return recommender_service.dataset[:limit]

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "TeaML Machine Learning Engine",
        "activeModel": recommender_service.active_model_key,
        "datasetCount": len(recommender_service.dataset)
    }
