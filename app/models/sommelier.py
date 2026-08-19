import re
from typing import Dict, Any, List

class TeaSommelier:
    def __init__(self, dataset: List[Dict[str, Any]] = None):
        self.dataset = dataset or []

    def set_dataset(self, dataset: List[Dict[str, Any]]) -> None:
        self.dataset = dataset

    def chat(self, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        msg_lower = message.lower()
        
        # 1. Sleep / Nighttime / Relaxation Queries
        if any(w in msg_lower for w in ["sleep", "bedtime", "insomnia", "nighttime", "night cap", "relax", "stress", "calming", "anxiety", "ashwagandha"]):
            return self._handle_sleep_query(msg_lower)
            
        # 2. Brewing Guidance Queries (Kadak Chai, Kahwa, Darjeeling)
        elif any(w in msg_lower for w in ["brew", "steep", "temperature", "how to make", "steep time", "brew time", "water ratio", "kadak", "kulhad"]):
            return self._handle_brewing_query(msg_lower)
            
        # 3. Energy / Focus / Morning / Work Queries
        elif any(w in msg_lower for w in ["energy", "focus", "morning", "wake up", "caffeine", "boost", "work", "study", "alertness", "assam"]):
            return self._handle_energy_query(msg_lower)
            
        # 4. Digestion / Monsoon / Kadha / Ayurveda Queries
        elif any(w in msg_lower for w in ["digest", "stomach", "bloat", "kadha", "immunity", "cough", "cold", "ayurved", "tulsi", "turmeric"]):
            return self._handle_health_query(msg_lower)
            
        # 5. Food Pairing Queries
        elif any(w in msg_lower for w in ["pair", "food", "snack", "samosa", "pakora", "bun maska", "biscuit", "nankhatai", "mathri"]):
            return self._handle_pairing_query(msg_lower)
            
        # 6. Specific Indian Terroirs (Darjeeling, Assam, Nilgiri, Kashmir, Kangra, Sikkim)
        elif any(w in msg_lower for w in ["darjeeling", "assam", "nilgiri", "kahwa", "kashmir", "kangra", "sikkim", "masala chai", "noon chai"]):
            return self._handle_terroir_query(msg_lower)
            
        # 7. General Indian Sommelier Welcome
        else:
            return self._handle_general_query(msg_lower)

    def _handle_brewing_query(self, msg: str) -> Dict[str, Any]:
        if "masala" in msg or "kadak" in msg or "chai" in msg:
            reply = (
                "☕ **Masterclass: Authentic Indian Kadak Masala Chai**:\n\n"
                "1. **Water-to-Milk Ratio**: 1 part filtered water to 1 part whole/creamy milk (or 60:40 for lighter body).\n"
                "2. **Spice Infusion**: Bring water to a boil with freshly crushed **Adrak (Ginger)** and **Elaichi (Green Cardamom)** for 2 minutes to extract essential oils.\n"
                "3. **Add CTC Assam Tea**: Add 1 heaping teaspoon of Assam CTC per cup. Simmer on low flame for 3 minutes until rich mahogany.\n"
                "4. **Add Milk & Jaggery/Sugar**: Add milk, bring to a rolling boil (*ubal*) 3 times, strain through a fine mesh into a warm clay kulhad."
            )
            chai_teas = [t for t in self.dataset if "Chai" in t["teaType"] or "Assam" in t["teaType"]][:2]
            return {
                "response": reply,
                "recommendedTeas": chai_teas,
                "suggestions": ["Show top Masala Chais", "How to brew Kashmiri Kahwa?", "Best Darjeeling First Flush"]
            }

        elif "kahwa" in msg or "kashmir" in msg:
            reply = (
                "🍵 **Masterclass: Kashmiri Saffron Almond Kahwa**:\n\n"
                "1. **Water Temperature**: 80°C – 85°C (Gentle simmer, never boiling green tea leaves).\n"
                "2. **Botanical Base**: Simmer crushed green cardamom, cinnamon bark, and dried rose petals in water for 3 minutes.\n"
                "3. **Saffron & Green Leaf**: Add Kashmiri green tea leaves and steep for 3 minutes. Pour into glasses garnished with pure **Pampore Saffron** strands and slivered almonds."
            )
            kahwa_teas = [t for t in self.dataset if "Kahwa" in t["teaType"]][:2]
            return {
                "response": reply,
                "recommendedTeas": kahwa_teas,
                "suggestions": ["Show Kashmiri Kahwa blends", "Health benefits of Saffron", "How to brew Darjeeling"]
            }
        else:
            reply = (
                "🍃 **Masterclass: Darjeeling & Single-Estate Whole Leaf**:\n\n"
                "1. **Water Temperature**: 85°C (185°F). Boiling water burns delicate muscatel notes.\n"
                "2. **Steep Time**: 3 to 4 minutes.\n"
                "3. **Leaf Ratio**: 2.5g per 200ml freshly drawn spring water. Enjoy clear without milk to appreciate the terroir."
            )
            darj_teas = [t for t in self.dataset if "Darjeeling" in t["teaType"]][:2]
            return {
                "response": reply,
                "recommendedTeas": darj_teas,
                "suggestions": ["Show Darjeeling First Flush", "Explore Nilgiri Frost Teas", "Take the AI Tea Quiz"]
            }

    def _handle_sleep_query(self, msg: str) -> Dict[str, Any]:
        sleep_teas = [t for t in self.dataset if t["teaType"] in ["Ayurvedic Tisane", "Kashmir Kahwa"] and any(m in t.get("moodTags", []) for m in ["Calm", "Relaxed", "Soothing"])][:3]
        reply = (
            "🌙 **Evening Ayurvedic Restorative Ritual**:\n\n"
            "For restful sleep and calming the nervous system, traditional Ayurvedic botanicals like **Ashwagandha root**, "
            "**Brahmi**, **Shankhpushpi**, and **Chamomile** naturally balance Vata dosha and regulate cortisol without any caffeine."
        )
        return {
            "response": reply,
            "recommendedTeas": sleep_teas,
            "suggestions": ["Show Ashwagandha Elixirs", "Zero-caffeine tisanes", "Kashmiri Kahwa for evenings"]
        }

    def _handle_energy_query(self, msg: str) -> Dict[str, Any]:
        energy_teas = [t for t in self.dataset if t["teaType"] in ["Assam", "Masala Chai"] and t.get("caffeine", 0) >= 50][:3]
        reply = (
            "⚡ **High Sustained Energy & Morning Alertness**:\n\n"
            "Upper Assam whole leaf and orthodox CTC teas from estates like Halmari and Mangalam are naturally rich in "
            "theaflavins and caffeine. Combined with warming spices like **Adrak (Ginger)** and **Kali Mirch (Black Pepper)**, they ignite digestive fire (Agni) and provide 5+ hours of sustained vigor."
        )
        return {
            "response": reply,
            "recommendedTeas": energy_teas,
            "suggestions": ["Show Upper Assam CTC", "Kadak Chai blends", "Best morning breakfast teas"]
        }

    def _handle_health_query(self, msg: str) -> Dict[str, Any]:
        health_teas = [t for t in self.dataset if t["teaType"] == "Ayurvedic Tisane" or "Tulsi" in t["ingredients"]][:3]
        reply = (
            "🌿 **Ayurvedic Immunity & Digestive Harmony (Kadha)**:\n\n"
            "• **Rama & Krishna Tulsi**: Potent adaptogens that protect the respiratory tract and alleviate seasonal allergies.\n"
            "• **Wild Himalayan Turmeric & Ginger**: Curcumin enhances immunity and joint vitality.\n"
            "• **Saunf (Fennel) & Mulethi (Licorice)**: Cools the stomach and aids healthy post-meal digestion."
        )
        return {
            "response": reply,
            "recommendedTeas": health_teas,
            "suggestions": ["Show Ayurvedic Kadhas", "Tulsi Green Teas", "Ginger Turmeric Immunity Blends"]
        }

    def _handle_pairing_query(self, msg: str) -> Dict[str, Any]:
        pairing_teas = self.dataset[:3]
        reply = (
            "✨ **Artisanal Indian Tea & Culinary Pairings**:\n\n"
            "• **Crisp Hot Samosas & Pakoras**: Perfectly balanced by robust, spiced *Assam Masala Chai* or *Dhaba Kadak Chai*.\n"
            "• **Irani Bun Maska & Nankhatai**: The classic companion to rich *Cardamom Elaichi Chai*.\n"
            "• **Shrewsbury & Butter Biscuits**: Elevates single-estate *Darjeeling First Flush* or *Nilgiri Frost Tea*.\n"
            "• **Kashmiri Bakarkhani / Girda**: Harmonizes with saffron-infused *Kashmiri Kahwa* or *Pink Noon Chai*."
        )
        return {
            "response": reply,
            "recommendedTeas": pairing_teas,
            "suggestions": ["Show Masala Chais", "Show Kashmiri Kahwa", "Best Darjeeling Blends"]
        }

    def _handle_terroir_query(self, msg: str) -> Dict[str, Any]:
        matched = "Darjeeling"
        for t in ["Assam", "Darjeeling", "Nilgiri", "Kahwa", "Kangra", "Sikkim", "Masala Chai"]:
            if t.lower() in msg:
                matched = t
                break
        terroir_teas = [t for t in self.dataset if matched.lower() in t["teaType"].lower() or matched.lower() in t["origin"].lower()][:3]
        reply = (
            f"🍵 **Exploring {matched} Terroir**:\n\n"
            f"Our cellar features premier single-estate harvests from {matched} with verified GI provenance, "
            f"calibrated sensory notes, and rich heritage. Here are our master sommelier selections for you:"
        )
        return {
            "response": reply,
            "recommendedTeas": terroir_teas,
            "suggestions": [f"Brewing guide for {matched}", f"Price of {matched} in ₹", "Take AI Chai Quiz"]
        }

    def _handle_general_query(self, msg: str) -> Dict[str, Any]:
        sample_teas = self.dataset[:3] if self.dataset else []
        reply = (
            "Namaste! I am your **TeaML India AI Chai & Tea Sommelier** 🍵.\n\n"
            "I can recommend the perfect Indian harvest for your mood, provide exact recipes for **Kadak Masala Chai**, **Kashmiri Kahwa**, and **Darjeeling First Flush**, or guide you through Ayurvedic wellness tisanes. What would you like to explore?"
        )
        return {
            "response": reply,
            "recommendedTeas": sample_teas,
            "suggestions": ["Best Kadak Chai recipe", "Teas for deep sleep & stress", "Show Darjeeling First Flush", "Take AI Chai Quiz"]
        }
