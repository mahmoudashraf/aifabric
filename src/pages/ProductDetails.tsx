import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Loader2, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CRUD_API_BASE_URL } from "@/pages/demos/AIFabricFramework/constants";
import {
  AI_SHOPPING_EXPERIENCE_ROUTE,
  LEGACY_AI_FABRIC_FRAMEWORK_ROUTE,
} from "@/pages/demos/AIFabricFramework/routes";

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  inStockQty?: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

interface Review {
  id?: string;
  productId: string | null;
  userId: string;
  rating: number;
  title: string;
  text?: string;
  comment?: string;
  createdAt?: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const productsRoute = location.pathname.startsWith(LEGACY_AI_FABRIC_FRAMEWORK_ROUTE)
    ? LEGACY_AI_FABRIC_FRAMEWORK_ROUTE
    : AI_SHOPPING_EXPERIENCE_ROUTE;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    setIsLoadingProduct(true);
    try {
      const response = await fetch(
        `${CRUD_API_BASE_URL}/products/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const response = await fetch(
        `${CRUD_API_BASE_URL}/reviews/by-product-id/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Don't show error toast for reviews - it's not critical
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Package className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The product you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate(productsRoute)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : product.rating || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(productsRoute)}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Image Section */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {product.imageUrl ? (
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full flex items-center justify-center bg-muted">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                SKU: {product.sku}
              </p>
              {product.category && (
                <Badge variant="secondary" className="mb-4">
                  {product.category}
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3">
              {renderStars(Math.round(avgRating))}
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="py-4 border-y">
              <p className="text-3xl sm:text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Stock */}
            <div>
              <Badge variant={product.inStockQty && product.inStockQty > 0 ? "default" : "destructive"} className="text-sm">
                {product.inStockQty && product.inStockQty > 0
                  ? `${product.inStockQty} in stock`
                  : "Out of stock"}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2 text-base sm:text-lg">Description</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                className="flex-1 gap-2"
                size="lg"
                disabled={!product.inStockQty || product.inStockQty === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                size="lg"
              >
                <Sparkles className="h-5 w-5" />
                Ask AI
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Star className="h-5 w-5 sm:h-6 sm:w-6" />
              Customer Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No reviews yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Be the first to review this product!
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b last:border-0 pb-4 sm:pb-6 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">
                          {review.title || "Customer Review"}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          By User {review.userId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        {review.createdAt && (
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {(review.comment || review.text) && (
                      <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                        {review.comment || review.text}
                      </p>
                    )}
                    {review.createdAt && (
                      <span className="text-xs text-muted-foreground sm:hidden mt-2 block">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
