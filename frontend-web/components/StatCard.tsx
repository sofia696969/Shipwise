import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Trend {
  value: string;
  positive?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<any>;
  subtitle?: string;
  trend?: Trend;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
}) => (
  <Card className="overflow-hidden border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-1">
      <div className="text-3xl font-black text-slate-950">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      {trend && (
        <div
          className={`text-xs font-medium ${
            trend.positive ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend.value}
        </div>
      )}
    </CardContent>
  </Card>
);

export default StatCard;
