import { useState, useEffect, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { CircuitSimState } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Info, Sliders, Zap } from 'lucide-react';

interface CircuitSimulationProps {
  state: CircuitSimState;
  setState: Dispatch<SetStateAction<CircuitSimState>>;
}

export default function CircuitSimulation({ state, setState }: CircuitSimulationProps) {
  const { isSeries, voltage, R1, R2, zoomScale } = state;
  const [totalR, setTotalR] = useState<number>(24);
  const [totalI, setTotalI] = useState<number>(0.5);
  const [totalP, setTotalP] = useState<number>(6.0);

  const [v1, setV1] = useState<number>(5.0);
  const [i1, setI1] = useState<number>(0.5);
  const [p1, setP1] = useState<number>(2.5);

  const [v2, setV2] = useState<number>(7.0);
  const [i2, setI2] = useState<number>(0.5);
  const [p2, setP2] = useState<number>(3.5);

  // Recalculate circuit values when voltage or resistances change
  useEffect(() => {
    if (isSeries) {
      const rSum = R1 + R2;
      setTotalR(rSum);
      const current = voltage / rSum;
      setTotalI(current);
      setTotalP(voltage * current);

      setV1(current * R1);
      setI1(current);
      setP1(current * R1 * current);

      setV2(current * R2);
      setI2(current);
      setP2(current * R2 * current);
    } else {
      const rEq = (R1 * R2) / (R1 + R2);
      setTotalR(rEq);
      const current1 = voltage / R1;
      const current2 = voltage / R2;
      const currentTotal = current1 + current2;
      setTotalI(currentTotal);
      setTotalP(voltage * currentTotal);

      setV1(voltage);
      setI1(current1);
      setP1(voltage * current1);

      setV2(voltage);
      setI2(current2);
      setP2(voltage * current2);
    }
  }, [isSeries, voltage, R1, R2]);

  const handleZoomIn = () => {
    setState((prev) => ({ ...prev, zoomScale: Math.min(prev.zoomScale + 0.1, 1.5) }));
  };

  const handleZoomOut = () => {
    setState((prev) => ({ ...prev, zoomScale: Math.max(prev.zoomScale - 0.1, 0.6) }));
  };

  const handleReset = () => {
    setState({
      isSeries: true,
      voltage: 12,
      R1: 10,
      R2: 14,
      zoomScale: 1.0,
    });
  };

  const handleSwitchTopology = (series: boolean) => {
    setState((prev) => ({ ...prev, isSeries: series }));
  };

  const handleVoltageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setState((prev) => ({ ...prev, voltage: val }));
  };

  const handleR1Change = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setState((prev) => ({ ...prev, R1: Math.max(1, Math.min(val, 100)) }));
  };

  const handleR2Change = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setState((prev) => ({ ...prev, R2: Math.max(1, Math.min(val, 100)) }));
  };

  return (
    <div className="flex-1 flex relative w-full h-full">
      {/* Simulation Workspace */}
      <main className="flex-1 bg-surface-dim relative flex flex-col bg-grid-pattern overflow-hidden h-full">
        {/* Toolbar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto flex gap-1 bg-surface-container-high p-1 rounded-md border border-outline-variant shadow-lg">
            <button
              onClick={handleZoomIn}
              className="px-3 py-1.5 text-on-surface bg-surface-container-lowest border border-outline-variant rounded hover:border-primary-container transition-colors font-mono text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              Zoom In
            </button>
            <button
              onClick={handleZoomOut}
              className="px-3 py-1.5 text-on-surface bg-surface-container-lowest border border-outline-variant rounded hover:border-primary-container transition-colors font-mono text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              Zoom Out
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-on-surface bg-surface-container-lowest border border-outline-variant rounded hover:border-primary-container transition-colors font-mono text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Topology Toggle Buttons */}
          <div className="pointer-events-auto flex bg-surface-container-high p-1 rounded-md border border-outline-variant shadow-lg gap-1">
            <button
              onClick={() => handleSwitchTopology(true)}
              className={`px-4 py-2 font-sans text-xs font-semibold rounded transition-colors border cursor-pointer ${
                isSeries
                  ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent hover:bg-surface-container-highest'
              }`}
            >
              직렬 회로 (Series)
            </button>
            <button
              onClick={() => handleSwitchTopology(false)}
              className={`px-4 py-2 font-sans text-xs font-semibold rounded transition-colors border cursor-pointer ${
                !isSeries
                  ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface border-transparent hover:bg-surface-container-highest'
              }`}
            >
              병렬 회로 (Parallel)
            </button>
          </div>
        </div>

        {/* Floating Physics reference Diagram */}
        <div className="absolute top-20 right-4 bg-surface-container-high/95 p-3 rounded-md border border-outline-variant shadow-xl opacity-90 pointer-events-none z-20 max-w-xs transition-all duration-300">
          <div className="font-mono text-[10px] text-on-surface-variant mb-1.5 text-center tracking-wide uppercase">
            회로도 참조 (물리학II)
          </div>
          {isSeries ? (
            <img
              referrerPolicy="no-referrer"
              alt="직렬 회로도"
              className="w-44 rounded border border-outline-variant/50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8WtNDOk1QZWJcV4B0YtJuMdKRzJZYi0ZZ2Cwoduy7Fldewe77nk3cEi7mG4CUKVE3FtdAV8D2YM4h6SiMU0MmTmEIAYTgRBfE6GTSYt5PZSfUBF7yyYeNcOFIDlqofwBgPVAm2Vrkk9GPGex0oo1HANyyB6XghVSo1s-6b74LsuAAqDXLLv52SdWrUBcBsZw6aNg8Btbg1zjrg5qNqGcXerjCavm15Pufr2DFEr_hMGuNEBGARHWi2tiywnuwURx8gWY"
            />
          ) : (
            <img
              referrerPolicy="no-referrer"
              alt="병렬 회로도"
              className="w-44 rounded border border-outline-variant/50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjroVDgPeMTjf0xG45nD4a9oIq6yLL-9qUo9xetSC_JNSkRA_AKTuofIF470h5oNsBVYFHG5bN2oKna_5CT27yO3By-SdbZC31cDtVnOi7VuXoSSPqkBggP1_WAQHFBnkDfi-Qttp9ApwYJOoxsef0ELlaX95_tYsb3fJIMgZvoNQfq11qmg38LCz2FkdmO9ZnqtVXE4mf4_PA1EuvwK0Sp8fkI5_djQJmT3wig57mnHh9tW0C2_48rkSqTf_Qxtx-7TI"
            />
          )}
        </div>

        {/* SVG Interactive Circuit Viewport */}
        <div className="flex-1 relative flex flex-col items-center justify-center overflow-visible">
          <svg
            id="circuitSvg"
            viewBox="0 0 600 400"
            width="600"
            height="400"
            className="overflow-visible transition-transform duration-300 origin-center"
            style={{ transform: `scale(${zoomScale})` }}
          >
            <defs>
              <marker id="arrowHeadRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ffb4ab" />
              </marker>
              <marker id="arrowHeadGray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#bac9cc" />
              </marker>
              <marker id="arrowHeadGrayRev" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 10 1 L 0 5 L 10 9 z" fill="#bac9cc" />
              </marker>
            </defs>

            {/* Ideal Power DC Battery Source (Common) */}
            <g id="commonBattery" transform="translate(300, 310)">
              {/* Battery wires */}
              <line x1="-50" y1="0" x2="-12" y2="0" stroke="#c3f5ff" strokeWidth="2.5" />
              <line x1="12" y1="0" x2="50" y2="0" stroke="#c3f5ff" strokeWidth="2.5" />
              {/* Long plate (+) */}
              <line x1="-12" y1="-20" x2="-12" y2="20" stroke="#c3f5ff" strokeWidth="4.5" />
              {/* Short thick plate (-) */}
              <line x1="12" y1="-12" x2="12" y2="12" stroke="#c3f5ff" strokeWidth="9" />
              {/* Polar labeling */}
              <text x="-25" y="-28" fontFamily="JetBrains Mono" fontSize="18" fontWeight="bold" fill="#ffb4ab" textAnchor="middle">+</text>
              <text x="25" y="-28" fontFamily="JetBrains Mono" fontSize="18" fontWeight="bold" fill="#9cf0ff" textAnchor="middle">-</text>

              {/* Slider Controller Inside SVG */}
              <foreignObject x="-90" y="22" width="180" height="65">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex items-center gap-1.5 w-full px-2">
                    <span className="font-mono text-[9px] text-on-surface-variant">0V</span>
                    <input
                      id="voltageSlider"
                      type="range"
                      min="0"
                      max="30"
                      step="0.5"
                      value={voltage}
                      onChange={handleVoltageChange}
                      className="cursor-pointer"
                    />
                    <span className="font-mono text-[9px] text-on-surface-variant">30V</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-primary-container mt-1">
                    V = <span className="text-secondary">{voltage.toFixed(1)}</span>V
                  </div>
                </div>
              </foreignObject>
            </g>

            {/* SERIES CIRCUITS SECTION */}
            {isSeries ? (
              <g id="circuitSeries">
                {/* Flow Animation (Charge line layered above wires) */}
                {voltage > 0 && (
                  <path
                    className="charge-line"
                    d="M 250 310 L 100 310 L 100 100 L 170 100 M 230 100 L 370 100 M 430 100 L 500 100 L 500 310 L 350 310"
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="4"
                    opacity="0.8"
                  />
                )}

                {/* Base Copper Wires */}
                <path
                  className="wire"
                  d="M 250 310 L 100 310 L 100 100 L 170 100"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />
                <path
                  className="wire"
                  d="M 230 100 L 370 100"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />
                <path
                  className="wire"
                  d="M 430 100 L 500 100 L 500 310 L 350 310"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />

                {/* Resistor R1 zig-zag */}
                <g transform="translate(200, 100)">
                  <path
                    d="M -30 0 L -20 -12 L -10 12 L 0 -12 L 10 12 L 20 -12 L 30 0"
                    fill="none"
                    stroke="#00daf3"
                    strokeWidth="3"
                    strokeLinejoin="miter"
                  />
                  <text x="0" y="-22" fontFamily="JetBrains Mono" fontSize="14" fontWeight="bold" fill="#00daf3" textAnchor="middle">R₁</text>
                  <text x="0" y="24" fontFamily="JetBrains Mono" fontSize="10" fill="#bac9cc" textAnchor="middle">{R1}Ω</text>
                </g>

                {/* Resistor R2 zig-zag */}
                <g transform="translate(400, 100)">
                  <path
                    d="M -30 0 L -20 -12 L -10 12 L 0 -12 L 10 12 L 20 -12 L 30 0"
                    fill="none"
                    stroke="#fabd00"
                    strokeWidth="3"
                    strokeLinejoin="miter"
                  />
                  <text x="0" y="-22" fontFamily="JetBrains Mono" fontSize="14" fontWeight="bold" fill="#fabd00" textAnchor="middle">R₂</text>
                  <text x="0" y="24" fontFamily="JetBrains Mono" fontSize="10" fill="#bac9cc" textAnchor="middle">{R2}Ω</text>
                </g>

                {/* Dynamic Current Vector Labels/Arrows */}
                {voltage > 0 && (
                  <g fill="#ffb4ab" stroke="#ffb4ab" strokeWidth="1.5">
                    {/* Main circuit current I arrow */}
                    <path d="M 80 230 L 80 180" markerEnd="url(#arrowHeadRed)" />
                    <text x="92" y="210" fontFamily="JetBrains Mono" fontSize="12" stroke="none" fontWeight="semibold">I</text>

                    {/* Resistor branch current indicator R1 */}
                    <path d="M 130 75 L 160 75" markerEnd="url(#arrowHeadRed)" />
                    <text x="145" y="65" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" stroke="none">I₁</text>

                    {/* Resistor branch current indicator R2 */}
                    <path d="M 330 75 L 360 75" markerEnd="url(#arrowHeadRed)" />
                    <text x="345" y="65" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" stroke="none">I₂</text>
                  </g>
                )}

                {/* Voltmeter drop measuring brackets (V1, V2) */}
                <g fill="#bac9cc" stroke="#bac9cc" strokeWidth="1">
                  <line x1="140" y1="100" x2="140" y2="155" strokeDasharray="3,3" />
                  <line x1="280" y1="100" x2="280" y2="155" strokeDasharray="3,3" />
                  <line x1="460" y1="100" x2="460" y2="155" strokeDasharray="3,3" />

                  {/* Voltmeter 1 line */}
                  <path d="M 145 145 L 275 145" markerStart="url(#arrowHeadGrayRev)" markerEnd="url(#arrowHeadGray)" />
                  <text x="210" y="138" fontFamily="JetBrains Mono" fontSize="13" textAnchor="middle" stroke="none">V₁</text>

                  {/* Voltmeter 2 line */}
                  <path d="M 285 145 L 455 145" markerStart="url(#arrowHeadGrayRev)" markerEnd="url(#arrowHeadGray)" />
                  <text x="370" y="138" fontFamily="JetBrains Mono" fontSize="13" textAnchor="middle" stroke="none">V₂</text>
                </g>
              </g>
            ) : (
              /* PARALLEL CIRCUITS SECTION */
              <g id="circuitParallel">
                {/* Flow Animation */}
                {voltage > 0 && (
                  <path
                    className="charge-line"
                    d="M 250 310 L 100 310 L 100 150 L 200 150 M 200 150 L 200 80 L 270 80 M 330 80 L 400 80 L 400 150 M 200 150 L 200 220 L 270 220 M 330 220 L 400 220 L 400 150 M 400 150 L 500 150 L 500 310 L 350 310"
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="4"
                    opacity="0.8"
                  />
                )}

                {/* Base Copper Wires */}
                <path
                  className="wire"
                  d="M 250 310 L 100 310 L 100 150 L 200 150"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />
                <path
                  className="wire"
                  d="M 200 150 L 200 80 L 270 80"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />
                <path
                  className="wire"
                  d="M 330 80 L 400 80 L 400 150"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />
                <path
                  className="wire"
                  d="M 200 150 L 200 220 L 270 220"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />
                <path
                  className="wire"
                  d="M 330 220 L 400 220 L 400 150"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />
                <path
                  className="wire"
                  d="M 400 150 L 500 150 L 500 310 L 350 310"
                  fill="none"
                  stroke="#3b494c"
                  strokeWidth="3.5"
                />

                {/* Central junctions */}
                <circle cx="200" cy="150" r="5" fill="#bac9cc" />
                <circle cx="400" cy="150" r="5" fill="#bac9cc" />

                {/* Resistor R1 branch zig-zag */}
                <g transform="translate(300, 80)">
                  <path
                    d="M -30 0 L -20 -12 L -10 12 L 0 -12 L 10 12 L 20 -12 L 30 0"
                    fill="none"
                    stroke="#00daf3"
                    strokeWidth="3"
                    strokeLinejoin="miter"
                  />
                  <text x="0" y="-22" fontFamily="JetBrains Mono" fontSize="14" fontWeight="bold" fill="#00daf3" textAnchor="middle">R₁</text>
                  <text x="0" y="24" fontFamily="JetBrains Mono" fontSize="10" fill="#bac9cc" textAnchor="middle">{R1}Ω</text>
                </g>

                {/* Resistor R2 branch zig-zag */}
                <g transform="translate(300, 220)">
                  <path
                    d="M -30 0 L -20 -12 L -10 12 L 0 -12 L 10 12 L 20 -12 L 30 0"
                    fill="none"
                    stroke="#fabd00"
                    strokeWidth="3"
                    strokeLinejoin="miter"
                  />
                  <text x="0" y="-22" fontFamily="JetBrains Mono" fontSize="14" fontWeight="bold" fill="#fabd00" textAnchor="middle">R₂</text>
                  <text x="0" y="24" fontFamily="JetBrains Mono" fontSize="10" fill="#bac9cc" textAnchor="middle">{R2}Ω</text>
                </g>

                {/* Dynamic Current Vector Labels/Arrows for Parallel branches */}
                {voltage > 0 && (
                  <g fill="#ffb4ab" stroke="#ffb4ab" strokeWidth="1.5">
                    {/* Main wire current arrow */}
                    <path d="M 80 230 L 80 180" markerEnd="url(#arrowHeadRed)" />
                    <text x="92" y="210" fontFamily="JetBrains Mono" fontSize="12" stroke="none" fontWeight="semibold">I</text>

                    {/* Branch 1 current arrow */}
                    <path d="M 220 50 L 250 50" markerEnd="url(#arrowHeadRed)" />
                    <text x="235" y="40" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" stroke="none">I₁</text>

                    {/* Branch 2 current arrow */}
                    <path d="M 220 190 L 250 190" markerEnd="url(#arrowHeadRed)" />
                    <text x="235" y="180" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" stroke="none">I₂</text>
                  </g>
                )}

                {/* Parallel Voltmeter drop brackets (V1, V2) */}
                <g fill="#bac9cc" stroke="#bac9cc" strokeWidth="1">
                  {/* Bracket R1 */}
                  <line x1="200" y1="80" x2="200" y2="120" strokeDasharray="3,3" />
                  <line x1="400" y1="80" x2="400" y2="120" strokeDasharray="3,3" />
                  <path d="M 205 110 L 395 110" markerStart="url(#arrowHeadGrayRev)" markerEnd="url(#arrowHeadGray)" />
                  <text x="300" y="102" fontFamily="JetBrains Mono" fontSize="13" textAnchor="middle" stroke="none">V₁</text>

                  {/* Bracket R2 */}
                  <line x1="200" y1="220" x2="200" y2="260" strokeDasharray="3,3" />
                  <line x1="400" y1="220" x2="400" y2="260" strokeDasharray="3,3" />
                  <path d="M 205 250 L 395 250" markerStart="url(#arrowHeadGrayRev)" markerEnd="url(#arrowHeadGray)" />
                  <text x="300" y="242" fontFamily="JetBrains Mono" fontSize="13" textAnchor="middle" stroke="none">V₂</text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Bottom Real-time status bar */}
        <div className="h-8 bg-surface-container-low border-t border-outline-variant flex items-center px-4 gap-6 shrink-0 absolute bottom-0 left-0 right-0 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse inline-block"></span>
            <span className="font-mono text-xs text-on-surface-variant">시뮬레이션 실행 중 (Active)</span>
          </div>
          <div className="flex items-center gap-4 ml-auto font-mono text-xs text-on-surface-variant">
            <span id="totalCurrent">
              총 전류 (I_total) = <span className="text-primary-container font-semibold">{totalI.toFixed(3)} A</span>
            </span>
            <span id="totalPower" className="border-l border-outline-variant pl-4">
              총 전력 (P_total) = <span className="text-secondary font-semibold">{totalP.toFixed(1)} W</span>
            </span>
          </div>
        </div>
      </main>

      {/* Right Sidebar: Multimeter Gauge & Analytics */}
      <aside className="w-[320px] bg-surface-container-low border-l border-outline-variant shrink-0 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-outline-variant bg-surface-container flex items-center gap-2">
          <Zap className="w-4.5 h-4.5 text-primary-fixed-dim" />
          <h2 className="font-sans text-sm font-semibold text-on-surface">계측 데이터 (Multimeter)</h2>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider border-b border-outline-variant pb-1 flex justify-between items-center">
              <span>부품 분석 (Components)</span>
              <span className="text-primary-fixed-dim flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Tuning
              </span>
            </div>

            {/* R1 Parameters and Readout */}
            <div className="bg-surface-container border border-outline-variant rounded p-3 relative overflow-hidden transition-all duration-300 hover:border-primary-fixed-dim">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-fixed-dim"></div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-semibold text-on-surface">저항 (R₁)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={R1}
                    onChange={handleR1Change}
                    className="w-11 text-center bg-surface-variant border border-outline-variant/60 rounded text-[11px] py-0.5 text-primary font-mono focus:outline-none focus:border-primary-container"
                  />
                  <span className="text-xs text-on-surface-variant font-mono">Ω</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-surface-dim p-1.5 rounded border border-outline-variant/40">
                  <div className="text-[9px] text-on-surface-variant font-mono mb-0.5">전압 강하 (V₁)</div>
                  <div className="font-mono text-xs text-primary-fixed font-semibold">{v1.toFixed(1)} V</div>
                </div>
                <div className="bg-surface-dim p-1.5 rounded border border-outline-variant/40">
                  <div className="text-[9px] text-on-surface-variant font-mono mb-0.5">전류 (I₁)</div>
                  <div className="font-mono text-xs text-primary-fixed font-semibold">{i1.toFixed(2)} A</div>
                </div>
                <div className="bg-surface-dim p-1.5 rounded border border-outline-variant/40">
                  <div className="text-[9px] text-on-surface-variant font-mono mb-0.5">전력 (P₁)</div>
                  <div className="font-mono text-xs text-primary-fixed font-semibold">{p1.toFixed(1)} W</div>
                </div>
              </div>
            </div>

            {/* R2 Parameters and Readout */}
            <div className="bg-surface-container border border-outline-variant rounded p-3 relative overflow-hidden transition-all duration-300 hover:border-secondary-container">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary-container"></div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-semibold text-on-surface">저항 (R₂)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={R2}
                    onChange={handleR2Change}
                    className="w-11 text-center bg-surface-variant border border-outline-variant/60 rounded text-[11px] py-0.5 text-secondary font-mono focus:outline-none focus:border-primary-container"
                  />
                  <span className="text-xs text-on-surface-variant font-mono">Ω</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-surface-dim p-1.5 rounded border border-outline-variant/40">
                  <div className="text-[9px] text-on-surface-variant font-mono mb-0.5">전압 강하 (V₂)</div>
                  <div className="font-mono text-xs text-secondary-container font-semibold">{v2.toFixed(1)} V</div>
                </div>
                <div className="bg-surface-dim p-1.5 rounded border border-outline-variant/40">
                  <div className="text-[9px] text-on-surface-variant font-mono mb-0.5">전류 (I₂)</div>
                  <div className="font-mono text-xs text-secondary-container font-semibold">{i2.toFixed(2)} A</div>
                </div>
                <div className="bg-surface-dim p-1.5 rounded border border-outline-variant/40">
                  <div className="text-[9px] text-on-surface-variant font-mono mb-0.5">전력 (P₂)</div>
                  <div className="font-mono text-xs text-secondary-container font-semibold">{p2.toFixed(1)} W</div>
                </div>
              </div>
            </div>
          </div>

          {/* Theoretical Data Analysis Explanation Section */}
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider border-b border-outline-variant pb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-primary-container" />
              <span>실시간 물리 데이터 분석</span>
            </div>
            <div className="bg-surface-container-highest border border-outline-variant rounded p-3 text-xs leading-relaxed text-on-surface-variant font-sans shadow-inner">
              {isSeries ? (
                <p>
                  옴의 법칙(V=IR)에 따라 <strong>직렬 회로</strong>의 합성 저항은 R_total = R₁ + R₂ (
                  <span className="text-secondary font-bold font-mono">{totalR.toFixed(0)}Ω</span>)이며, 회로 전체에 흐르는
                  전류는 I = V/R_total = {voltage.toFixed(1)}V/{totalR.toFixed(0)}Ω ={' '}
                  <span className="text-primary font-bold font-mono">{totalI.toFixed(2)}A</span>로 모든 소자에서 완벽히 동일합니다.
                  각 저항기 양단에 인가되는 개별 전압 강하는 V₁ = I &middot; R₁ (
                  <span className="text-primary-container font-mono font-bold">{v1.toFixed(1)}V</span>), V₂ = I &middot; R₂ (
                  <span className="text-secondary-container font-mono font-bold">{v2.toFixed(1)}V</span>)로 각각 저항 비례하여
                  공평하게 분배되며, 전체 시스템 총 소비 전력은{' '}
                  <span className="text-secondary font-mono font-bold">{totalP.toFixed(1)}W</span> 입니다.
                </p>
              ) : (
                <p>
                  옴의 법칙(V=IR)에 따라 <strong>병렬 회로</strong>의 모든 분기 저항기에 가해지는 전압(V)은 공급 전압인{' '}
                  <span className="text-secondary font-bold font-mono">{voltage.toFixed(1)}V</span>로 완전히 똑같습니다. 각 저항 분기
                  도선을 따라 흐르는 개별 전류량은 저항값에 역비례하여 I₁ = V/R₁ (
                  <span className="text-primary-container font-mono font-bold">{i1.toFixed(2)}A</span>), I₂ = V/R₂ (
                  <span className="text-secondary-container font-mono font-bold">{i2.toFixed(2)}A</span>)가 되며, 회로 전체 총 합산
                  전류는 이 분기 전류들의 대수적 합산인{' '}
                  <span className="text-primary font-mono font-bold">{totalI.toFixed(2)}A</span>가 됩니다. 전체 회로의 합성 저항(R_eq)은
                  1/R_eq = 1/R₁ + 1/R₂ 에 따라 약{' '}
                  <span className="text-secondary font-mono font-semibold">{totalR.toFixed(2)}Ω</span>로 저하되며, 총 소비 전력량은{' '}
                  <span className="text-secondary font-mono font-bold">{totalP.toFixed(1)}W</span>로 급증합니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
