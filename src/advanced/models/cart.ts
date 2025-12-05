// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산
// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산
// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액)
// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
// 5. addItemToCart(cart, product): 상품 추가
// 6. removeItemFromCart(cart, productId): 상품 제거
// 7. getRemainingStock(product, cart): 남은 재고 계산
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { CartItem } from "../../types";
import { ProductWithUI } from "../hooks/useProducts";

export const cartModel = {
  /**
   * 상품의 기본 할인율 계산 (수량 기반)
   * @param item - 장바구니 아이템
   * @returns 기본 할인율 (0 ~ 1)
   */
  getBaseDiscount: (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    return discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);
  },

  /**
   * 대량 구매 보너스 할인율 계산
   * @param cart - 전체 장바구니
   * @returns 대량 구매 보너스 할인율 (0 또는 0.05)
   */
  getBulkPurchaseBonus: (cart: CartItem[]): number => {
    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    return hasBulkPurchase ? 0.05 : 0;
  },

  /**
   * 적용 가능한 최대 할인율 계산
   * @param item - 장바구니 아이템
   * @param cart - 전체 장바구니 (대량 구매 체크용)
   * @returns 최대 할인율 (0 ~ 0.5, 최대 50%)
   */
  getMaxApplicableDiscount: (item: CartItem, cart: CartItem[]): number => {
    const baseDiscount = cartModel.getBaseDiscount(item);
    const bulkBonus = cartModel.getBulkPurchaseBonus(cart);

    // 기본 할인 + 대량 구매 보너스, 최대 50% 제한
    return Math.min(baseDiscount + bulkBonus, 0.5);
  },

  /**
   * 개별 아이템의 할인 적용 후 총액 계산
   * @param item - 장바구니 아이템
   * @param cart - 전체 장바구니 (대량 구매 체크용)
   * @returns 할인 적용 후 총액
   */
  calculateItemTotal: (item: CartItem, cart: CartItem[]): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = cartModel.getMaxApplicableDiscount(item, cart);

    return Math.round(price * quantity * (1 - discount));
  },

  /**
   * 장바구니 총액 계산 (쿠폰 적용 전)
   * @param cart - 장바구니 아이템 배열
   * @returns 할인 전/후 총액 (쿠폰 미적용)
   */
  calculateCartTotal: (cart: CartItem[]) => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += cartModel.calculateItemTotal(item, cart);
    });

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  },

  /**
   * 남은 재고 계산
   * @param cart - 장바구니
   * @param product - 상품
   * @returns 남은 재고 수량
   */
  getRemainingStock: (cart: CartItem[], product: ProductWithUI): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  },

  /**
   * 재고 초과 여부 확인
   * @param cart - 장바구니
   * @param product - 상품
   * @returns 재고 초과 여부
   */
  wouldExceedStock: (cart: CartItem[], product: ProductWithUI): boolean => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      return existingItem.quantity + 1 > product.stock;
    }
    return false;
  },

  /**
   * 장바구니에 상품 추가
   * @param cart - 현재 장바구니
   * @param product - 추가할 상품
   * @returns 새로운 장바구니
   */
  addItemToCart: (cart: CartItem[], product: ProductWithUI): CartItem[] => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      return cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...cart, { product, quantity: 1 }];
  },

  /**
   * 장바구니에서 상품 제거
   * @param cart - 현재 장바구니
   * @param productId - 제거할 상품 ID
   * @returns 새로운 장바구니
   */
  removeItemFromCart: (cart: CartItem[], productId: string): CartItem[] => {
    return cart.filter((item) => item.product.id !== productId);
  },

  /**
   * 장바구니 아이템 수량 변경
   * @param cart - 현재 장바구니
   * @param productId - 변경할 상품 ID
   * @param quantity - 새로운 수량
   * @returns 새로운 장바구니
   */
  updateCartItemQuantity: (
    cart: CartItem[],
    productId: string,
    quantity: number
  ): CartItem[] => {
    if (quantity <= 0) {
      return cartModel.removeItemFromCart(cart, productId);
    }

    return cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
  },
};
