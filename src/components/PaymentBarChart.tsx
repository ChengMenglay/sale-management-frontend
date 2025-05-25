"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Order } from "../../type";

type PropsType = {
  filteredData: Order[];
};

const chartColorClassMap: Record<string, string> = {
  Cash: "bg-[hsl(var(--chart-1))]",
  ABA: "bg-[hsl(var(--chart-2))]",
  CreditCard: "bg-gray-400",
};

const chartConfig = {
  Cash: {
    label: "Cash",
    color: "hsl(var(--chart-1))",
    class: "bg-[hsl(var(--chart-1))]",
  },
  ABA: {
    label: "ABA",
    color: "hsl(var(--chart-2))",
    class: "bg-[hsl(var(--chart-2))]",
  },
  CreditCard: {
    label: "Credit Card",
    color: "hsl(var(--chart-3))",
    class: "bg-[hsl(var(--chart-3))]",
  },
} satisfies ChartConfig & {
  [key: string]: { label: string; color: string; class: string };
};

export function PaymentBarChart({ filteredData }: PropsType) {
  // Count orders per payment method
  const paymentCounts: Record<string, number> = {};

  filteredData.forEach((order) => {
    const method = order.payment_method || "Unknown";
    paymentCounts[method] = (paymentCounts[method] || 0) + 1;
  });

  // Convert to chart data
  const chartData = Object.entries(paymentCounts).map(([method, count]) => ({
    browser: method,
    visitors: count,
    fill: chartConfig[method as keyof typeof chartConfig]?.color || "#ccc",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-60 w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
            width={600}
            height={chartData.length * 60}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-4 pt-4">
        {Object.entries(chartConfig).map(([key, { label }]) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <div
              className={`h-3 w-3 rounded-full ${
                chartColorClassMap[key] || "bg-gray-400"
              }`}
            />
            <span>{label}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
