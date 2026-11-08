// Store catalog. All photos come from Unsplash.

export const CURRENCY = 'Rs.'
export const FREE_SHIPPING_MIN = 10000
export const SHIPPING_FEE = 250
export const EXPRESS_FEE = 600
export const WHATSAPP_NUMBER = '923001234567'

const UNSPLASH = 'https://images.unsplash.com/photo-'

// Build an image URL from an Unsplash photo id or a full URL.
export function imageUrl(photo, w = 800, zoom) {
  if (!photo) return ''
  if (photo.startsWith('http') || photo.startsWith('data:')) return photo
  let url = `${UNSPLASH}${photo}?auto=format&fit=crop&w=${w}&h=${w}&q=80`
  if (zoom) url += `&crop=focalpoint&fp-x=${zoom[0]}&fp-y=${zoom[1]}&fp-z=${zoom[2]}`
  return url
}

// Product gallery: the main shot plus close-up detail shots.
export function gallery(product, w = 900) {
  const photo = product.photo
  if (!photo || photo.startsWith('http') || photo.startsWith('data:')) return [imageUrl(photo, w)]
  return [
    imageUrl(photo, w),
    imageUrl(photo, w, [0.35, 0.55, 1.7]),
    imageUrl(photo, w, [0.65, 0.5, 1.9]),
    imageUrl(photo, w, [0.5, 0.65, 2.4]),
  ]
}

export const formatPrice = (n) => `${CURRENCY} ${Math.round(n).toLocaleString('en-US')}`

export const CATEGORIES = [
  { slug: 'men', name: "Men's Shoes", photo: '1520639888713-7851133b1ed0', blurb: 'Crafted for the modern gentleman' },
  { slug: 'women', name: "Women's Shoes", photo: '1535043934128-cf0b28d52f95', blurb: 'Elegance in every step' },
  { slug: 'kids', name: "Kids' Shoes", photo: '1607522370275-f14206abe5d3', blurb: 'Built for little adventures' },
  { slug: 'sneakers', name: 'Sneakers', photo: '1597248881519-db089d3744a5', blurb: 'Street-ready icons' },
  { slug: 'sports', name: 'Sports Shoes', photo: '1542291026-7eec264c27ff', blurb: 'Performance meets comfort' },
  { slug: 'formal', name: 'Formal Shoes', photo: '1614252235316-8c857d38b5f4', blurb: 'Handmade leather classics' },
  { slug: 'sandals', name: 'Sandals', photo: '1603487742131-4160ec999306', blurb: 'Easy summer style' },
]

export const BRANDS = ['StepStyle Atelier', 'Aurelio', 'UrbanEdge', 'Velocity', 'Luna & Co.', 'Coastline', 'LittleSteps']

const SIZES = {
  men: [39, 40, 41, 42, 43, 44, 45],
  women: [35, 36, 37, 38, 39, 40, 41],
  unisex: [36, 37, 38, 39, 40, 41, 42, 43, 44],
  kids: [28, 29, 30, 31, 32, 33, 34, 35],
}

const C = {
  black: { name: 'Black', hex: '#111111' },
  white: { name: 'White', hex: '#f4f4f2' },
  gold: { name: 'Gold', hex: '#c9a24a' },
  tan: { name: 'Tan', hex: '#b5824f' },
  brown: { name: 'Brown', hex: '#6b3f22' },
  cognac: { name: 'Cognac', hex: '#9a4e1f' },
  red: { name: 'Red', hex: '#c62828' },
  burgundy: { name: 'Burgundy', hex: '#6d1a2a' },
  grey: { name: 'Grey', hex: '#8d8d8d' },
  navy: { name: 'Navy', hex: '#1f2a44' },
  olive: { name: 'Olive', hex: '#5d6532' },
  pink: { name: 'Pink', hex: '#efb3c0' },
  nude: { name: 'Nude', hex: '#e2c2a6' },
  blue: { name: 'Blue', hex: '#3d5afe' },
  green: { name: 'Green', hex: '#7cb342' },
  cream: { name: 'Cream', hex: '#efe6d5' },
  purple: { name: 'Plum', hex: '#5b2a4a' },
  orange: { name: 'Orange', hex: '#f26b2a' },
}

