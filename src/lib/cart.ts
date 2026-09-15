// src/lib/cart.ts

export interface CartItem {
  /**
   * Frontend cart identifier.
   * For new Payload products this should be the Payload product ID.
   */
  id: string;

  /**
   * Actual Payload CMS Product document ID.
   * This is the value that must be sent to the Orders relationship field.
   */
  payloadProductId: string;

  title: string;
  price: number;

  gsm?: string;
  fabric?: string;
  category?: string;

  quantity: number;
  size?: string;

  image?: string;

  [key: string]: any;
}

export interface CartDataResult {
  items: CartItem[];
  isExpired: boolean;
}

const CART_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 Hours

export const getCartStorageKey = (): string => {
  if (typeof window === 'undefined') {
    return 'kult_cart_guest';
  }

  const accessKey =
    localStorage.getItem('kult_access_key') ||
    localStorage.getItem('kult_founder_key') ||
    'guest';

  return `kult_cart_${accessKey}`;
};

export const getCartData = (founderKey?: string): CartDataResult => {
  if (typeof window === 'undefined') {
    return {
      items: [],
      isExpired: false,
    };
  }

  const cartKey = founderKey
    ? `kult_cart_${founderKey}`
    : getCartStorageKey();

  const rawData = localStorage.getItem(cartKey);

  if (!rawData) {
    return {
      items: [],
      isExpired: false,
    };
  }

  try {
    const parsed = JSON.parse(rawData);

    let items: CartItem[] = [];
    let isExpired = false;

    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (parsed && typeof parsed === 'object') {
      items = Array.isArray(parsed.items)
        ? parsed.items
        : [];

      const timestamp = parsed.timestamp;

      isExpired =
        typeof timestamp === 'number'
          ? Date.now() - timestamp > CART_EXPIRY_MS
          : false;
    }

    /**
     * Do NOT hydrate products from hard-coded data here.
     *
     * Product information comes from Payload CMS.
     * We only normalize cart-specific values.
     */
    const resolvedItems = items.map((item) => ({
      ...item,

      /**
       * New cart items should always have payloadProductId.
       *
       * The fallback to id is only for compatibility with
       * carts created before this field was introduced.
       */
      payloadProductId:
        item.payloadProductId || item.id,

      quantity:
        typeof item.quantity === 'number' && item.quantity > 0
          ? item.quantity
          : 1,

      size:
        item.size || 'M',
    }));

    return {
      items: resolvedItems,
      isExpired,
    };
  } catch (error) {
    console.error('Error reading cart data:', error);

    return {
      items: [],
      isExpired: false,
    };
  }
};

export const saveCartData = (
  items: CartItem[],
  founderKey?: string,
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const cartKey = founderKey
    ? `kult_cart_${founderKey}`
    : getCartStorageKey();

  const payload = {
    items,
    timestamp: Date.now(),
  };

  localStorage.setItem(
    cartKey,
    JSON.stringify(payload),
  );

  // Secondary guest fallback
  localStorage.setItem(
    'kult_cart_guest',
    JSON.stringify(payload),
  );

  // Keep cart/header synchronized
  window.dispatchEvent(
    new Event('kult_cart_updated'),
  );
};

export const getActiveCartCount = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  const {
    items,
    isExpired,
  } = getCartData();

  if (
    isExpired ||
    !Array.isArray(items)
  ) {
    return 0;
  }

  return items.reduce(
    (acc: number, item: CartItem) =>
      acc + (item.quantity || 1),
    0,
  );
};