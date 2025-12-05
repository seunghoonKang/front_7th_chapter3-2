import { useState } from "react";

export interface ProductFormType {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

export const useProductForm = () => {
  const [productForm, setProductForm] = useState<ProductFormType>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const updateProductForm = (updates: Partial<typeof productForm>) => {
    setProductForm({ ...productForm, ...updates });
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });

    setEditingProduct(null);
    setShowProductForm(false);
  };

  return {
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    updateProductForm,
    resetProductForm,
  };
};
