import { useState } from "react";

export interface CouponFormType {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export const useCouponForm = () => {
  const [couponForm, setCouponForm] = useState<CouponFormType>({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const [showCouponForm, setShowCouponForm] = useState(false);

  const updateCouponForm = (updates: Partial<CouponFormType>) => {
    setCouponForm({ ...couponForm, ...updates });
  };

  const resetCouponForm = () => {
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
  };

  return {
    couponForm,
    updateCouponForm,
    resetCouponForm,
    showCouponForm,
    setShowCouponForm,
  };
};
