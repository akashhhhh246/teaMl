import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "TeaML - Machine Learning Recommendation Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    PORT: int = int(os.getenv("ML_PORT", "8000"))
    HOST: str = os.getenv("ML_HOST", "0.0.0.0")
    DATASET_PATH: str = os.getenv("DATASET_PATH", "app/data/teas_dataset.json")
    MODELS_DIR: str = os.getenv("MODELS_DIR", "app/saved_models")

settings = Settings()
