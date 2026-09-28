import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_TOPICS } from '../data/topics';
import {
  AchievementBadge,
  DebateEvaluation,
  DebateMessage,
  DebateMode,
  DebateSession,
  DebateTopic,
  Difficulty,
  Side,
  TimerOption,
  UserProfile,
} from '../types';
import { soundFx } from '../utils/audio';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'start'
  | 'arena'
  | 'analysis'
  | 'topics'
  | 'history'
  | 'performance'
  | 'profile'
  | 'settings';

interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
  title: string;
  message?: string;
}

interface DebateContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  topics: DebateTopic[];
  addCustomTopic: (topic: Omit<DebateTopic, 'id' | 'debatesCount'>) => DebateTopic;
  
  // Active debate session
  activeSession: DebateSession | null;
  startNewDebate: (params: {
    topic: DebateTopic;
    userSide: Side;
    difficulty: Difficulty;
    mode: DebateMode;
    timerOption: TimerOption;
  }) => void;
  submitUserArgument: (text: string) => Promise<void>;
  passCurrentRound: () => Promise<void>;
  concedeDebate: () => void;
  completeDebate: (evaluation: DebateEvaluation) => void;
  switchSidesDebate: () => void;
  
  // History & Selected Analysis
  history: DebateSession[];
  viewingEvaluationSession: DebateSession | null;
  setViewingEvaluationSession: (session: DebateSession | null) => void;
  
  // Pre-selected topic for Start Debate
  selectedTopicForStart: DebateTopic | null;
  setSelectedTopicForStart: (topic: DebateTopic | null) => void;

  // Modals & UI states
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  isCreateTopicModalOpen: boolean;
  setIsCreateTopicModalOpen: (open: boolean) => void;
  isInfoModalOpen: string | null; // 'about' | 'how-it-works' | 'privacy' | 'terms' | 'contact'
  setIsInfoModalOpen: (modal: string | null) => void;

  // Sound & toasts
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  loginAsGuest: () => void;
  loginAsUser: (username: string, email: string) => void;
  logout: () => void;
}

const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'first-debate',
    title: 'FIRST DEBATE',
    description: 'Completed your maiden intellectual clash in the Arena.',
    icon: 'Sword',
    isUnlocked: true,
    unlockedAt: '2026-09-15',
    category: 'milestone',
  },
  {
    id: '10-debates',
    title: '10 DEBATES',
    description: 'Engaged in 10 full dialectic debates against the AI.',
    icon: 'Flame',
    isUnlocked: false,
    category: 'milestone',
  },
  {
    id: 'logic-master',
    title: 'LOGIC MASTER',
    description: 'Achieved a Logic score of 90 or higher in a debate.',
    icon: 'Brain',
    isUnlocked: true,
    unlockedAt: '2026-09-22',
    category: 'logic',
  },
  {
    id: 'counter-expert',
    title: 'COUNTERARGUMENT EXPERT',
    description: 'Dismantled an AI rebuttal with high clarity and zero fallacies.',
    icon: 'ShieldCheck',
    isUnlocked: true,
    unlockedAt: '2026-09-24',
    category: 'logic',
  },
  {
    id: 'devils-advocate',
    title: "DEVIL'S ADVOCATE",
    description: "Survived 5 rounds on the Devil's Advocate difficulty.",
    icon: 'Zap',
    isUnlocked: false,
    category: 'special',
  },
  {
    id: 'dual-mind',
    title: 'DUAL MIND',
    description: 'Defended both FOR and AGAINST positions on the exact same topic.',
    icon: 'Repeat',
    isUnlocked: true,
    unlockedAt: '2026-09-27',
    category: 'special',
  },
];

