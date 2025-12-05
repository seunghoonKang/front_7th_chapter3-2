import { useEffect, useState } from "react";
import { CartItem, Coupon } from "../../types";
import { ProductWithUI } from "./useProducts";
import { cartModel } from "../models/cart";
import { couponModel } from "../models/coupon";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useNotification } from "./useNotification";

// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수

export const useCart = () => {
  const { addNotification } = useNotification();
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [totalItemCount, setTotalItemCount] = useState(0);

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

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  return {
    cart,
    setCart,
    totalItemCount,
    setTotalItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    calculateCartTotal,
    calculateItemTotal,
    getRemainingStock,
  };
};
