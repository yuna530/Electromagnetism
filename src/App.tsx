import { useState } from 'react';
import { ActiveTab, MagSimState, CircuitSimState } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MagneticSimulation from './components/MagneticSimulation';
import CircuitSimulation from './components/CircuitSimulation';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('magFieldTab');

  // Magnetic Simulation State
  const [magSimState, setMagSimState] = useState<MagSimState>({
    current: 10.0,
    coilRadius: 40,
    isReversed: false,
    zoomScale: 1.0,
  });

  // Circuit Simulation State
  const [circuitSimState, setCircuitSimState] = useState<CircuitSimState>({
    isSeries: true,
    voltage: 12.0,
    R1: 10,
    R2: 14,
    zoomScale: 1.0,
  });

  // Resets both simulations to their pristine, factory defaults
  const handleResetSimulations = () => {
    setMagSimState({
      current: 10.0,
      coilRadius: 40,
      isReversed: false,
      zoomScale: 1.0,
    });
    setCircuitSimState({
      isSeries: true,
      voltage: 12.0,
      R1: 10,
      R2: 14,
      zoomScale: 1.0,
    });
  };

  return (
    <div className="bg-background text-on-surface h-screen flex flex-col overflow-hidden font-sans">
      {/* Universal Sticky Top Header Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Interactive Theoretical Reference Sidebar */}
        <Sidebar activeTab={activeTab} onResetSimulations={handleResetSimulations} />

        {/* Central Responsive Simulation Viewport */}
        <div className="flex-1 relative flex flex-col min-w-0 h-full">
          <AnimatePresence mode="wait">
            {activeTab === 'magFieldTab' ? (
              <motion.div
                key="magnetic-sim"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full h-full flex flex-col"
              >
                <MagneticSimulation state={magSimState} setState={setMagSimState} />
              </motion.div>
            ) : (
              <motion.div
                key="circuit-sim"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full h-full flex flex-col"
              >
                <CircuitSimulation state={circuitSimState} setState={setCircuitSimState} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
