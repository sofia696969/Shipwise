'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// we will fetch these from recharts after mount
let LazyBarChart: any;
let LazyBar: any;
let LazyXAxis: any;
let LazyYAxis: any;
let LazyCartesianGrid: any;
let LazyTooltip: any;
let LazyResponsiveContainer: any;
let LazyPieChart: any;
let LazyPie: any;
let LazyCell: any;

const pieColors = [
  "hsl(200, 98%, 39%)",
  "hsl(0, 72%, 50%)",
  "hsl(215, 16%, 46%)",
];

export interface DashboardChartsProps {
  carrierData: { name: string; score: number }[];
  statusData: { name: string; value: number }[];
}

export default function DashboardCharts({ carrierData, statusData }: DashboardChartsProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // dynamically load recharts only on the client after React is initialized
    import("recharts").then((mod) => {
      LazyBarChart = mod.BarChart;
      LazyBar = mod.Bar;
      LazyXAxis = mod.XAxis;
      LazyYAxis = mod.YAxis;
      LazyCartesianGrid = mod.CartesianGrid;
      LazyTooltip = mod.Tooltip;
      LazyResponsiveContainer = mod.ResponsiveContainer;
      LazyPieChart = mod.PieChart;
      LazyPie = mod.Pie;
      LazyCell = mod.Cell;
      setReady(true);
    });
  }, []);

  if (!ready) {
    // placeholder while recharts loads
    return <div className="h-64 flex items-center justify-center">Loading charts…</div>;
  }

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" /> Carrier Reliability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LazyResponsiveContainer width="100%" height={240}>
            <LazyBarChart data={carrierData}>
              <LazyCartesianGrid strokeDasharray="3 3" stroke="hsl(212, 26%, 83%)" />
              <LazyXAxis
                dataKey="name"
                fontSize={12}
                tick={{ fill: "hsl(215, 16%, 46%)" }}
              />
              <LazyYAxis
                domain={[70, 100]}
                fontSize={12}
                tick={{ fill: "hsl(215, 16%, 46%)" }}
              />
              <LazyTooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(212, 26%, 83%)",
                  fontSize: 12,
                }}
              />
              <LazyBar
                dataKey="score"
                fill="hsl(200, 98%, 39%)"
                radius={[4, 4, 0, 0]}
              />
            </LazyBarChart>
          </LazyResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipment Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <LazyResponsiveContainer width="100%" height={200}>
            <LazyPieChart>
              <LazyPie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                fontSize={11}
              >
                {statusData.map((_, i) => (
                  <LazyCell key={i} fill={pieColors[i]} />
                ))}
              </LazyPie>
              <LazyTooltip />
            </LazyPieChart>
          </LazyResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
