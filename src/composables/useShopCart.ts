import { computed, ref } from "vue";
import { formatShopPrice, getShopProduct, shopProductMap, type ShopProduct } from "@/data/shop";

type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

const cartItems = ref<CartItem[]>([]);

export const useShopCart = () => {
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
