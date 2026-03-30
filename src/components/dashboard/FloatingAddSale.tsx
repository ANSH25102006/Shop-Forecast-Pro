import { useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const FloatingAddSale = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");

  const products = [
    "Rice 5kg Bag", "Wheat Flour 10kg", "Sugar 1kg", "Cooking Oil 1L",
    "Dal Toor 1kg", "Organic Milk 1L", "Brown Bread", "Eggs (12 pack)",
  ];

  const handleSubmit = () => {
    if (!product || !quantity || !amount) return;
    toast.success(t("sale.recorded"), {
      description: `${product} × ${quantity} — ₹${amount}`,
    });
    setOpen(false);
    setProduct("");
    setQuantity("");
    setAmount("");
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-elevated gradient-primary hover:opacity-90 transition-all hover:scale-110 p-0"
        aria-label={t("sale.addSale")}
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {t("sale.addSale")}
            </DialogTitle>
            <DialogDescription>{t("sale.addSaleDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger>
                <SelectValue placeholder={t("sale.selectProduct")} />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder={t("sale.quantity")} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <Input type="number" placeholder={t("sale.amount")} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>{t("records.cancel")}</Button>
              <Button className="flex-1" onClick={handleSubmit}>{t("sale.record")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingAddSale;
