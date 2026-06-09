import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Target, Database, AlertCircle, Users, Zap } from "lucide-react";

const MACROS = [
  {
    emoji: "🔥",
    name: "Calories",
    unit: "kcal",
    color: "from-orange-400 to-red-400",
    bg: "bg-orange-50",
    border: "border-orange-200",
    daily: "2,000 kcal / day",
    summary: "The unit of energy in all food",
    body: `Calories measure the energy stored in food. Your body burns calories constantly — even while sleeping — to power everything from breathing to walking. An average adult needs around 2,000 calories per day, but this varies widely by age, sex, size, and activity level.

Fast food meals can easily deliver 800–1,500 calories in one sitting, which is 40–75% of a full day's needs. Knowing the calorie count before you order is the single most impactful step you can take for managing your weight.`,
    example: "Big Mac = 590 cal · Large Fries = 490 cal · Total = 1,080 cal in one meal",
  },
  {
    emoji: "💪",
    name: "Protein",
    unit: "g",
    color: "from-blue-400 to-indigo-400",
    bg: "bg-blue-50",
    border: "border-blue-200",
    daily: "50g / day",
    summary: "Builds muscle, keeps you full",
    body: `Protein is made of amino acids — the building blocks your body uses to repair muscle, make enzymes, and run your immune system. It also keeps you fuller for longer compared to carbs or fat, making it the most satisfying macronutrient per calorie.

Most fast food is surprisingly decent for protein: a chicken sandwich can have 30–40g. However, the protein comes packaged with a lot of saturated fat and sodium. If you're eating out and trying to hit a protein target (common for gym-goers), grilled chicken options and burrito bowls are your best friends.`,
    example: "Chipotle Chicken Bowl = 47g protein · Tim Hortons Double Double = 3g protein",
  },
  {
    emoji: "🍞",
    name: "Carbohydrates",
    unit: "g",
    color: "from-amber-400 to-yellow-400",
    bg: "bg-amber-50",
    border: "border-amber-200",
    daily: "275g / day",
    summary: "Your body's primary fuel source",
    body: `Carbohydrates include starches (bread, buns, fries, rice) and sugars (ketchup, sauces, soda). They're your body's preferred energy source — your brain runs almost exclusively on glucose, a carb.

The issue with fast food carbs isn't carbs themselves, it's the type: white buns, fried potatoes, and sugary sauces cause rapid blood sugar spikes and crashes, leaving you hungry again quickly. Fibre-rich carbs (whole grains, vegetables) are digested slowly and are much better for sustained energy and appetite control.`,
    example: "Medium Fries = 44g carbs · Crunchwrap Supreme = 71g carbs",
  },
  {
    emoji: "🥑",
    name: "Total Fat",
    unit: "g",
    color: "from-green-400 to-emerald-400",
    bg: "bg-green-50",
    border: "border-green-200",
    daily: "78g / day",
    summary: "Essential for hormones, vitamins & brain",
    body: `Fat is not the enemy — it's essential for absorbing fat-soluble vitamins (A, D, E, K), producing hormones, and keeping your brain healthy. It also makes food taste rich and satisfying.

The concern with fast food fat is the sheer quantity. A single Whopper has 40g of fat. Fat is also calorie-dense: 1g of fat = 9 calories, compared to 4 calories per gram for protein or carbs. This is why fried foods add up so quickly. Not all fats are equal — avocado, olive oil, and nuts are healthy fats; deep-fried batter and processed meat fat are not.`,
    example: "Double Whopper = 57g fat · Chipotle Steak Burrito = 29g fat",
  },
  {
    emoji: "🧈",
    name: "Saturated Fat",
    unit: "g",
    color: "from-yellow-400 to-orange-400",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    daily: "< 20g / day",
    summary: "The 'bad' fat — watch this closely",
    body: `Saturated fat is a type of fat found mainly in animal products (beef, pork, dairy, cheese) and some tropical oils (palm, coconut). Unlike unsaturated fat, saturated fat raises LDL ("bad") cholesterol, which over time increases the risk of heart disease and stroke.

Health Canada and the American Heart Association recommend keeping saturated fat under 10% of total daily calories — about 20g on a 2,000-calorie diet. A single fast food burger with cheese can easily have 12–26g. This is the fat to watch most carefully when eating out regularly.`,
    example: "Baconator = 26g sat fat · KFC Extra Crispy Breast = 8g sat fat",
  },
  {
    emoji: "🧂",
    name: "Sodium",
    unit: "mg",
    color: "from-purple-400 to-violet-400",
    bg: "bg-purple-50",
    border: "border-purple-200",
    daily: "< 2,300mg / day",
    summary: "Salt — fast food's biggest problem",
    body: `Sodium is the mineral in salt (sodium chloride). Your body needs a small amount of sodium to function — it regulates fluid balance and nerve signals — but most Canadians and Americans consume nearly double the recommended amount.

Fast food is by far the biggest source of excess sodium in the modern diet. A single fast food meal can easily deliver 1,500–3,000mg of sodium — more than an entire day's recommended intake. Chronically high sodium raises blood pressure, strains your heart and kidneys, and increases the risk of stroke. It also causes water retention, which can make you feel bloated.`,
    example: "KFC Famous Bowl = 2,090mg · Subway Footlong BLT Ham = 2,330mg",
  },
  {
    emoji: "🍬",
    name: "Sugar",
    unit: "g",
    color: "from-pink-400 to-rose-400",
    bg: "bg-pink-50",
    border: "border-pink-200",
    daily: "< 50g / day",
    summary: "Hidden in sauces, buns, and drinks",
    body: `Sugar is a simple carbohydrate that tastes sweet. There are two types: natural sugars (found in fruit and dairy alongside fibre and nutrients) and added sugars (added during food processing to make things taste better). Health guidelines target added sugars specifically.

Fast food is loaded with hidden sugar — in buns, ketchup, BBQ sauce, salad dressings, coleslaw, and especially drinks. A medium Iced Capp from Tim Hortons has 43g of sugar — nearly a full day's worth in one drink. Liquid sugar is especially problematic because it doesn't trigger the same fullness signals as solid food.`,
    example: "Tim Hortons Iced Capp = 43g sugar · Starbucks Java Chip Frap = 60g sugar",
  },
  {
    emoji: "🌿",
    name: "Fibre",
    unit: "g",
    color: "from-lime-400 to-green-400",
    bg: "bg-lime-50",
    border: "border-lime-200",
    daily: "28g / day",
    summary: "The nutrient fast food almost never has",
    body: `Dietary fibre is the indigestible part of plant foods — it passes through your digestive system intact, and in doing so, it slows digestion, feeds beneficial gut bacteria, reduces cholesterol, regulates blood sugar, and keeps you full.

Fast food is almost universally low in fibre. A typical fast food meal might have 2–5g of fibre — 10–18% of your daily needs. The biggest sources of fibre in fast food are beans (Taco Bell, Chipotle), vegetables, and salads. If you eat fast food regularly, make a conscious effort to get fibre from other meals.`,
    example: "Chipotle Sofritas Bowl = 11g fibre · McDonald's Big Mac = 3g fibre",
  },
  {
    emoji: "🫀",
    name: "Cholesterol",
    unit: "mg",
    color: "from-red-400 to-rose-400",
    bg: "bg-red-50",
    border: "border-red-200",
    daily: "< 300mg / day",
    summary: "From eggs, meat & dairy",
    body: `Cholesterol is a waxy, fat-like substance that your body uses to build cell membranes and make hormones. Your liver produces all the cholesterol you need on its own — dietary cholesterol from food is less impactful on blood cholesterol than scientists once believed.

However, dietary cholesterol still matters in combination with saturated fat. Foods highest in cholesterol include eggs, organ meat, shellfish, and full-fat dairy. In fast food, the main sources are egg-based breakfast items, beef burgers, and cheese. People with diabetes or heart disease are generally advised to watch dietary cholesterol more carefully.`,
    example: "Starbucks Bacon Gouda Sandwich = 135mg · Egg McMuffin = 235mg cholesterol",
  },
];

