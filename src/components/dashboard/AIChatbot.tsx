import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
}

const quickResponses: Record<string, string> = {
  "sales": "📊 This week's sales: ₹14,560 (+12% vs last week). Top seller: Rice 5kg Bag (₹4,200). Daily average: ₹2,080.",
  "restock": "📦 Items to restock:\n• Rice 5kg Bag — 30 units left (3 days)\n• Organic Milk 1L — 8 units left (1 day)\n• Fresh Paneer — OUT OF STOCK\n• Brown Bread — 15 units left (5 days)",
  "profit": "💰 Monthly Profit Summary:\n• Revenue: ₹62,400\n• Expenses: ₹53,700\n• Net Profit: ₹8,700 (13.9% margin)\n• Growth: +18.2% vs last month",
  "forecast": "🔮 7-Day Forecast: ₹48,200 expected revenue\n• Demand trending UP (+12%)\n• Confidence: 94.2%\n• Peak day: Saturday\n• Top predicted: Rice 5kg, Cooking Oil",
  "best": "🏆 Best Selling Products (This Month):\n1. Rice 5kg Bag — ₹12,400\n2. Cooking Oil 1L — ₹11,800\n3. Dal Toor 1kg — ₹9,200\n4. Wheat Flour 10kg — ₹8,600",
  "expense": "💸 Expense Breakdown:\n• Raw Materials: ₹28,000 (52%)\n• Salaries: ₹12,000 (22%)\n• Rent: ₹8,000 (15%)\n• Transport: ₹3,200 (6%)\n• Utilities: ₹2,500 (5%)",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("sale") || lower.includes("week") || lower.includes("revenue")) return quickResponses.sales;
  if (lower.includes("restock") || lower.includes("stock") || lower.includes("inventory")) return quickResponses.restock;
  if (lower.includes("profit") || lower.includes("margin") || lower.includes("loss")) return quickResponses.profit;
  if (lower.includes("forecast") || lower.includes("predict") || lower.includes("demand")) return quickResponses.forecast;
  if (lower.includes("best") || lower.includes("top") || lower.includes("popular")) return quickResponses.best;
  if (lower.includes("expense") || lower.includes("cost") || lower.includes("spend")) return quickResponses.expense;
  return "🤖 I can help with:\n• \"Show my sales this week\"\n• \"Which product should I restock?\"\n• \"What's my profit?\"\n• \"Show forecast\"\n• \"Best selling products\"\n• \"Show expenses\"";
}

const AIChatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", content: t("chatbot.welcome") },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const response = getResponse(input);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", content: response }]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-elevated bg-chart-5 hover:bg-chart-5/90 transition-all hover:scale-110 p-0"
        aria-label={t("chatbot.title")}
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-elevated flex flex-col overflow-hidden animate-fade-in" style={{ height: "480px" }}>
      {/* Header */}
      <div className="gradient-primary p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary-foreground" />
          <div>
            <p className="font-semibold text-primary-foreground text-sm">{t("chatbot.title")}</p>
            <p className="text-[10px] text-primary-foreground/70">{t("chatbot.subtitle")}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "bot" && (
              <div className="h-6 w-6 rounded-full bg-chart-5/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-3 w-3 text-chart-5" />
              </div>
            )}
            <div className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-line ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatbot.placeholder")}
            className="text-sm"
          />
          <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbot;
