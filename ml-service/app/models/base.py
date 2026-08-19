from abc import ABC, abstractmethod
from typing import Dict, Any, List, Tuple

class BaseRecommender(ABC):
    """
    Abstract Strategy Interface for all TeaML recommendation models.
    Complies with Open/Closed and Liskov Substitution Principles.
    """
    def __init__(self, name: str):
        self.name = name
        self.is_trained = False

    @abstractmethod
    def fit(self, dataset: List[Dict[str, Any]]) -> None:
        """Trains the recommendation model on the provided tea dataset."""
        pass

    @abstractmethod
    def recommend(self, quiz: Dict[str, Any], top_k: int = 5) -> List[Dict[str, Any]]:
        """Generates ranked tea recommendations with match confidence scores and explanations."""
        pass

    @abstractmethod
    def evaluate(self) -> Dict[str, float]:
        """Calculates model performance metrics (Accuracy, Precision@5, NDCG, Coverage)."""
        pass
