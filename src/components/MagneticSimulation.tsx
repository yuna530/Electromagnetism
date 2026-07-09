import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { MagSimState } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, ArrowLeftRight } from 'lucide-react';

interface MagneticSimulationProps {
  state: MagSimState;
  setState: Dispatch<SetStateAction<MagSimState>>;
}

export default function MagneticSimulation({ state, setState }: MagneticSimulationProps) {
  const { current, coilRadius, isReversed, zoomScale } = state;
  const [computedB, setComputedB] = useState<number>(133.5);

  // Recalculate Magnetic Field (B) based on Current (I) and Radius (R)
  // Calibrated with scale factor 1575 (representing coil turns N) to match 133.5 mT at I=8.5A, R=63mm
  useEffect(() => {
    if (current === 0) {
      setComputedB(0);
      return;
    }
    const mu0 = 4 * Math.PI * 1e-7;
    const N = 1575; // coil turns calibration factor
    const rMeters = coilRadius / 1000;
    // B = (mu0 * I * N) / (2 * r) -> convert to mT (multiply by 1000)
    const B_mT = ((mu0 * current * N) / (2 * rMeters)) * 1000;
    setComputedB(B_mT);
  }, [current, coilRadius]);

  const handleFlipPolarity = () => {
    setState((prev) => ({ ...prev, isReversed: !prev.isReversed }));
  };

  const handleZoomIn = () => {
    setState((prev) => ({ ...prev, zoomScale: Math.min(prev.zoomScale + 0.1, 1.5) }));
  };

  const handleZoomOut = () => {
    setState((prev) => ({ ...prev, zoomScale: Math.max(prev.zoomScale - 0.1, 0.6) }));
  };

  const handleReset = () => {
    setState({
      current: 10.0,
      coilRadius: 40,
      isReversed: false,
      zoomScale: 1.0,
    });
  };

  // SVG dimensions & responsive view box
  const viewWidth = 1000;
  const viewHeight = 600;

  // Scaling factor for coil group visual rendering
  const coilScale = coilRadius / 40;

  return (
    <div className="flex-1 bg-surface-dim relative flex flex-col p-5 overflow-hidden bg-grid-pattern h-full">
      {/* Top Left Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex gap-1 bg-surface-container-high p-1 rounded-md border border-outline-variant shadow-lg">
        <button
          onClick={handleZoomIn}
          className="px-3 py-1.5 text-on-surface bg-surface-container-lowest border border-outline-variant rounded hover:border-primary-container transition-colors font-mono text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
          확대
        </button>
        <button
          onClick={handleZoomOut}
          className="px-3 py-1.5 text-on-surface bg-surface-container-lowest border border-outline-variant rounded hover:border-primary-container transition-colors font-mono text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
          축소
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-on-surface bg-surface-container-lowest border border-outline-variant rounded hover:border-primary-container transition-colors font-mono text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </button>
      </div>

      {/* Control Overlay (Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
        <div className="bg-surface-container-high border border-outline-variant p-4 rounded-lg flex flex-col gap-4 w-64 shadow-xl backdrop-blur bg-opacity-90">
          <div className="font-mono text-xs font-semibold text-primary-container tracking-wider uppercase">
            시뮬레이션 제어
          </div>

          <button
            onClick={handleFlipPolarity}
            className="w-full py-2 bg-[#1E1E1E] border border-[#333333] text-on-surface font-sans text-sm font-medium rounded hover:border-primary-container transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-primary-container" />
            극성 반전
          </button>

          {/* Current (I) Control */}
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex justify-between items-center">
              <label htmlFor="currentSlider" className="font-mono text-xs text-on-surface-variant">
                전류 (I)
              </label>
              <span className="font-mono text-sm font-semibold text-primary-container">
                {isReversed ? '-' : ''}
                {current.toFixed(1)}{' '}
                <span className="text-secondary text-xs">A</span>
              </span>
            </div>
            <input
              id="currentSlider"
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={current}
              onChange={(e) => setState((prev) => ({ ...prev, current: parseFloat(e.target.value) }))}
              className="cursor-pointer"
            />
          </div>

          {/* Coil Radius (R) Control */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="radiusSlider" className="font-mono text-xs text-on-surface-variant">
                코일 반지름 (R)
              </label>
              <span className="font-mono text-sm font-semibold text-primary-container">
                {coilRadius}{' '}
                <span className="text-secondary text-xs">mm</span>
              </span>
            </div>
            <input
              id="radiusSlider"
              type="range"
              min="20"
              max="80"
              step="1"
              value={coilRadius}
              onChange={(e) => setState((prev) => ({ ...prev, coilRadius: parseInt(e.target.value) }))}
              className="cursor-pointer"
            />
          </div>

          {/* Measurement Panel */}
          <div className="flex flex-col gap-1 border-t border-outline-variant pt-3 mt-1">
            <div className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
              자기장 세기 (B)
            </div>
            <div className="font-mono text-lg font-bold text-primary-container flex items-baseline gap-1">
              {computedB.toFixed(1)}{' '}
              <span className="text-secondary text-xs font-normal">mT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Workspace */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center min-h-[400px]">
        <svg
          id="magSimSvg"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className="max-w-full max-h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomScale})` }}
        >
          <defs>
            {/* Soft outer glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Custom vector arrow heads */}
            <marker
              id="arrowHead"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#00e5ff" opacity="0.8" />
            </marker>

            {/* Gradient fills for the coil poles */}
            <linearGradient id="coilN" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" stopOpacity={isReversed ? '0.1' : '0.8'} />
              <stop offset="100%" stopColor="#ff4d4d" stopOpacity={isReversed ? '0.8' : '0.1'} />
            </linearGradient>
            <linearGradient id="coilS" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4d4dff" stopOpacity={isReversed ? '0.8' : '0.1'} />
              <stop offset="100%" stopColor="#4d4dff" stopOpacity={isReversed ? '0.1' : '0.8'} />
            </linearGradient>

            {/* Dynamic Gradient for Permanent Bar Magnet */}
            <linearGradient id="magnetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="50%" stopColor={isReversed ? '#4d4dff' : '#ff4d4d'} />
              <stop offset="50%" stopColor={isReversed ? '#ff4d4d' : '#4d4dff'} />
            </linearGradient>
          </defs>

          {/* Loop Coil Simulation (Left) */}
          <g id="loopSimulation" transform="translate(300, 300)">
            <text
              x="0"
              y="250"
              fontFamily="Inter"
              fontSize="14"
              fill="#e5e2e1"
              textAnchor="middle"
              className="opacity-75 tracking-wide pointer-events-none"
            >
              전류 및 자기장 (원형 도선)
            </text>

            {/* Dynamic Circular Loop Magnetic Field Lines */}
            {current > 0 && (
              <g
                className="loopFieldLines"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2"
                filter="url(#glow)"
                opacity={Math.min(0.2 + current / 15, 1.0)}
              >
                {/* Core Center line */}
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M 0 190 L 0 -190"
                  markerMid="url(#arrowHead)"
                />

                {/* Inner loop lines */}
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M -30 180 C -55 60, -55 -60, -30 -180"
                  markerMid="url(#arrowHead)"
                />
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M 30 180 C 55 60, 55 -60, 30 -180"
                  markerMid="url(#arrowHead)"
                />

                {/* Left wrap loops */}
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M -60 150 C -125 50, -125 -50, -60 -150"
                  markerMid="url(#arrowHead)"
                />
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M -80 110 C -155 20, -155 -20, -80 -110"
                  markerMid="url(#arrowHead)"
                />
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M -100 70 C -185 0, -185 0, -100 -70"
                  markerMid="url(#arrowHead)"
                />

                {/* Right wrap loops */}
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M 60 150 C 125 50, 125 -50, 60 -150"
                  markerMid="url(#arrowHead)"
                />
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M 80 110 C 155 20, 155 -20, 80 -110"
                  markerMid="url(#arrowHead)"
                />
                <path
                  className={isReversed ? 'field-line-reverse' : 'field-line'}
                  d="M 100 70 C 185 0, 185 0, 100 -70"
                  markerMid="url(#arrowHead)"
                />
              </g>
            )}

            {/* Coil Visual Presentation - Scales dynamically with slider */}
            <g id="coilLoopGroup" transform={`scale(${coilScale})`} className="transition-transform duration-300">
              {/* North/South Field glow rectangles */}
              <rect
                x="-110"
                y="-35"
                width="220"
                height="35"
                rx="8"
                fill="url(#coilN)"
                opacity={Math.min(0.1 + current / 25, 0.5)}
              />
              <rect
                x="-110"
                y="0"
                width="220"
                height="35"
                rx="8"
                fill="url(#coilS)"
                opacity={Math.min(0.1 + current / 25, 0.5)}
              />

              {/* Wire Loop - Behind part */}
              <path
                d="M -100 0 A 100 30 0 0 1 100 0"
                fill="none"
                stroke="#fabd00"
                strokeWidth="8"
                opacity="0.5"
              />

              {/* Wire Loop - Front part (fully visible) */}
              <path
                d="M -100 0 A 100 30 0 0 0 100 0"
                fill="none"
                stroke="#fabd00"
                strokeWidth="8"
              />
              <path
                d="M -100 0 A 100 30 0 0 0 100 0"
                fill="none"
                stroke="#ffdf9e"
                strokeWidth="4"
              />

              {/* Current directional arrow indicator overlay */}
              {current > 0 && (
                <g
                  id="loopCurrentArrow"
                  transform={`translate(0, 30) ${isReversed ? 'rotate(180)' : ''}`}
                  className="transition-transform duration-300"
                >
                  <path
                    d="M -20 0 L 20 0 M 10 -8 L 20 0 L 10 8"
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x="0"
                    y="25"
                    fontFamily="JetBrains Mono"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#00e5ff"
                    textAnchor="middle"
                  >
                    I
                  </text>
                </g>
              )}
            </g>

            {/* Static Magnetic Pole Markers */}
            <g className="font-mono font-bold tracking-widest text-2xl select-none">
              <text
                x="0"
                y={isReversed ? '110' : '-80'}
                className="magnet-text-n transition-all duration-300"
                textAnchor="middle"
              >
                N
              </text>
              <text
                x="0"
                y={isReversed ? '-80' : '110'}
                className="magnet-text-s transition-all duration-300"
                textAnchor="middle"
              >
                S
              </text>
            </g>
          </g>

          {/* Bar Magnet Simulation (Right) */}
          <g id="magnetSimulation" transform="translate(700, 300)">
            <text
              x="0"
              y="250"
              fontFamily="Inter"
              fontSize="14"
              fill="#e5e2e1"
              textAnchor="middle"
              className="opacity-75 tracking-wide pointer-events-none"
            >
              영구 자석 주변의 자기장 선
            </text>

            {/* Vector Magnetic Field Lines of Bar Magnet */}
            <g
              className="magFieldLines"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="2.2"
              filter="url(#glow)"
              opacity="0.85"
            >
              {/* Polar field flows */}
              <path
                className={isReversed ? 'field-line' : 'field-line-reverse'}
                d="M 0 -100 L 0 -220"
                markerMid="url(#arrowHead)"
              />
              <path
                className={isReversed ? 'field-line' : 'field-line-reverse'}
                d="M -15 -100 C -50 -175, -50 -220, -80 -220"
                markerMid="url(#arrowHead)"
              />
              <path
                className={isReversed ? 'field-line' : 'field-line-reverse'}
                d="M 15 -100 C 50 -175, 50 -220, 80 -220"
                markerMid="url(#arrowHead)"
              />

              <path
                className={isReversed ? 'field-line-reverse' : 'field-line'}
                d="M 0 100 L 0 220"
                markerMid="url(#arrowHead)"
              />
              <path
                className={isReversed ? 'field-line-reverse' : 'field-line'}
                d="M -15 100 C -50 175, -50 220, -80 220"
                markerMid="url(#arrowHead)"
              />
              <path
                className={isReversed ? 'field-line-reverse' : 'field-line'}
                d="M 15 100 C 50 175, 50 220, 80 220"
                markerMid="url(#arrowHead)"
              />

              {/* Side loops */}
              <path
                className={isReversed ? 'field-line' : 'field-line-reverse'}
                d="M -30 -100 C -110 -145, -160 -105, -160 0"
                markerMid="url(#arrowHead)"
              />
              <path
                className={isReversed ? 'field-line-reverse' : 'field-line'}
                d="M -30 100 C -110 145, -160 105, -160 0"
                markerMid="url(#arrowHead)"
              />

              <path
                className={isReversed ? 'field-line' : 'field-line-reverse'}
                d="M 30 -100 C 110 -145, 160 -105, 160 0"
                markerMid="url(#arrowHead)"
              />
              <path
                className={isReversed ? 'field-line-reverse' : 'field-line'}
                d="M 30 100 C 110 145, 160 105, 160 0"
                markerMid="url(#arrowHead)"
              />

              {/* Wide side loops */}
              <path
                className={isReversed ? 'field-line' : 'field-line-reverse'}
                d="M -40 -60 C -165 -80, -210 0, -210 0"
                markerMid="url(#arrowHead)"
              />
              <path
                className={isReversed ? 'field-line-reverse' : 'field-line'}
                d="M -40 60 C -165 80, -210 0, -210 0"
                markerMid="url(#arrowHead)"
              />

              <path
                className={isReversed ? 'field-line' : 'field-line-reverse'}
                d="M 40 -60 C 165 -80, 210 0, 210 0"
                markerMid="url(#arrowHead)"
              />
              <path
                className={isReversed ? 'field-line-reverse' : 'field-line'}
                d="M 40 60 C 165 80, 210 0, 210 0"
                markerMid="url(#arrowHead)"
              />
            </g>

            {/* Bar Magnet Physical Container */}
            <g id="magnetBar">
              <rect
                x="-40"
                y="-100"
                width="80"
                height="200"
                rx="6"
                fill="url(#magnetGrad)"
                stroke="#e5e2e1"
                strokeWidth="2.5"
                filter="url(#glow)"
              />

              {/* Internal magnetic alignment lines inside magnet */}
              <g opacity="0.45" stroke="#e5e2e1" strokeWidth="1.5">
                <line x1="-25" y1="-95" x2="-25" y2="95" />
                <line x1="-12.5" y1="-95" x2="-12.5" y2="95" />
                <line x1="0" y1="-95" x2="0" y2="95" />
                <line x1="12.5" y1="-95" x2="12.5" y2="95" />
                <line x1="25" y1="-95" x2="25" y2="95" />
              </g>

              {/* North/South Pole label text inside magnet */}
              <text
                x="0"
                y={isReversed ? '75' : '-55'}
                className="magnet-pole magnet-text-n font-mono font-bold text-3xl select-none transition-all duration-300"
                textAnchor="middle"
              >
                N
              </text>
              <text
                x="0"
                y={isReversed ? '-55' : '75'}
                className="magnet-pole magnet-text-s font-mono font-bold text-3xl select-none transition-all duration-300"
                textAnchor="middle"
              >
                S
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-surface-container-lowest border-t border-outline-variant flex items-center px-4 justify-between shrink-0 absolute bottom-0 left-0 right-0 z-10">
        <span className="font-mono text-[11px] text-outline">상태: 정상</span>
        <span className="font-mono text-[11px] text-outline flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-container electric-glow inline-block animate-pulse"></span>{' '}
          시뮬레이션 활성화됨
        </span>
      </div>
    </div>
  );
}
