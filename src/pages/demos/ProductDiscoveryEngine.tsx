import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  Tag,
  TrendingUp,
  Heart,
  Star,
  Filter,
  Sparkles,
  Eye,
  ShoppingCart,
  Zap,
  Users,
  BarChart3,
  Package,
  DollarSign,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { DemoBackendArchitecture } from "./components/DemoBackendArchitecture";
import { demoBackendArchitectures } from "./components/demoBackendArchitectures";

// Sample products data
const sampleProducts = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and remote workers.",
    category: "Electronics",
    brand: "AudioPro",
    price: 299.99,
    features: ["Noise Cancellation", "30hr Battery", "Bluetooth 5.0", "Foldable Design"],
    tags: ["wireless", "headphones", "audio", "premium"],
    rating: 4.8,
    reviewCount: 1247,
    inStock: true,
    imageUrl: "🎧",
    similarity: 0.95,
  },
  {
    id: "2",
    name: "Ergonomic Mechanical Keyboard",
    description: "Split mechanical keyboard with hot-swappable switches, programmable RGB, and ergonomic design to reduce wrist strain during long typing sessions.",
    category: "Electronics",
    brand: "KeyMaster",
    price: 189.99,
    features: ["Mechanical Switches", "RGB Lighting", "Ergonomic", "Programmable"],
    tags: ["keyboard", "ergonomic", "mechanical", "gaming"],
    rating: 4.6,
    reviewCount: 856,
    inStock: true,
    imageUrl: "⌨️",
    similarity: 0.88,
  },
  {
    id: "3",
    name: "Ultra-Wide Curved Monitor",
    description: "34-inch ultra-wide curved display with 144Hz refresh rate, perfect for productivity and immersive gaming experiences.",
    category: "Electronics",
    brand: "ViewTech",
    price: 549.99,
    features: ["34 inch", "144Hz", "Curved", "USB-C"],
    tags: ["monitor", "ultrawide", "gaming", "productivity"],
    rating: 4.7,
    reviewCount: 632,
    inStock: true,
    imageUrl: "🖥️",
    similarity: 0.82,
  },
  {
    id: "4",
    name: "Smart Standing Desk",
    description: "Electric height-adjustable desk with memory presets, cable management, and app control for the ultimate ergonomic workspace.",
    category: "Furniture",
    brand: "DeskFlow",
    price: 699.99,
    features: ["Electric Lift", "Memory Presets", "App Control", "Cable Management"],
    tags: ["desk", "standing", "ergonomic", "smart"],
    rating: 4.9,
    reviewCount: 423,
    inStock: true,
    imageUrl: "🪑",
    similarity: 0.75,
  },
  {
    id: "5",
    name: "Compact Espresso Machine",
    description: "Professional-grade espresso machine with built-in grinder, milk frother, and customizable brewing profiles for coffee enthusiasts.",
    category: "Kitchen",
    brand: "BrewPro",
    price: 449.99,
    features: ["Built-in Grinder", "Milk Frother", "Custom Profiles", "Compact"],
    tags: ["coffee", "espresso", "kitchen", "appliance"],
    rating: 4.5,
    reviewCount: 789,
    inStock: false,
    imageUrl: "☕",
    similarity: 0.65,
  },
];

const trendingProducts = [
  { id: "t1", name: "AI-Powered Smart Watch", trend: "+45%", category: "Wearables", imageUrl: "⌚" },
  { id: "t2", name: "Portable Power Station", trend: "+38%", category: "Electronics", imageUrl: "🔋" },
  { id: "t3", name: "Wireless Earbuds Pro", trend: "+32%", category: "Audio", imageUrl: "🎵" },
  { id: "t4", name: "Smart Home Hub", trend: "+28%", category: "Smart Home", imageUrl: "🏠" },
];

const searchExamples = [
  "headphones for working from home with noise cancellation",
  "ergonomic setup for back pain",
  "gift ideas for coffee lovers under $500",
  "gaming accessories for streaming",
];

interface Interaction {
  type: "view" | "search" | "add_to_cart" | "favorite";
  productId?: string;
  query?: string;
  timestamp: Date;
}

