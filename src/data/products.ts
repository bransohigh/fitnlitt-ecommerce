export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  colors: {
    name: string;
    hex: string;
    image: string;
  }[];
  sizes: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  fabric: string;
  care: string;
  category: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productIds: string[];
}

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Latex Korse Spor Sütyeni',
    slug: 'latex-korse-spor-sutyeni',
    price: 299,
    compareAtPrice: 349,
    images: [
      'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    ],
    colors: [
      { name: 'Siyah', hex: '#000000', image: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800' },
      { name: 'Kırmızı', hex: '#D32F2F', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Yeni',
    rating: 4.8,
    reviewCount: 124,
    description: 'Latex destekli korse tasarımı ile maksimum destek ve şekillendirme sağlar.',
    fabric: '80% Polyester, 20% Elastan',
    care: 'Hassas yıkama, max 30°C',
    category: 'She Moves',
  },
  {
    id: 'prod-002',
    name: 'Yüksek Bel Spor Tayt',
    slug: 'yuksek-bel-spor-tayt',
    price: 249,
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    ],
    colors: [
      { name: 'Siyah', hex: '#000000', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800' },
      { name: 'Mor', hex: '#9C27B0', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewCount: 256,
    description: 'Karın kontrol özellikli, yüksek bel tasarımı ile mükemmel uyum.',
    fabric: '85% Nylon, 15% Spandex',
    care: 'Elde yıkama önerilir',
    category: 'Everyday Collection',
  },
  {
    id: 'prod-003',
    name: 'Crop Spor Atlet',
    slug: 'crop-spor-atlet',
    price: 179,
    compareAtPrice: 219,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    ],
    colors: [
      { name: 'Beyaz', hex: '#FFFFFF', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800' },
      { name: 'Pembe', hex: '#EC407A', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800' },
    ],
    sizes: ['S', 'M', 'L'],
    badge: '%20',
    rating: 4.7,
    reviewCount: 189,
    description: 'Nefes alabilen kumaş, rahat kesim ve trend crop boy.',
    fabric: '90% Pamuk, 10% Elastan',
    care: 'Makinede yıkanabilir, 40°C',
    category: 'Baddie Collection',
  },
  {
    id: 'prod-004',
    name: 'Seamless Spor Sütyeni',
    slug: 'seamless-spor-sutyeni',
    price: 199,
    images: [
      'https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=800',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
    ],
    colors: [
      { name: 'Gri', hex: '#757575', image: 'https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=800' },
      { name: 'Siyah', hex: '#000000', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 145,
    description: 'Dikişsiz tasarım, maksimum konfor ve esneklik.',
    fabric: '92% Polyamide, 8% Elastan',
    care: 'Hassas yıkama, 30°C',
    category: '2nd SKN',
  },
  {
    id: 'prod-005',
    name: 'Oversized Hoodie',
    slug: 'oversized-hoodie',
    price: 399,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800',
    ],
    colors: [
      { name: 'Bej', hex: '#D7CCC8', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800' },
      { name: 'Siyah', hex: '#000000', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Çok Satan',
    rating: 4.9,
    reviewCount: 312,
    description: 'Oversize kesim, yumuşak dokulu premium pamuk hoodie.',
    fabric: '80% Pamuk, 20% Polyester',
    care: 'Makinede yıkanabilir, 30°C',
    category: 'Timeless Collection',
  },
  {
    id: 'prod-006',
    name: 'Juicy Velvet Set',
    slug: 'juicy-velvet-set',
    price: 549,
    compareAtPrice: 649,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800',
    ],
    colors: [
      { name: 'Pembe', hex: '#F06292', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800' },
      { name: 'Mor', hex: '#AB47BC', image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: 'Yeni',
    rating: 4.8,
    reviewCount: 98,
    description: 'Lüks kadife kumaş, üst ve alt takım.',
    fabric: '95% Polyester Kadife, 5% Elastan',
    care: 'Kuru temizleme önerilir',
    category: 'Juicy Collection',
  },
];

export const collections: Collection[] = [
  {
    id: 'col-001',
    name: 'She Moves',
    slug: 'she-moves',
    description: 'Güçlü kadınlar için tasarlandı',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200',
    productIds: ['prod-001', 'prod-002'],
  },
  {
    id: 'col-002',
    name: 'Latex Korse',
    slug: 'latex-korse',
    description: 'Şekillendirici ve destekleyici',
    image: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=1200',
    productIds: ['prod-001'],
  },
  {
    id: 'col-003',
    name: 'Juicy Collection',
    slug: 'juicy-collection',
    description: 'Lüks kadife koleksiyonu',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200',
    productIds: ['prod-006'],
  },
  {
    id: 'col-004',
    name: 'Baddie Collection',
    slug: 'baddie-collection',
    description: 'Cesur, güçlü, özgürlükçü',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
    productIds: ['prod-003'],
  },
  {
    id: 'col-007',
    name: 'Timeless Collection',
    slug: 'timeless-collection',
    description: 'Zamansız klasikler',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
    productIds: ['prod-005'],
  },
  {
    id: 'col-006',
    name: 'Everyday Collection',
    slug: 'everyday-collection',
    description: 'Günlük konforu yaşa',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200',
    productIds: ['prod-002'],
  },
  {
    id: 'col-002',
    name: 'Latex Korse',
    slug: 'latex-korse',
    description: 'Şekillendirici ve destekleyici',
    image: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=1200',
    productIds: ['prod-001'],
  },
  {
    id: 'col-008',
    name: 'New In',
    slug: 'new-in',
    description: 'Yeni gelenler',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200',
    productIds: ['prod-001', 'prod-006'],
  },
  {
    id: 'col-005',
    name: '2nd SKN',
    slug: '2nd-skn',
    description: 'İkinci ten hissi',
    image: 'https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=1200',
    productIds: ['prod-004'],
  },
  {
    id: 'col-006',
    name: 'Everyday Collection',
    slug: 'everyday-collection',
    description: 'Günlük kullanım için',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200',
    productIds: ['prod-002'],
  },
  {
    id: 'col-007',
    name: 'Timeless Collection',
    slug: 'timeless-collection',
    description: 'Zamansız klasikler',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
    productIds: ['prod-005'],
  },
];