const DATA_SOURCES = [
  { name: "McDonald's", flag: "🇨🇦", region: "Canada", url: "https://www.mcdonalds.com/ca/en-ca/nutritional-calculator.html" },
  { name: "Tim Hortons", flag: "🇨🇦", region: "Canada", url: "https://www.timhortons.ca/nutrition" },
  { name: "Harvey's", flag: "🇨🇦", region: "Canada", url: "https://www.harveys.ca/en/nutrition.html" },
  { name: "Swiss Chalet", flag: "🇨🇦", region: "Canada", url: "https://www.swisschalet.com/en/nutrition.html" },
  { name: "Mary Brown's", flag: "🇨🇦", region: "Canada", url: "https://marybrowns.com/nutrition/" },
  { name: "A&W Canada", flag: "🇨🇦", region: "Canada", url: "https://www.aw.ca/en/our-food/nutrition-information.html" },
  { name: "Burger King", flag: "🇨🇦🇺🇸", region: "Canada/US", url: "https://www.burgerking.ca/en/nutrition" },
  { name: "Wendy's", flag: "🇺🇸", region: "US/Canada", url: "https://www.wendys.com/nutrition" },
  { name: "Subway", flag: "🇨🇦🇺🇸", region: "Canada/US", url: "https://www.subway.com/en-CA/MenuNutrition/NutritionAndAllergens" },
  { name: "KFC", flag: "🇨🇦", region: "Canada", url: "https://www.kfc.ca/en/nutrition" },
  { name: "Taco Bell", flag: "🇨🇦🇺🇸", region: "Canada/US", url: "https://www.tacobell.ca/nutrition" },
  { name: "Chipotle", flag: "🇺🇸", region: "US", url: "https://www.chipotle.com/nutrition-calculator" },
  { name: "Chick-fil-A", flag: "🇺🇸", region: "US", url: "https://www.chick-fil-a.com/nutrition-allergens/allergens" },
  { name: "Starbucks", flag: "🇨🇦", region: "Canada", url: "https://www.starbucks.ca/en/menu" },
  { name: "Pizza Hut", flag: "🇨🇦", region: "Canada", url: "https://www.pizzahut.ca/en/nutrition" },
  { name: "Domino's", flag: "🇨🇦", region: "Canada", url: "https://www.dominos.ca/en/pages/content/nutrition/" },
  { name: "Popeyes", flag: "🇺🇸", region: "US/Canada", url: "https://www.popeyes.com/nutrition-information" },
  { name: "Five Guys", flag: "🇺🇸", region: "US/Canada", url: "https://www.fiveguys.com/nutrition-information" },
  { name: "In-N-Out Burger", flag: "🇺🇸", region: "US (West)", url: "https://www.in-n-out.com/menu/nutritional-info.aspx" },
  { name: "Shake Shack", flag: "🇺🇸", region: "US/Canada", url: "https://www.shakeshack.com/food/nutrition/" },
  { name: "Panera Bread", flag: "🇺🇸", region: "US/Canada", url: "https://www.panerabread.com/en-us/articles/nutrition-information.html" },
  { name: "Panda Express", flag: "🇺🇸", region: "US/Canada", url: "https://www.pandaexpress.com/nutrition" },
  { name: "Dunkin'", flag: "🇺🇸", region: "US/Canada", url: "https://www.dunkindonuts.com/en/nutrition-and-allergens" },
  { name: "Dairy Queen", flag: "🇨🇦🇺🇸", region: "Canada/US", url: "https://www.dairyqueen.com/en-ca/menu/full-menu/" },
  { name: "Carl's Jr. / Hardee's", flag: "🇺🇸", region: "US", url: "https://www.carlsjr.com/menu/nutritional-info" },
  { name: "Jack in the Box", flag: "🇺🇸", region: "US", url: "https://www.jackinthebox.com/nutrition" },
  { name: "Sonic Drive-In", flag: "🇺🇸", region: "US", url: "https://www.sonicdrivein.com/menu/nutrition-info" },
  { name: "Whataburger", flag: "🇺🇸", region: "US (South)", url: "https://www.whataburger.com/nutrition" },
  { name: "Wingstop", flag: "🇺🇸", region: "US/Canada", url: "https://www.wingstop.com/menu/nutrition-info" },
  { name: "Arby's", flag: "🇺🇸", region: "US/Canada", url: "https://www.arbys.com/nutrition" },
];

