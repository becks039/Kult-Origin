// src/lib/cart.ts

export interface CartItem {
  id: string;
  title: string;
  price: number;
  gsm: string;
  fabric: string;
  category: string;
  quantity: number;
  size?: string;
  [key: string]: any;
}

export interface CartDataResult {
  items: CartItem[];
  isExpired: boolean;
}

const CART_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 Hours

export const PRODUCTS_LOOKUP: Record<string, Omit<CartItem, 'quantity'>> = {
  'B001-HD01': { id: 'B001-HD01', title: 'TYPE 1: HEAVYWEIGHT OVERSIZED HOODIE', price: 1999, gsm: '500 GSM', fabric: 'FRENCH TERRY FLEECE', category: 'HOODIES' },
  'B001-HD02': { id: 'B001-HD02', title: 'TYPE 2: ARCHITECTURAL ZIP-UP HOODIE', price: 2319, gsm: '520 GSM', fabric: 'HEAVY COTTON FLEECE', category: 'HOODIES' },
  'B001-HD03': { id: 'B001-HD03', title: 'TYPE 3: BALACLAVA TACTICAL HOODIE', price: 2480, gsm: '480 GSM', fabric: 'THERMAL FLEECE BLEND', category: 'HOODIES' },
  'B001-TE01': { id: 'B001-TE01', title: 'TYPE 1: STRUCTURAL COMPRESSION TEE', price: 1999, gsm: '300 GSM', fabric: 'ELASTANE COTTON BLEND', category: 'TEES' },
  'B001-TE02': { id: 'B001-TE02', title: 'TYPE 2: OVERSIZED DROP-SHOULDER TEE', price: 1519, gsm: '280 GSM', fabric: 'COMBED ORGANIC COTTON', category: 'TEES' },
  'B001-TE03': { id: 'B001-TE03', title: 'TYPE 3: ACID WASH TACTICAL SHIRT', price: 1759, gsm: '320 GSM', fabric: 'VINTAGE WASH COTTON', category: 'TEES' },
  'B001-VT01': { id: 'B001-VT01', title: 'TYPE 1: TACTICAL UTILITY VEST', price: 2560, gsm: 'CORDURA 1000D', fabric: 'REINFORCED NYLON / MESH', category: 'OUTERWEAR' },
  'B001-JK02': { id: 'B001-JK02', title: 'TYPE 2: ARCHITECTURAL BOMBER JACKET', price: 3600, gsm: 'WATERPROOF MESH', fabric: 'BALLISTIC NYLON SHELL', category: 'OUTERWEAR' },
  'B001-JK03': { id: 'B001-JK03', title: 'TYPE 3: HEAVY ANORAK WINDSTOPPER', price: 3199, gsm: 'WEATHER-PROOF', fabric: 'RIPSTOP POLYESTER', category: 'OUTERWEAR' },
  'B001-SW01': { id: 'B001-SW01', title: 'TYPE 1: HEAVY FLEECE SWEATPANTS', price: 1999, gsm: '500 GSM', fabric: 'FRENCH TERRY FLEECE', category: 'BOTTOMS' },
  'B001-PT02': { id: 'B001-PT02', title: 'TYPE 2: MODULAR CARGO PANT', price: 2559, gsm: '350 GSM', fabric: 'COTTON TWILL RIPSTOP', category: 'BOTTOMS' },
  'B001-SH03': { id: 'B001-SH03', title: 'TYPE 3: TACTICAL TRAINING SHORTS', price: 1439, gsm: '240 GSM', fabric: 'STRETCH NYLON BLEND', category: 'BOTTOMS' },
  'B001-AC01': { id: 'B001-AC01', title: 'OBSIDIAN ALLOY KEYCHAIN', price: 1039, gsm: 'HARDWARE', fabric: 'ZINC ALLOY / STEEL', category: 'ACCESSORIES' },
  'B001-AC02': { id: 'B001-AC02', title: 'TACTICAL CHEST RIG SLING', price: 1839, gsm: 'CORDURA 500D', fabric: 'WATER-RESISTANT NYLON', category: 'ACCESSORIES' },
  'B001-AC03': { id: 'B001-AC03', title: '500 GSM FLEECE BALACLAVA', price: 959, gsm: '500 GSM', fabric: 'FRENCH TERRY FLEECE', category: 'ACCESSORIES' },
};

export const getCartStorageKey = (): string => {
  if (typeof window === 'undefined') return 'kult_cart_guest';
  const accessKey =
    localStorage.getItem('kult_access_key') ||
    localStorage.getItem('kult_founder_key') ||
    'guest';
  return `kult_cart_${accessKey}`;
};

export const getCartData = (founderKey?: string): CartDataResult => {
  if (typeof window === 'undefined') return { items: [], isExpired: false };

  const cartKey = founderKey ? `kult_cart_${founderKey}` : getCartStorageKey();
  const rawData = localStorage.getItem(cartKey);

  if (!rawData) return { items: [], isExpired: false };

  try {
    const parsed = JSON.parse(rawData);
    let items: CartItem[] = [];
    let isExpired = false;

    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (parsed && typeof parsed === 'object') {
      items = Array.isArray(parsed.items) ? parsed.items : [];
      const timestamp = parsed.timestamp;
      isExpired = typeof timestamp === 'number' 
        ? Date.now() - timestamp > CART_EXPIRY_MS 
        : false;
    }

    // Hydrate item metadata from lookup if title/price is missing
    const resolvedItems = items.map((item) => {
      const details = PRODUCTS_LOOKUP[item.id] || {};
      return {
        ...details,
        ...item,
        quantity: item.quantity || 1,
        size: item.size || 'M',
      } as CartItem;
    });

    return { items: resolvedItems, isExpired };
  } catch (error) {
    console.error('Error reading cart data:', error);
    return { items: [], isExpired: false };
  }
};

export const saveCartData = (items: CartItem[], founderKey?: string): void => {
  if (typeof window === 'undefined') return;

  const cartKey = founderKey ? `kult_cart_${founderKey}` : getCartStorageKey();
  const payload = {
    items,
    timestamp: Date.now(),
  };

  localStorage.setItem(cartKey, JSON.stringify(payload));
  // Secondary fallback for guest access
  localStorage.setItem('kult_cart_guest', JSON.stringify(payload));

  // Dispatch custom window event so Cart and Header Navbar stay synced
  window.dispatchEvent(new Event('kult_cart_updated'));
};

export const getActiveCartCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const { items, isExpired } = getCartData();
  if (isExpired || !Array.isArray(items)) return 0;
  return items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
};