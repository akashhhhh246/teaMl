import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.data.dataset_generator import generate_indian_tea_dataset
from app.models.content_based import ContentBasedRecommender
from app.models.decision_tree import DecisionTreeRecommender
from app.models.random_forest import RandomForestRecommender
from app.models.hybrid import HybridRecommender
from app.models.sommelier import TeaSommelier
from app.services.recommender_service import RecommenderService

@pytest.fixture
def sample_dataset():
    return generate_indian_tea_dataset(target_count=50)

def test_dataset_generation():
    teas = generate_indian_tea_dataset(target_count=30)
    assert len(teas) == 30
    first = teas[0]
    assert "TEA-IN-" in first["id"]
    assert first["price"] > 0
    assert len(first["flavorProfile"]) > 0

def test_content_based_recommender(sample_dataset):
    model = ContentBasedRecommender()
    model.fit(sample_dataset)
    
    user_features = {
        "favoriteFlavours": ["Cardamom (Elaichi)", "Ginger (Adrak)"],
        "teaStrength": "Bold & Strong",
        "floralPreference": 5,
        "spicePreference": 8,
        "aromaPreference": 9,
        "mood": "Calm",
        "caffeineTolerance": "Moderate Caffeine"
    }
    
    recs = model.recommend(user_features, top_k=5)
    assert len(recs) == 5
    assert "confidenceScore" in recs[0]
    assert "tea" in recs[0]

def test_decision_tree_recommender(sample_dataset):
    model = DecisionTreeRecommender()
    model.fit(sample_dataset)
    
    user_features = {
        "mood": "Energetic",
        "stressLevel": 3,
        "caffeineTolerance": "High Caffeine"
    }
    recs = model.recommend(user_features, top_k=3)
    assert len(recs) == 3

def test_random_forest_recommender(sample_dataset):
    model = RandomForestRecommender()
    model.fit(sample_dataset)
    
    user_features = {
        "spicePreference": 8,
        "floralPreference": 4,
        "mood": "Calm"
    }
    recs = model.recommend(user_features, top_k=5)
    assert len(recs) == 5

def test_hybrid_recommender(sample_dataset):
    model = HybridRecommender()
    model.fit(sample_dataset)
    
    user_features = {
        "favoriteFlavours": ["Cardamom (Elaichi)", "Ginger (Adrak)"],
        "mood": "Calm",
        "spicePreference": 7,
        "floralPreference": 6,
        "caffeineTolerance": "Moderate Caffeine"
    }
    recs = model.recommend(user_features, top_k=5)
    assert len(recs) == 5
    assert recs[0]["confidenceScore"] > 50

def test_sommelier_chat(sample_dataset):
    sommelier = TeaSommelier(sample_dataset)
    res_brew = sommelier.chat("How do I brew authentic Kadak Masala Chai?")
    assert "Kadak" in res_brew["response"] or "Chai" in res_brew["response"]
    assert len(res_brew["suggestions"]) > 0

def test_recommender_service_orchestrator(sample_dataset):
    service = RecommenderService()
    service.dataset = sample_dataset
    service.retrain_all()
    assert "hybrid" in service.active_model_key
    
    user_features = {"mood": "Calm", "favoriteFlavours": ["Cardamom (Elaichi)"]}
    result = service.predict(user_features, top_k=3)
    assert len(result["recommendations"]) == 3
    
    comparison = service.get_models_comparison()
    assert len(comparison) >= 4
