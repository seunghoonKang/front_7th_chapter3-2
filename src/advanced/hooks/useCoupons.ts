import { useCallback, useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";
import { couponModel } from "../models/coupon";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useNotification } from "./useNotification";

export const useCoupons = () => {
  const { addNotification } = useNotification();

  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const isDuplicateCoupon = useCallback(
    (newCoupon: Coupon) => {
      return coupons.find((c) => c.code === newCoupon.code) !== undefined;
    },
    [coupons]
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      setCoupons((prev) => [...prev, newCoupon]);
    },
    [coupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
    },
    [selectedCoupon]
  );
  const toggleCouponForm = () => {
    setShowCouponForm(!showCouponForm);
  };

  const applyCoupon = useCallback(
    (coupon: Coupon, currentTotal: number) => {
      const isApplicable = couponModel.isApplicable(currentTotal, coupon);

      if (!isApplicable) {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }
      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification]
  );

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    showCouponForm,
    setShowCouponForm,
    addCoupon,
    deleteCoupon,
    isDuplicateCoupon,
    toggleCouponForm,
    applyCoupon,
  };
};
