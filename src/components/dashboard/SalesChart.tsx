import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";

const salesData = [
  { month: "Jan", actual: 4200, predicted: 4100 },
  { month: "Feb", actual: 3800, predicted: 3900 },
  { month: "Mar", actual: 5100, predicted: 4800 },
  { month: "Apr", actual: 4600, predicted: 4700 },
  { month: "May", actual: 5400, predicted: 5200 },
  { month: "Jun", actual: 6200, predicted: 5800 },
  { month: "Jul", actual: null, predicted: 6400 },
  { month: "Aug", actual: null, predicted: 6800 },
  { month: "Sep", actual: null, predicted: 7100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-card border border-border p-3 shadow-elevated">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="h-2 w-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              ${entry.value?.toLocaleString() || "—"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SalesChart = () => {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card border border-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Sales & Demand Forecast</h3>
        <p className="text-sm text-muted-foreground">Historical data with ML-powered predictions</p>
      </div>
      
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Sales"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              fill="url(#actualGradient)"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              name="Predicted Demand"
              stroke="hsl(199, 89%, 48%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#predictedGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
