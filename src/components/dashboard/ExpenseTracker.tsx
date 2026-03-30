import { useState } from "react";
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
}

const ExpenseTracker = () => {
  const { t } = useLanguage();
  const [addOpen, setAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const revenue = 62400;
  const expenseData: Expense[] = [
    { id: 1, category: "expense.rent", amount: 8000, date: "2026-03-01" },
    { id: 2, category: "expense.rawMaterials", amount: 28000, date: "2026-03-15" },
    { id: 3, category: "expense.salaries", amount: 12000, date: "2026-03-01" },
    { id: 4, category: "expense.utilities", amount: 2500, date: "2026-03-10" },
    { id: 5, category: "expense.transport", amount: 3200, date: "2026-03-20" },
  ];

  const totalExpenses = expenseData.reduce((sum, e) => sum + e.amount, 0);
  const profit = revenue - totalExpenses;
  const profitMargin = ((profit / revenue) * 100).toFixed(1);

  const handleAdd = () => {
    if (!newCategory || !newAmount) return;
    toast.success(t("expense.added"), { description: `${t(newCategory)} - ₹${newAmount}` });
    setAddOpen(false);
    setNewCategory("");
    setNewAmount("");
  };

  const categories = ["expense.rent", "expense.rawMaterials", "expense.salaries", "expense.utilities", "expense.transport", "expense.marketing"];

  return (
    <div className="rounded-xl bg-card p-6 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
            <Wallet className="h-4 w-4 text-chart-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t("expense.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("expense.subtitle")}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-3 w-3 mr-1" />
          {t("expense.add")}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-[10px] text-muted-foreground mb-1">{t("expense.revenue")}</p>
          <p className="text-lg font-bold text-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-accent" />₹{(revenue / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-[10px] text-muted-foreground mb-1">{t("expense.expenses")}</p>
          <p className="text-lg font-bold text-foreground flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-destructive" />₹{(totalExpenses / 1000).toFixed(1)}k
          </p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-[10px] text-muted-foreground mb-1">{t("expense.netProfit")}</p>
          <p className="text-lg font-bold text-foreground flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-primary" />₹{(profit / 1000).toFixed(1)}k
          </p>
          <p className="text-[10px] text-accent">{profitMargin}% {t("expense.margin")}</p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="space-y-2">
        {expenseData.map((expense) => {
          const percent = ((expense.amount / totalExpenses) * 100).toFixed(0);
          return (
            <div key={expense.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{t(expense.category)}</p>
                  <p className="text-sm font-semibold text-foreground">₹{expense.amount.toLocaleString()}</p>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("expense.addTitle")}</DialogTitle>
            <DialogDescription>{t("expense.addDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t("expense.selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{t(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" placeholder={t("expense.amount")} value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setAddOpen(false)}>{t("records.cancel")}</Button>
              <Button className="flex-1" onClick={handleAdd}>{t("expense.add")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseTracker;
