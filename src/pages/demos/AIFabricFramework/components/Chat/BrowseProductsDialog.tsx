import { motion } from "framer-motion";
import { Package, Laptop, Headphones, Tablet, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BrowseProductsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (query: string, label: string) => void;
}

export function BrowseProductsDialog({
  isOpen,
  onClose,
  onSelect,
}: BrowseProductsDialogProps) {
  const categories = [
    {
      id: "laptops",
      icon: Laptop,
      label: "High-Performance Laptops",
      query: "Action: List product: Laptops for high performance",
      color: "from-blue-500 to-cyan-500",
      description: "Powerful machines for work & gaming",
    },
    {
      id: "headphones",
      icon: Headphones,
      label: "iPhone-Compatible Headphones",
      query: "Action: List product: headphones compatible with iPhone",
      color: "from-purple-500 to-pink-500",
      description: "Premium audio for your Apple devices",
    },
    {
      id: "tablets",
      icon: Tablet,
      label: "Samsung Tablets",
      query: "Action: List product: tablet from Samsung",
      color: "from-green-500 to-emerald-500",
      description: "Versatile tablets for productivity",
    },
    {
      id: "cameras",
      icon: Camera,
      label: "Sony Cameras",
      query: "Action: List product: Sony cameras",
      color: "from-orange-500 to-red-500",
      description: "Professional photography equipment",
    },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-background rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border-2 border-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Package className="h-6 w-6" />
              Browse Products
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Explore our curated collections
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg"
                    onClick={() => {
                      onSelect(category.query, category.label);
                      onClose();
                    }}
                  >
                    <CardContent className="p-0">
                      <div
                        className={`h-24 bg-gradient-to-br ${category.color} flex items-center justify-center relative overflow-hidden`}
                      >
                        <Icon className="h-12 w-12 text-white/90 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base mb-1">
                          {category.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Fun Fact */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              💡 <span className="font-semibold">Pro Tip:</span> Our AI can help
              you find the perfect product based on your needs!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
