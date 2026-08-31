import { Info } from "@phosphor-icons/react";
import { CheckCircle } from "@phosphor-icons/react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface DayData {
  key: string;
  label: string;
  total: number;
  successCount: number;
  failedCount: number;
  successRate: number;
  checks: string[];
  dayStatus: string;
}

export function MonitorCard({
  name,
  url,
  status,
  avgPct,
  daysTracked,
  dailyHealth,
  recentChecks = [],
  theme = "dark",
}: {
  name: string;
  url: string;
  status: string;
  avgPct: number;
  daysTracked: number;
  dailyHealth: DayData[];
  recentChecks?: any[];
  theme?: "light" | "dark";
}) {
  const isLight = theme === "light";
  const responseData = recentChecks
    .filter(c => c.responseTimeMs != null)
    .map(c => {
      const date = new Date(c.checkedAt);
      const hour = date.getHours();
      const timeLabel = hour === 0 ? "12:00am" : hour === 12 ? "12:00pm" : hour > 12 ? `${hour - 12}:00pm` : `${hour}:00am`;
      return {
        time: timeLabel,
        value: c.responseTimeMs / 1000,
        timestamp: date.getTime(),
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-100); // Take the most recent 100 checks so the chart isn't too crowded

  return (
    <div className={isLight ? "pt-6 pb-2 first:pt-2 border-gray-200" : "pt-6 pb-2 first:pt-2 border-[#30363d]"}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {status === "up" ? (
            <CheckCircle weight="fill" className="size-5 text-[#238636]" />
          ) : status === "down" ? (
            <div className="size-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">!</div>
          ) : (
            <div className="size-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs">!</div>
          )}
          <div className="min-w-0">
            <h3 className={isLight ? "truncate text-base font-semibold text-gray-900" : "truncate text-base font-semibold text-white"}>{name}</h3>
            <p className={isLight ? "truncate font-sans text-xs text-gray-500" : "truncate font-sans text-xs text-[#8b949e]"}>{url}</p>
          </div>
          <Info className={isLight ? "size-4 shrink-0 text-gray-400" : "size-4 shrink-0 text-[#8b949e]"} />
        </div>
        <div className={`text-sm font-medium ${avgPct >= 99 ? 'text-[#2ea043]' : avgPct >= 50 ? 'text-[#d29922]' : 'text-[#f85149]'}`}>
          {avgPct.toFixed(3)}% uptime · {daysTracked}d
        </div>
      </div>

      <div className="flex items-center h-8 gap-0.5 w-full">
        {dailyHealth.map(day => (
          <div 
            key={day.key} 
            className={`h-full flex-1 rounded-sm ${day.dayStatus === 'up' ? 'bg-[#238636]' : day.dayStatus === 'degraded' ? 'bg-[#d29922]' : day.dayStatus === 'down' ? 'bg-[#f85149]' : isLight ? 'bg-gray-200' : 'bg-[#30363d]'}`}
            title={`${day.label}: ${day.dayStatus}`} 
          />
        ))}
      </div>

      <div className="mt-6 mb-2">
        <h4 className={isLight ? "text-sm text-gray-500 font-medium mb-4" : "text-sm text-[#8b949e] font-medium mb-4"}>Response times</h4>
        <div className="h-40 w-full" style={{ marginLeft: '-15px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseData}>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isLight ? '#6b7280' : '#8b949e', fontSize: 12 }} 
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isLight ? '#6b7280' : '#8b949e', fontSize: 12 }}
                tickFormatter={(val) => `${val.toFixed(1)} s`}
                domain={[0, 1.2]}
                ticks={[0, 0.3, 0.6, 0.9, 1.2]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#161b22', borderColor: isLight ? '#e5e7eb' : '#30363d', borderRadius: '8px' }}
                itemStyle={{ color: '#5b5bd6' }}
                labelStyle={{ color: isLight ? '#6b7280' : '#8b949e' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#5b5bd6"
                strokeWidth={1.5} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Horizontal grid lines simulation */}
        <div className="relative -mt-32 pointer-events-none h-32 flex flex-col justify-between w-full pl-[50px] pr-2">
           <div className={isLight ? "w-full h-px bg-gray-200" : "w-full h-px bg-[#30363d]/50"}></div>
           <div className={isLight ? "w-full h-px bg-gray-200" : "w-full h-px bg-[#30363d]/50"}></div>
           <div className={isLight ? "w-full h-px bg-gray-200" : "w-full h-px bg-[#30363d]/50"}></div>
           <div className={isLight ? "w-full h-px bg-gray-200" : "w-full h-px bg-[#30363d]/50"}></div>
        </div>
      </div>
    </div>
  );
}
