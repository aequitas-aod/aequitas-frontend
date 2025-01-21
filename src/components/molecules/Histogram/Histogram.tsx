"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ParsedDistribution } from "@/types/types";

const generateChartConfig = (data: ParsedDistribution): ChartConfig => {
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
  data: ParsedDistribution;
  hideXAxis?: boolean;
  className?: string;
}) => {
  const chartConfig = generateChartConfig(data);
  const keys: string[] = data.keys
  const values: number[] = data.values
  const chartData: { key: string; value: number }[] = []

  for (const [index, key] of keys.entries()) {
    console.log(`INDEX: ${index}, KEY: ${key}`);
    chartData.push({ key, value: values[index] });
  }

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
