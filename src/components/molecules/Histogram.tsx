"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

export const Histogram = ({ data }: { data: Record<string, number> }) => {
  const chartConfig = generateChartConfig(data);

  const chartData = Object.entries(data).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[120px]">
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
        <Bar dataKey="value" fill="var(--chart-1)" radius={4}></Bar>{" "}
      </BarChart>
    </ChartContainer>
  );
};