const DESCRIPTIONS = {
  sneakers: 'A modern street icon reimagined with premium materials. A cushioned midsole and padded collar give all-day comfort, while the clean silhouette pairs with everything from denim to tailored joggers.',
  sports: 'Engineered for movement. A breathable upper keeps you cool, responsive foam returns energy with every stride, and a high-traction rubber outsole grips on track, gym floor and street.',
  formal: 'Hand-finished from full-grain leather by skilled artisans. A leather-lined interior, cushioned insole and Goodyear-style stitched sole make it a refined choice for the office, weddings and evening events.',
  women: 'Designed to make an entrance. A sculpted silhouette, padded footbed and carefully balanced heel bring elegance and comfort together, from day meetings to evening celebrations.',
  sandals: 'Laid-back luxury for warm days. Contoured footbeds support your arch, soft straps adjust for a secure fit, and lightweight soles keep every step easy.',
  kids: 'Made for running, jumping and exploring. Flexible soles support growing feet, easy fastening helps little ones dress themselves, and durable materials stand up to the playground.',
  men: 'Rugged good looks with refined details. Durable leather, a cushioned footbed and a grippy sole make this a dependable pair for city streets and weekend escapes.',
}

const FEATURES = {
  sneakers: ['Premium leather & textile upper', 'Cushioned EVA midsole', 'Padded collar and tongue', 'Durable rubber cupsole'],
  sports: ['Breathable engineered mesh', 'Responsive foam cushioning', 'High-traction rubber outsole', 'Lightweight: approx. 280 g'],
  formal: ['Full-grain leather upper', 'Leather lining & insole', 'Stitched leather sole', 'Handcrafted finish'],
  women: ['Padded comfort footbed', 'Non-slip sole', 'Premium finish', 'True to size fit'],
  sandals: ['Contoured cork footbed', 'Adjustable straps', 'Lightweight EVA sole', 'Water-friendly materials'],
  kids: ['Flexible, lightweight sole', 'Easy on & off', 'Breathable lining', 'Scuff-resistant toe'],
  men: ['Full-grain leather', 'Cushioned footbed', 'Lug rubber outsole', 'Reinforced stitching'],
}

