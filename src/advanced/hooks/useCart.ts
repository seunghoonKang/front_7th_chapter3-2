import { CartItem, Coupon } from "../../types";
import { ProductWithUI } from "./useProducts";
import { cartModel } from "../models/cart";
import { couponModel } from "../models/coupon";
import { useNotification } from "./useNotification";
import { useAtom, useAtomValue } from "jotai";
import { cartAtom, totalItemCountAtom } from "../atoms/cart";

export const useCart = () => {
  const { addNotification } = useNotification();
  const [cart, setCart] = useAtom(cartAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);

  const addToCart = (product: ProductWithUI) => {
    const remainingStock = cartModel.getRemainingStock(cart, product);
    const isStockExceeded = cartModel.wouldExceedStock(cart, product);

    if (remainingStock <= 0) {
      addNotification("재고가 부족합니다!", "error");
      return;
    }

    if (isStockExceeded) {
      addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
      return;
    }

    const newCart = cartModel.addItemToCart(cart, product);
    setCart(newCart);
    addNotification("장바구니에 담았습니다", "success");
  };

  const updateQuantity = (
    productId: string,
    newQuantity: number,
    product: ProductWithUI
  ) => {
    if (newQuantity > product.stock) {
      addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
      return;
    }

    const newCart = cartModel.updateCartItemQuantity(
      cart,
      productId,
      newQuantity
    );
    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cartModel.removeItemFromCart(cart, productId);
    setCart(newCart);
  };

  const calculateCartTotal = (selectedCoupon?: Coupon | null) => {
    // 1. 장바구니 총액 계산 (쿠폰 없이)
    const cartTotal = cartModel.calculateCartTotal(cart);

    // 2. 쿠폰이 있으면 적용
    let finalTotal = cartTotal.totalAfterDiscount;
    if (selectedCoupon) {
      finalTotal = couponModel.applyCoupon(
        cartTotal.totalAfterDiscount,
        selectedCoupon
      );
    }

    return {
      totalBeforeDiscount: cartTotal.totalBeforeDiscount,
      totalAfterDiscount: finalTotal,
    };
  };

  const calculateItemTotal = (item: CartItem) => {
    return cartModel.calculateItemTotal(item, cart);
  };

  const getRemainingStock = (product: ProductWithUI) => {
    return cartModel.getRemainingStock(cart, product);
  };

  return {
    cart,
    setCart,
    totalItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    calculateCartTotal,
    calculateItemTotal,
    getRemainingStock,
  };
};
