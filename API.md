# 📡 TeaML REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 🍃 Indian Tea Catalog Endpoints

### `GET /teas`
Faceted search and pagination across 1,050+ Indian estate blends.
- **Query Params**:
  - `search`: string
  - `teaType`: "Darjeeling" | "Assam" | "Masala Chai" | "Kashmir Kahwa" | "Nilgiri" | "Ayurvedic Tisane" | "Kangra Valley" | "Sikkim Temi"
  - `origin`: string (e.g. "Darjeeling (Makaibari)", "Assam (Jorhat)", "Kashmir (Pampore)")
  - `mood`: string (e.g. "Calm", "Focused", "Energetic", "Relaxed")
  - `healthGoal`: string
  - `caffeineMin` / `caffeineMax`: number
  - `priceMin` / `priceMax`: number (in ₹ INR)
  - `sortBy`: "rating" | "price" | "reviews" | "name"
  - `sortOrder`: "asc" | "desc"
  - `page`: number (default: 1)
  - `limit`: number (default: 12)

### `GET /teas/:id`
Retrieves detailed sensory profile, brewing guide, culinary pairings, and verified reviews for a specific blend.

### `POST /teas`
Adds a new Indian harvest blend to the cellar.

---

## 🤖 AI & Sensory Recommendation Endpoints

### `POST /recommendations/predict`
Executes ML recommendation pipeline on 19 Indian sensory features.
- **Body**:
```json
{
  "age": 26,
  "country": "North India",
  "climate": "Monsoon / Humid",
  "teaFrequency": "Daily (2-3 cups Kadak Chai)",
  "favoriteFlavours": ["Cardamom (Elaichi)", "Ginger (Adrak)", "Saffron (Kesar)"],
  "teaStrength": "Bold & Strong",
  "sugarPreference": "Slightly Sweet (or Jaggery/Gur)",
  "milkPreference": "Rich Milk Tea (Kadak Chai)",
  "spicePreference": 8,
  "floralPreference": 5,
  "aromaPreference": 9,
  "mood": "Calm",
  "stressLevel": 5,
  "sleepQuality": "Average",
  "healthGoals": ["Stress Relief & Calming", "Immunity Fortification (Kadha)"],
  "budget": "Premium Single-Estate (₹500 - ₹1,200)",
  "teaBrands": "Indian Artisan Estates (Makaibari, Halmari, Temi)",
  "caffeineTolerance": "Moderate Caffeine",
  "preparationStyle": "Simmered Stove-top Pot (Kadak Chai)",
  "modelOverride": "hybrid"
}
```
- **Response**: Top 5 recommendations with match confidence scores, XAI explanations, and sensory comparison.

### `POST /chat`
Converses with the Indian Chai & Botanical Sommelier.
- **Body**: `{ "message": "How do I brew authentic Kadak Masala Chai?", "context": {} }`

### `GET /recommendations/models/compare`
Returns benchmark leaderboard comparing Decision Tree, Random Forest, Content-Based, and Hybrid models.

---

## 📝 Reviews & Chai Diary Endpoints

### `POST /reviews`
Submits a verified tasting note for any blend without requiring login.
- **Body**:
```json
{
  "teaId": "TEA-IN-0001",
  "rating": 5,
  "title": "Exquisite Muscatel Aroma",
  "comment": "Steeped at 85°C for 3 minutes. Pure spring gold."
}
```

### `POST /moods`
Logs an Ayurvedic mood check-in.
- **Body**:
```json
{
  "mood": "Calm",
  "stressLevel": 4,
  "energyLevel: 7,
  "note": "Afternoon ginger chai recharge"
}
```
