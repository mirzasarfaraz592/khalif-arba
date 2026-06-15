const { writeDB } = require('./db');

const products = [
  // --- Perfumes (15 items) ---
  { id: 1, name: 'Blanc (EDP)', notes: 'Lemon, Birch, Cardamom', price: '₹499', mrp: '₹899', numericPrice: 499, rating: '⭐⭐⭐⭐⭐ (245)', image: 'images/p1.jpg', tag: 'Bestseller' },
  { id: 2, name: 'Noir (EDP)', notes: 'Lemon, Carnation, Sandalwood', price: '₹599', mrp: '₹999', numericPrice: 599, rating: '⭐⭐⭐⭐⭐ (189)', image: 'images/p2.jpg', tag: 'Save 40%' },
  { id: 3, name: 'Bleu (EDP)', notes: 'Bergamot, Lavender, Cedarwood', price: '₹699', mrp: '₹1,299', numericPrice: 699, rating: '⭐⭐⭐⭐⭐ (345)', image: 'images/p3.jpg', tag: 'Top Rated' },
  { id: 4, name: 'Fire (EDT)', notes: 'Armoise, Jasmine, Sandalwood', price: '₹299', mrp: '₹499', numericPrice: 299, rating: '⭐⭐⭐⭐½ (560)', image: 'images/p4.jpg', tag: 'Hot' },
  { id: 5, name: 'Night (EDP)', notes: 'Grapefruit, Amber, Patchouli', price: '₹549', mrp: '₹899', numericPrice: 549, rating: '⭐⭐⭐⭐⭐ (120)', image: 'images/p5.jpg', tag: 'Save 38%' },
  { id: 6, name: 'Dubai Royal Oud', notes: 'Pure Oud, Rose, Saffron', price: '₹1,499', mrp: '₹2,500', numericPrice: 1499, rating: '⭐⭐⭐⭐⭐ (89)', image: 'images/p6.jpg', tag: 'Dubai Exclusive' },
  { id: 7, name: 'Emirati Musk', notes: 'White Musk, Vanilla, Amber', price: '₹1,299', mrp: '₹1,999', numericPrice: 1299, rating: '⭐⭐⭐⭐⭐ (65)', image: 'images/p1.jpg', tag: 'Dubai Exclusive' },
  { id: 8, name: 'Indian Sandalwood', notes: 'Mysore Sandalwood, Cedar', price: '₹899', mrp: '₹1,499', numericPrice: 899, rating: '⭐⭐⭐⭐⭐ (112)', image: 'images/p2.jpg', tag: 'Indian Classic' },
  { id: 9, name: 'Parisian Romance', notes: 'Rose, Peony, White Musk', price: '₹999', mrp: '₹1,599', numericPrice: 999, rating: '⭐⭐⭐⭐½ (78)', image: 'images/p3.jpg', tag: 'French' },
  { id: 10, name: 'French Vanilla', notes: 'Madagascar Vanilla, Orchid', price: '₹799', mrp: '₹1,199', numericPrice: 799, rating: '⭐⭐⭐⭐⭐ (201)', image: 'images/p4.jpg', tag: 'French' },
  { id: 11, name: 'Amber Nights', notes: 'Amber, Leather, Spices', price: '₹649', mrp: '₹999', numericPrice: 649, rating: '⭐⭐⭐⭐½ (45)', image: 'images/p5.jpg', tag: '' },
  { id: 12, name: 'Oceanic Breeze', notes: 'Sea Salt, Citrus, Musk', price: '₹449', mrp: '₹799', numericPrice: 449, rating: '⭐⭐⭐⭐⭐ (90)', image: 'images/p6.jpg', tag: '' },
  { id: 13, name: 'Mystic Rose', notes: 'Damask Rose, Patchouli', price: '₹699', mrp: '₹1,099', numericPrice: 699, rating: '⭐⭐⭐⭐½ (67)', image: 'images/p1.jpg', tag: 'New Arrival' },
  { id: 14, name: 'Desert Mirage', notes: 'Spicy Oud, Vetiver', price: '₹849', mrp: '₹1,299', numericPrice: 849, rating: '⭐⭐⭐⭐⭐ (54)', image: 'images/p2.jpg', tag: '' },
  { id: 15, name: 'Velvet Gold', notes: 'Saffron, Jasmine, Ambergris', price: '₹1,199', mrp: '₹1,899', numericPrice: 1199, rating: '⭐⭐⭐⭐⭐ (130)', image: 'images/p3.jpg', tag: 'Premium' },
  
  // --- International Designer Brands (8 items) ---
  { id: 27, name: 'Azzaro Wanted', notes: 'Lemon, Ginger, Cardamom', price: '₹5,999', mrp: '₹7,500', numericPrice: 5999, rating: '⭐⭐⭐⭐⭐ (312)', image: 'images/d_azzaro.png', tag: 'Designer' },
  { id: 28, name: 'BVLGARI Man In Black', notes: 'Spices, Rum, Leather', price: '₹8,499', mrp: '₹10,500', numericPrice: 8499, rating: '⭐⭐⭐⭐⭐ (420)', image: 'images/d_bvlgari.png', tag: 'Luxury' },
  { id: 29, name: 'Davidoff Cool Water', notes: 'Mint, Green Nuances, Coriander', price: '₹4,999', mrp: '₹6,000', numericPrice: 4999, rating: '⭐⭐⭐⭐½ (890)', image: 'images/d_davidoff.png', tag: 'Classic' },
  { id: 30, name: 'Dior Sauvage', notes: 'Calabrian Bergamot, Pepper', price: '₹11,999', mrp: '₹14,000', numericPrice: 11999, rating: '⭐⭐⭐⭐⭐ (1250)', image: 'images/d_dior.png', tag: 'Best Seller' },
  { id: 31, name: 'Giorgio Armani Acqua Di Gio', notes: 'Marine Notes, Bergamot, Cedar', price: '₹7,999', mrp: '₹9,500', numericPrice: 7999, rating: '⭐⭐⭐⭐⭐ (670)', image: 'images/d_armani.png', tag: 'Fresh' },
  { id: 32, name: 'Hermes Terre d\'Hermes', notes: 'Orange, Gunflint, Vetiver', price: '₹10,499', mrp: '₹12,500', numericPrice: 10499, rating: '⭐⭐⭐⭐⭐ (340)', image: 'images/d_hermes.png', tag: 'Luxury' },
  { id: 33, name: 'Issey Miyake L\'Eau d\'Issey', notes: 'Yuzu, Blue Water Lily', price: '₹6,499', mrp: '₹8,000', numericPrice: 6499, rating: '⭐⭐⭐⭐½ (410)', image: 'images/d_issey.png', tag: 'Designer' },
  { id: 34, name: 'Paco Rabanne 1 Million', notes: 'Blood Mandarin, Peppermint', price: '₹6,999', mrp: '₹8,500', numericPrice: 6999, rating: '⭐⭐⭐⭐⭐ (980)', image: 'images/d_paco.png', tag: 'Iconic' },

  // --- Itrs / Attars (11 items) ---
  { id: 16, name: 'Attar - Jannatul Firdaus', notes: 'Lotus, Rose, Jasmine', price: '₹349', mrp: '₹599', numericPrice: 349, rating: '⭐⭐⭐⭐⭐ (310)', image: 'images/p4.jpg', tag: 'Best Itr' },
  { id: 17, name: 'Attar - Majmua', notes: 'Earthy, Floral, Woody', price: '₹399', mrp: '₹650', numericPrice: 399, rating: '⭐⭐⭐⭐½ (180)', image: 'images/p5.jpg', tag: 'Classic' },
  { id: 18, name: 'Premium Attar - Oud', notes: 'Pure Agarwood', price: '₹999', mrp: '₹1,600', numericPrice: 999, rating: '⭐⭐⭐⭐⭐ (95)', image: 'images/p6.jpg', tag: 'Luxury Itr' },
  { id: 19, name: 'Attar - Ruh Khus', notes: 'Vetiver, Earthy, Cool', price: '₹449', mrp: '₹700', numericPrice: 449, rating: '⭐⭐⭐⭐⭐ (120)', image: 'images/p1.jpg', tag: 'Indian Summer' },
  { id: 20, name: 'Attar - Shamama', notes: 'Spices, Herbs, Woods', price: '₹599', mrp: '₹899', numericPrice: 599, rating: '⭐⭐⭐⭐½ (75)', image: 'images/p2.jpg', tag: 'Winter Special' },
  { id: 21, name: 'Attar - Mitti (Earth)', notes: 'Petrichor, Baked Earth', price: '₹499', mrp: '₹750', numericPrice: 499, rating: '⭐⭐⭐⭐⭐ (205)', image: 'images/p3.jpg', tag: 'Unique' },
  { id: 22, name: 'Attar - White Musk', notes: 'Clean, Powdery, Soft', price: '₹299', mrp: '₹450', numericPrice: 299, rating: '⭐⭐⭐⭐⭐ (400)', image: 'images/p4.jpg', tag: 'Everyday' },
  { id: 23, name: 'Attar - Kasturi', notes: 'Deer Musk Alternate, Rich', price: '₹799', mrp: '₹1,200', numericPrice: 799, rating: '⭐⭐⭐⭐½ (50)', image: 'images/p5.jpg', tag: 'Premium' },
  { id: 24, name: 'Attar - Rose (Gulab)', notes: 'Fresh Indian Rose', price: '₹249', mrp: '₹399', numericPrice: 249, rating: '⭐⭐⭐⭐⭐ (500)', image: 'images/p6.jpg', tag: 'Floral' },
  { id: 25, name: 'Attar - Jasmine (Mogra)', notes: 'Sweet, Intense Floral', price: '₹249', mrp: '₹399', numericPrice: 249, rating: '⭐⭐⭐⭐⭐ (340)', image: 'images/p1.jpg', tag: 'Floral' },
  { id: 26, name: 'Dubai Attar - Mukhallat', notes: 'Rose, Saffron, Oud', price: '₹1,099', mrp: '₹1,799', numericPrice: 1099, rating: '⭐⭐⭐⭐⭐ (88)', image: 'images/p2.jpg', tag: 'Dubai Exclusive' }
];

writeDB({ users: [], products: products, orders: [] });
console.log('JSON Database seeded with 26 products successfully!');
