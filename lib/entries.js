const entries = [
  {
    id: "prahok",
    title: "Prahok",
    khmerTerm: "ប្រហុក",
    description:
      "Salted, dried, and packed into clay jars to ferment for weeks — sometimes years — prahok turns freshwater catches from the Tonlé Sap (snakehead, featherback, riel) into an intensely pungent, salty paste. It's the deep, funky note underneath samlor korko, amok, and prahok ktis — the flavor Khmer cooking is built on.",
    category: "Fermented Fish Paste",
    photo: "/images/prahok.jpg",
    photoNote:
      "A clay jar of dark, packed prahok paste with visible fish texture, next to a small dish of the paste served with fresh vegetables.",
    howMade:
      "Freshwater fish from the Tonlé Sap — snakehead, featherback, riel — are salted, dried, and packed into clay jars to ferment for weeks, sometimes years. The salt draws out moisture while natural enzymes break down the fish into a concentrated, intensely savory paste.",
    whatUsedFor:
      "Prahok is the deep, funky note underneath samlor korko, amok, and prahok ktis — the flavor Khmer cooking is built on. A pinch dissolves into soups, a spoonful thickens dips, and a smear on rice is a meal on its own.",
    howRecipesVary:
      "Some families ferment longer for a more pungent paste; others blend different ratios of fish species. A jar from Battambang can taste noticeably different from one made in Phnom Penh — each carries the signature of the kitchen that made it.",
    sourceCredit: "grantourismotravels.com, figaroshakes.com, morethantemples.com",
    status: "published",
  },
  {
    id: "kroeung",
    title: "Kroeung",
    khmerTerm: "គ្រឿង",
    description:
      "Pounded by hand in a stone mortar until lemongrass, galangal, turmeric, garlic, shallots, and kaffir lime dissolve into one fragrant paste, kroeung is the citrusy, earthy backbone of Khmer cuisine. Individual and royal blends, in yellow or red, shift the character of dish after dish.",
    category: "Herb & Spice Paste",
    photo: "/images/kroeung.webp",
    photoNote:
      "A stone mortar and pestle filled with freshly pounded green-yellow kroeung paste, with whole lemongrass, turmeric root, and kaffir lime leaves beside it.",
    howMade:
      "Lemongrass, galangal, turmeric, garlic, shallots, and kaffir lime are pounded by hand in a stone mortar until they dissolve into one fragrant paste. The pounding releases essential oils that no blender can replicate.",
    whatUsedFor:
      "Kroeung is the citrusy, earthy backbone of Khmer cuisine — the foundation of soups, curries, and stir-fries. It's the first thing that hits the pan and the last thing you taste.",
    howRecipesVary:
      "Individual and royal blends come in yellow or red, shifting the character of dish after dish. Some families add more turmeric for colour, others more lemongrass for aroma. A royal kroeung might include kaffir lime peel and extra galangal.",
    sourceCredit: "en.wikipedia.org/wiki/Kroeung, chefnak.com",
    status: "published",
  },
  {
    id: "tnot-skor",
    title: "Tnot Skor",
    khmerTerm: "ស្ករត្នោត",
    description:
      "Tapped from the sap of the Palmyra palm and slow-cooked down into granules, paste, block, or syrup, tnot skor (palm sugar) carries a deep, smoky caramel sweetness found nowhere else. Kampong Speu, its EU-recognized heartland, still divides the work by tradition: men climb the palms for sap, women cook it into sugar.",
    category: "Palm Sugar",
    photo: "/images/tnot-skor.jpg",
    photoNote:
      "Round blocks of golden-brown palm sugar stacked on a banana leaf, with a climber's bamboo ladder against a palmyra palm trunk in the background.",
    howMade:
      "Sap is tapped from the inflorescence of the Palmyra palm and slow-cooked in wide woks until it reduces into granules, paste, blocks, or syrup. The longer it cooks, the darker and deeper the flavour becomes.",
    whatUsedFor:
      "Tnot skor carries a deep, smoky caramel sweetness used in desserts, sauces, marinades, and beverages — it's the sweetener behind palm sugar lattes, caramel glazes, and traditional Khmer sweets.",
    howRecipesVary:
      "Kampong Speu, its EU-recognized heartland, still divides the work by tradition: men climb the palms for sap, women cook it into sugar. Cooking time and temperature vary by family, changing the sugar's colour from golden blonde to deep espresso brown.",
    sourceCredit: "fondazioneslowfood.com, tasteatlas.com, cambodianess.com",
    status: "published",
  },
  {
    id: "trey-ngeat",
    title: "Trey Ngeat",
    khmerTerm: "ត្រីងៀត",
    description:
      "Trey ngeat is a traditional Cambodian dried fish — most commonly made from snakehead fish (trey ros), though any freshwater fish can be used. It's cured with salt and sometimes sugar, chili, or a chicken soup base, then sun-dried until it develops a sweet-and-salty, smoky flavour.",
    category: "Dried & Cured Fish",
    photoNote:
      "A woven tray of sun-dried trey ngeat — whole fish splayed open, glistening with salt crystals under the afternoon sun.",
    howMade:
      "Fresh fish — most commonly snakehead (trey ros) — are cleaned, split open, and rubbed with salt. Some families add sugar, chili, or a chicken soup base to the cure. The fish are then laid out under the sun for one to three days, depending on the weather, until they turn golden-brown and develop a smoky-sweet aroma.",
    whatUsedFor:
      "Trey ngeat is typically fried until crispy and served as a side dish with rice, fresh vegetables, and dipping sauce. It's also crumbled over salads, stir-fried into noodles, or eaten as a snack — the salty-sweet crunch carries any dish it touches.",
    howRecipesVary:
      "The cure varies widely: some families keep it simple with just salt; others add garlic, palm sugar, or a commercial chicken soup powder for extra depth. The fish species changes too — snakehead is traditional, but catfish, mackerel, or even small river fish are used depending on what's caught that season.",
    sourceCredit: null,
    status: "published",
  },
  {
    id: "phaok",
    title: "Phaok",
    khmerTerm: "ផ្អក",
    description:
      "Chopped fish or meat mixed with salt, sugar, yeast, and rice, then sealed airtight to ferment, phaok turns sour and savory over days — the base for ផ្អកចំហុយ (steamed phaok) and ផ្អកចិញ្ច្រាំ (fermented vegetable paste).",
    category: "Fermented Fish or Meat Paste",
    photo: "/images/phaok.jpg",
    photoNote:
      "A glass jar of chopped, fermented phaok with visible rice grains, next to a steamed phaok dish served in a banana-leaf bowl.",
    howMade:
      "Chopped fish or meat is mixed with salt, sugar, yeast, and rice, then sealed airtight to ferment. The rice feeds the fermentation while the yeast and salt control spoilage, producing a sour-savory paste over days.",
    whatUsedFor:
      "Phaok is the base for ផ្អកចំហុយ (steamed phaok) and ផ្អកចិញ្ច្រាំ (fermented vegetable paste). It can be steamed as a side dish, stirred into soups, or used as a flavouring for stir-fried vegetables.",
    howRecipesVary:
      "Recipes vary by family: some use fish, others use pork or chicken. The fermentation time adjusts the sourness, and the choice of rice — sticky or regular — changes the texture from coarse to silky.",
    sourceCredit: "My grandmother",
    status: "published",
  },
];

export default entries;