const DAILY_GOALS = [
  { nutrient: "Calories", value: "2,000 kcal", source: "Health Canada / FDA" },
  { nutrient: "Protein", value: "50g", source: "Health Canada DRI" },
  { nutrient: "Total Carbohydrates", value: "275g", source: "FDA Daily Value" },
  { nutrient: "Total Fat", value: "78g", source: "FDA Daily Value" },
  { nutrient: "Saturated Fat", value: "< 20g", source: "Health Canada / AHA" },
  { nutrient: "Sodium", value: "< 2,300mg", source: "Health Canada / WHO" },
  { nutrient: "Added Sugar", value: "< 50g", source: "Health Canada / FDA" },
  { nutrient: "Dietary Fibre", value: "28g", source: "Health Canada DRI" },
  { nutrient: "Cholesterol", value: "< 300mg", source: "Health Canada DRI" },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero px-4 pt-14 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-6 left-12 text-4xl float">📊</div>
          <div className="absolute top-10 right-20 text-3xl float-slow">🥗</div>
          <div className="absolute bottom-6 left-24 text-3xl float">📋</div>
          <div className="absolute bottom-10 right-16 text-4xl float-slow">🔬</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-5 text-sm font-700 text-primary border border-primary/20 shadow-sm">
            <BookOpen size={14} className="text-primary" />
            <span>Full Transparency — Data, Sources & Methodology</span>
          </div>
          <h1 className="text-5xl font-900 text-foreground mb-4 leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              MacroCutie
            </span>{" "}
            🍓
          </h1>
          <p className="text-lg text-foreground/60 font-500 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about this app — what it does, who it's for, how the data is collected, what every number means, and where it all comes from.
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* What is it */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 gradient-pink rounded-2xl flex items-center justify-center shadow-md">
              <Zap size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-900 text-foreground">What is MacroCutie?</h2>
          </div>
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-border space-y-4">
            <p className="text-foreground/80 font-500 leading-relaxed">
              <strong>MacroCutie is a free nutrition calculator built for people who eat at fast food and chain restaurants in Canada and North America.</strong> It lets you look up the exact calories, protein, carbs, fat, sodium, sugar, fibre, and cholesterol in your meal — before you eat it.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              Most nutrition tracking apps are designed for cooking at home: you log ingredients, scan barcodes, and build custom recipes. MacroCutie is different — it's entirely focused on eating <em>out</em>, at the chains you already visit every week. Pick your restaurant, browse the menu, add condiments, and get your full macro breakdown in seconds.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              The app has a strong Canadian focus because most existing tools centre on the US market and don't include Canadian-specific chains like Tim Hortons, Harvey's, Swiss Chalet, Mary Brown's, and A&W Canada — or Canadian menu variations. MacroCutie covers both.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { v: "30+", l: "Chains covered" },
                { v: "140+", l: "Menu items" },
                { v: "43+", l: "Branded condiments" },
                { v: "58+", l: "Cities & neighbourhoods" },
              ].map((s) => (
                <div key={s.l} className="bg-primary/5 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-900 text-primary">{s.v}</div>
                  <div className="text-xs text-muted-foreground font-600 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Who is it for */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-md">
              <Users size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-900 text-foreground">Who is it for?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { emoji: "🏋️", title: "Fitness enthusiasts", body: "Tracking macros while still eating out? Build your meal, hit your protein goal, and know exactly what you're working with before you go to the gym." },
              { emoji: "⚖️", title: "Weight managers", body: "Trying to lose or maintain weight without giving up fast food entirely? Knowing the calorie count before you order is the most impactful change you can make." },
              { emoji: "🍁", title: "Canadians", body: "Tired of apps that don't have Tim Hortons or Harvey's? MacroCutie was built with the Canadian market as a core priority, not an afterthought." },
              { emoji: "🩺", title: "Health-conscious eaters", body: "Managing sodium for blood pressure? Watching saturated fat for heart health? Use the detailed breakdown to make choices aligned with your health goals." },
              { emoji: "🌱", title: "Dietary needs", body: "Filter by vegetarian, vegan, halal, or gluten-free across all 30+ chains at once. Find what works for you without checking 10 different apps." },
              { emoji: "📱", title: "Curious eaters", body: "Just want to know what's actually in a Baconator? Or how your Iced Capp compares to a Frappuccino? MacroCutie makes nutrition transparent and fun to explore." },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-5 shadow-sm border border-border">
                <div className="text-2xl mb-2">{c.emoji}</div>
                <h3 className="font-800 text-foreground mb-1">{c.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* How to use */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-md">
              <Target size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-900 text-foreground">How to use MacroCutie</h2>
          </div>
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-border">
            <div className="space-y-6">
              {[
                { n: "1", emoji: "📍", title: "Set your location", body: "Select your city from the dropdown on the home page. Chains available near you appear at the top. If you're in Toronto, pick your neighbourhood for even more specificity." },
                { n: "2", emoji: "🏪", title: "Choose a restaurant", body: "Browse or search for a chain. Use the dietary filters (vegetarian, vegan, halal, gluten-free) to narrow your options. Click any restaurant to see its full menu." },
                { n: "3", emoji: "🍔", title: "Build your meal", body: "Click items to add them to your meal tray. You can add multiple items from multiple different chains — MacroCutie calculates your full combined nutrition across everything." },
                { n: "4", emoji: "🧂", title: "Add condiments", body: "The condiment picker lets you add ketchup, mayo, hot sauce, and more — with brand-accurate calorie counts (Heinz, Hellmann's, Frank's RedHot, etc.) down to the exact serving size." },
                { n: "5", emoji: "📊", title: "Get your breakdown", body: "Hit 'Calculate Nutrition' to see your full macro breakdown: total calories, protein, carbs, fat, sodium, sugar, fibre, and cholesterol — each shown as a percentage of your daily recommended intake." },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 gradient-pink rounded-xl flex items-center justify-center text-white font-900 text-sm shadow-md shadow-pink-100">
                    {step.n}
                  </div>
                  <div>
                    <div className="font-800 text-foreground mb-0.5">{step.emoji} {step.title}</div>
                    <p className="text-sm text-foreground/60 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Understanding macros */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg">📖</span>
            </div>
            <div>
              <h2 className="text-2xl font-900 text-foreground">Understanding Your Macros</h2>
              <p className="text-sm text-muted-foreground font-500">Plain-English explanations of every number we track</p>
            </div>
          </div>
          <div className="space-y-4">
            {MACROS.map((m) => (
              <div key={m.name} className={`${m.bg} border ${m.border} rounded-3xl p-6`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{m.emoji}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-900 text-foreground">{m.name}</h3>
                      <span className="text-sm text-muted-foreground font-600">({m.unit})</span>
                      <span className={`ml-auto text-xs font-800 text-white bg-gradient-to-r ${m.color} px-3 py-1 rounded-full`}>
                        Goal: {m.daily}
                      </span>
                    </div>
                    <p className="text-sm font-700 text-foreground/80 mb-3">{m.summary}</p>
                    <div className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                      {m.body}
                    </div>
                    <div className={`mt-4 bg-white/70 rounded-2xl px-4 py-2.5 border ${m.border}`}>
                      <span className="text-xs font-800 text-foreground/50 uppercase tracking-wide">Fast food example: </span>
                      <span className="text-xs font-600 text-foreground/70">{m.example}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Daily reference values */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🎯</span>
            </div>
            <div>
              <h2 className="text-2xl font-900 text-foreground">Daily Reference Values</h2>
              <p className="text-sm text-muted-foreground font-500">Based on a 2,000 calorie diet for an average adult</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/50 border-b border-border">
              <p className="text-sm text-foreground/60 font-500">
                These values are used to calculate the "% Daily Value" shown in your nutrition breakdown. They are based on{" "}
                <a href="https://www.canada.ca/en/health-canada/services/nutrients.html" target="_blank" rel="noreferrer" className="text-primary font-700 hover:underline">
                  Health Canada's Dietary Reference Intakes
                </a>{" "}
                and the{" "}
                <a href="https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels" target="_blank" rel="noreferrer" className="text-primary font-700 hover:underline">
                  US FDA Daily Reference Values
                </a>. Actual needs vary by age, sex, weight, and activity level.
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 font-800 text-foreground">Nutrient</th>
                  <th className="text-left px-6 py-3 font-800 text-foreground">Daily Goal</th>
                  <th className="text-left px-6 py-3 font-800 text-foreground hidden sm:table-cell">Source</th>
                </tr>
              </thead>
              <tbody>
                {DAILY_GOALS.map((row, i) => (
                  <tr key={row.nutrient} className={i % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                    <td className="px-6 py-3 font-700 text-foreground">{row.nutrient}</td>
                    <td className="px-6 py-3 font-800 text-primary">{row.value}</td>
                    <td className="px-6 py-3 text-muted-foreground hidden sm:table-cell">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Data sources */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-md">
              <Database size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-900 text-foreground">Data Sources</h2>
              <p className="text-sm text-muted-foreground font-500">Official nutrition guides from each restaurant chain</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 bg-muted/50 border-b border-border">
              <p className="text-sm text-foreground/60 font-500">
                All nutrition data is sourced directly from each restaurant chain's official nutrition guide, published on their website. Data reflects Canadian menu items where available (some items and portion sizes differ between Canada and the US). Last reviewed 2025.
              </p>
            </div>
            <div className="divide-y divide-border">
              {DATA_SOURCES.map((src) => (
                <div key={src.name} className="flex items-center justify-between px-6 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{src.flag}</span>
                    <span className="font-700 text-foreground text-sm">{src.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full hidden sm:block">
                      {src.region}
                    </span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-700 text-primary hover:underline"
                  >
                    Official source
                    <ExternalLink size={11} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Methodology */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🔬</span>
            </div>
            <h2 className="text-2xl font-900 text-foreground">How We Collect Data</h2>
          </div>
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-border space-y-4 text-foreground/70 leading-relaxed text-sm">
            <p>
              <strong className="text-foreground">All nutritional values come directly from the restaurants' official published nutrition guides.</strong> We do not estimate, calculate, or guess any values. If a restaurant hasn't published a number, we don't include that item.
            </p>
            <div className="space-y-3">
              {[
                { title: "Standard preparation", body: "All values assume the item is prepared in the standard/default way as described on the restaurant's menu. A Whopper includes its default toppings (lettuce, tomato, onion, ketchup, mayo, pickles); those components are included in the calorie count." },
                { title: "Canadian data priority", body: "For chains operating in Canada, we prioritize the Canadian nutrition data (from the Canadian website). Canadian portions and ingredients sometimes differ from US versions — for example, some Tim Hortons items are Canada-specific and would not appear on a US nutrition tracker." },
                { title: "Condiment data", body: "Condiment values come from the manufacturers' official nutrition labels (e.g., Heinz ketchup nutrition from Heinz Canada, Hellmann's mayo from Unilever Canada). Serving sizes match standard single-serving packages or the typical amount used at a restaurant." },
                { title: "Location data", body: "Restaurant location coverage (which chains operate in which cities and neighbourhoods) is based on publicly available store locator data. The nutrition data itself is identical regardless of which specific location you visit — a Big Mac has the same calories in Scarborough as it does in Vancouver." },
                { title: "Review schedule", body: "We aim to review all nutrition data annually. Restaurants occasionally change recipes, portion sizes, or ingredients — if you notice an outdated value, the official source link in the Data Sources table above is the most current information." },
              ].map((m) => (
                <div key={m.title} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">{m.title}: </strong>
                    {m.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-md">
              <AlertCircle size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-900 text-foreground">Accuracy & Disclaimer</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-7 space-y-3 text-sm text-foreground/70 leading-relaxed">
            <p>
              Nutrition values in MacroCutie are sourced from publicly available restaurant data and are provided <strong>for informational and educational purposes only</strong>. They are not medical advice.
            </p>
            <p>
              Values may vary slightly due to:
            </p>
            <ul className="space-y-1 ml-4">
              {[
                "Regional ingredient differences (e.g., Canadian vs US beef suppliers)",
                "Preparation variations at individual restaurant locations",
                "Seasonal menu changes or limited-time items",
                "Updates to restaurant recipes or formulations since our last review",
                "Rounding differences between restaurant and regulatory reporting standards",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-amber-500 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              <strong className="text-foreground">For allergy-related decisions, always verify directly with the restaurant.</strong> Cross-contamination risks and allergen presence can vary by location and are not fully captured in standard nutrition guides.
            </p>
            <p>
              If you have a medical condition requiring precise dietary tracking (diabetes, kidney disease, cardiovascular disease), consult a registered dietitian in addition to using this app.
            </p>
          </div>
        </motion.section>

        {/* Built by */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pb-8"
        >
          <div className="inline-flex flex-col items-center gap-4 bg-white rounded-3xl px-10 py-8 shadow-sm border border-border">
            <div className="text-5xl float">🍓</div>
            <div>
              <h3 className="font-900 text-xl text-foreground mb-1">MacroCutie</h3>
              <p className="text-sm text-muted-foreground font-500">
                Built for Canadians eating out — because you deserve to know what's in your food.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {["Canada-first 🍁", "30+ Chains", "Open Data", "Free Forever"].map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full font-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
