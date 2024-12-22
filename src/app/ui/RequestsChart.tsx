'use client';

import { TrendingUp } from 'lucide-react';
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
const chartData = [
  { month: 'January', created: 186, fulfilled: 80 },
  { month: 'February', created: 250, fulfilled: 160 },
  { month: 'March', created: 320, fulfilled: 220 },
  { month: 'April', created: 150, fulfilled: 130 },
  { month: 'May', created: 290, fulfilled: 250 },
  { month: 'June', created: 310, fulfilled: 270 },
  { month: 'July', created: 220, fulfilled: 180 },
  { month: 'August', created: 240, fulfilled: 200 },
  { month: 'September', created: 300, fulfilled: 280 },
  { month: 'October', created: 270, fulfilled: 250 },
  { month: 'November', created: 310, fulfilled: 290 },
  { month: 'December', created: 400, fulfilled: 350 },
];

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

export function RequestsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fulfilled and created requests</CardTitle>
        <CardDescription>Last 12 months overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="fulfilled"
              type="natural"
              fill="var(--color-fulfilled)"
              fillOpacity={0.4}
              stroke="var(--color-fulfilled)"
              stackId="a"
            />
            <Area
              dataKey="created"
              type="natural"
              fill="var(--color-created)"
              fillOpacity={0.4}
              stroke="var(--color-created)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/*<CardFooter>*/}
      {/*    <div className="flex w-full items-start gap-2 text-sm">*/}
      {/*        <div className="grid gap-2">*/}
      {/*            <div className="flex items-center gap-2 font-medium leading-none">*/}
      {/*                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />*/}
      {/*            </div>*/}
      {/*            <div className="flex items-center gap-2 leading-none text-muted-foreground">*/}
      {/*                January - June 2024*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</CardFooter>*/}
    </Card>
  );
}
