// 1. 탭 UI로 상품 관리와 쿠폰 관리 분리
// 2. 상품 추가/수정/삭제 기능
// 3. 쿠폰 생성 기능
// 4. 할인 규칙 설정
//
// 필요한 hooks:
// - useProducts: 상품 CRUD
// - useCoupons: 쿠폰 CRUD
//
// 하위 컴포넌트:
// - ProductForm: 새 상품 추가 폼
// - ProductAccordion: 상품 정보 표시 및 수정
// - CouponForm: 새 쿠폰 추가 폼
// - CouponList: 쿠폰 목록 표시

import { useState } from "react";
import { type ProductWithUI } from "../hooks/useProducts";
import { ProductList } from "./admin/ProductList";
import { useProductForm } from "../hooks/useProductForm";
import { ProductForm } from "./admin/ProductForm";
import { CouponList } from "./admin/CouponList";
import { useCouponForm } from "../hooks/useCouponForm";
import { CouponForm } from "./CouponForm";
import { Coupon } from "../../types";

interface AdminPageProps {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (product: string) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  isDuplicateCoupon: (coupon: Coupon) => boolean;
  toggleCouponForm: () => void;
  showCouponForm: boolean;
  setShowCouponForm: (show: boolean) => void;
}

const AdminPage = ({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  addNotification,
  coupons,
  addCoupon,
  deleteCoupon,
  isDuplicateCoupon,
  toggleCouponForm,
  showCouponForm,
  setShowCouponForm,
}: AdminPageProps) => {
  const {
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    updateProductForm,
    resetProductForm,
  } = useProductForm();

  const { couponForm, updateCouponForm, resetCouponForm } = useCouponForm();

  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const handleNewProduct = () => {
    setEditingProduct("new");
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      addNotification("상품이 수정되었습니다.", "success");
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
      addNotification("상품이 추가되었습니다.", "success");
    }
    resetProductForm();
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDuplicateCoupon(couponForm)) {
      addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
      return;
    }
    addCoupon(couponForm);
    addNotification("쿠폰이 추가되었습니다.", "success");
    resetCouponForm();
    setShowCouponForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <button
                onClick={handleNewProduct}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
              >
                새 상품 추가
              </button>
            </div>
          </div>

          <ProductList
            products={products}
            deleteProduct={deleteProduct}
            startEditProduct={startEditProduct}
            addNotification={addNotification}
          />
          {showProductForm && (
            <ProductForm
              productForm={productForm}
              editingProduct={editingProduct}
              updateProductForm={updateProductForm}
              resetProductForm={resetProductForm}
              handleProductSubmit={handleProductSubmit}
              addNotification={addNotification}
            />
          )}
        </section>
      ) : (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          </div>
          <div className="p-6">
            <CouponList
              coupons={coupons}
              deleteCoupon={deleteCoupon}
              toggleCouponForm={toggleCouponForm}
              addNotification={addNotification}
            />

            {showCouponForm && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <CouponForm
                  couponForm={couponForm}
                  updateCouponForm={updateCouponForm}
                  handleCouponSubmit={handleCouponSubmit}
                  addNotification={addNotification}
                  setShowCouponForm={setShowCouponForm}
                />
                {/* <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">
                    새 쿠폰 생성
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        쿠폰명
                      </label>
                      <input
                        type="text"
                        value={couponForm.name}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                        placeholder="신규 가입 쿠폰"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        쿠폰 코드
                      </label>
                      <input
                        type="text"
                        value={couponForm.code}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
                        placeholder="WELCOME2024"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        할인 타입
                      </label>
                      <select
                        value={couponForm.discountType}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            discountType: e.target.value as
                              | "amount"
                              | "percentage",
                          })
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                      >
                        <option value="amount">정액 할인</option>
                        <option value="percentage">정률 할인</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {couponForm.discountType === "amount"
                          ? "할인 금액"
                          : "할인율(%)"}
                      </label>
                      <input
                        type="text"
                        value={
                          couponForm.discountValue === 0
                            ? ""
                            : couponForm.discountValue
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setCouponForm({
                              ...couponForm,
                              discountValue: value === "" ? 0 : parseInt(value),
                            });
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          if (couponForm.discountType === "percentage") {
                            if (value > 100) {
                              addNotification(
                                "할인율은 100%를 초과할 수 없습니다",
                                "error"
                              );
                              setCouponForm({
                                ...couponForm,
                                discountValue: 100,
                              });
                            } else if (value < 0) {
                              setCouponForm({
                                ...couponForm,
                                discountValue: 0,
                              });
                            }
                          } else {
                            if (value > 100000) {
                              addNotification(
                                "할인 금액은 100,000원을 초과할 수 없습니다",
                                "error"
                              );
                              setCouponForm({
                                ...couponForm,
                                discountValue: 100000,
                              });
                            } else if (value < 0) {
                              setCouponForm({
                                ...couponForm,
                                discountValue: 0,
                              });
                            }
                          }
                        }}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                        placeholder={
                          couponForm.discountType === "amount" ? "5000" : "10"
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCouponForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      쿠폰 생성
                    </button>
                  </div>
                </form> */}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPage;
