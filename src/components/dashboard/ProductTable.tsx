import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const products = [
  {
    id: 1,
    name: "Organic Milk 1L",
    category: "Dairy",
    currentStock: 45,
    predictedDemand: 78,
    trend: "up",
    confidence: 92,
    status: "low",
  },
  {
    id: 2,
    name: "Whole Wheat Bread",
    category: "Bakery",
    currentStock: 120,
    predictedDemand: 95,
    trend: "stable",
    confidence: 88,
    status: "optimal",
  },
  {
    id: 3,
    name: "Fresh Eggs (12 pack)",
    category: "Dairy",
    currentStock: 200,
    predictedDemand: 180,
    trend: "down",
    confidence: 85,
    status: "optimal",
  },
  {
    id: 4,
    name: "Rice 5kg Bag",
    category: "Grains",
    currentStock: 30,
    predictedDemand: 65,
    trend: "up",
    confidence: 94,
    status: "critical",
  },
  {
    id: 5,
    name: "Cooking Oil 2L",
    category: "Essentials",
    currentStock: 85,
    predictedDemand: 70,
    trend: "stable",
    confidence: 90,
    status: "optimal",
  },
  {
    id: 6,
    name: "Sugar 1kg",
    category: "Essentials",
    currentStock: 150,
    predictedDemand: 120,
    trend: "down",
    confidence: 87,
    status: "high",
  },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-accent" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    critical: { label: "Restock Now", className: "bg-destructive/10 text-destructive border-destructive/20" },
    low: { label: "Low Stock", className: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
    optimal: { label: "Optimal", className: "bg-accent/10 text-accent border-accent/20" },
    high: { label: "Overstock", className: "bg-primary/10 text-primary border-primary/20" },
  };
  
  const { label, className } = config[status as keyof typeof config] || config.optimal;
  
  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {status === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
      {status === "optimal" && <CheckCircle className="h-3 w-3 mr-1" />}
      {label}
    </Badge>
  );
};

const ProductTable = () => {
  return (
    <div className="rounded-xl bg-card shadow-card border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Product Inventory & Predictions</h3>
        <p className="text-sm text-muted-foreground">AI-powered demand forecasts for the next 30 days</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold text-right">Current Stock</TableHead>
            <TableHead className="font-semibold text-right">Predicted Demand</TableHead>
            <TableHead className="font-semibold text-center">Trend</TableHead>
            <TableHead className="font-semibold text-center">Confidence</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="group">
              <TableCell className="font-medium text-foreground">{product.name}</TableCell>
              <TableCell className="text-muted-foreground">{product.category}</TableCell>
              <TableCell className="text-right font-medium">{product.currentStock}</TableCell>
              <TableCell className="text-right">
                <span className="font-semibold text-primary">{product.predictedDemand}</span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <TrendIcon trend={product.trend} />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full gradient-primary transition-all duration-500"
                      style={{ width: `${product.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{product.confidence}%</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={product.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
