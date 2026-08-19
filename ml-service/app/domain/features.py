import numpy as np
import pandas as pd
from typing import Dict, Any, List

STRENGTH_MAP = {
    "Light & Delicate": 2.0,
    "Medium Balanced": 5.0,
    "Bold & Strong": 7.5,
    "Extra Robust": 9.5
}

CAFFEINE_TOLERANCE_MAP = {
    "Zero Caffeine (Herbal/Tisane only)": 0,
    "Low Caffeine": 20,
    "Moderate Caffeine": 45,
    "High Caffeine / Need Maximum Energy": 75
}

class FeatureExtractor:
    @staticmethod
    def extract_user_sensory_vector(quiz: Dict[str, Any]) -> np.ndarray:
        """
        Converts user quiz responses into a 5-dimensional normalized sensory vector:
        [Bitterness, Sweetness, Floral, Spice, Aroma]
        Values are scaled in [0.0, 1.0] range.
        """
        # Bitterness target derived from strength and milk preference
        strength_val = STRENGTH_MAP.get(quiz.get("teaStrength", "Medium Balanced"), 5.0)
        bitterness_target = strength_val / 10.0
        
        # Sweetness target derived from sugar preference
        sugar = quiz.get("sugarPreference", "No Sugar / Pure")
        if "No Sugar" in sugar:
            sweetness_target = 0.3
        elif "Slightly" in sugar:
            sweetness_target = 0.55
        elif "Moderately" in sugar:
            sweetness_target = 0.75
        else:
            sweetness_target = 0.95
            
        floral_target = float(quiz.get("floralPreference", 5)) / 10.0
        spice_target = float(quiz.get("spicePreference", 3)) / 10.0
        aroma_target = float(quiz.get("aromaPreference", 7)) / 10.0
        
        return np.array([bitterness_target, sweetness_target, floral_target, spice_target, aroma_target])

    @staticmethod
    def extract_tea_sensory_vector(tea: Dict[str, Any]) -> np.ndarray:
        """
        Converts tea sensory scores into a 5-dimensional normalized sensory vector:
        [Bitterness, Sweetness, Floral, Spice, Aroma]
        """
        b = float(tea.get("bitterness", 5.0)) / 10.0
        s = float(tea.get("sweetness", 5.0)) / 10.0
        f = float(tea.get("floralNotes", 5.0)) / 10.0
        sp = float(tea.get("spiceLevel", 3.0)) / 10.0
        a = float(tea.get("aroma", 7.0)) / 10.0
        return np.array([b, s, f, sp, a])

    @staticmethod
    def build_user_query_text(quiz: Dict[str, Any]) -> str:
        """
        Builds a comprehensive semantic query string for TF-IDF content matching.
        """
        tokens = []
        
        # Flavours
        fav_flavours = quiz.get("favoriteFlavours", [])
        if isinstance(fav_flavours, list):
            tokens.extend(fav_flavours)
            tokens.extend(fav_flavours)  # Double weight for explicit flavor choices
            
        # Mood
        mood = quiz.get("mood", "")
        if mood:
            tokens.append(mood)
            tokens.append(f"{mood} state")
            
        # Health Goals
        goals = quiz.get("healthGoals", [])
        if isinstance(goals, list):
            tokens.extend(goals)
            
        # Climate / Seasonality
        climate = quiz.get("climate", "")
        if "Cold" in climate:
            tokens.extend(["Warming", "Winter", "Spiced", "Comforting"])
        elif "Tropical" in climate:
            tokens.extend(["Refreshing", "Cooling", "Summer", "Green", "Minty"])
            
        # Sleep & Stress
        stress = int(quiz.get("stressLevel", 5))
        if stress >= 7:
            tokens.extend(["Stress Relief", "Calm", "L-Theanine", "Chamomile", "Relaxed"])
            
        sleep = quiz.get("sleepQuality", "")
        if "Restless" in sleep or "Insomnia" in sleep:
            tokens.extend(["Sleep Enhancement", "Lavender", "Valerian", "Caffeine-Free", "Tisane"])
            
        # Caffeine tolerance filter hint
        caff = quiz.get("caffeineTolerance", "")
        if "Zero Caffeine" in caff:
            tokens.extend(["Tisane", "Rooibos", "Herbal", "Zero Caffeine"])
            
        return " ".join(tokens)

    @staticmethod
    def build_tea_corpus_text(tea: Dict[str, Any]) -> str:
        """
        Builds a rich semantic document for each tea blend.
        """
        flavors = " ".join(tea.get("flavorProfile", []))
        benefits = " ".join(tea.get("healthBenefits", []))
        moods = " ".join(tea.get("moodTags", []))
        pairings = " ".join(tea.get("foodPairings", []))
        
        return (
            f"{tea.get('name', '')} {tea.get('teaType', '')} {tea.get('origin', '')} "
            f"{flavors} {flavors} {benefits} {benefits} {moods} {moods} "
            f"{tea.get('ingredients', '')} {tea.get('description', '')} {pairings} {tea.get('season', '')}"
        )
