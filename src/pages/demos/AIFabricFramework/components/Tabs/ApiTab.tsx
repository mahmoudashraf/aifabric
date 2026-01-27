import { Code, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "../../constants";

interface ApiTabProps {
  productCount: number;
  policyCount: number;
  reviewCount: number;
  couponCount: number;
}

export function ApiTab({ productCount, policyCount, reviewCount, couponCount }: ApiTabProps) {
  const endpoints = [
    {
      category: "Products",
      items: [
        { method: "GET", path: "/products", description: "List all products" },
        { method: "GET", path: "/products/search", description: "Semantic search" },
        { method: "POST", path: "/products", description: "Create product" },
        { method: "PUT", path: "/products/:id", description: "Update product" },
        { method: "DELETE", path: "/products/:id", description: "Delete product" },
      ],
    },
    {
      category: "Chat",
      items: [
        { method: "POST", path: "/chat/query", description: "Send chat message" },
        { method: "GET", path: "/chat/conversations", description: "Get conversations" },
        { method: "POST", path: "/chat/suggestions", description: "Get AI suggestions" },
      ],
    },
    {
      category: "Policies",
      items: [
        { method: "GET", path: "/policies", description: "List all policies" },
        { method: "POST", path: "/policies", description: "Create policy" },
        { method: "DELETE", path: "/policies/:id", description: "Delete policy" },
      ],
    },
    {
      category: "Reviews",
      items: [
        { method: "GET", path: "/reviews", description: "List all reviews" },
        { method: "POST", path: "/reviews", description: "Create review" },
      ],
    },
    {
      category: "Coupons",
      items: [
        { method: "GET", path: "/coupons", description: "List all coupons" },
        { method: "POST", path: "/coupons", description: "Create coupon" },
      ],
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500/10 text-green-700";
      case "POST":
        return "bg-blue-500/10 text-blue-700";
      case "PUT":
        return "bg-yellow-500/10 text-yellow-700";
      case "DELETE":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats card */}
      <Card>
        <CardHeader>
          <CardTitle>Framework Statistics</CardTitle>
          <CardDescription>Current data counts in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{productCount}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{policyCount}</div>
              <div className="text-sm text-muted-foreground">Policies</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{reviewCount}</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{couponCount}</div>
              <div className="text-sm text-muted-foreground">Coupons</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <div className="grid gap-4 md:grid-cols-2">
        {endpoints.map((group) => (
          <Card key={group.category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-4 w-4" />
                {group.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {group.items.map((endpoint, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Badge
                      variant="secondary"
                      className={`font-mono text-xs ${getMethodColor(endpoint.method)}`}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-xs text-muted-foreground flex-1">
                      {endpoint.path}
                    </code>
                    <span className="text-xs text-muted-foreground hidden md:block">
                      {endpoint.description}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Swagger link */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <h3 className="font-medium">Full API Documentation</h3>
            <p className="text-sm text-muted-foreground">
              View the complete Swagger UI documentation
            </p>
          </div>
          <Button asChild>
            <a
              href={`${API_BASE_URL.replace("/api", "")}/swagger-ui/index.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Swagger UI
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
