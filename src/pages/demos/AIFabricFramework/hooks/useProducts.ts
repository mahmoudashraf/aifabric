import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import * as api from "../utils/api";
import type { Product, ProductFormData } from "../types";

const initialFormData: ProductFormData = {
  sku: "",
  name: "",
  description: "",
  price: "",
  category: "",
  inStockQty: "",
  imageUrl: "",
};

export function useProducts() {
  const { toast } = useToast();

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  // Load products
  const loadProducts = useCallback(async (limit = 50) => {
    setIsLoadingProducts(true);
    try {
      const data = await api.fetchProducts(limit);
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [toast]);

  // Load product count
  const loadProductCount = useCallback(async () => {
    try {
      const count = await api.fetchProductCount();
      setProductCount(count);
    } catch (error) {
      console.error("Failed to load product count:", error);
    }
  }, []);

  // Search products
  const handleProductSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    setIsLoadingProducts(true);
    try {
      const data = await api.searchProducts(searchQuery);
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search products.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [searchQuery, loadProducts, toast]);

  // Open add dialog
  const openAddDialog = useCallback(() => {
    setFormData(initialFormData);
    setIsAddDialogOpen(true);
  }, []);

  // Open edit dialog
  const openEditDialog = useCallback((product: Product) => {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku || "",
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category: product.category || "",
      inStockQty: product.inStockQty?.toString() || "",
      imageUrl: product.imageUrl || "",
    });
    setIsEditDialogOpen(true);
  }, []);

  // Add product
  const handleAddProduct = useCallback(async () => {
    try {
      await api.createProduct({
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inStockQty: parseInt(formData.inStockQty) || 0,
        imageUrl: formData.imageUrl,
      });

      setIsAddDialogOpen(false);
      setFormData(initialFormData);
      await loadProducts();
      await loadProductCount();

      toast({
        title: "Product Created",
        description: "The product has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    }
  }, [formData, loadProducts, loadProductCount, toast]);

  // Edit product
  const handleEditProduct = useCallback(async () => {
    if (!selectedProduct) return;

    try {
      await api.updateProduct(selectedProduct.id, {
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inStockQty: parseInt(formData.inStockQty) || 0,
        imageUrl: formData.imageUrl,
      });

      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      setFormData(initialFormData);
      await loadProducts();

      toast({
        title: "Product Updated",
        description: "The product has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    }
  }, [selectedProduct, formData, loadProducts, toast]);

  // Delete product
  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      await api.deleteProduct(id);
      await loadProducts();
      await loadProductCount();

      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  }, [loadProducts, loadProductCount, toast]);

  return {
    // State
    products,
    productCount,
    isLoadingProducts,
    searchQuery,
    isAddDialogOpen,
    isEditDialogOpen,
    selectedProduct,
    formData,

    // Setters
    setSearchQuery,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setFormData,

    // Actions
    loadProducts,
    loadProductCount,
    handleProductSearch,
    openAddDialog,
    openEditDialog,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
  };
}
