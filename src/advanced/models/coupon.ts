// 쿠폰 관련 비즈니스 로직 (순수 함수)
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { Coupon } from "../../types";

export const couponModel = {
  /**
   * 쿠폰을 총액에 적용
   * @param total - 쿠폰 적용 전 총액
   * @param coupon - 적용할 쿠폰
   * @returns 쿠폰 적용 후 총액
   */
  applyCoupon: (total: number, coupon: Coupon): number => {
    if (coupon.discountType === "amount") {
      return Math.max(0, total - coupon.discountValue);
    } else {
      return Math.round(total * (1 - coupon.discountValue / 100));
    }
  },

  /**
   * 쿠폰 적용 가능 여부 확인
   * @param total - 현재 총액
   * @param coupon - 확인할 쿠폰
   * @returns 적용 가능 여부
   */
  isApplicable: (total: number, coupon: Coupon): boolean => {
    // percentage 쿠폰은 10,000원 이상 구매 시 사용 가능
    if (coupon.discountType === "percentage" && total < 10000) {
      return false;
    }
    return true;
  },
};
