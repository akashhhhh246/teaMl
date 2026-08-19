# 📡 TeaML REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication Endpoints

### `POST /auth/register`
Creates a new user account.
- **Body**: `{ "name": "string", "email": "string", "password": "string" }`
- **Response**: `{ "success": true, "data": { "user": {...}, "token": "jwt_token" } }`

### `POST /auth/login`
Authenticates existing users.
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `{ "success": true, "data": { "user": {...}, "token": "jwt_token" } }`

### `GET /auth/me`
Fetches authenticated user profile and saved preferences.
- **Headers**: `Authorization: Bearer <token>`

---

## 🍃 Tea Catalog Endpoints

### `GET /teas`
Faceted search and pagination across 1,050+ tea blends.
- **Query Params**:
  - `search`: string
  - `teaType`: "Green" | "Black" | "Oolong" | "White" | "Tisane" | "Pu-erh" | "Matcha" | "Chai" | "Rooibos" | "Yellow"
  - `origin`: string
  - `mood`: string
  - `healthGoal`: string
  - `caffeineMin` / `caffeineMax`: number
  - `priceMin` / `priceMax`: number
  - `sortBy`: "rating" | "price" | "reviews" | "name" | "newest"
  - `sortOrder`: "asc" | "desc"
  - `page`: number (default: 1)
  - `limit`: number (default: 20)

### `GET /teas/:id`
Retrieves detailed sensory profile, brewing guide, and verified reviews for a specific blend.

### `POST /teas` *(Admin Only)*
Creates a new tea blend in the cellar.

---

## 🤖 AI & Recommendation Endpoints

### `POST /recommendations/predict`
Executes ML recommendation pipeline on 19 quiz features.
- **Body**:
```json
{
  "age": 28,
  "country": "United States",
  "climate": "Temperate",
  "teaFrequency": "Daily (1-2 cups)",
  "favoriteFlavours": ["Floral", "Honey", "Citrus"],
  "teaStrength": "Medium Balanced",
  "sugarPreference": "No Sugar / Pure",
  "milkPreference": "Pure Black/Clear Tea (No Milk)",
  "spicePreference": 3,
  "floralPreference": 7,
  "aromaPreference": 8,
  "mood": "Calm",
  "stressLevel": 5,
  "sleepQuality": "Average",
  "healthGoals": ["Stress Relief", "Antioxidant Boost"],
  "budget": "Premium Artisan ($18 - $30)",
  "caffeineTolerance": "Moderate Caffeine",
  "preparationStyle": "Western Teapot Infuser",
  "modelOverride": "hybrid"
}
```
- **Response**: Top 5 recommendations with confidence scores, XAI explanations, and sensory comparison.

### `POST /chat`
Converses with the AI Tea Sommelier.
- **Body**: `{ "message": "How do I brew Oolong tea?", "context": {} }`

### `GET /recommendations/models/compare`
Returns benchmark leaderboard comparing Decision Tree, Random Forest, Content-Based, and Hybrid models.