// [id, name, brand, categories, gender, price, oldPrice, photo, colors, rating, reviews, stock, flags]
const RAW = [
  [1, 'Phantom Low Classic', 'UrbanEdge', ['sneakers', 'men'], 'men', 12499, 14999, '1600269452121-4f2416e55c28', [C.white, C.black], 4.8, 412, 42, 'best'],
  [2, 'Midnight Court Low', 'UrbanEdge', ['sneakers', 'men'], 'men', 12999, 0, '1543508282-6319a3e2621f', [C.black, C.white], 4.7, 238, 31, 'best'],
  [3, 'Desert Tan Runner', 'StepStyle Atelier', ['sneakers', 'men'], 'men', 10999, 13499, '1549298916-b41d501d3772', [C.tan, C.brown], 4.6, 156, 24, ''],
  [4, 'Crimson Retro High', 'UrbanEdge', ['sneakers', 'men'], 'men', 18999, 21999, '1575537302964-96cd47c06b1b', [C.red, C.black], 4.9, 321, 12, 'best'],
  [5, 'Heritage Low Bred', 'UrbanEdge', ['sneakers'], 'unisex', 16499, 0, '1552346154-21d32810aba3', [C.red, C.black, C.white], 4.8, 198, 18, 'new'],
  [6, 'Court Air Glide', 'Velocity', ['sneakers'], 'unisex', 11999, 0, '1579338559194-a162d19bf842', [C.white, C.red], 4.5, 87, 35, ''],
  [7, 'Peach Dunk High', 'UrbanEdge', ['sneakers', 'women'], 'women', 15499, 17999, '1584735175315-9d5df23860e6', [C.pink, C.cream], 4.7, 143, 15, 'new'],
  [8, 'Stone Grey Duo', 'StepStyle Atelier', ['sneakers', 'men'], 'men', 9999, 0, '1588361861040-ac9b1018f6d5', [C.grey, C.white], 4.4, 64, 40, ''],
  [9, 'Metro Chunky Trainer', 'UrbanEdge', ['sneakers', 'men'], 'men', 13499, 15999, '1595341888016-a392ef81b7de', [C.navy, C.orange, C.white], 4.6, 119, 22, 'new'],
  [10, 'Burgundy Skate Classic', 'UrbanEdge', ['sneakers'], 'unisex', 7499, 0, '1525966222134-fcfa99b8ae77', [C.burgundy, C.black], 4.5, 276, 50, ''],
  [11, 'Pure White Court', 'StepStyle Atelier', ['sneakers', 'men'], 'men', 8999, 10999, '1608231387042-66d1773070a5', [C.white], 4.6, 182, 28, ''],
  [12, 'Prism Knit Runner', 'Velocity', ['sneakers', 'women'], 'women', 14999, 0, '1604671801908-6f0c6a092c05', [C.purple, C.black], 4.7, 95, 19, 'new'],
  [13, 'Noir Court Legend', 'UrbanEdge', ['sneakers', 'men'], 'men', 13999, 0, '1570464197285-9949814674a7', [C.black], 4.8, 204, 26, ''],
  [14, 'Sandstone Minimal', 'StepStyle Atelier', ['sneakers'], 'unisex', 9499, 11499, '1603808033176-9d134e6f2c74', [C.cream, C.white], 4.5, 73, 33, ''],
  [15, 'Golden Retro High', 'UrbanEdge', ['sneakers', 'men'], 'men', 19999, 23999, '1597248881519-db089d3744a5', [C.gold, C.black], 4.9, 356, 9, 'best'],
  [16, 'Pastel Cloud Low', 'Luna & Co.', ['sneakers', 'women'], 'women', 12999, 14499, '1595950653106-6c9ebd614d3a', [C.pink, C.white], 4.8, 167, 21, 'best'],
  [17, 'Sunburst Court', 'UrbanEdge', ['sneakers'], 'unisex', 17499, 0, '1628253747716-0c4f5c90fdda', [C.gold, C.white], 4.7, 88, 14, 'new'],
  [18, 'Blush Retro Runner', 'Luna & Co.', ['sneakers', 'women'], 'women', 11499, 13999, '1608667508764-33cf0726b13a', [C.pink, C.cream], 4.6, 102, 23, ''],
  [19, 'Rosé Heritage Runner', 'Luna & Co.', ['women', 'sports'], 'women', 10999, 0, '1551107696-a4b0c5a0d9a2', [C.pink, C.grey], 4.5, 77, 30, ''],
  [20, 'Lavender Trail Classic', 'Luna & Co.', ['women', 'sneakers'], 'women', 10499, 0, '1465453869711-7e174808ace9', [C.white, C.pink], 4.6, 58, 27, ''],
  [21, 'Inferno Flyknit Run', 'Velocity', ['sports', 'men'], 'men', 13999, 16999, '1542291026-7eec264c27ff', [C.red, C.black], 4.9, 512, 20, 'best'],
  [22, 'Shadow Glide Pro', 'Velocity', ['sports', 'men'], 'men', 15999, 0, '1491553895911-0055eca6402d', [C.black, C.grey], 4.7, 141, 17, 'new'],
  [23, 'Aero Mesh Trainer', 'Velocity', ['sports', 'men'], 'men', 9999, 12499, '1562183241-b937e95585b6', [C.grey, C.green], 4.5, 96, 34, ''],
  [24, 'Solar Flare Runner', 'Velocity', ['sports', 'women'], 'women', 12499, 0, '1600185365483-26d7a4cc7519', [C.orange, C.white], 4.6, 84, 25, ''],
  [25, 'Court Vision Elite', 'Velocity', ['sports', 'men'], 'men', 17999, 19999, '1605348532760-6753d2c43329', [C.black, C.white], 4.8, 133, 11, 'best'],
  [26, 'Volt Power Trainer', 'Velocity', ['sports'], 'unisex', 13499, 0, '1606107557195-0e29a4b5b4aa', [C.green, C.black], 4.6, 69, 29, 'new'],
  [27, 'Blaze Boost Runner', 'Velocity', ['sports', 'men'], 'men', 16499, 18999, '1580902394724-b08ff9ba7e8a', [C.orange, C.blue], 4.8, 221, 16, ''],
  [28, 'Olive Free Run', 'Velocity', ['sports', 'men'], 'men', 11999, 0, '1582588678413-dbf45f4823e9', [C.olive, C.white], 4.5, 91, 31, ''],
  [29, 'Trail Olive Runner', 'Velocity', ['sports', 'men'], 'men', 12999, 0, '1539185441755-769473a23570', [C.olive, C.grey], 4.4, 52, 22, ''],
  [30, 'Plum Pulse Trainer', 'Velocity', ['sports', 'women'], 'women', 11499, 13499, '1619253341026-74c609e6ce50', [C.purple, C.pink], 4.6, 63, 19, 'new'],
  [31, 'Cognac Derby', 'Aurelio', ['formal', 'men'], 'men', 15999, 18999, '1449505278894-297fdb3edbc1', [C.cognac, C.brown], 4.8, 187, 18, 'best'],
  [32, 'Double Monk Strap', 'Aurelio', ['formal', 'men'], 'men', 17499, 0, '1533867617858-e7b97e060509', [C.brown, C.black], 4.9, 142, 10, 'best'],
  [33, 'Heritage Wingtip Brogue', 'Aurelio', ['formal', 'men'], 'men', 16999, 19499, '1603191659812-ee978eeeef76', [C.tan, C.brown], 4.7, 118, 14, ''],
  [34, 'Milano Oxford', 'Aurelio', ['formal', 'men'], 'men', 18499, 0, '1614252235316-8c857d38b5f4', [C.cognac, C.black], 4.8, 97, 12, 'new'],
  [35, 'Espresso Leather Boot', 'Aurelio', ['formal', 'men'], 'men', 19999, 22999, '1608256246200-53e635b5b65f', [C.brown, C.black], 4.8, 84, 8, ''],
  [36, 'Teal Suede Brogue', 'Aurelio', ['formal', 'men'], 'men', 14499, 0, '1560343090-f0409e92791a', [{ name: 'Teal', hex: '#3f7f78' }, C.navy], 4.5, 41, 15, 'new'],
  [37, 'Rustic Leather Casual', 'Aurelio', ['men', 'formal'], 'men', 11999, 0, '1617689563472-c66428e83d17', [C.cognac, C.brown], 4.6, 76, 24, ''],
  [38, 'Rugged Work Boot', 'StepStyle Atelier', ['men'], 'men', 16499, 18499, '1520639888713-7851133b1ed0', [C.tan, C.brown], 4.7, 129, 13, ''],
  [39, 'Nude Stiletto Pump', 'Luna & Co.', ['women', 'formal'], 'women', 9999, 12499, '1535043934128-cf0b28d52f95', [C.nude, C.black], 4.8, 201, 20, 'best'],
  [40, 'Denim Blue Pump', 'Luna & Co.', ['women', 'formal'], 'women', 8999, 0, '1515347619252-60a4bf4fff4f', [C.navy, C.blue], 4.5, 66, 18, ''],
  [41, 'Floral Couture Stiletto', 'Luna & Co.', ['women'], 'women', 13999, 0, '1543163521-1bf539c55dd2', [C.blue, C.pink], 4.7, 48, 9, 'new'],
  [42, 'Noir Pointed Heel', 'Luna & Co.', ['women', 'formal'], 'women', 9499, 11999, '1596703263926-eb0762ee17e4', [C.black], 4.7, 154, 26, ''],
  [43, 'Champagne Glitter Heel', 'Luna & Co.', ['women'], 'women', 16999, 0, '1581101767113-1677fc2beaa8', [C.gold, C.pink], 4.9, 112, 7, 'best'],
  [44, 'Cream Lace-Up Boot', 'Luna & Co.', ['women'], 'women', 14999, 17499, '1610398752800-146f269dfcc8', [C.cream, C.black], 4.6, 71, 12, 'new'],
  [45, 'Blush Ankle Bootie', 'Luna & Co.', ['women'], 'women', 12999, 0, '1621996659490-3275b4d0d951', [C.nude, C.pink], 4.5, 39, 16, ''],
  [46, 'Cognac Block Bootie', 'Luna & Co.', ['women'], 'women', 13499, 0, '1531310197839-ccf54634509e', [C.cognac, C.black], 4.6, 82, 14, ''],
  [47, 'Riviera Cork Slide', 'Coastline', ['sandals'], 'unisex', 6999, 8499, '1603487742131-4160ec999306', [C.cream, C.tan], 4.8, 233, 44, 'best'],
  [48, 'Bordeaux Wedge Sandal', 'Coastline', ['sandals', 'women'], 'women', 7999, 0, '1562273138-f46be4ebdf33', [C.burgundy, C.tan], 4.5, 57, 21, ''],
  [49, 'Scarlet Strappy Sandal', 'Luna & Co.', ['sandals', 'women'], 'women', 10999, 12999, '1613987876445-fcb353cd8e27', [C.red, C.black], 4.7, 68, 15, 'new'],
  [50, 'Lime Pool Slide', 'Coastline', ['sandals'], 'unisex', 3499, 0, '1622920799137-86c891159e44', [C.green, C.black], 4.4, 145, 60, ''],
  [51, 'Onyx Buckle Sandal', 'Coastline', ['sandals', 'men'], 'men', 6499, 7999, '1625318880107-49baad6765fd', [C.black, C.brown], 4.6, 92, 37, ''],
  [52, 'Mini Court Hi', 'LittleSteps', ['kids', 'sneakers'], 'kids', 4999, 5999, '1607522370275-f14206abe5d3', [C.red, C.navy], 4.8, 186, 38, 'best'],
  [53, 'Junior Retro Mid', 'LittleSteps', ['kids', 'sneakers'], 'kids', 6499, 0, '1597045566677-8cf032ed6634', [C.red, C.white], 4.7, 74, 22, 'new'],
  [54, 'Ocean Glow Runner', 'LittleSteps', ['kids', 'sports'], 'kids', 5499, 6499, '1515955656352-a1fa3ffcd111', [C.blue, C.white], 4.6, 59, 30, ''],
  [55, 'Candy Pop Air', 'LittleSteps', ['kids'], 'kids', 5999, 0, '1511556532299-8f662fc26c06', [C.pink, C.white], 4.7, 81, 26, ''],
  [56, 'Neon Splash Trainer', 'LittleSteps', ['kids', 'sports'], 'kids', 5799, 6999, '1520256862855-398228c41684', [C.blue, C.pink], 4.5, 47, 4, 'new'],
  [57, 'Forest Hi-Top Canvas', 'LittleSteps', ['kids'], 'kids', 3999, 0, '1463100099107-aa0980c362e6', [C.green, C.black], 4.6, 112, 41, ''],
  [58, 'Night Hoops Junior', 'LittleSteps', ['kids', 'sports'], 'kids', 6999, 0, '1631984564919-1f6b2313a71c', [C.black, C.orange], 4.7, 66, 3, ''],
]

