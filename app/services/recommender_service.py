import os
import json
from typing import Dict, Any, List
from app.models.content_based import ContentBasedRecommender
from app.models.decision_tree import DecisionTreeRecommender
from app.models.random_forest import RandomForestRecommender
from app.models.hybrid import HybridRecommender
from app.models.sommelier import TeaSommelier
from app.data.dataset_generator import generate_tea_dataset, export_dataset

class RecommenderService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RecommenderService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        self.dataset: List[Dict[str, Any]] = []
        self.models: Dict[str, Any] = {
            "content_based": ContentBasedRecommender(),
            "decision_tree": DecisionTreeRecommender(),
            "random_forest": RandomForestRecommender(),
            "hybrid": HybridRecommender(),
        }
        self.active_model_key = "hybrid"
        self.sommelier = TeaSommelier()
        self.metrics_cache: Dict[str, Any] = {}
        
        self._load_and_train()
        self._initialized = True

    def _load_and_train(self) -> None:
        dataset_path = os.path.join(os.path.dirname(__file__), "..", "data", "teas_dataset.json")
        if not os.path.exists(dataset_path):
            print("[INFO] Dataset not found. Generating 1050 records...")
            export_dataset()
            
        with open(dataset_path, "r", encoding="utf-8") as f:
            self.dataset = json.load(f)
            
        print(f"[INFO] Loaded {len(self.dataset)} tea records for ML service.")
        self.retrain_all()
        self.sommelier.set_dataset(self.dataset)

    def retrain_all(self) -> Dict[str, Any]:
        print("[INFO] Training all ML recommendation models...")
        comparison = {}
        
        for key, model in self.models.items():
            model.fit(self.dataset)
            metrics = model.evaluate()
            comparison[key] = metrics
            print(f"[INFO] Model '{model.name}' trained. Accuracy: {metrics.get('accuracy')}, NDCG@5: {metrics.get('ndcg_at_5')}")

        self.metrics_cache = comparison
        # Automatically select the model with highest NDCG@5
        best_key = max(comparison.keys(), key=lambda k: comparison[k].get("ndcg_at_5", 0))
        self.active_model_key = best_key
        print(f"[INFO] Best model auto-selected: '{self.models[best_key].name}'")
        
        return {
            "status": "success",
            "activeModel": self.active_model_key,
            "modelsCompared": comparison
        }

    def predict(self, quiz: Dict[str, Any], top_k: int = 5, model_override: str = None) -> Dict[str, Any]:
        selected_key = model_override if model_override in self.models else self.active_model_key
        model = self.models[selected_key]
        
        recommendations = model.recommend(quiz, top_k=top_k)
        
        return {
            "status": "success",
            "activeModel": model.name,
            "modelKey": selected_key,
            "totalEvaluated": len(self.dataset),
            "recommendations": recommendations
        }

    def get_metrics(self) -> Dict[str, Any]:
        return {
            "activeModel": self.active_model_key,
            "totalTeas": len(self.dataset),
            "benchmarks": self.metrics_cache
        }

    def get_models_comparison(self) -> List[Dict[str, Any]]:
        results = []
        for key, model in self.models.items():
            metrics = self.metrics_cache.get(key, model.evaluate())
            results.append({
                "key": key,
                "name": model.name,
                "isActive": (key == self.active_model_key),
                **metrics
            })
        return results

    def chat(self, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        return self.sommelier.chat(message, context)

recommender_service = RecommenderService()