const INITIAL_HISTORY: DebateSession[] = [
  {
    id: 'hist-1',
    topic: INITIAL_TOPICS[0], // Should AI replace teachers
    userSide: 'AGAINST',
    difficulty: 'Challenger',
    mode: 'Standard',
    totalRounds: 5,
    timerOption: 90,
    currentRound: 5,
    status: 'completed',
    startedAt: '2026-09-27T14:30:00Z',
    completedAt: '2026-09-27T14:41:20Z',
    timeSpentSeconds: 680,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        round: 1,
        content:
          'Human teachers provide essential socio-emotional mentorship, ethical modeling, and relational intuition that algorithmic systems can never emulate. Education is not mere information ingestion; it is emotional attunement and character formation.',
        timestamp: '14:31',
        strengthScore: 88,
        strengths: ['Clear philosophical grounding', 'Rich vocabulary'],
      },
      {
        id: 'm2',
        sender: 'ai',
        round: 1,
        content:
          'Your argument assumes human teachers uniformly possess high emotional intuition. In reality, teacher burnout is at 60%, resulting in cognitive bias and inequitable student treatment. Adaptive AI delivers consistent patience to every child without prejudice.',
        timestamp: '14:32',
        responseType: 'COUNTERARGUMENT',
      },
    ],
    evaluation: {
      logicScore: 82,
      clarityScore: 87,
      evidenceScore: 68,
      rebuttalScore: 74,
      relevanceScore: 91,
      overallScore: 81,
      strongestArgument: {
        text: 'Human teachers provide essential socio-emotional mentorship and ethical modeling...',
        explanation:
          'You clearly connected your argument to the irreplaceable relational dimensions of pediatric development.',
      },
      weakestArgument: {
        text: 'Algorithms can never truly care because they are just silicon.',
        explanation: 'You made an ontological claim without supporting empirical behavioral evidence.',
      },
      logicalIssues: [
        {
          type: 'Overgeneralization',
          explanation: 'Assumed all human teachers successfully foster empathetic environments.',
        },
        {
          type: 'Unsupported assumption',
          explanation: 'Presupposed machines cannot simulate effective empathetic behavioral cues.',
        },
      ],
      aiStrongestCounterargument:
        'Teacher burnout rates exceed 60%, leading to disparate discipline and emotional friction that impartial algorithmic tutors completely avoid.',
      detailedFeedback:
        'A compelling defense of pedagogical humanism. You withstood high pressure from the Challenger AI, though you conceded structural points on algorithmic patience.',
      areasToImprove: [
        'Supporting emotional claims with neurological and educational metrics',
        'Addressing teacher burnout directly in your counter-framework',
      ],
    },
  },
  {
    id: 'hist-2',
    topic: INITIAL_TOPICS[1], // AI content regulation
    userSide: 'FOR',
    difficulty: 'Expert',
    mode: 'Standard',
    totalRounds: 5,
    timerOption: 60,
    currentRound: 5,
    status: 'completed',
    startedAt: '2026-09-25T10:15:00Z',
    completedAt: '2026-09-25T10:24:00Z',
    timeSpentSeconds: 540,
    messages: [],
    evaluation: {
      logicScore: 86,
      clarityScore: 89,
      evidenceScore: 78,
      rebuttalScore: 82,
      relevanceScore: 94,
      overallScore: 86,
      strongestArgument: {
        text: 'Cryptographic provenance is essential to prevent systemic epistemic collapse in democratic elections.',
        explanation: 'Anchored the discussion in verifiable technical standards and civic resilience.',
      },
      weakestArgument: {
        text: 'Any government that fails to mandate watermarks is complicit.',
        explanation: 'Emotional appeal that skipped over technical implementation feasibility.',
      },
      logicalIssues: [
        {
          type: 'False Dichotomy',
          explanation: 'Framed the choice as total regulation vs total societal collapse.',
        },
      ],
      aiStrongestCounterargument:
        'Cryptographic watermarks can be stripped with simple open-source parameter noise, rendering mandates an enforcement illusion that only burdens compliant actors.',
      detailedFeedback:
        'Formidable display of legal and technical debate points. Your rebuttal on C2PA metadata standards was precise.',
      areasToImprove: ['Anticipating evasion vectors in open-weights models'],
    },
  },
  {
    id: 'hist-3',
    topic: INITIAL_TOPICS[4], // Autonomous vehicles
    userSide: 'AGAINST',
    difficulty: 'Cross Examination',
    mode: 'Quick',
    totalRounds: 3,
    timerOption: 0,
    currentRound: 3,
    status: 'completed',
    startedAt: '2026-09-22T18:00:00Z',
    completedAt: '2026-09-22T18:08:00Z',
    timeSpentSeconds: 480,
    messages: [],
    evaluation: {
      logicScore: 79,
      clarityScore: 83,
      evidenceScore: 72,
      rebuttalScore: 75,
      relevanceScore: 88,
      overallScore: 79,
      strongestArgument: {
        text: 'Codifying mathematical value onto human lives strips moral agency and creates unresolvable legal liabilities.',
        explanation: 'Solid deontological moral framework presented with tight cohesion.',
      },
      weakestArgument: {
        text: 'Cars should just stop and not make any choices.',
        explanation: 'Fails in scenarios where kinetic momentum makes an impact inevitable.',
      },
      logicalIssues: [
        {
          type: 'Slippery Slope',
          explanation: 'Asserted that algorithmic vehicle triage leads to state-sanctioned algorithmic social credit.',
        },
      ],
      aiStrongestCounterargument:
        'By refusing to program utilitarian minimization into vehicle trajectory, you default to higher overall casualties, which is itself an active moral choice.',
      detailedFeedback:
        'Sharp ethical instincts under Cross Examination pressure. Strengthen your defense against utilitarian objections.',
      areasToImprove: ['Engaging with kinetic physics constraints in trolley scenarios'],
    },
  },
];

