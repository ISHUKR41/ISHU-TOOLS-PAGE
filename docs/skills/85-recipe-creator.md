# Skill: recipe-creator

## Purpose
Generates detailed recipes with precise measurements, step-by-step instructions, nutritional information, substitution options, scaling calculations, and cooking tips — focused on Indian cuisine, hostel-friendly cooking, and quick recipes for students and professionals.

## When to Use
- User wants a recipe for a specific dish
- User wants to scale a recipe (2 people → 10 people)
- User wants substitution options (no cream → use milk/curd)
- User wants quick recipes with limited ingredients
- User wants nutritional breakdown of a dish
- User needs hostel/dorm-friendly recipes (1 burner, no oven)

## Recipe Format Template

```
╔══════════════════════════════════════════════════════╗
║  RECIPE NAME                                          ║
╚══════════════════════════════════════════════════════╝
🕐 Prep: X min  |  🍳 Cook: X min  |  👥 Serves: X
💰 Cost: ₹X  |  🔥 Calories: X  |  ⭐ Difficulty: Easy

INGREDIENTS:
━━━━━━━━━━
• [Ingredient 1] — [quantity] [unit]
• [Ingredient 2] — [quantity] [unit]

INSTRUCTIONS:
━━━━━━━━━━━━
Step 1: [Action verb] the [ingredient] for [time/until condition]
Step 2: ...
Step 3: ...

PRO TIPS:
━━━━━━━━
💡 [Tip 1 for better results]
💡 [Tip 2 for time saving]

SUBSTITUTIONS:
━━━━━━━━━━━━
• No X? Use Y instead
• Vegan: Replace Z with W

NUTRITIONAL INFO (per serving):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Calories: X kcal | Protein: Xg | Carbs: Xg | Fat: Xg | Fiber: Xg
```

## Usage Examples

```
"Recipe for dal tadka that a hostel student can make on 1 gas burner in under 30 minutes"
"Quick high-protein breakfast for gym-goers using eggs and oats"
"5 simple recipes using only dal, rice, and onion-tomato"
"Aloo paratha recipe — step by step for beginners"
"How to make dahi (curd) at home from milk"
```

## Sample Recipe: Dal Tadka (Hostel Edition)

```
╔══════════════════════════════════════════════════════╗
║  DAL TADKA (Hostel Edition) 🍲                        ║
╚══════════════════════════════════════════════════════╝
🕐 Prep: 5 min  |  🍳 Cook: 25 min  |  👥 Serves: 2
💰 Cost: ₹20  |  🔥 Calories: 240  |  ⭐ Difficulty: Easy
Equipment: 1 pressure cooker or large vessel

INGREDIENTS:
━━━━━━━━━━
• Masoor dal (red lentils) — 1 cup (150g)
• Water — 2.5 cups
• Onion (medium) — 1, finely chopped
• Tomato (medium) — 1, finely chopped
• Ginger-garlic paste — 1 tsp
• Oil or ghee — 2 tbsp
• Cumin seeds — ½ tsp
• Turmeric powder — ¼ tsp
• Red chili powder — ½ tsp (adjust to taste)
• Coriander powder — 1 tsp
• Salt — to taste
• Lemon juice — 1 tbsp
• Fresh coriander leaves — optional garnish

INSTRUCTIONS:
━━━━━━━━━━━━
Step 1: Rinse dal 2-3 times under cold water until water runs clear.

Step 2: Add dal + water + ¼ tsp turmeric + ½ tsp salt to pressure 
         cooker. Cook for 3-4 whistles (or 20 min in open vessel).

Step 3: Heat oil in a separate small pan. Add cumin seeds and let 
         them sizzle for 10-15 seconds.

Step 4: Add chopped onion and cook on medium heat for 5-7 minutes 
         until golden brown (this is key — don't rush this step).

Step 5: Add ginger-garlic paste. Cook for 1 minute until raw smell 
         goes away.

Step 6: Add chopped tomato + red chili + coriander powder. Cook for 
         3-4 minutes until tomato becomes soft and oil separates.

Step 7: Pour the cooked dal into this tadka. Add water if too thick.
         Taste and adjust salt. Let it simmer for 3-5 minutes.

Step 8: Add lemon juice. Garnish with coriander leaves. Serve hot 
         with rice or roti.

PRO TIPS:
━━━━━━━━
💡 Golden-brown onions = deep flavour. Don't skip this step.
💡 Dal consistency: Should coat the back of a spoon. Not too thin.
💡 Leftover dal gets thicker overnight. Add water when reheating.
💡 Add a pinch of amchur (dry mango powder) for restaurant taste.

SUBSTITUTIONS:
━━━━━━━━━━━━
• No masoor? Use moong dal (cooks faster, tastes similar)
• No ghee? Oil works fine
• No ginger-garlic paste? Use ½ tsp ginger + 2 garlic cloves, minced
• Vegan: Use oil instead of ghee (already vegetarian)

NUTRITIONAL INFO (per serving):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Calories: 240 kcal | Protein: 12g | Carbs: 35g | Fat: 7g | Fiber: 8g
```

## Recipe Scaling Calculator
```python
def scale_recipe(original_servings: int, target_servings: int, ingredients: dict) -> dict:
    """Scale ingredient quantities from original to target servings"""
    factor = target_servings / original_servings
    scaled = {}
    
    for ingredient, quantity in ingredients.items():
        if isinstance(quantity, (int, float)):
            scaled_qty = quantity * factor
            # Round to practical amounts
            if scaled_qty < 1:
                scaled[ingredient] = f"{round(scaled_qty * 100)}g or {round(scaled_qty, 1)} unit"
            else:
                scaled[ingredient] = round(scaled_qty, 1)
        else:
            scaled[ingredient] = quantity  # Keep "to taste" etc.
    
    return {
        "original_servings": original_servings,
        "target_servings": target_servings,
        "scaling_factor": round(factor, 2),
        "ingredients": scaled
    }
```

## Quick Recipes for Common Ingredients

### Using Only: Dal + Rice + Onion + Tomato + Spices
```
1. Dal Tadka + Rice (main meal)
2. Khichdi (mix dal+rice together — comfort food)
3. Tomato Rice (tomato-spiced rice, dal on side)
4. Dal Soup (thin dal, great for sick days)
5. Rice Kheer (sweet rice pudding with sugar+milk)
```

### High-Protein Breakfast Ideas (Under 15 min)
```
1. Scrambled Eggs + Toast (protein: 14g, time: 5 min)
2. Oats + Peanut Butter (protein: 12g, time: 5 min)
3. Curd + Fruits + Oats (protein: 10g, time: 3 min — no cooking)
4. Besan Chilla / Gram Flour Pancake (protein: 15g, time: 10 min)
5. Moong Dal Chilla (protein: 18g, time: 12 min)
```

## Related Skills
- `meal-planner` — weekly planning using these recipes
- `health tools` — nutrition calculations
- `personal-shopper` — buying kitchen equipment
