import React, { useState } from 'react';
import { useAppStore } from './store/useStore';
import { TOPICS_DATA } from './data/topics';
import { TopicId, StageId, TopicData, RecordedError } from './types';
import { Navbar, MainViewTab } from './components/Navbar';
import { TopicRoadmap } from './components/Playground/TopicRoadmap';
import { ActiveStageRunner } from './components/Playground/ActiveStageRunner';
import { PistasReaderModal } from './components/Playground/PistasReaderModal';
import { QuickDrillModal } from './components/Playground/QuickDrillModal';
import { DecisionTreeModal } from './components/DecisionTree/DecisionTreeModal';
import { DistributionCalculator } from './components/Calculator/DistributionCalculator';
import { LibraryView } from './components/Library/LibraryView';
import { FormulasView } from './components/Formulas/FormulasView';
import { ProgressView } from './components/Progress/ProgressView';
import { HomeView } from './components/Home/HomeView';
import { ScormModal } from './components/Scorm/ScormModal';
import { BookOpen, GraduationCap, Heart, HelpCircle, Layers } from 'lucide-react';

export default function App() {
  const {
    state,
    completionPercentage,
    addXP,
    recordStageCompletion,
    recordError,
    clearResolvedError,
    isTopicUnlocked,
    isStageUnlocked,
    exportStateJSON,
    importStateJSON,
    resetAllProgress,
  } = useAppStore();

  const [currentTab, setCurrentTab] = useState<MainViewTab>('home');
  const [activeStage, setActiveStage] = useState<{ topicId: TopicId; stageId: StageId } | null>(
    null
  );
  const [pistasTopic, setPistasTopic] = useState<TopicData | null>(null);
  const [showDecisionTree, setShowDecisionTree] = useState<boolean>(false);
  const [showQuickDrill, setShowQuickDrill] = useState<boolean>(false);
  const [showScormModal, setShowScormModal] = useState<boolean>(false);
  const [calculatorSelectedTopic, setCalculatorSelectedTopic] = useState<TopicId>('binomial');

  const handleStartStage = (topicId: TopicId, stageId: StageId) => {
    const topic = TOPICS_DATA.find((t) => t.id === topicId);
    if (!topic) return;

    if (stageId === 'pistas') {
      // Open reading modal for stage 1
      setPistasTopic(topic);
    } else {
      setActiveStage({ topicId, stageId });
    }
  };

  const handlePistasContinue = () => {
    if (!pistasTopic) return;
    recordStageCompletion(pistasTopic.id, 'pistas', true, 10);
    const targetTopicId = pistasTopic.id;
    setPistasTopic(null);
    setActiveStage({ topicId: targetTopicId, stageId: 'reconocer' });
  };

  const handleStageFinished = (isSuccess: boolean, earnedXp: number) => {
    if (!activeStage) return;
    recordStageCompletion(activeStage.topicId, activeStage.stageId, isSuccess, earnedXp);
  };

  const handleStartReviewExercise = (error: RecordedError) => {
    setActiveStage({ topicId: error.tema, stageId: error.etapa });
    setCurrentTab('playground');
  };

  const activeTopicData = activeStage
    ? TOPICS_DATA.find((t) => t.id === activeStage.topicId)
    : null;

  return (
    <div className="min-h-screen bg-[#FBF5EC] text-[#1d1b16] flex flex-col font-sans">
      {/* WCAG 2.2 Guideline 2.4.1: Bypass Blocks (Skip to main content) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#8A1428] focus:text-white focus:rounded-lg focus:shadow-xl focus:font-bold focus:outline-none"
      >
        Saltar al contenido principal
      </a>

      {/* Editorial Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'playground') {
            setActiveStage(null);
          }
        }}
        xp={state.xp}
        rachaDias={state.racha.dias}
        onOpenScormModal={() => setShowScormModal(true)}
      />

      {/* Main Container Landmark with target id */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12 outline-none">
        {/* TAB 0: HOME PAGE (EXPLICACIÓN DE CADA MÓDULO) */}
        {currentTab === 'home' && (
          <HomeView
            onNavigate={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'playground') {
                setActiveStage(null);
              }
            }}
            onOpenDecisionTree={() => setShowDecisionTree(true)}
            onOpenScormModal={() => setShowScormModal(true)}
            xp={state.xp}
            rachaDias={state.racha.dias}
          />
        )}

        {/* TAB 1: PLAYGROUND & LEARNING ROADMAP */}
        {currentTab === 'playground' && (
          <>
            {!activeStage ? (
              <TopicRoadmap
                unlockedCheck={isTopicUnlocked}
                stageUnlockedCheck={isStageUnlocked}
                userTopicsState={state.temas}
                onStartStage={handleStartStage}
                onOpenDecisionTree={() => setShowDecisionTree(true)}
                onOpenQuickDrill={() => setShowQuickDrill(true)}
              />
            ) : (
              activeTopicData && (
                <ActiveStageRunner
                  topic={activeTopicData}
                  stageId={activeStage.stageId}
                  onBackToRoadmap={() => setActiveStage(null)}
                  onStageFinished={handleStageFinished}
                  onOpenVideo={() => {
                    setCurrentTab('library');
                  }}
                  onOpenCalculator={() => {
                    setCalculatorSelectedTopic(activeTopicData.id);
                    setCurrentTab('calculator');
                  }}
                />
              )
            )}
          </>
        )}

        {/* TAB 2: CALCULATOR */}
        {currentTab === 'calculator' && (
          <DistributionCalculator initialTopic={calculatorSelectedTopic} />
        )}

        {/* TAB 3: LIBRARY */}
        {currentTab === 'library' && (
          <LibraryView initialTopic={calculatorSelectedTopic} />
        )}

        {/* TAB 4: FORMULAS */}
        {currentTab === 'formulas' && <FormulasView />}

        {/* TAB 5: PROGRESS */}
        {currentTab === 'progress' && (
          <ProgressView
            state={state}
            onExport={exportStateJSON}
            onImport={importStateJSON}
            onReset={resetAllProgress}
            onStartReviewExercise={handleStartReviewExercise}
            onOpenScormModal={() => setShowScormModal(true)}
          />
        )}
      </main>

      {/* Stage 1: Pistas & Signals Reader Modal */}
      {pistasTopic && (
        <PistasReaderModal
          topic={pistasTopic}
          onClose={() => setPistasTopic(null)}
          onContinueToReconocer={handlePistasContinue}
        />
      )}

      {/* Interactive Decision Tree Modal */}
      {showDecisionTree && (
        <DecisionTreeModal
          onClose={() => setShowDecisionTree(false)}
          onSelectTopic={(topicId) => {
            setCurrentTab('playground');
            setActiveStage({ topicId, stageId: 'reconocer' });
          }}
          onOpenCalculator={(topicId) => {
            setCalculatorSelectedTopic(topicId);
            setCurrentTab('calculator');
          }}
        />
      )}

      {/* Quick Drill / Modo Reconocer Modal */}
      {showQuickDrill && (
        <QuickDrillModal
          unlockedCheck={isTopicUnlocked}
          onClose={() => setShowQuickDrill(false)}
          onOpenCalculator={() => {
            setShowQuickDrill(false);
            setCurrentTab('calculator');
          }}
        />
      )}

      {/* SCORM 1.2 Modal */}
      {showScormModal && (
        <ScormModal
          onClose={() => setShowScormModal(false)}
          completionPercentage={completionPercentage}
        />
      )}

      {/* Editorial Footer */}
      <footer className="border-t border-[#8A142815] bg-[#FFFFFF] py-6 text-xs text-[#584141] print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#8A1428]">Easy Pro</span>
            <span>•</span>
            <span>Probabilidad y Estadística para Ingeniería y Ciencias (Devore)</span>
          </div>
          <div className="flex items-center gap-4 text-[#8A1428]">
            <button
              onClick={() => setCurrentTab('home')}
              className="hover:underline font-semibold"
            >
              Inicio
            </button>
            <button
              onClick={() => setShowScormModal(true)}
              className="hover:underline font-bold text-[#AC0B32] flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Paquete SCORM 1.2</span>
            </button>
            <button
              onClick={() => setShowDecisionTree(true)}
              className="hover:underline font-semibold"
            >
              Árbol de Decisión
            </button>
            <button
              onClick={() => setCurrentTab('calculator')}
              className="hover:underline font-semibold"
            >
              Calculadora
            </button>
            <button
              onClick={() => setCurrentTab('formulas')}
              className="hover:underline font-semibold"
            >
              Guía de Fórmulas
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
