import { useState, useEffect } from "react";
import AdminPage from "./components/AdminPage";
import { useNotification } from "./hooks/useNotification";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useSearch } from "./hooks/useSearch";
import { Notifications } from "./components/Notifications";
import { Header } from "./components/header";
import { SearchBar } from "./components/header/SearchBar";
import { ToggleButton } from "./components/header/ToggleButton";
import { CartIcon } from "./components/header/CartIcon";
import { useCart } from "./hooks/useCart";
import CartPage from "./components/CartPage";

const App = () => {
  // 검색 기능
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useSearch(500);

  // 알림 기능
  const { notifications, addNotification, clearNotification } =
    useNotification();

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    filterProductsBySearchTerm,
  } = useProducts();

  const {
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
  } = useCoupons({ addNotification });

  const {
    cart,
    setCart,
    totalItemCount,
    addToCart,
    updateQuantity,
    calculateCartTotal,
    calculateItemTotal,
    removeFromCart,
    getRemainingStock,
  } = useCart({ addNotification });

  const [isAdmin, setIsAdmin] = useState(false);

  const totals = calculateCartTotal(selectedCoupon);
  // 검색어로 상품 필터링
  const filteredProducts = filterProductsBySearchTerm(debouncedSearchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <Notifications
          notifications={notifications}
          clearNotification={clearNotification}
        />
      )}
      <Header
        leftSide={
          !isAdmin && (
            <div className="ml-8 flex-1 max-w-md">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          )
        }
        rightSide={
          <nav className="flex items-center space-x-4">
            <ToggleButton isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            {!isAdmin && (
              <CartIcon cart={cart} totalItemCount={totalItemCount} />
            )}
          </nav>
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            addNotification={addNotification}
            //products
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            //coupons
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            isDuplicateCoupon={isDuplicateCoupon}
            toggleCouponForm={toggleCouponForm}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            getRemainingStock={getRemainingStock}
            addToCart={addToCart}
            cart={cart}
            setCart={setCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            totals={totals}
            calculateItemTotal={calculateItemTotal}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
