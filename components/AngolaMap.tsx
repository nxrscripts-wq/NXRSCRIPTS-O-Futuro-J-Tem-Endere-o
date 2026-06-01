import React, { useState } from 'react';
import { Province } from '../types';
import { MapPin } from 'lucide-react';

const PROVINCES_DATA = [
  { id: 'cabinda', name: 'Cabinda', cx: 65, cy: 35 },
  { id: 'zaire', name: 'Zaire', cx: 85, cy: 75 },
  { id: 'uige', name: 'Uíge', cx: 145, cy: 85 },
  { id: 'luanda', name: 'Luanda', cx: 80, cy: 145 },
  { id: 'bengo', name: 'Bengo', cx: 110, cy: 140 },
  { id: 'kwanza_norte', name: 'Cuanza Norte', cx: 160, cy: 125 },
  { id: 'malanje', name: 'Malanje', cx: 200, cy: 115 },
  { id: 'lunda_norte', name: 'Lunda Norte', cx: 265, cy: 95 },
  { id: 'lunda_sul', name: 'Lunda Sul', cx: 270, cy: 160 },
  { id: 'kwanza_sul', name: 'Cuanza Sul', cx: 145, cy: 185 },
  { id: 'benguela', name: 'Benguela', cx: 110, cy: 240 },
  { id: 'huambo', name: 'Huambo', cx: 175, cy: 245 },
  { id: 'bie', name: 'Bié', cx: 220, cy: 240 },
  { id: 'moxico', name: 'Moxico', cx: 280, cy: 235 },
  { id: 'namibe', name: 'Namibe', cx: 100, cy: 315 },
  { id: 'huila', name: 'Huíla', cx: 165, cy: 320 },
  { id: 'cunene', name: 'Cunene', cx: 175, cy: 390 },
  { id: 'cuando_cubango', name: 'Cuando Cubango', cx: 265, cy: 340 },
];

const STATUS_COLORS = {
  active: { fill: '#164e63', stroke: '#06b6d4', label: 'Activo' },
  partial: { fill: '#1e3a5f', stroke: '#3b82f6', label: 'Parcial' },
  planned: { fill: '#3b2f1a', stroke: '#d97706', label: 'Planeado' },
  none: { fill: '#1e293b', stroke: '#334155', label: 'Sem cobertura' },
  luanda: { fill: '#0e4f6e', stroke: '#00e5ff', label: 'Activo' }, // sede
};

interface AngolaMapProps {
  provinces: Province[];
  onProvinceClick?: (id: string) => void;
  interactive?: boolean;
}

const AngolaMap: React.FC<AngolaMapProps> = ({
  provinces,
  onProvinceClick,
  interactive = false,
}) => {
  const [hoveredProv, setHoveredProv] = useState<string | null>(null);

  const getProvinceData = (id: string) => {
    return (
      provinces.find(p => p.province_id === id) || {
        province_id: id,
        status: 'none' as const,
        services: [],
        note: null,
      }
    );
  };

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[4/5] font-sans">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
      >
        <rect width="400" height="500" fill="#0f172a" rx="16" />

        {/* Coastal / Border Approximation */}
        <path
          d="M 50,30 Q 150,20 280,40 T 350,200 Q 350,400 280,450 T 80,450 Q 50,300 70,180 T 50,30 Z"
          fill="none"
          stroke="#1e293b"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {PROVINCES_DATA.map(prov => {
          const data = getProvinceData(prov.id);
          const isLuanda = prov.id === 'luanda';
          const isHovered = hoveredProv === prov.id;

          let color =
            STATUS_COLORS[data.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.none;
          if (isLuanda && data.status === 'active') color = STATUS_COLORS.luanda;

          const isClickable = interactive || data.status !== 'none';

          return (
            <g
              key={prov.id}
              onMouseEnter={() => setHoveredProv(prov.id)}
              onMouseLeave={() => setHoveredProv(null)}
              onClick={() => {
                if (interactive && onProvinceClick) onProvinceClick(prov.id);
              }}
              className={`${isClickable ? 'cursor-pointer' : 'cursor-default'} transition-all duration-300`}
            >
              <circle
                cx={prov.cx}
                cy={prov.cy}
                r={isHovered ? 23 : 20}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth={isLuanda ? 2.5 : 1.5}
                className="transition-all duration-300"
                style={
                  isHovered && data.status !== 'none'
                    ? { filter: `drop-shadow(0 0 8px ${color.stroke})` }
                    : {}
                }
              />
              <text
                x={prov.cx}
                y={prov.cy + (isHovered ? 34 : 31)}
                textAnchor="middle"
                fontSize="10"
                fontWeight={isLuanda ? 'bold' : 'normal'}
                fill={isHovered ? '#f8fafc' : '#94a3b8'}
                className="pointer-events-none transition-all duration-300 font-mono tracking-tighter"
              >
                {prov.name}
              </text>
              {isLuanda && (
                <circle
                  cx={prov.cx}
                  cy={prov.cy}
                  r={4}
                  fill="#00e5ff"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredProv && (
        <div className="absolute top-4 left-4 right-4 pointer-events-none">
          {(() => {
            const staticData = PROVINCES_DATA.find(p => p.id === hoveredProv) || PROVINCES_DATA[0];
            const data = getProvinceData(hoveredProv);
            const color =
              STATUS_COLORS[data.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.none;

            return (
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl shadow-cyan-900/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-bold text-sm flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    {staticData.name}
                  </h4>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded border font-mono uppercase tracking-wider"
                    style={{
                      borderColor: color.stroke,
                      color: color.stroke,
                      backgroundColor: `${color.fill}80`,
                    }}
                  >
                    {color.label}
                  </span>
                </div>

                {data.status !== 'none' && data.services && data.services.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Serviços:</p>
                    <ul className="text-xs text-slate-300 space-y-0.5">
                      {data.services.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-1 h-1 rounded-full bg-slate-500 mr-2" />
                          {s}
                        </li>
                      ))}
                      {data.services.length > 3 && (
                        <li className="text-slate-500 text-[10px] italic pt-0.5">
                          E mais {data.services.length - 3} serviço(s)...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {data.status === 'none' && !interactive && (
                  <p className="text-xs text-slate-500 mt-1">
                    Nenhuma infraestrutura activa nesta região.
                  </p>
                )}

                {interactive && (
                  <p className="text-[10px] text-slate-400 mt-2 italic font-mono border-t border-slate-800 pt-1">
                    Clique para editar cobertura
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-3 pointer-events-none">
        <div className="flex items-center text-[10px] text-slate-400 font-mono">
          <span className="w-2.5 h-2.5 rounded bg-[#164e63] border border-[#06b6d4] mr-1.5" />{' '}
          Activo
        </div>
        <div className="flex items-center text-[10px] text-slate-400 font-mono">
          <span className="w-2.5 h-2.5 rounded bg-[#1e3a5f] border border-[#3b82f6] mr-1.5" />{' '}
          Parcial
        </div>
        <div className="flex items-center text-[10px] text-slate-400 font-mono">
          <span className="w-2.5 h-2.5 rounded bg-[#3b2f1a] border border-[#d97706] mr-1.5" />{' '}
          Planeado
        </div>
        <div className="flex items-center text-[10px] text-slate-400 font-mono">
          <span className="w-2.5 h-2.5 rounded bg-[#1e293b] border border-[#334155] mr-1.5" /> Sem
          cobertura
        </div>
      </div>
    </div>
  );
};

export default AngolaMap;
