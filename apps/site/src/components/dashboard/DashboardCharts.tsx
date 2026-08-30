"use client";

import { TrendingUp, Users, Calendar, Handshake } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  memberGrowth: { month: string; count: number; cumulative: number }[];
  totalMembers: number;
  membersThisMonth: number;
  eventsThisMonth: number;
  eventsOverall: number;
  eventsByMonth: { month: string; monthLabel: string; virtual: number; irl: number }[];
  gdpByMonth: { month: string; monthLabel: string; gdp: number }[];
  totalAttendees: number;
  totalPartners: number;
  gdpBroughtMalaysia: { overall: number; thisMonth: number };
  grantsAwarded: { overall: number; thisMonth: number };
  bountiesRewarded: number;
  bountiesSource: string;
}

const memberChartConfig = {
  cumulative: {
    label: "Total Members",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const gdpChartConfig = {
  gdp: {
    label: "GDP",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const eventsChartConfig = {
  virtual: {
    label: "Virtual",
    color: "var(--chart-1)",
  },
  irl: {
    label: "IRL",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonth(key: string) {
  const [y, m] = key.split("-");
  const monthIdx = parseInt(m || "1", 10) - 1;
  return `${MONTHS[monthIdx] ?? ""} ${y?.slice(2) ?? ""}`;
}

type ChartRange = "6m" | "1y" | "all";

function sliceByRange<T>(arr: T[], range: ChartRange): T[] {
  if (range === "all") return arr;
  const n = range === "6m" ? 6 : 12;
  return arr.slice(-n);
}

export function DashboardCharts({ stats, range = "6m" }: { stats: DashboardStats; range?: ChartRange }) {
  const formatCurrency = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;

  const memberGrowthFiltered = sliceByRange(stats.memberGrowth ?? [], range);
  const eventsByMonthFiltered = sliceByRange(stats.eventsByMonth ?? [], range);
  const gdpByMonthFiltered = sliceByRange(stats.gdpByMonth ?? [], range);

  const gdpChartData = gdpByMonthFiltered.map(({ monthLabel, gdp }) => ({
    month: monthLabel,
    gdp,
  }));

  const eventsChartData = eventsByMonthFiltered.map(({ monthLabel, virtual, irl }) => ({
    month: monthLabel,
    virtual,
    irl,
  }));

  return (
    <div className="space-y-4">
      {/* Total Members, Events, Partners */}
      <div className="flex flex-row  gap-3">
        <Card className="py-3 grow">
          <CardHeader className="p-0 px-4 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Members
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <p className="text-xl font-bold">{stats.totalMembers}</p>
          </CardContent>
        </Card>
        <Card className="py-3 grow">
          <CardHeader className="p-0 px-4 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Total Events
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <p className="text-xl font-bold">{stats.eventsOverall}</p>
          </CardContent>
        </Card>
        <Card className="py-3 grow">
          <CardHeader className="p-0 px-4 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Handshake className="w-4 h-4" /> Total Partners
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <p className="text-xl font-bold">{stats.totalPartners}</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary cards - compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="py-3">
          <CardHeader className="p-0 px-4 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">GDP Brought to Malaysia</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <p className="text-xl font-bold">{formatCurrency(stats.gdpBroughtMalaysia.overall)}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.gdpBroughtMalaysia.thisMonth)} this month</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardHeader className="p-0 px-4 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Grants Awarded</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <p className="text-xl font-bold">{stats.grantsAwarded.overall}</p>
            <p className="text-xs text-muted-foreground">{stats.grantsAwarded.thisMonth} this month</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardHeader className="p-0 px-4 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Bounties Rewarded</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <p className="text-xl font-bold">{formatCurrency(stats.bountiesRewarded)}</p>
            <p className="text-xs text-muted-foreground">
              <a href="https://superteam.fun/earn/s/superteammalaysia" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">superteam.fun</a>
            </p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardHeader className="p-0 px-4 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <p className="text-xl font-bold">{stats.totalAttendees}</p>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>
      </div>

      {/* GDP contributed to Malaysia - Area chart */}
      {gdpChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>GDP Contributed to Malaysia</CardTitle>
            <CardDescription>
              Cumulative GDP contributed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={gdpChartConfig} className="aspect-auto h-[140px] w-full">
              <AreaChart
                accessibilityLayer
                data={gdpChartData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} tickFormatter={(v) => formatCurrency(v)} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" formatter={(value) => [formatCurrency(Number(value)), "GDP"]} />}
                />
                <Area
                  dataKey="gdp"
                  type="natural"
                  fill="var(--color-gdp)"
                  fillOpacity={0.4}
                  stroke="var(--color-gdp)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Total: {formatCurrency(stats.gdpBroughtMalaysia.overall)} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  {range === "6m" && "Last 6 months"}
                  {range === "1y" && "Last 12 months"}
                  {range === "all" && "All time"}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Member growth + Events held - same row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Member growth - Line chart like shadcn */}
        {memberGrowthFiltered.length > 0 && (
          <Card className="py-3">
            <CardHeader className="px-4 pb-2">
              <CardTitle className="text-sm">Member Growth</CardTitle>
              <p className="text-xs text-muted-foreground">Cumulative members over time</p>
            </CardHeader>
            <CardContent className="px-4 pt-0">
              <ChartContainer config={memberChartConfig} className="aspect-auto h-[120px] w-full">
                <LineChart data={memberGrowthFiltered} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    tickFormatter={formatMonth}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={6} width={28} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(v) => formatMonth(String(v))}
                        formatter={(value) => [value, "Members"]}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="var(--color-cumulative)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-cumulative)", r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Events - stacked bar chart: virtual vs IRL by month */}
        <Card className="py-3">
        <CardHeader className="px-4 pb-2">
          <CardTitle className="text-sm">Events Held</CardTitle>
          <CardDescription>Virtual vs IRL by month</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pt-0">
          <ChartContainer config={eventsChartConfig} className="aspect-auto h-[140px] w-full">
            <BarChart accessibilityLayer data={eventsChartData} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(v) => v}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={6} width={28} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={(props) => <ChartLegendContent payload={props.payload} verticalAlign={props.verticalAlign} />} />
              <Bar
                dataKey="virtual"
                stackId="a"
                fill="var(--color-virtual)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="irl"
                stackId="a"
                fill="var(--color-irl)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 px-4 pb-4 pt-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            {stats.eventsThisMonth} events this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            {range === "6m" && "Showing events for the last 6 months"}
            {range === "1y" && "Showing events for the last 12 months"}
            {range === "all" && "Showing all events"}
          </div>
        </CardFooter>
        </Card>
      </div>
    </div>
  );
}