export const PRODUCTS = RAW.map(([id, name, brand, categories, gender, price, oldPrice, photo, colors, rating, reviews, stock, flag]) => {
  const main = categories.find((c) => DESCRIPTIONS[c]) || categories[0]
  const sizes = SIZES[gender]
  return {
    id,
    name,
    brand,
    categories,
    gender,
    price,
    oldPrice: oldPrice || null,
    photo,
    colors,
    rating,
    reviews,
    stock,
    sizes,
    // A couple of sizes per product are sold out, for realism.
    soldOutSizes: sizes.filter((s) => (s + id) % 7 === 0),
    isNew: flag === 'new',
    isBestseller: flag === 'best',
    description: DESCRIPTIONS[main],
    features: FEATURES[main],
    createdAt: Date.now() - (RAW.length - id) * 86400000,
  }
})

export const SAMPLE_REVIEWS = [
  { name: 'Ayesha K.', rating: 5, date: 'Oct 12, 2026', title: 'Absolutely stunning', text: 'The quality is outstanding and the fit is perfect. I got compliments on day one. Packaging felt truly premium.' },
  { name: 'Usman R.', rating: 5, date: 'Sep 28, 2026', title: 'Worth every rupee', text: 'Super comfortable straight out of the box. Delivery was quick and the size guide was accurate.' },
  { name: 'Sara M.', rating: 4, date: 'Sep 03, 2026', title: 'Great pair', text: 'Love the design and material. Runs very slightly large, so consider half a size down if you are between sizes.' },
]

