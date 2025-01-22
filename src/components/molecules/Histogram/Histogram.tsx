"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DataDistributions } from "@/types/types";

const generateChartConfig = (data: Record<string, number>): ChartConfig => {
  const config: ChartConfig = {};
  Object.keys(data).forEach((key) => {
    config[key] = {
      label: key,
      color: "var(--chart-1)",
    };
  });
  return config;
};

export const Histogram = ({
  data,
  hideXAxis = true,
  className,
}: {
  data: Record<string, number>;
  hideXAxis?: boolean;
  className?: string;
}) => {

  console.log("row[col]");
  console.log(data);
  const chartConfig = generateChartConfig(data);
  const chartData = Object.entries(data).map(([key, value]) => ({
    key,
    value,
  }));

  console.log("CHART DATA ", chartData);
  return (
    <ChartContainer config={chartConfig} className={`h-[120px] ${className}`}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="key"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          hide
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--chart-1)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
