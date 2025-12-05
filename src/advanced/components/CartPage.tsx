import { useCallback } from "react";
import { CartItem, Coupon } from "../../types";
import { ProductWithUI } from "../hooks/useProducts";
import { ProductCard } from "./cart/ProductCard";
import { ShoppingCart } from "./cart/ShoppingCart";
import { SelectCoupon } from "./cart/SelectCoupon";
import { PaymentInfo } from "./cart/PaymentInfo";
import { useNotification } from "../hooks/useNotification";
import { useCart } from "../hooks/useCart";

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon, currentTotal: number) => void;
}

const CartPage = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
}: CartPageProps) => {
  const { addNotification } = useNotification();
  const { cart, setCart } = useCart();

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                return <ProductCard key={product.id} product={product} />;
              })}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <ShoppingCart />

          {cart.length > 0 && (
            <>
              {coupons.length > 0 && (
                <SelectCoupon
                  selectedCoupon={selectedCoupon}
                  coupons={coupons}
                  applyCoupon={applyCoupon}
                  setSelectedCoupon={setSelectedCoupon}
                />
              )}

              <PaymentInfo completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
