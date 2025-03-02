'use client';

import { format, parseISO } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@radix-ui/themes';

type StatsData = {
  month: string;
  created: number;
  fulfilled: number;
}[];

type RequestsChartProps = {
  stats: StatsData;
  isLoading?: boolean;
};

const chartConfig = {
  created: {
    label: 'Created',
    color: 'hsl(var(--chart-1))',
  },
  fulfilled: {
    label: 'Fulfilled',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function RequestsChart({ stats, isLoading }: RequestsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fulfilled and created requests</CardTitle>
        <CardDescription>Last 12 months overview</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={stats}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  format(parseISO(`${value}-01`), 'MMM')
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="fulfilled"
                type="monotone"
                fill="var(--color-fulfilled)"
                fillOpacity={0.4}
                stroke="var(--color-fulfilled)"
                stackId="a"
              />
              <Area
                dataKey="created"
                type="monotone"
                fill="var(--color-created)"
                fillOpacity={0.4}
                stroke="var(--color-created)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