const DEFAULT_USER: UserProfile = {
  username: 'Alex Vance',
  email: 'alex.vance@arena.intellect',
  isGuest: false,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  rank: 'Senior Logician · Tier IV',
  debatesCompleted: 14,
  currentStreak: 5,
  averageLogicScore: 83,
  strongestSkill: 'Structural Rebuttal & Topical Relevance',
  weakestSkill: 'Empirical Evidence Citations',
  favoriteTopics: ['Education', 'AI & Society', 'Philosophy'],
  badges: INITIAL_BADGES,
};

const DebateContext = createContext<DebateContextType | undefined>(undefined);

export const DebateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('arena_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  const [topics, setTopics] = useState<DebateTopic[]>(() => {
    const saved = localStorage.getItem('arena_custom_topics');
    return saved ? [...INITIAL_TOPICS, ...JSON.parse(saved)] : INITIAL_TOPICS;
  });
  const [history, setHistory] = useState<DebateSession[]>(() => {
    const saved = localStorage.getItem('arena_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [activeSession, setActiveSession] = useState<DebateSession | null>(null);
  const [viewingEvaluationSession, setViewingEvaluationSession] = useState<DebateSession | null>(
    INITIAL_HISTORY[0]
  );
  const [selectedTopicForStart, setSelectedTopicForStart] = useState<DebateTopic | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<string | null>(null);

  // Sound & Toasts
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('arena_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('arena_history', JSON.stringify(history));
  }, [history]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addCustomTopic = (topicData: Omit<DebateTopic, 'id' | 'debatesCount'>): DebateTopic => {
    const newTopic: DebateTopic = {
      ...topicData,
      id: `custom-${Date.now()}`,
      debatesCount: 1,
    };
    setTopics((prev) => [newTopic, ...prev]);
    showToast({
      type: 'success',
      title: 'Topic Created',
      message: `"${newTopic.title}" added to your topics library.`,
    });
    return newTopic;
  };

  const startNewDebate = (params: {
    topic: DebateTopic;
    userSide: Side;
    difficulty: Difficulty;
    mode: DebateMode;
    timerOption: TimerOption;
  }) => {
    const roundCounts: Record<DebateMode, number> = {
      Quick: 3,
      Standard: 5,
      Deep: 10,
    };

    const session: DebateSession = {
      id: `session-${Date.now()}`,
      topic: params.topic,
      userSide: params.userSide,
      difficulty: params.difficulty,
      mode: params.mode,
      totalRounds: roundCounts[params.mode],
      timerOption: params.timerOption,
      currentRound: 1,
      messages: [],
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      timeSpentSeconds: 0,
    };

    setActiveSession(session);
    setCurrentView('arena');
    soundFx.playRoundStart();
    showToast({
      type: 'info',
      title: 'Entered Debate Arena',
      message: `Round 1 of ${session.totalRounds}. Present your opening argument!`,
    });
  };

  const submitUserArgument = async (text: string) => {
    if (!activeSession) return;
    // handled inside DebateArena with audio and async AI turn
  };

  const passCurrentRound = async () => {
    if (!activeSession) return;
  };

  const concedeDebate = () => {
    if (!activeSession) return;
    const endedSession: DebateSession = {
      ...activeSession,
      status: 'conceded',
      completedAt: new Date().toISOString(),
    };
    setActiveSession(null);
    setHistory((prev) => [endedSession, ...prev]);
    setCurrentView('dashboard');
    showToast({
      type: 'warning',
      title: 'Debate Conceded',
      message: 'You have withdrawn from this debate.',
    });
  };

  const completeDebate = (evaluation: DebateEvaluation) => {
    if (!activeSession) return;
    const completedSession: DebateSession = {
      ...activeSession,
      status: 'completed',
      completedAt: new Date().toISOString(),
      evaluation,
    };

    setActiveSession(null);
    setViewingEvaluationSession(completedSession);
    setHistory((prev) => [completedSession, ...prev]);

    // Update user stats
    setUser((prev) => {
      const newTotal = prev.debatesCompleted + 1;
      const newAvg = Math.round(
        (prev.averageLogicScore * prev.debatesCompleted + evaluation.logicScore) / newTotal
      );
      const newStreak = prev.currentStreak + 1;

      // Unlock badges if criteria met
      const updatedBadges = prev.badges.map((b) => {
        if (b.id === '10-debates' && newTotal >= 10 && !b.isUnlocked) {
          showToast({
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: '10 DEBATES: Dialectic veteran badge earned.',
          });
          return { ...b, isUnlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
        }
        if (b.id === 'logic-master' && evaluation.logicScore >= 90 && !b.isUnlocked) {
          showToast({
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: 'LOGIC MASTER: 90+ Logic score achieved!',
          });
          return { ...b, isUnlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
        }
        return b;
      });

      return {
        ...prev,
        debatesCompleted: newTotal,
        averageLogicScore: newAvg,
        currentStreak: newStreak,
        badges: updatedBadges,
      };
    });

    setCurrentView('analysis');
    soundFx.playDebateComplete();
  };

  const switchSidesDebate = () => {
    if (!viewingEvaluationSession) return;
    const oppositeSide: Side = viewingEvaluationSession.userSide === 'FOR' ? 'AGAINST' : 'FOR';

    startNewDebate({
      topic: viewingEvaluationSession.topic,
      userSide: oppositeSide,
      difficulty: viewingEvaluationSession.difficulty,
      mode: viewingEvaluationSession.mode,
      timerOption: viewingEvaluationSession.timerOption,
    });

    showToast({
      type: 'achievement',
      title: 'Switched Sides!',
      message: `Now defending the ${oppositeSide} position on "${viewingEvaluationSession.topic.title}".`,
    });
  };

  const loginAsGuest = () => {
    setUser({
      username: 'Guest Debater',
      email: 'guest@arena.intellect',
      isGuest: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rank: 'Guest Challenger',
      debatesCompleted: 0,
      currentStreak: 0,
      averageLogicScore: 0,
      strongestSkill: 'Intuitive Reasoning',
      weakestSkill: 'Formal Structure',
      favoriteTopics: ['Everyday Life', 'Technology'],
      badges: INITIAL_BADGES.map((b) => ({ ...b, isUnlocked: false })),
    });
    setIsAuthModalOpen(false);
    showToast({
      type: 'info',
      title: 'Guest Mode Activated',
      message: 'You can now enter debates and test your reasoning.',
    });
  };

  const loginAsUser = (username: string, email: string) => {
    setUser((prev) => ({
      ...prev,
      username: username || 'Alex Vance',
      email: email || 'alex.vance@arena.intellect',
      isGuest: false,
    }));
    setIsAuthModalOpen(false);
    showToast({
      type: 'success',
      title: 'Welcome Back',
      message: `Logged in as ${username || 'Alex Vance'}.`,
    });
  };

  const logout = () => {
    loginAsGuest();
    setCurrentView('landing');
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Switched back to guest mode.',
    });
  };

  return (
    <DebateContext.Provider
      value={{
        currentView,
        setCurrentView,
        user,
        setUser,
        topics,
        addCustomTopic,
        activeSession,
        startNewDebate,
        submitUserArgument,
        passCurrentRound,
        concedeDebate,
        completeDebate,
        switchSidesDebate,
        history,
        viewingEvaluationSession,
        setViewingEvaluationSession,
        selectedTopicForStart,
        setSelectedTopicForStart,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isCreateTopicModalOpen,
        setIsCreateTopicModalOpen,
        isInfoModalOpen,
        setIsInfoModalOpen,
        soundEnabled,
        setSoundEnabled,
        toasts,
        showToast,
        removeToast,
        loginAsGuest,
        loginAsUser,
        logout,
      }}
    >
      {children}
    </DebateContext.Provider>
  );
};

export const useDebate = () => {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
};
