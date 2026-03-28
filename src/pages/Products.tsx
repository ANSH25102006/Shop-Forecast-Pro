import Header from "@/components/layout/Header";
import ProductTable from "@/components/dashboard/ProductTable";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Filter } from "lucide-react";
import { useState } from "react";
import AddProductDialog from "@/components/dashboard/AddProductDialog";
import UploadDataDialog from "@/components/dashboard/UploadDataDialog";
import { useLanguage } from "@/contexts/LanguageContext";

type StockFilter = "all" | "optimal" | "low" | "critical" | "high";

const Products = () => {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="products" />
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("products.title")}</h2>
            <p className="text-muted-foreground">{t("products.subtitle")}</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              {t("products.import")}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t("products.export")}
            </Button>
            <Button variant="hero" onClick={() => setAddProductOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("products.addProduct")}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Button 
            variant={stockFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStockFilter("all")}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t("products.allCategories")}
          </Button>
          <Button 
            variant={stockFilter === "optimal" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStockFilter("optimal")}
          >
            {t("products.inStock")}
          </Button>
          <Button 
            variant={stockFilter === "low" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStockFilter("low")}
          >
            {t("products.lowStock")}
          </Button>
          <Button 
            variant={stockFilter === "critical" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStockFilter("critical")}
          >
            {t("products.outOfStock")}
          </Button>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <ProductTable filter={stockFilter} />
        </div>
      </main>

      <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} />
      <UploadDataDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
};

export default Products;
