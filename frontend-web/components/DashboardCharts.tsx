'use client';

import React from "react";

type Carrier = { name: string; score: number };
type Status = { name: string; value: number };

interface Props {
  carrierData: Carrier[];
  statusData: Status[];
}

const palette = ["#1d4ed8", "#0f766e", "#f59e0b", "#dc2626", "#7c3aed"];

const DashboardCharts: React.FC<Props> = ({ carrierData, statusData }) => {
  const total = statusData.reduce((sum, status) => sum + status.value, 0) || 1;
  const topCarrierScore = Math.max(...carrierData.map((carrier) => carrier.score), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Carrier Performance
            </p>
            <h3 className="mt-2 text-lg font-bold text-slate-950">Reliability snapshot</h3>
          </div>
          <p className="text-sm text-slate-500">{carrierData.length} carriers</p>
        </div>

        <div className="mt-6 space-y-4">
          {carrierData.length === 0 ? (
            <p className="text-sm text-slate-500">No carrier data yet.</p>
          ) : (
            carrierData.map((carrier, index) => {
              const width = Math.max((carrier.score / topCarrierScore) * 100, 10);

              return (
                <div key={carrier.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">{carrier.name}</span>
                    <span className="font-mono text-slate-500">{carrier.score.toFixed(1)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${palette[index % palette.length]}, #7dd3fc)`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Shipment Mix
        </p>
        <h3 className="mt-2 text-lg font-bold text-slate-950">Status distribution</h3>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {statusData.map((status, index) => {
            const pct = Math.round((status.value / total) * 100);

            return (
              <div
                key={status.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div
                  className="mb-4 h-2 rounded-full"
                  style={{ backgroundColor: palette[index % palette.length] }}
                />
                <p className="text-sm font-semibold text-slate-800">{status.name}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{status.value}</p>
                <p className="text-xs text-slate-500">{pct}% of all tracked shipments</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