export const TESTIMONIALS = [
  { name: 'Hamza Ali', city: 'Lahore', text: 'StepStyle has become my go-to for formal shoes. The Cognac Derby looks and feels like a pair three times the price.', avatar: 'HA' },
  { name: 'Fatima Noor', city: 'Karachi', text: 'Ordered heels for a wedding and they arrived in two days, beautifully packed. The comfort is unreal for a stiletto.', avatar: 'FN' },
  { name: 'Bilal Ahmed', city: 'Islamabad', text: 'Great collection of sneakers and the WhatsApp support helped me pick the right size. Easy exchange too.', avatar: 'BA' },
]

export const SEED_ORDERS = [
  { id: 'SS-10428', date: '2026-11-07T10:24:00', status: 'Processing', customer: { name: 'Hamza Ali', email: 'hamza@example.com', phone: '0301 2345678' }, address: { line: '12 Gulberg III', city: 'Lahore', province: 'Punjab', postal: '54000' }, payment: 'Cash on Delivery', items: [{ id: 31, name: 'Cognac Derby', size: 42, color: 'Cognac', qty: 1, price: 15999, photo: '1449505278894-297fdb3edbc1' }], subtotal: 15999, shipping: 0, discount: 0, total: 15999 },
  { id: 'SS-10427', date: '2026-11-06T16:02:00', status: 'Shipped', customer: { name: 'Fatima Noor', email: 'fatima@example.com', phone: '0321 7654321' }, address: { line: 'House 45, DHA Phase 6', city: 'Karachi', province: 'Sindh', postal: '75500' }, payment: 'Credit / Debit Card', items: [{ id: 39, name: 'Nude Stiletto Pump', size: 37, color: 'Nude', qty: 1, price: 9999, photo: '1535043934128-cf0b28d52f95' }, { id: 47, name: 'Riviera Cork Slide', size: 38, color: 'Cream', qty: 1, price: 6999, photo: '1603487742131-4160ec999306' }], subtotal: 16998, shipping: 0, discount: 0, total: 16998 },
  { id: 'SS-10426', date: '2026-11-05T12:40:00', status: 'Delivered', customer: { name: 'Bilal Ahmed', email: 'bilal@example.com', phone: '0333 1122334' }, address: { line: 'F-7/2, Street 18', city: 'Islamabad', province: 'ICT', postal: '44000' }, payment: 'JazzCash / Easypaisa', items: [{ id: 21, name: 'Inferno Flyknit Run', size: 43, color: 'Red', qty: 1, price: 13999, photo: '1542291026-7eec264c27ff' }], subtotal: 13999, shipping: 0, discount: 0, total: 13999 },
  { id: 'SS-10425', date: '2026-11-04T09:15:00', status: 'Delivered', customer: { name: 'Zainab Hussain', email: 'zainab@example.com', phone: '0345 9988776' }, address: { line: '7 Canal View', city: 'Faisalabad', province: 'Punjab', postal: '38000' }, payment: 'Cash on Delivery', items: [{ id: 52, name: 'Mini Court Hi', size: 31, color: 'Red', qty: 2, price: 4999, photo: '1607522370275-f14206abe5d3' }], subtotal: 9998, shipping: 250, discount: 0, total: 10248 },
  { id: 'SS-10424', date: '2026-11-03T18:30:00', status: 'Delivered', customer: { name: 'Hamza Ali', email: 'hamza@example.com', phone: '0301 2345678' }, address: { line: '12 Gulberg III', city: 'Lahore', province: 'Punjab', postal: '54000' }, payment: 'Credit / Debit Card', items: [{ id: 15, name: 'Golden Retro High', size: 42, color: 'Gold', qty: 1, price: 19999, photo: '1597248881519-db089d3744a5' }], subtotal: 19999, shipping: 0, discount: 0, total: 19999 },
  { id: 'SS-10423', date: '2026-11-02T11:05:00', status: 'Cancelled', customer: { name: 'Omar Farooq', email: 'omar@example.com', phone: '0312 4455667' }, address: { line: '22 University Road', city: 'Peshawar', province: 'KPK', postal: '25000' }, payment: 'Cash on Delivery', items: [{ id: 10, name: 'Burgundy Skate Classic', size: 41, color: 'Burgundy', qty: 1, price: 7499, photo: '1525966222134-fcfa99b8ae77' }], subtotal: 7499, shipping: 250, discount: 0, total: 7749 },
  { id: 'SS-10422', date: '2026-11-01T14:50:00', status: 'Delivered', customer: { name: 'Fatima Noor', email: 'fatima@example.com', phone: '0321 7654321' }, address: { line: 'House 45, DHA Phase 6', city: 'Karachi', province: 'Sindh', postal: '75500' }, payment: 'Bank Transfer', items: [{ id: 43, name: 'Champagne Glitter Heel', size: 37, color: 'Gold', qty: 1, price: 16999, photo: '1581101767113-1677fc2beaa8' }], subtotal: 16999, shipping: 0, discount: 0, total: 16999 },
]

export const SEED_USERS = [
  { name: 'Admin', email: 'admin@stepstyle.com', password: 'admin123', phone: '0300 1234567', role: 'admin', joined: '2025-01-10' },
  { name: 'Hamza Ali', email: 'hamza@example.com', password: 'demo123', phone: '0301 2345678', role: 'customer', joined: '2025-06-14' },
  { name: 'Fatima Noor', email: 'fatima@example.com', password: 'demo123', phone: '0321 7654321', role: 'customer', joined: '2025-08-02' },
  { name: 'Bilal Ahmed', email: 'bilal@example.com', password: 'demo123', phone: '0333 1122334', role: 'customer', joined: '2026-02-19' },
  { name: 'Zainab Hussain', email: 'zainab@example.com', password: 'demo123', phone: '0345 9988776', role: 'customer', joined: '2026-04-07' },
  { name: 'Omar Farooq', email: 'omar@example.com', password: 'demo123', phone: '0312 4455667', role: 'customer', joined: '2026-07-21' },
]

export const COUPONS = { STEP10: 0.1, GOLD15: 0.15 }
