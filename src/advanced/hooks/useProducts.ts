// TODO: 상품 관리 Hook
// 힌트:
// 1. 상품 목록 상태 관리 (localStorage 연동 고려)
// 2. 상품 CRUD 작업
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제
//
// 반환할 값:
// - products: 상품 배열
// - updateProduct: 상품 정보 수정
// - addProduct: 새 상품 추가
// - updateProductStock: 재고 수정
// - addProductDiscount: 할인 규칙 추가
// - removeProductDiscount: 할인 규칙 삭제

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

import { useCallback } from "react";
import { Product } from "../../types";
import { initialProducts } from "../constants";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    []
  );

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const filterProductsBySearchTerm = useCallback(
    (searchTerm: string): ProductWithUI[] => {
      if (!searchTerm.trim()) {
        return products;
      }

      const lowerSearchTerm = searchTerm.toLowerCase();

      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerSearchTerm) ||
          (product.description &&
            product.description.toLowerCase().includes(lowerSearchTerm))
      );
    },
    [products]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    filterProductsBySearchTerm,
  };
}
