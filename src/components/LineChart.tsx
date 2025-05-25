"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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
import { isAfter, isBefore, subYears } from "date-fns";
import { useMemo } from "react";

type LineChartComponentProps = {
  filteredOrders: Order[];
};

const chartConfig = {
  desktop: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function LineChartComponent({
  filteredOrders,
}: LineChartComponentProps) {
  const chartData = useMemo(() => {
    return monthLabels.map((month, index) => {
      const total = filteredOrders
        .filter((order) => new Date(order.created_at).getMonth() === index)
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      return {
        month,
        desktop: total,
      };
    });
  }, [filteredOrders]);

  const now = new Date();
  const oneYearAgo = subYears(now, 1);
  const twoYearsAgo = subYears(now, 2);

  // Revenue for last 12 months
  const currentYearRevenue = filteredOrders
    .filter((order) => {
      const date = new Date(order.created_at);
      return isAfter(date, oneYearAgo) && isBefore(date, now);
    })
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  // Revenue for the previous year (year before the current 12 months)
  const lastYearRevenue = filteredOrders
    .filter((order) => {
      const date = new Date(order.created_at);
      return isAfter(date, twoYearsAgo) && isBefore(date, oneYearAgo);
    })
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  // Calculate percent change
  const percentChange =
    lastYearRevenue === 0
      ? 0
      : ((currentYearRevenue - lastYearRevenue) / lastYearRevenue) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Revenue - Last 12 Months</CardTitle>
        <CardDescription>Monthly breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <ChartContainer config={chartConfig} className="h-60 w-full">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 12, right: 12 }}
                  width={700} // Ensure this matches the min-width
                  height={180}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="desktop"
                    type="linear"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending {percentChange >= 0 ? "up" : "down"} by{" "}
          {Math.abs(percentChange).toFixed(1)}%{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue for the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
}
