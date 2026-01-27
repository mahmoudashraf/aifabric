import { useState } from "react";
import { Search, Plus, Edit, Trash2, Loader2, Bot, Eye, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product, ProductFormData } from "../../types";

interface ProductsTabProps {
  products: Product[];
  productCount: number;
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onAttachProduct: (product: Product) => void;
  // Dialog props
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  formData: ProductFormData;
  onFormDataChange: (data: ProductFormData) => void;
  onOpenAddDialog: () => void;
  onCloseAddDialog: () => void;
  onOpenEditDialog: (product: Product) => void;
  onCloseEditDialog: () => void;
  onAddProduct: () => void;
  onEditProduct: () => void;
  onDeleteProduct: (id: string) => void;
}

export function ProductsTab({
  products,
  productCount,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onAttachProduct,
  isAddDialogOpen,
  isEditDialogOpen,
  formData,
  onFormDataChange,
  onOpenAddDialog,
  onCloseAddDialog,
  onOpenEditDialog,
  onCloseEditDialog,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsTabProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products with natural language..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={onSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
        <Button onClick={onOpenAddDialog} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Product count */}
      <div className="text-sm text-muted-foreground">
        Showing {products.length} of {productCount} products
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No products found</p>
            <Button onClick={onOpenAddDialog} variant="link" className="mt-2">
              Add your first product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => onOpenEditDialog(product)}
              onDelete={() => onDeleteProduct(product.id)}
              onAttach={() => onAttachProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && onCloseAddDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the product details below.</DialogDescription>
          </DialogHeader>
          <ProductForm formData={formData} onChange={onFormDataChange} />
          <DialogFooter>
            <Button variant="outline" onClick={onCloseAddDialog}>
              Cancel
            </Button>
            <Button onClick={onAddProduct}>Create Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && onCloseEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details below.</DialogDescription>
          </DialogHeader>
          <ProductForm formData={formData} onChange={onFormDataChange} />
          <DialogFooter>
            <Button variant="outline" onClick={onCloseEditDialog}>
              Cancel
            </Button>
            <Button onClick={onEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Product card component with details dialog
function ProductCard({
  product,
  onEdit,
  onDelete,
  onAttach,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onAttach: () => void;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/30">
        <div className="relative" onClick={() => setIsDetailsOpen(true)}>
          {product.imageUrl && (
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          {/* Always visible Add to AI button */}
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAttach();
            }}
            className="absolute top-2 right-2 gap-1 bg-primary/90 hover:bg-primary shadow-lg"
            title="Add to AI Chat"
          >
            <Sparkles className="h-3 w-3" />
            <span className="text-xs">Add to AI</span>
          </Button>
        </div>
        <CardContent className="p-4" onClick={() => setIsDetailsOpen(true)}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.sku}</p>
            </div>
            <Badge variant={product.inStockQty > 0 ? "default" : "destructive"}>
              {product.inStockQty > 0 ? `${product.inStockQty} in stock` : "Out of stock"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button size="icon" variant="ghost" onClick={onEdit} title="Edit">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onDelete} title="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {product.name}
              <Badge variant="secondary" className="ml-2">{product.category}</Badge>
            </DialogTitle>
            <DialogDescription>{product.sku}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {product.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Price</Label>
                <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Stock</Label>
                <p className="text-lg font-semibold">
                  {product.inStockQty > 0 ? (
                    <span className="text-green-600">{product.inStockQty} units available</span>
                  ) : (
                    <span className="text-destructive">Out of stock</span>
                  )}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="text-sm mt-1">{product.description}</p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => {
                onAttach();
                setIsDetailsOpen(false);
              }}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="h-4 w-4" />
              Add to AI Chat
            </Button>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Product form component
function ProductForm({
  formData,
  onChange,
}: {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
}) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => onChange({ ...formData, sku: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onChange({ ...formData, price: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => onChange({ ...formData, category: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.inStockQty}
            onChange={(e) => onChange({ ...formData, inStockQty: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => onChange({ ...formData, imageUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
