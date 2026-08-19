import json
import csv
import random
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

INDIAN_TEA_CATEGORIES = {
    "Darjeeling": {
        "origins": ["Darjeeling (Makaibari)", "Darjeeling (Castle Castleton)", "Darjeeling (Margaret's Hope)", "Darjeeling (Jungpana)", "Darjeeling (Okayti)", "Darjeeling (Goomtee)", "Darjeeling (Singbulli)"],
        "base_names": [
            "First Flush Spring Champagne", "Second Flush Muscatel Gold", "Silver Needle White Darjeeling",
            "Autumnal Flush Ruby Harvest", "Moonlight Imperial Pluck", "Vintage Muscatel Wonder",
            "Misty Mountain Bio-Dynamic First Flush", "Single Estate Royal Amber Darjeeling",
            "High Elevation Queen of Teas", "Castleton Muscatel Supreme", "Margaret's Hope Golden Tips"
        ],
        "flavor_pool": ["Muscatel", "Floral", "Green Apple", "Apricot", "Honey", "Citrus Zest", "Pine Wood", "Honeysuckle"],
        "ingredients": ["100% Hand-Picked Camellia Sinensis Single Estate Darjeeling Leaves"],
        "caffeine_range": (30, 55),
        "bitterness_range": (1.5, 4.0),
        "sweetness_range": (5.0, 9.0),
        "floral_range": (7.0, 10.0),
        "spice_range": (0.5, 2.0),
        "aroma_range": (8.0, 10.0),
        "temp_range": (80, 90),
        "time_range": (3, 4),
        "health_benefits": ["High Antioxidants", "Heart Wellness", "Mental Clarity", "Gentle Vitality", "Cellular Protection"],
        "mood_tags": ["Calm", "Focused", "Refreshed", "Meditative", "Uplifted"],
        "price_range": (550, 2400),
        "images": [
            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1546852199-2d8e8c4aa477?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "Assam": {
        "origins": ["Assam (Upper Brahmaputra Valley)", "Assam (Jorhat)", "Assam (Dibrugarh)", "Assam (Golaghat)", "Assam (Sibsagar)", "Assam (Mangaldai)"],
        "base_names": [
            "Golden Tips Extra Special Orthodox", "Malty Breakfast Kadak CTC", "Imperial Halmari Single Estate",
            "Brahmaputra Valley Bold Red", "Smoked Wild Bamboo Assam", "Royal Mangalam Golden Needle",
            "Robust Morning Chai Blend", "Dark Mahogany Malt Reserve", "Assam Tippy Golden Flowery Orange Pekoe"
        ],
        "flavor_pool": ["Malty", "Dark Cocoa", "Caramel", "Honey", "Molasses", "Woody", "Toasted Grain", "Bold Body"],
        "ingredients": ["100% High-Grade Assam Whole Leaf & Golden Buds (Camellia Sinensis var. Assamica)"],
        "caffeine_range": (50, 85),
        "bitterness_range": (4.0, 7.5),
        "sweetness_range": (3.0, 6.5),
        "floral_range": (1.0, 4.0),
        "spice_range": (1.5, 4.5),
        "aroma_range": (7.0, 9.5),
        "temp_range": (95, 100),
        "time_range": (4, 5),
        "health_benefits": ["High Sustained Energy", "Metabolic Fire", "Immune Strength", "Digestive Power", "Cardiovascular Support"],
        "mood_tags": ["Energetic", "Focused", "Uplifted", "Motivated", "Cozy"],
        "price_range": (299, 1200),
        "images": [
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "Masala Chai": {
        "origins": ["Assam & Kerala Spice Hills", "Mumbai Heritage", "Kolkata Street Estate", "Rajasthan Royal Palace", "Delhi Old Quarter"],
        "base_names": [
            "Authentic Mumbai Cutting Masala Chai", "Royal Elaichi & Kesar Rich Chai", "Fiery Adrak & Kali Mirch Kadak Chai",
            "Five-Spice Maharaja Special Chai", "Rose Petal & Green Cardamom Sweet Chai", "Cinnamon Bark & Clove Monsoon Chai",
            "Dhaba Style Kulhad Strong Chai", "Caramelized Jaggery (Gur) Spiced Chai", "Star Anise & Nutmeg Winter Chai"
        ],
        "flavor_pool": ["Spicy", "Cardamom (Elaichi)", "Ginger (Adrak)", "Cinnamon (Dalchini)", "Clove (Laung)", "Peppery", "Creamy", "Sweet Heat"],
        "ingredients": ["Assam CTC Black Tea", "Green Cardamom Pods", "Crushed Dry Ginger", "Ceylon Cinnamon", "Cloves", "Black Pepper", "Star Anise", "Saffron"],
        "caffeine_range": (40, 70),
        "bitterness_range": (3.0, 6.0),
        "sweetness_range": (4.0, 8.5),
        "floral_range": (1.0, 4.0),
        "spice_range": (7.5, 10.0),
        "aroma_range": (9.0, 10.0),
        "temp_range": (95, 100),
        "time_range": (4, 6),
        "health_benefits": ["Immunity Shield", "Anti-inflammatory", "Digestive Comfort", "Instant Warming", "Cold & Cough Relief"],
        "mood_tags": ["Cozy", "Comforting", "Energetic", "Uplifted", "Refreshed"],
        "price_range": (249, 799),
        "images": [
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "Kashmir Kahwa": {
        "origins": ["Kashmir (Srinagar Valley)", "Kashmir (Pampore Saffron Fields)", "Kashmir (Gulmarg Hills)"],
        "base_names": [
            "Royal Kashmiri Saffron Almond Kahwa", "Pampore Golden Saffron Green Infusion", "Traditional Samovar Cinnamon Kahwa",
            "Rose Petal & Kashmiri Cardamom Kahwa", "Himalayan Crushed Walnut & Kahwa Blend", "Gulmarg Winter Spice Kahwa",
            "Pink Salted Noon Chai (Sheer Chai)", "Zaffran Emerald Heritage Brew"
        ],
        "flavor_pool": ["Saffron (Kesar)", "Cardamom", "Cinnamon", "Sweet Almond", "Nutty", "Floral Honey", "Delicate Green"],
        "ingredients": ["Kashmiri Green Tea Leaves", "Pampore Pure Saffron Strands", "Green Cardamom", "Cinnamon", "Crushed Almond Slivers", "Dried Rose Petals"],
        "caffeine_range": (15, 30),
        "bitterness_range": (1.0, 3.0),
        "sweetness_range": (6.0, 9.0),
        "floral_range": (6.0, 9.5),
        "spice_range": (5.0, 8.0),
        "aroma_range": (9.0, 10.0),
        "temp_range": (80, 85),
        "time_range": (3, 5),
        "health_benefits": ["Skin Glow & Radiance", "Stress Relief", "Immunity Boost", "Digestive Fire", "Calming Warmth"],
        "mood_tags": ["Relaxed", "Cozy", "Meditative", "Refreshed", "Calm"],
        "price_range": (499, 1899),
        "images": [
            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "Nilgiri": {
        "origins": ["Nilgiri (Blue Mountains)", "Nilgiri (Coonoor)", "Nilgiri (Ooty Highlands)", "Nilgiri (Kotagiri)"],
        "base_names": [
            "Nilgiri Frost Tea Winter Pluck", "Blue Mountain Aromatic Orthdox", "Nilgiri Golden Needle Rare Estate",
            "High Altitude Floral White Nilgiri", "Emerald Dew Nilgiri Green", "Glendale High-Grown Special",
            "Coonoor Highland Fragrant Amber", "Tiger Hill Single Cultivar Nilgiri"
        ],
        "flavor_pool": ["Bright Citrus", "Floral", "Crisp Fruit", "Honey", "Light Malt", "Plum", "Sweet Melon"],
        "ingredients": ["100% High-Elevation Nilgiri Camellia Sinensis"],
        "caffeine_range": (35, 55),
        "bitterness_range": (1.0, 3.5),
        "sweetness_range": (6.0, 8.5),
        "floral_range": (6.0, 9.0),
        "spice_range": (0.5, 2.5),
        "aroma_range": (8.0, 9.5),
        "temp_range": (85, 95),
        "time_range": (3, 4),
        "health_benefits": ["Antioxidant Rich", "Weight Balance", "Daily Refreshment", "Heart Health", "Gentle Alertness"],
        "mood_tags": ["Refreshed", "Focused", "Calm", "Uplifted", "Creative"],
        "price_range": (349, 1450),
        "images": [
            "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1546852199-2d8e8c4aa477?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "Ayurvedic Tisane": {
        "origins": ["Kerala (Western Ghats)", "Himalayan Foothills", "Madhya Pradesh Herbal Forests", "Uttarakhand Sacred Valleys"],
        "base_names": [
            "Sacred Tulsi Trio (Rama, Krishna, Vana)", "Ashwagandha Stress Relief Golden Elixir", "Turmeric Ginger Curcumin Immunity Guard",
            "Brahmi & Shankhpushpi Memory Tonic", "Moringa & Lemongrass Detox Flush", "Triphala & Fennel Digestive Nectar",
            "Chamomile & Shankhpushpi Deep Sleep", "Giloy & Tulsi Monsoon Kadha Herbal"
        ],
        "flavor_pool": ["Herbal", "Sweet Earthy", "Tulsi Mint", "Warm Ginger", "Woody", "Botanical", "Fennel Sweetness", "Cooling"],
        "ingredients": ["Organic Tulsi (Holy Basil)", "Ashwagandha Root", "Wild Himalayan Turmeric", "Brahmi Leaves", "Licorice (Mulethi)", "Fennel Seeds (Saunf)", "Lemongrass"],
        "caffeine_range": (0, 0),
        "bitterness_range": (0.5, 3.0),
        "sweetness_range": (4.0, 8.0),
        "floral_range": (4.0, 8.0),
        "spice_range": (2.0, 6.0),
        "aroma_range": (7.5, 9.5),
        "temp_range": (95, 100),
        "time_range": (5, 7),
        "health_benefits": ["Cortisol / Stress Reduction", "Deep Restful Sleep", "Immunity Fortification", "Gut Health & Detox", "Joint & Anti-inflammatory"],
        "mood_tags": ["Relaxed", "Calm", "Soothing", "Meditative", "Cozy"],
        "price_range": (299, 950),
        "images": [
            "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "Kangra Valley": {
        "origins": ["Himachal Pradesh (Kangra Valley)", "Himachal Pradesh (Dharamshala)", "Himachal Pradesh (Palampur)"],
        "base_names": [
            "Kangra Imperial Green Dragon", "Palampur Orthodox Spring Gold", "Dharamshala Mountain Dew Green",
            "Himalayan Cedar Scented Kangra", "Snow Mist Kangra First Flush", "Wild Herb Infused Kangra Tea"
        ],
        "flavor_pool": ["Nutty", "Sweet Vegetal", "Pine Mist", "Floral", "Roasted Corn", "Mellow Green"],
        "ingredients": ["100% Certified GI Tagged Kangra Valley Whole Leaf Tea"],
        "caffeine_range": (25, 45),
        "bitterness_range": (1.0, 3.5),
        "sweetness_range": (5.5, 8.0),
        "floral_range": (5.0, 8.5),
        "spice_range": (0.5, 2.0),
        "aroma_range": (7.0, 9.0),
        "temp_range": (75, 85),
        "time_range": (2, 4),
        "health_benefits": ["High Polyphenols", "Digestive Ease", "Metabolic Balance", "Peaceful Focus", "Antioxidant Shield"],
        "mood_tags": ["Focused", "Meditative", "Refreshed", "Calm", "Uplifted"],
        "price_range": (399, 1250),
        "images": [
            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "Sikkim Temi": {
        "origins": ["Sikkim (Temi Tea Estate, South Sikkim)", "Sikkim (Ravangla Highlands)"],
        "base_names": [
            "Temi Estate 100% Organic First Flush", "Kanchenjunga Mist Golden Tips", "Sikkim Royal Orthodox Muscatel",
            "High Altitude Cloud Pluck Temi Red", "Sikkim Green Dragon Spring Leaf"
        ],
        "flavor_pool": ["Sweet Floral", "Muscatel", "Honeyed Wood", "Peach", "Gentle Spice", "Caramel"],
        "ingredients": ["100% Organic Single Estate Temi Leaves"],
        "caffeine_range": (30, 50),
        "bitterness_range": (1.5, 3.5),
        "sweetness_range": (6.0, 8.5),
        "floral_range": (6.5, 9.0),
        "spice_range": (1.0, 3.0),
        "aroma_range": (8.0, 9.5),
        "temp_range": (85, 90),
        "time_range": (3, 4),
        "health_benefits": ["Pure Organic Nutrition", "Cardiovascular Support", "L-Theanine Serenity", "Skin Vitality"],
        "mood_tags": ["Calm", "Focused", "Refreshed", "Meditative", "Serene"],
        "price_range": (450, 1650),
        "images": [
            "https://images.unsplash.com/photo-1546852199-2d8e8c4aa477?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
        ]
    }
}

INDIAN_PAIRINGS = [
    "Crisp Hot Samosas with Mint & Tamarind Chutney", "Kolkata Style Kathi Rolls", "Irani Cafe Bun Maska & Chai",
    "Traditional Osmania Butter Biscuits", "Warm Cardamom Nankhatai", "Crisp Onion & Paneer Pakoras",
    "Spicy Bhakarwadi & Mathri", "Gulab Jamun with Rosewater Syrup", "Shrewsbury Butter Biscuits",
    "Dhokla with Green Chilies", "Poha with Roasted Peanuts", "Kashmiri Girda Flatbread with Butter"
]

SEASONS = ["Monsoon Special", "First Flush Spring", "Second Flush Summer", "Autumnal Harvest", "Winter Warmth", "All Season"]

def generate_indian_tea_dataset(target_count=1050):
    teas = []
    category_keys = list(INDIAN_TEA_CATEGORIES.keys())
    
    id_counter = 1
    random.seed(42)
    
    while len(teas) < target_count:
        cat = category_keys[(id_counter - 1) % len(category_keys)]
        data = INDIAN_TEA_CATEGORIES[cat]
        
        base_name = random.choice(data["base_names"])
        origin = random.choice(data["origins"])
        
        batch_id = f"Lot #{random.randint(101, 999)}" if random.random() > 0.4 else ""
        year = f"'{random.choice(['24', '25', '26'])}" if random.random() > 0.6 else ""
        name_parts = [base_name]
        if batch_id:
            name_parts.append(batch_id)
        if year:
            name_parts.append(year)
        full_name = " ".join(name_parts)
        
        bitterness = round(random.uniform(*data["bitterness_range"]), 1)
        sweetness = round(random.uniform(*data["sweetness_range"]), 1)
        floral = round(random.uniform(*data["floral_range"]), 1)
        spice = round(random.uniform(*data["spice_range"]), 1)
        aroma = round(random.uniform(*data["aroma_range"]), 1)
        caffeine = int(random.uniform(*data["caffeine_range"]))
        calories = random.randint(0, 5) if cat != "Masala Chai" else random.randint(15, 60)
        prep_time = random.randint(*data["time_range"])
        steep_temp = random.randint(*data["temp_range"])
        
        selected_flavors = list(set(random.sample(data["flavor_pool"], k=min(len(data["flavor_pool"]), random.randint(3, 5)))))
        selected_health = list(set(random.sample(data["health_benefits"], k=min(len(data["health_benefits"]), random.randint(2, 4)))))
        selected_moods = list(set(random.sample(data["mood_tags"], k=min(len(data["mood_tags"]), random.randint(2, 4)))))
        selected_pairings = list(set(random.sample(INDIAN_PAIRINGS, k=random.randint(2, 3))))
        season = random.choice(SEASONS)
        price = round(random.uniform(*data["price_range"]), 0)  # INR price in rupees
        rating = round(random.uniform(4.3, 4.98), 2)
        reviews_count = random.randint(20, 450)
        image = random.choice(data["images"])
        
        description = (
            f"An exquisite handcrafted {cat.lower()} harvest from the famed terroirs of {origin}. "
            f"Imbued with prominent sensory notes of {', '.join(selected_flavors[:3])}, this blend exhibits an aroma rating of {aroma}/10. "
            f"Specially curated for {', '.join(selected_moods[:2]).lower()} rituals, it offers potent {', '.join(selected_health[:2]).lower()}."
        )
        
        tea_record = {
            "id": f"TEA-IN-{id_counter:04d}",
            "name": full_name,
            "origin": origin,
            "teaType": cat,
            "ingredients": ", ".join(data["ingredients"]),
            "flavorProfile": selected_flavors,
            "bitterness": bitterness,
            "sweetness": sweetness,
            "floralNotes": floral,
            "spiceLevel": spice,
            "aroma": aroma,
            "caffeine": caffeine,
            "calories": calories,
            "preparationTime": prep_time,
            "steepTemperature": steep_temp,
            "waterRatio": "2.5g per 200ml (or 1:1 milk-water for Chai)",
            "healthBenefits": selected_health,
            "moodTags": selected_moods,
            "season": season,
            "price": price,
            "rating": rating,
            "reviewsCount": reviews_count,
            "description": description,
            "foodPairings": selected_pairings,
            "imageUrl": image
        }
        
        teas.append(tea_record)
        id_counter += 1
        
    return teas

generate_tea_dataset = generate_indian_tea_dataset

def export_dataset():
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(data_dir, exist_ok=True)
    teas = generate_indian_tea_dataset(target_count=1050)
    
    # Save JSON format
    json_path = os.path.join(data_dir, "teas_dataset.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(teas, f, indent=2, ensure_ascii=False)
    print(f"[SUCCESS] Generated {len(teas)} Indian tea records in {json_path}")
    
    # Save CSV format
    csv_path = os.path.join(data_dir, "teas_dataset.csv")
    keys = list(teas[0].keys())
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for t in teas:
            row = dict(t)
            row["flavorProfile"] = "; ".join(row["flavorProfile"])
            row["healthBenefits"] = "; ".join(row["healthBenefits"])
            row["moodTags"] = "; ".join(row["moodTags"])
            row["foodPairings"] = "; ".join(row["foodPairings"])
            writer.writerow(row)
    print(f"[SUCCESS] Generated Indian CSV dataset in {csv_path}")

if __name__ == "__main__":
    export_dataset()
