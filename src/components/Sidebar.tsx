import { useState, useEffect } from 'react';
import { ActiveTab, SidebarTab } from '../types';
import { BookOpen, Binary, Layers, Play } from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onResetSimulations: () => void;
}

export default function Sidebar({ activeTab, onResetSimulations }: SidebarProps) {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('concepts');

  useEffect(() => {
    if (activeTab === 'circuitSimTab' && activeSidebarTab === 'materials') {
      setActiveSidebarTab('concepts');
    }
  }, [activeTab, activeSidebarTab]);

  return (
    <aside className="w-[320px] bg-surface-container border-r border-outline-variant shrink-0 flex flex-col h-full overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-outline-variant flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center overflow-hidden">
          <img
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            alt="Scientist avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQqPxva-utfwA9tqnS4SuYfNDIS4yWrd0OqNbWReaRLBcYzhfrZuB5PkyHlg3uQ_EUrRFAhe8b2MPW3-LiogloDFql_JQirnxaKC_IM4to2soxDgmAH3C986MLF8upDVGPH7wlAWuljJottipPPpy-Cw5GLNYWQm6XkZ6KwZF5zwwfY3orpaJNC2Hnb40Qwg6T-3LpZPPdYDkauXvmmno7JsrG-w8CbeqAyI435fm4WejvlKAX5dFWDA"
          />
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold text-secondary">Theory Lab</h2>
          <p className="font-sans text-xs text-on-surface-variant">Electromagnetics Module</p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="p-4 flex flex-col gap-1.5">
        <button
          onClick={() => setActiveSidebarTab('concepts')}
          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 w-full text-left cursor-pointer ${
            activeSidebarTab === 'concepts'
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border border-transparent hover:border-primary/20'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="font-sans text-xs">Concepts</span>
        </button>

        <button
          onClick={() => setActiveSidebarTab('equations')}
          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 w-full text-left cursor-pointer ${
            activeSidebarTab === 'equations'
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border border-transparent hover:border-primary/20'
          }`}
        >
          <Binary className="w-4 h-4" />
          <span className="font-sans text-xs">Equations</span>
        </button>

        {activeTab !== 'circuitSimTab' && (
          <button
            onClick={() => setActiveSidebarTab('materials')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 w-full text-left cursor-pointer ${
              activeSidebarTab === 'materials'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface border border-transparent hover:border-primary/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="font-sans text-xs">Materials</span>
          </button>
        )}
      </div>

      {/* Dynamic Content Based on Tabs */}
      <div className="flex-1 p-4 overflow-y-auto border-t border-outline-variant/30">
        {activeTab === 'magFieldTab' ? (
          /* MAGNETIC FIELD SIMULATION THEORY */
          <div className="flex flex-col gap-5">
            {activeSidebarTab === 'concepts' && (
              <>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-1 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    전자기 유도 (Electromagnetic Induction)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant">
                    코일이나 회로 주변의 변화하는 자기장이 유도 기전력(EMF)을 발생시켜, 전류가 흐를 수 있는 경로가 있을 때 유도 전류를 흐르게 하는 물리적 현상입니다.
                  </p>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-1 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    오른손 법칙 (Right-Hand Rule)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant">
                    오른손 엄지손가락을 전류(I)의 방향으로 향하게 할 때, 나머지 네 손가락이 감싸 쥐는 방향이 생성되는 자기장 선(B)의 회전 방향을 나타냅니다.
                  </p>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-1 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    자기선속밀도 (Magnetic Flux Density, B)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant">
                    벡터 B로 표시되며, 단위 면적을 수직으로 통과하는 자기력선의 밀도(집중도)를 나타냅니다. 표준 SI 단위는 테슬라(T) 또는 밀리테슬라(mT)입니다.
                  </p>
                </section>
              </>
            )}

            {activeSidebarTab === 'equations' && (
              <>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-2 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    원형 도선의 자기장
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant mb-3">
                    반지름이 R인 원형 도선의 중심에서 발생하는 자기장의 세기(B)는 도선에 흐르는 전류(I)에 비례하고 반지름(R)에 반비례합니다.
                  </p>
                  <div className="bg-surface-container-highest p-3 rounded-md border border-outline-variant flex justify-center shadow-inner">
                    <span className="font-mono text-xs font-semibold text-primary-fixed-dim">
                      B = k' &times; (I / r)
                    </span>
                  </div>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-2 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    앙페르 법칙 (Ampere's Law)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant mb-3">
                    닫힌 임의의 폐곡선을 따라 자기장을 선적분한 결과가 그 폐곡선 내부를 통과하는 총 전류의 양과 같음을 나타내는 법칙입니다.
                  </p>
                  <div className="bg-surface-container-highest p-3 rounded-md border border-outline-variant flex justify-center shadow-inner">
                    <span className="font-mono text-xs font-semibold text-primary-fixed-dim">
                      &oint; B &middot; dl = &mu;₀I
                    </span>
                  </div>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-2 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    자기선속 (Magnetic Flux, &Phi;)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant mb-3">
                    주어진 단면적을 수직으로 통과하는 총 자기력선의 수(자기장의 양)를 측정하는 물리량입니다.
                  </p>
                  <div className="bg-surface-container-highest p-3 rounded-md border border-outline-variant flex justify-center shadow-inner">
                    <span className="font-mono text-xs font-semibold text-primary-fixed-dim">
                      &Phi; = B &times; A
                    </span>
                  </div>
                </section>
              </>
            )}

            {activeSidebarTab === 'materials' && (
              <>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-1 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    영구 자석 (Permanent Magnets)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant">
                    네오디뮴(NdFeB), 알니코, 또는 산화철(페라이트)과 같은 물질 내부에 자기구역이 일렬로 정렬되어 있어, 외부 전력 공급 없이도 영구적으로 자기장을 유지하는 자석입니다.
                  </p>
                </section>
              </>
            )}
          </div>
        ) : (
          /* CIRCUIT SIMULATION THEORY */
          <div className="flex flex-col gap-5">
            {activeSidebarTab === 'concepts' && (
              <>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-1 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    옴의 법칙 (Ohm's Law)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant">
                    도체에 흐르는 전류(I)는 양단에 인가되는 전압(V)에 비례하고, 도체의 고유 전기 저항(R)에 반비례합니다. 회로 해석의 기본 토대입니다.
                  </p>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-1 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    합성 저항 (Equivalent Resistance)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant">
                    여러 저항이 직렬 혹은 병렬로 얽혀 있을 때, 이를 단 하나의 이상적인 단일 저항값으로 단순화하여 전체 회로 거동을 산출하는 방식입니다.
                  </p>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-1 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    전기에너지와 전력 (Power)
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant">
                    단위 시간 동안 저항기 등 회로 소자에서 소비하거나 열로 발산되는 전기 에너지를 의미하며, 단위는 와트(W)를 채택합니다.
                  </p>
                </section>
              </>
            )}

            {activeSidebarTab === 'equations' && (
              <>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-2 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    기본 옴의 법칙 식
                  </h3>
                  <div className="bg-surface-container-highest p-3 rounded-md border border-outline-variant flex justify-center shadow-inner">
                    <span className="font-mono text-xs font-semibold text-primary-fixed-dim">
                      V = I &times; R
                    </span>
                  </div>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-2 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    직렬 연결 합성 저항
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant mb-2">
                    모든 저항을 지나는 전류는 동일하며, 전위 강하의 총합은 전체 전압과 같습니다.
                  </p>
                  <div className="bg-surface-container-highest p-2.5 rounded-md border border-outline-variant flex flex-col items-center gap-1 shadow-inner">
                    <span className="font-mono text-[11px] text-primary-fixed-dim">V = V₁ + V₂</span>
                    <span className="font-mono text-[11px] text-primary-fixed-dim">I = I₁ = I₂</span>
                    <span className="font-mono text-xs font-bold text-secondary">R_total = R₁ + R₂</span>
                  </div>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-2 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    병렬 연결 합성 저항
                  </h3>
                  <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant mb-2">
                    각 저항에 걸리는 전위차(전압)는 전체 인가 전압과 같습니다.
                  </p>
                  <div className="bg-surface-container-highest p-2.5 rounded-md border border-outline-variant flex flex-col items-center gap-1 shadow-inner">
                    <span className="font-mono text-[11px] text-primary-fixed-dim">V = V₁ = V₂</span>
                    <span className="font-mono text-[11px] text-primary-fixed-dim">I = I₁ + I₂</span>
                    <span className="font-mono text-xs font-bold text-secondary">1/R_total = 1/R₁ + 1/R₂</span>
                  </div>
                </section>
                <section>
                  <h3 className="font-sans text-xs font-semibold text-primary mb-2 border-b border-outline-variant pb-1 uppercase tracking-wider">
                    소비 전력 식
                  </h3>
                  <div className="bg-surface-container-highest p-3 rounded-md border border-outline-variant flex justify-center gap-4 shadow-inner">
                    <span className="font-mono text-xs font-semibold text-secondary">P = V &times; I</span>
                    <span className="font-mono text-xs font-semibold text-secondary">P = I&sup2;R</span>
                  </div>
                </section>
              </>
            )}


          </div>
        )}
      </div>

      {/* New Simulation Trigger */}
      <div className="p-4 border-t border-outline-variant mt-auto">
        <button
          onClick={onResetSimulations}
          className="w-full bg-[#1E1E1E] hover:bg-primary-container text-primary-container hover:text-on-primary-container font-sans text-sm font-semibold py-3 px-4 border border-[#333333] hover:border-primary-container transition-all duration-300 flex items-center justify-center gap-2 electric-glow rounded-md cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          New Simulation
        </button>
      </div>
    </aside>
  );
}
