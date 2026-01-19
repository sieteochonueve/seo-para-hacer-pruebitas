import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'lg' | 'hero';
  onClick?: () => void;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, size = 'sm', onClick }) => {
  const getColor = (val: number) => {
    if (val >= 80) return '#6B72F0'; // Oracle Blue
    if (val >= 50) return '#9F7AEA'; // Oracle Purple
    return '#F87171'; // Oracle Red
  };

  const themeColor = getColor(score);
  const data = [{ name: 'score', value: score, fill: themeColor }];
  
  const config = {
    hero: { container: 'h-48 w-48', font: 'text-4xl', bar: 12 },
    lg: { container: 'h-40 w-40', font: 'text-3xl', bar: 10 },
    sm: { container: 'h-24 w-24', font: 'text-xl', bar: 6 }
  }[size];

  return (
    <div 
      className={`flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`relative ${config.container}`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="75%" 
            outerRadius="100%" 
            barSize={config.bar} 
            data={data} 
            startAngle={90} 
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#E5E7EB' }}
              dataKey="value"
              cornerRadius={config.bar / 2}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-bold tracking-tight text-[#333333] ${config.font}`}>
            {score}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
