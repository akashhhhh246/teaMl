import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export function FlavorRadarChart({
  teaActual = { bitterness: 5, sweetness: 5, floral: 5, spice: 3, aroma: 7 },
  userTarget = null,
  height = 280,
}) {
  const data = [
    {
      dimension: 'Aroma',
      Tea: teaActual.aroma ?? teaActual.aromaNotes ?? 7,
      ...(userTarget ? { 'Your Target': userTarget.aroma ?? 7 } : {}),
    },
    {
      dimension: 'Sweetness',
      Tea: teaActual.sweetness ?? 5,
      ...(userTarget ? { 'Your Target': userTarget.sweetness ?? 6 } : {}),
    },
    {
      dimension: 'Floral',
      Tea: teaActual.floral ?? teaActual.floralNotes ?? 5,
      ...(userTarget ? { 'Your Target': userTarget.floral ?? 6 } : {}),
    },
    {
      dimension: 'Spice',
      Tea: teaActual.spice ?? teaActual.spiceLevel ?? 3,
      ...(userTarget ? { 'Your Target': userTarget.spice ?? 3 } : {}),
    },
    {
      dimension: 'Body & Strength',
      Tea: teaActual.bitterness ?? 4,
      ...(userTarget ? { 'Your Target': userTarget.bitterness ?? 5 } : {}),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="rgba(156, 163, 175, 0.3)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 500 }}
            className="text-slate-600 dark:text-slate-400"
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="rgba(156, 163, 175, 0.2)" tick={false} />

          <Radar
            name="Tea Blend Profile"
            dataKey="Tea"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
            strokeWidth={2}
          />

          {userTarget && (
            <Radar
              name="Your Taste Target"
              dataKey="Your Target"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.25}
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          )}

          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          {userTarget && <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
