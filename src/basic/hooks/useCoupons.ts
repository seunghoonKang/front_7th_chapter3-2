import { useCallback, useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants";

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

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
  };
};
