export type TopicCategory =
  | 'Technology'
  | 'Education'
  | 'AI & Society'
  | 'Environment'
  | 'Ethics'
  | 'Science'
  | 'Business'
  | 'Philosophy'
  | 'Everyday Life';

export interface DebateTopic {
  id: string;
  title: string;
  category: TopicCategory;
  description: string;
  difficulty: 'Beginner' | 'Challenger' | 'Cross Examination' | 'Expert' | "Devil's Advocate";
  forPerspective: string;
  againstPerspective: string;
  tags: string[];
  debatesCount?: number;
}

export type Side = 'FOR' | 'AGAINST';

export type Difficulty =
  | 'Beginner'
  | 'Challenger'
  | 'Cross Examination'
  | 'Expert'
  | "Devil's Advocate";

export type DebateMode = 'Quick' | 'Standard' | 'Deep';

export type TimerOption = 0 | 60 | 90 | 120; // 0 = no timer

export type AIResponseType =
  | 'COUNTERARGUMENT'
  | 'CHALLENGE'
  | 'QUESTION'
  | 'REBUTTAL'
  | 'LOGIC CHECK';

export interface DebateMessage {
  id: string;
  sender: 'user' | 'ai';
  round: number;
  content: string;
  timestamp: string;
  responseType?: AIResponseType;
  strengthScore?: number;
  detectedFallacies?: string[];
  strengths?: string[];
  flaws?: string[];
}

export interface DebateEvaluation {
  logicScore: number;
  clarityScore: number;
  evidenceScore: number;
  rebuttalScore: number;
  relevanceScore: number;
  overallScore: number;
  strongestArgument: {
    text: string;
    explanation: string;
  };
  weakestArgument: {
    text: string;
    explanation: string;
  };
  logicalIssues: {
    type: string;
    explanation: string;
  }[];
  aiStrongestCounterargument: string;
  detailedFeedback: string;
  areasToImprove: string[];
}

export interface DebateSession {
  id: string;
  topic: DebateTopic;
  userSide: Side;
  difficulty: Difficulty;
  mode: DebateMode;
  totalRounds: number;
  timerOption: TimerOption;
  currentRound: number;
  messages: DebateMessage[];
  status: 'in_progress' | 'completed' | 'conceded';
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds: number;
  evaluation?: DebateEvaluation;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  category: 'milestone' | 'logic' | 'special';
}

export interface UserProfile {
  username: string;
  email: string;
  isGuest: boolean;
  avatar: string;
  rank: string;
  debatesCompleted: number;
  currentStreak: number;
  averageLogicScore: number;
  strongestSkill: string;
  weakestSkill: string;
  favoriteTopics: string[];
  badges: AchievementBadge[];
}