const ProductDiscoveryEngine = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(sampleProducts);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchIntent, setSearchIntent] = useState<string | null>(null);

  const categories = ["Electronics", "Furniture", "Kitchen", "Wearables", "Audio"];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchIntent(null);
    
    // Track search interaction
    trackInteraction({ type: "search", query: searchQuery, timestamp: new Date() });

    // Simulate AI-powered semantic search with intent detection
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Detect intent from query
    const intents: Record<string, string> = {
      "noise cancellation": "Looking for audio products with noise isolation features",
      "ergonomic": "Prioritizing products designed for comfort and health",
      "gift": "Searching for gift-worthy items with good reviews",
      "gaming": "Focusing on high-performance gaming peripherals",
      "work from home": "Products optimized for remote work productivity",
    };

    const detectedIntent = Object.entries(intents).find(([key]) => 
      searchQuery.toLowerCase().includes(key)
    );
    
    if (detectedIntent) {
      setSearchIntent(detectedIntent[1]);
    }

    // Filter and re-rank results based on semantic similarity
    const filteredResults = sampleProducts
      .filter((p) => {
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
        return matchesPrice && matchesCategory;
      })
      .sort((a, b) => b.similarity - a.similarity);

    setSearchResults(filteredResults);
    setIsSearching(false);
  };

  const trackInteraction = (interaction: Interaction) => {
    setInteractions((prev) => [interaction, ...prev].slice(0, 10));
  };

  const handleProductView = (productId: string) => {
    trackInteraction({ type: "view", productId, timestamp: new Date() });
  };

  const handleAddToCart = (productId: string) => {
    trackInteraction({ type: "add_to_cart", productId, timestamp: new Date() });
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    trackInteraction({ type: "favorite", productId, timestamp: new Date() });
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="container mx-auto px-4 py-8">
          <Link
            to="/demos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Product Discovery Engine</h1>
                <p className="text-muted-foreground">
                  AI-powered semantic search with personalized recommendations
                </p>
              </div>
            </div>

            {/* AI Capabilities Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="gap-1">
                <Search className="h-3 w-3" />
                Semantic Search
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                Behavior Tracking
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Query Understanding
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                Recommendations
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Search Tab */}
            <TabsContent value="search" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-4">
                {/* Filters Sidebar */}
                <Card className="lg:col-span-1 h-fit">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Filter className="h-4 w-4" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Price Range */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Price Range</label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000}
                        min={0}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Categories */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Categories</label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center gap-2">
                            <Checkbox
                              id={category}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryToggle(category)}
                            />
                            <label htmlFor={category} className="text-sm cursor-pointer">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Search Results */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Search Bar */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search naturally... e.g., 'headphones for working from home'"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          className="pl-10"
                        />
                      </div>
                      <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                        {isSearching ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        AI Search
                      </Button>
                    </div>

                    {/* Search Examples */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground">Try:</span>
                      {searchExamples.map((example) => (
                        <button
                          key={example}
                          onClick={() => {
                            setSearchQuery(example);
                            setTimeout(handleSearch, 100);
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          "{example}"
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intent Detection Banner */}
                  <AnimatePresence>
                    {searchIntent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="py-3 flex items-center gap-3">
                            <Zap className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              <strong>AI Intent Detected:</strong> {searchIntent}
                            </span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Results Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {searchResults.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className="group hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => handleProductView(product.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {/* Product Image Placeholder */}
                              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted text-3xl shrink-0">
                                {product.imageUrl}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                      {product.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {product.brand}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleFavorite(product.id);
                                    }}
                                  >
                                    <Heart
                                      className={`h-4 w-4 ${
                                        favorites.includes(product.id)
                                          ? "fill-red-500 text-red-500"
                                          : ""
                                      }`}
                                    />
                                  </Button>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <span className="text-sm font-medium">{product.rating}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({product.reviewCount} reviews)
                                  </span>
                                </div>

                                {/* Features */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {product.features.slice(0, 3).map((feature) => (
                                    <Badge key={feature} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>

                                {/* Price & Actions */}
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold">${product.price}</span>
                                    {!product.inStock && (
                                      <Badge variant="outline" className="text-xs text-destructive">
                                        Out of Stock
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                                      {Math.round(product.similarity * 100)}% match
                                    </Badge>
                                    <Button
                                      size="sm"
                                      disabled={!product.inStock}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product.id);
                                      }}
                                    >
                                      <ShoppingCart className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Trending Tab */}
            <TabsContent value="trending" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {trendingProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <div className="text-5xl mb-4">{product.imageUrl}</div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {product.trend}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* How Trending Works */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    How Trending Detection Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Eye className="h-4 w-4 text-primary" />
                        View Velocity
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tracks rapid increases in product views across user segments
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                        Conversion Spikes
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Monitors add-to-cart and purchase rate changes over time
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Search className="h-4 w-4 text-primary" />
                        Search Patterns
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Identifies emerging search terms and product interests
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Stats Cards */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Total Interactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{interactions.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">This session</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Favorites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{favorites.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Products saved</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Search Queries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {interactions.filter((i) => i.type === "search").length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">AI-powered searches</p>
                  </CardContent>
                </Card>
              </div>

              {/* Interaction Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Behavior Tracking Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {interactions.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Eye className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>No interactions yet. Search or browse products to see behavior tracking in action.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {interactions.map((interaction, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <div className={`p-2 rounded-full ${
                              interaction.type === "search" ? "bg-blue-500/10" :
                              interaction.type === "view" ? "bg-green-500/10" :
                              interaction.type === "add_to_cart" ? "bg-orange-500/10" :
                              "bg-red-500/10"
                            }`}>
                              {interaction.type === "search" && <Search className="h-4 w-4 text-blue-500" />}
                              {interaction.type === "view" && <Eye className="h-4 w-4 text-green-500" />}
                              {interaction.type === "add_to_cart" && <ShoppingCart className="h-4 w-4 text-orange-500" />}
                              {interaction.type === "favorite" && <Heart className="h-4 w-4 text-red-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium capitalize">{interaction.type.replace("_", " ")}</div>
                              <div className="text-xs text-muted-foreground">
                                {interaction.query && `Query: "${interaction.query}"`}
                                {interaction.productId && `Product ID: ${interaction.productId}`}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {interaction.timestamp.toLocaleTimeString()}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* API Endpoints Reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    AI Fabric Endpoints Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      { method: "POST", endpoint: "/api/products/search", desc: "Natural language product search" },
                      { method: "GET", endpoint: "/api/products/{id}/similar", desc: "Find similar products" },
                      { method: "GET", endpoint: "/api/products/recommendations", desc: "Personalized recommendations" },
                      { method: "POST", endpoint: "/api/products/interactions", desc: "Track user interaction" },
                      { method: "GET", endpoint: "/api/products/trending", desc: "Get trending products" },
                    ].map((api) => (
                      <div key={api.endpoint} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Badge variant={api.method === "POST" ? "default" : "secondary"} className="text-xs font-mono">
                          {api.method}
                        </Badge>
                        <div>
                          <code className="text-sm font-mono">{api.endpoint}</code>
                          <p className="text-xs text-muted-foreground">{api.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <DemoBackendArchitecture architecture={demoBackendArchitectures.productDiscovery} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDiscoveryEngine;
