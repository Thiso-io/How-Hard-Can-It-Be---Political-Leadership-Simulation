import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3-geo';
import { normalizeCountryName } from '../utils/countryData';
import { useAudio } from '../contexts/AudioContext';

interface WorldMapProps {
  onSelect: (countryId: string) => void;
  selectedCountry: string | null;
}

interface GeoFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: any;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onSelect, selectedCountry }) => {
  const [geoData, setGeoData] = useState<GeoFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  
  const { playUiSound } = useAudio();

  // Transform state for Zoom/Pan
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Fetch a reliable GeoJSON source
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then((response) => response.json())
      .then((data) => {
        setGeoData(data.features);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load map data", err);
        setLoading(false);
      });
  }, []);

  // Projection setup
  // 1000x500 base size
  const width = 1000;
  const height = 500;
  
  const projection = d3.geoMercator()
    .scale(120)
    .translate([width / 2, height / 1.5]);

  const pathGenerator = d3.geoPath().projection(projection);

  // Zoom Handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = 1.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    let newScale = transform.k * (direction > 0 ? scaleFactor : 1 / scaleFactor);
    newScale = Math.max(1, Math.min(newScale, 10));
    setTransform(prev => ({ ...prev, k: newScale }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startPoint.x;
    const dy = e.clientY - startPoint.y;
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gov-accent animate-pulse">
        <span className="font-mono text-sm">LOADING GEOSPATIAL DATA...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-900/50 rounded-xl border border-slate-800 relative overflow-hidden group select-none">
      {/* Grid Overlay for Strategy Feel */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10"></div>
      
      <div className="absolute top-4 right-4 z-20 flex gap-2">
         <button 
           onClick={() => { playUiSound('click'); setTransform({k: 1, x: 0, y: 0}); }}
           onMouseEnter={() => playUiSound('hover')}
           className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700"
         >
           RESET VIEW
         </button>
      </div>

      <svg 
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.1))' }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {geoData.map((feature, i) => {
            const rawName = feature.properties.name;
            const normalizedName = normalizeCountryName(rawName);
            const isSelected = selectedCountry === normalizedName;
            const isHovered = hovered === normalizedName;
            
            return (
              <path
                key={`${rawName}-${i}`}
                d={pathGenerator(feature) || undefined}
                className="transition-colors duration-200 ease-out"
                style={{
                  fill: isSelected ? '#22c55e' : (isHovered ? '#38bdf8' : '#1e293b'),
                  stroke: isSelected ? '#86efac' : (isHovered ? '#7dd3fc' : '#334155'),
                  strokeWidth: isSelected || isHovered ? (1.5 / transform.k) : (0.5 / transform.k),
                  fillOpacity: isSelected ? 0.9 : (isHovered ? 0.7 : 1),
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                    e.stopPropagation(); 
                    if (!isSelected) {
                        playUiSound('select');
                    }
                    onSelect(normalizedName);
                }}
                onMouseEnter={() => {
                    if (hovered !== normalizedName) {
                        setHovered(normalizedName);
                        playUiSound('hover');
                    }
                }}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </g>
      </svg>
      
      <div className="absolute bottom-4 left-4 text-xs text-slate-500 font-mono pointer-events-none bg-slate-900/80 p-1 px-2 rounded backdrop-blur-sm">
        <p>PROJECTION: MERCATOR_D3</p>
        <p>DATA_SOURCE: EARTH_GEO_DB</p>
        <p>SCALE: {transform.k.toFixed(2)}x</p>
      </div>
    </div>
  );
};