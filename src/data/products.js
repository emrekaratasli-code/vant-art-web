const products = [
  {
    id: 1,
    name: "VANT Soleil Gold Pendant",
    price: 1250,
    category: "Necklaces",
    collection: "Luna Collection",
    image: "https://images.unsplash.com/photo-1599643477877-5313557d87bc?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643477877-5313557d87bc?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "A delicate 18k gold chain adorned with a singular, radiant sunburst pendant. Perfect for layering or wearing alone for a subtle glow.",
    material: "18k Gold",
    care: "Clean with a soft cloth. Avoid contact with perfumes."
  },
  {
    id: 2,
    name: "VANT Eternal Diamond Studs",
    price: 3500,
    category: "Earrings",
    collection: "Contemporary Edge",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589128040788-b2230113c2c7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-e5e1237e3690?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Classic solitaire diamond studs that exude timeless elegance. Featuring 0.5 ct brilliant-cut diamonds set in platinum.",
    material: "Platinum, Diamond",
    care: "Professional cleaning recommended once a year."
  },
  {
    id: 3,
    name: "VANT Noir Obsidian Signet",
    price: 450,
    category: "Rings",
    collection: "Noir Series",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "A bold statement piece featuring a polished black obsidian stone set in a heavy sterling silver band. Modern and masculine.",
    material: "Sterling Silver, Obsidian",
    care: "Avoid hard impact on the stone."
  },
  {
    id: 4,
    name: "VANT Luna Pearl Drop",
    price: 890,
    category: "Necklaces",
    collection: "Luna Collection",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643477877-5313557d87bc?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "An organic freshwater pearl suspended from a fine gold chain. Each moon-like pearl is unique in shape and luster.",
    material: "14k Gold, Freshwater Pearl",
    care: "Keep away from acids and cosmetics."
  },
  {
    id: 5,
    name: "VANT Royal Cuban Bond",
    price: 2100,
    category: "Bracelets",
    collection: "Atelier 01",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop"],
    description: "A substantial Cuban link bracelet crafted from solid 14k yellow gold. Designed for everyday luxury and durability.",
    material: "14k Yellow Gold",
    care: "Buff with gold polishing cloth."
  },
  {
    id: 6,
    name: "VANT Rosé Classic Hoops",
    price: 650,
    category: "Earrings",
    collection: "Contemporary Edge",
    image: "https://images.unsplash.com/photo-1630019852942-e5e1237e3690?q=80&w=1000&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1630019852942-e5e1237e3690?q=80&w=1000&auto=format&fit=crop"],
    description: "Sleek and modern medium-sized hoops in blushing 18k rose gold. A versatile staple for any jewelry collection.",
    material: "18k Rose Gold",
    care: "Store in box to prevent scratching."
  },
  {
    id: 7,
    name: "VANT Sapphire Halo Ring",
    price: 4200,
    category: "Rings",
    collection: "Luna Collection",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1000&auto=format&fit=crop"],
    description: "A deep blue velvet sapphire surrounded by a halo of micro-pavé diamonds. Inspired by vintage royal heirlooms.",
    material: "White Gold, Sapphire, Diamond",
    care: "Do not wear while swimming."
  },
  {
    id: 8,
    name: "VANT Crystal Tennis Bracelet",
    price: 5500,
    category: "Bracelets",
    collection: "Noir Series",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1000&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1000&auto=format&fit=crop"],
    description: "A continuous line of emerald-cut cubic zirconia set in silver, mimicking the brilliance of high-end diamond tennis bracelets.",
    material: "Sterling Silver, Cubic Zirconia",
    care: "Clean with mild soap and water."
  },

  // ========================================
  // WEARABLE ART (Apparel)
  // ========================================
  {
    id: 201,
    name: "Atelier Tee — Midnight Black",
    price: 450,
    category: "Wearable Art",
    collection: "Atelier 01",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Organic cotton. Screen-printed manifesto. Worn by makers.",
    material: "100% Organic Cotton, 220gsm",
    care: "Cold wash. Hang dry. Wrinkles are character.",
    sizing: "Oversized fit. Model is 180cm wearing M.",
    philosophy: "Clothing as canvas. This isn't merch—it's wearable philosophy."
  },
  {
    id: 202,
    name: "Studio Mark Tee — Stone Grey",
    price: 450,
    category: "Wearable Art",
    collection: "Atelier 01",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622445275191-e2b42b994a1b?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Minimalist VANT studio mark. Subtle branding. Maximum impact.",
    material: "100% Organic Cotton, 220gsm",
    care: "Machine wash cold. Air dry recommended.",
    sizing: "Relaxed fit. Dropped shoulders.",
    philosophy: "For those who let their work speak louder than logos."
  },
  {
    id: 203,
    name: "Craft Series Tee — Off-White",
    price: 490,
    category: "Wearable Art",
    collection: "Noir Series",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622445274487-1ae9aa0f2b9d?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Hand-illustrated tools of the trade. For makers and believers.",
    material: "Heavyweight Cotton, 240gsm",
    care: "Reverse wash. Preserve the print.",
    sizing: "Boxy cut. Size down for fitted look.",
    philosophy: "Celebrating the hands that shape metal, wood, and thought."
  },
  {
    id: 204,
    name: "Manifesto Longsleeve — Charcoal",
    price: 550,
    category: "Wearable Art",
    collection: "Contemporary Edge",
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799139834-6b8f844fbe29?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "VANT principles typeset down the sleeve. Wear your values.",
    material: "Organic Cotton/Recycled Poly Blend",
    care: "Gentle cycle. Inside out.",
    sizing: "True to size. Extended sleeves.",
    philosophy: "Words matter. What you wear is what you stand for."
  },
  {
    id: 205,
    name: "Silhouette Crop — Black",
    price: 420,
    category: "Wearable Art",
    collection: "Luna Collection",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Cropped silhouette. Minimal branding. Maximum versatility.",
    material: "Organic Cotton Jersey, 200gsm",
    care: "Wash cold. Shape while drying.",
    sizing: "Fitted crop. Check size guide.",
    philosophy: "Less fabric. More intention."
  },
  {
    id: 206,
    name: "Oxidized Series Hoodie — Slate",
    price: 790,
    category: "Wearable Art",
    collection: "Noir Series",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop"
    ],
    description: "Heavy-weight fleece. Oxidized-inspired gradient print. Studio comfort.",
    material: "400gsm French Terry, Organic Cotton",
    care: "Wash inside out. No bleach. Tumble dry low.",
    sizing: "Oversized. Drop shoulders. Cropped hem.",
    philosophy: "The same finish we give to silver, now in textile form."
  }
];

export { products };
