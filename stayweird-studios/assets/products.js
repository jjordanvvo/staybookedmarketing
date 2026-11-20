/*
  Product catalog. Swap names, prices and images here when the real ones are ready.
  `images` can hold real file paths (e.g. "/images/tee-front.jpg"); empty means a placeholder is shown.
*/
window.SW_PRODUCTS = [
  { id: "weird-logo-tee-black", name: "Weird Logo Tee", color: "Black", price: 45, collection: "tops", sizes: ["S", "M", "L", "XL", "XXL"], soldOut: [], images: [], badge: "New" },
  { id: "weird-logo-tee-white", name: "Weird Logo Tee", color: "White", price: 45, collection: "tops", sizes: ["S", "M", "L", "XL", "XXL"], soldOut: ["S"], images: [] },
  { id: "studio-hoodie-washed", name: "Studio Hoodie", color: "Washed Grey", price: 95, collection: "tops", sizes: ["S", "M", "L", "XL"], soldOut: [], images: [], badge: "New" },
  { id: "studio-hoodie-black", name: "Studio Hoodie", color: "Black", price: 95, collection: "tops", sizes: ["S", "M", "L", "XL"], soldOut: ["S", "M", "L", "XL"], images: [] },
  { id: "distressed-denim", name: "Distressed Denim", color: "Indigo", price: 120, collection: "bottoms", sizes: ["28", "30", "32", "34", "36"], soldOut: ["28"], images: [] },
  { id: "sweatpants-heather", name: "Studio Sweatpants", color: "Heather", price: 80, collection: "bottoms", sizes: ["S", "M", "L", "XL"], soldOut: [], images: [] },
  { id: "cargo-shorts", name: "Cargo Shorts", color: "Olive", price: 65, collection: "bottoms", sizes: ["S", "M", "L", "XL"], soldOut: [], images: [] },
  { id: "long-sleeve-thermal", name: "Thermal Long Sleeve", color: "Cream", price: 60, collection: "tops", sizes: ["S", "M", "L", "XL"], soldOut: [], images: [] },
  { id: "trucker-hat", name: "Trucker Hat", color: "Black", price: 38, collection: "accessories", sizes: ["One Size"], soldOut: [], images: [] },
  { id: "beanie", name: "Rib Beanie", color: "Charcoal", price: 32, collection: "accessories", sizes: ["One Size"], soldOut: [], images: [] },
  { id: "zip-jacket", name: "Zip Work Jacket", color: "Brown", price: 150, collection: "outerwear", sizes: ["S", "M", "L", "XL"], soldOut: [], images: [], badge: "New" },
  { id: "puffer-vest", name: "Puffer Vest", color: "Black", price: 130, collection: "outerwear", sizes: ["S", "M", "L", "XL"], soldOut: ["XL"], images: [] }
];

window.SW_COLLECTIONS = [
  { id: "all", name: "Shop All" },
  { id: "tops", name: "Tops" },
  { id: "bottoms", name: "Bottoms" },
  { id: "outerwear", name: "Outerwear" },
  { id: "accessories", name: "Accessories" }
];
