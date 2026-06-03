import { computed, ref, watch } from "vue";
import { formatShopPrice, getShopProduct, shopProductMap, type ShopProduct } from "@/data/shop";

type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

const CART_STORAGE_KEY = "esclat-shop-cart-items";

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<CartItem>;
  return (
    typeof candidate.productId === "string" &&
    typeof candidate.size === "string" &&
    typeof candidate.quantity === "number"
  );
};

const loadCartItems = () => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
};

const cartItems = ref<CartItem[]>(loadCartItems());
let hasCartPersistenceWatcher = false;

export const useShopCart = () => {
  if (typeof window !== "undefined" && !hasCartPersistenceWatcher) {
    hasCartPersistenceWatcher = true;

    watch(
      cartItems,
      (items) => {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      },
      { deep: true },
    );
  }

  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      const product = shopProductMap[item.productId];
      return total + (product?.price ?? 0) * item.quantity;
    }, 0);
  });

  const addToCart = (product: ShopProduct, size: string) => {
    const cartSize = size || product.sizes[0] || "U";
    const existingItem = cartItems.value.find(
      (item) => item.productId === product.id && item.size === cartSize,
    );

    if (existingItem) {
      existingItem.quantity += 1;
      return;
    }

    cartItems.value.push({
      productId: product.id,
      size: cartSize,
      quantity: 1,
    });
  };

  const incrementItem = (item: CartItem) => {
    item.quantity += 1;
  };

  const decrementItem = (item: CartItem) => {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cartItems.value = cartItems.value.filter((entry) => entry !== item);
    }
  };

  const clearCart = () => {
    cartItems.value = [];
  };

  const getCartLineTotal = (item: CartItem) => {
    const product = shopProductMap[item.productId];
    return formatShopPrice((product?.price ?? 0) * item.quantity);
  };

  const getCartProduct = (productId: string | null | undefined) => {
    return getShopProduct(productId);
  };

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    incrementItem,
    decrementItem,
    clearCart,
    getCartLineTotal,
    getCartProduct,
  };
};

export type { CartItem };
