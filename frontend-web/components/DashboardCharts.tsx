'use client';

import React from "react";

type Carrier = { name: string; score: number };
type Status = { name: string; value: number };

interface Props {
  carrierData: Carrier[];
  statusData: Status[];
}

const DashboardCharts: React.FC<Props> = ({ carrierData, statusData }) => {
  const total = statusData.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <div className="space-y-4 col-span-3 lg:col-span-2">
      <div className="bg-card p-4 rounded-md">
        <h3 className="text-sm font-medium">Carrier Reliability</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {carrierData.map((c) => (
            <li key={c.name} className="flex justify-between">
              <span>{c.name}</span>
              <span className="font-mono">{c.score}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card p-4 rounded-md">
        <h3 className="text-sm font-medium">Shipment Status</h3>
        <div className="mt-2 flex gap-2">
          {statusData.map((s) => (
            <div key={s.name} className="flex-1 text-center">
              <div className="text-xs text-muted-foreground">{s.name}</div>
              <div className="text-lg font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{Math.round((s.value / total) * 100)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
