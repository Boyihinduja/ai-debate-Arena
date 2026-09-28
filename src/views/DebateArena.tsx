import React, { useState, useEffect, useRef } from 'react';
import { useDebate } from '../context/DebateContext';
import { soundFx } from '../utils/audio';
import {
  analyzeUserArgument,
  generateAiOpponentSpeech,
  evaluateFullDebate,
} from '../services/debateEngine';
import { AIResponseType, DebateMessage } from '../types';
import {
  Swords,
  Timer as TimerIcon,
  Bot,
  UserCheck,
  Send,
  SkipForward,
  AlertTriangle,
  Brain,
  ShieldCheck,
  HelpCircle,
  Zap,
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';

export const DebateArena: React.FC = () => {
  const {
    activeSession,
    completeDebate,
    concedeDebate,
    soundEnabled,
    setSoundEnabled,
    showToast,
  } = useDebate();

  if (!activeSession) return null;

  const { topic, userSide, difficulty, mode, totalRounds, timerOption } = activeSession;

  // Round & Message State
  const [messages, setMessages] = useState<DebateMessage[]>(activeSession.messages);
  const [currentRound, setCurrentRound] = useState(activeSession.currentRound || 1);
  const [argumentInput, setArgumentInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiThinkingStep, setAiThinkingStep] = useState('Analyzing premise coherence...');
  const [latestStrength, setLatestStrength] = useState<number | null>(null);
  const [latestFallacies, setLatestFallacies] = useState<string[]>([]);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(timerOption || 0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // Initial welcome / opening prompt if empty
  useEffect(() => {
    if (messages.length === 0) {
      // AI initiates the context or prompts the debater
      soundFx.playRoundStart();
    }
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (timerOption === 0 || isTimerPaused || isAiThinking) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          soundFx.playChallengeAlert();
          handlePassRound(true);
          return 0;
        }
        if (prev === 15) {
          soundFx.playChallengeAlert();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerOption, isTimerPaused, isAiThinking, currentRound]);

  const resetTimerForNextRound = () => {
    if (timerOption > 0) {
      setSecondsRemaining(timerOption);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const getAiChallengeLevel = () => {
    switch (difficulty) {
      case 'Beginner':
        return { text: 'AI CHALLENGE LEVEL: MODERATE', color: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/60' };
      case 'Challenger':
        return { text: 'AI CHALLENGE LEVEL: HIGH', color: 'text-amber-400 border-amber-800/40 bg-amber-950/60' };
      case 'Cross Examination':
        return { text: 'AI CHALLENGE LEVEL: INTENSE', color: 'text-orange-400 border-orange-800/40 bg-orange-950/60' };
      case 'Expert':
        return { text: 'AI CHALLENGE LEVEL: MAXIMUM', color: 'text-rose-400 border-rose-800/40 bg-rose-950/60' };
      case "Devil's Advocate":
        return { text: 'AI CHALLENGE LEVEL: EXTREME', color: 'text-red-400 border-red-800/40 bg-red-950/60 animate-pulse' };
      default:
        return { text: 'AI CHALLENGE LEVEL: HIGH', color: 'text-cyan-400 border-cyan-800/40 bg-cyan-950/60' };
    }
  };

  // Submit User Argument
  const handleSubmitArgument = async () => {
    const cleanText = argumentInput.trim();
    if (!cleanText || isAiThinking) return;

    soundFx.playClick();

    // 1. Analyze User Argument locally
    const analysis = analyzeUserArgument(cleanText, topic, userSide, currentRound);
    setLatestStrength(analysis.strengthScore);
    setLatestFallacies(analysis.detectedFallacies);

    const userMessage: DebateMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      round: currentRound,
      content: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      strengthScore: analysis.strengthScore,
      detectedFallacies: analysis.detectedFallacies,
      strengths: analysis.strengths,
      flaws: analysis.flaws,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setArgumentInput('');

    // Check if this was the final round
    const isLastRound = currentRound >= totalRounds;

    // 2. Trigger AI Opponent response
    setIsAiThinking(true);
    soundFx.playAiResponse();

    const thinkingSteps = [
      'Dissecting argument premises...',
      'Cross-referencing counter-evidence...',
      'Auditing for logical fallacies...',
      'Synthesizing adversarial rebuttal...',
    ];

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < thinkingSteps.length) {
        setAiThinkingStep(thinkingSteps[stepIdx]);
      }
    }, 450);

    setTimeout(async () => {
      clearInterval(stepInterval);

      const aiResponse = await generateAiOpponentSpeech({
        topic,
        userSide,
        difficulty,
        round: currentRound,
        totalRounds,
        userArgument: cleanText,
        previousMessages: updatedMessages,
      });

      const aiMessage: DebateMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        round: currentRound,
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseType: aiResponse.responseType,
      };

      const finalRoundMessages = [...updatedMessages, aiMessage];
      setMessages(finalRoundMessages);
      setIsAiThinking(false);
      soundFx.playChallengeAlert();

      if (isLastRound) {
        // Complete debate and evaluate
        setTimeout(() => {
          const evalResult = evaluateFullDebate({
            topic,
            userSide,
            difficulty,
            messages: finalRoundMessages,
          });
          completeDebate(evalResult);
        }, 1200);
      } else {
        // Advance to next round
        setCurrentRound((prev) => prev + 1);
        resetTimerForNextRound();
        showToast({
          type: 'info',
          title: `Round ${currentRound + 1} of ${totalRounds}`,
          message: 'The AI has mounted a challenge. Rebut its points.',
        });
      }
    }, 1800);
  };

  // Pass Round
  const handlePassRound = (fromTimeout = false) => {
    soundFx.playClick();
    setShowPassConfirm(false);

    const userMessage: DebateMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      round: currentRound,
      content: fromTimeout
        ? '[Timer Expired: Speaker conceded the floor for this round.]'
        : '[Passed Round: User yielded turn without presenting rebuttal.]',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      strengthScore: 35,
    };

    const updated = [...messages, userMessage];
    setMessages(updated);

    if (currentRound >= totalRounds) {
      const evalResult = evaluateFullDebate({
        topic,
        userSide,
        difficulty,
        messages: updated,
      });
      completeDebate(evalResult);
    } else {
      setCurrentRound((prev) => prev + 1);
      resetTimerForNextRound();
    }
  };

  const getBadgeForType = (type?: AIResponseType) => {
    switch (type) {
      case 'COUNTERARGUMENT':
        return { label: 'COUNTERARGUMENT', style: 'bg-amber-950/80 text-amber-300 border-amber-800/50' };
      case 'CHALLENGE':
        return { label: 'CHALLENGE', style: 'bg-rose-950/80 text-rose-300 border-rose-800/50' };
      case 'QUESTION':
        return { label: 'CROSS-EXAM QUESTION', style: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/50' };
      case 'REBUTTAL':
        return { label: 'CLOSING REBUTTAL', style: 'bg-violet-950/80 text-violet-300 border-violet-800/50' };
      case 'LOGIC CHECK':
        return { label: 'LOGIC CHECK AUDIT', style: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' };
      default:
        return { label: 'OPPOSING SPEECH', style: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const challengeInfo = getAiChallengeLevel();

  return (
    <div className="min-h-screen bg-[#05070e] flex flex-col pb-24 lg:pb-12">
      {/* 1. TOP BAR */}
      <div className="sticky top-16 z-30 w-full border-b border-white/5 bg-[#070b18]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Topic Title & Stance */}
          <div className="space-y-0.5 max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-cyan-400 font-bold uppercase">{topic.category}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{difficulty} RATING</span>
            </div>
            <h2 className="font-heading font-bold text-sm sm:text-base text-white tracking-tight line-clamp-1">
              {topic.title}
            </h2>
          </div>

          {/* Right: Round Counter, Timer, AI Challenge Badge, and Concede */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Round Indicator */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-300">
                ROUND {currentRound} / {totalRounds}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalRounds }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i + 1 < currentRound
                        ? 'bg-cyan-500'
                        : i + 1 === currentRound
                        ? 'bg-cyan-400 animate-ping'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Optional Timer */}
            {timerOption > 0 && (
              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono font-bold text-xs ${
                  secondsRemaining <= 15
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800/60 animate-pulse'
                    : 'bg-slate-900/80 text-slate-200 border-slate-700/80'
                }`}
              >
                <TimerIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}

            {/* AI Challenge Level Indicator */}
            <div
              className={`hidden md:flex px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold ${challengeInfo.color}`}
            >
              {challengeInfo.text}
            </div>

            {/* Concede Button */}
            <button
              onClick={concedeDebate}
              title="Withdraw from debate"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN ARENA SCREEN (Dual-Side Speech Battle) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between">
        {/* Arena Stage Sub-Header */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5 mb-6 text-xs font-mono">
          {/* Left Speaker Header */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-heading font-bold text-white uppercase">YOU</span>
              <span className="text-blue-400 font-bold ml-1.5">[{userSide}]</span>
            </div>
          </div>

          {/* Right Speaker Header */}
          <div className="flex items-center justify-end gap-2">
            <div className="text-right">
              <span className="font-heading font-bold text-white uppercase">AI OPPONENT</span>
              <span className="text-violet-400 font-bold ml-1.5">
                [{userSide === 'FOR' ? 'AGAINST' : 'FOR'}]
              </span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Bot className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Conversation Stream (Forensic Speech Cards) */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-1 pb-6 min-h-[360px]">
          {messages.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-cyan-500/30 bg-cyan-950/20 text-center space-y-3 my-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
                <Swords className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Arena Floor is Open
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                You have the opening floor. You are arguing <strong className="text-cyan-300">{userSide}</strong> the resolution: “{topic.title}”. Articulate your foundational premises below.
              </p>
              <div className="text-[11px] font-mono text-slate-400">
                Pro-tip: Include causal logic (therefore, because) and avoid sweeping absolutes (always, never).
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const badge = getBadgeForType(msg.responseType);

              return (
                <div
                  key={msg.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-start ${
                    isUser ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Left Column (User speech card or blank spacer) */}
                  <div className={`md:col-span-6 ${isUser ? 'order-1' : 'order-2 hidden md:block'}`}>
                    {isUser ? (
                      <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 shadow-lg shadow-blue-950/30 space-y-3 relative group">
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-400">ROUND {msg.round}</span>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-400">{msg.timestamp}</span>
                          </div>
                          {msg.strengthScore !== undefined && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 border border-blue-800/40 text-blue-300">
                              Strength: {msg.strengthScore}%
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans whitespace-pre-line">
                          {msg.content}
                        </p>

                        {/* Audit Details */}
                        {msg.detectedFallacies && msg.detectedFallacies.length > 0 && (
                          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Detected:
                            </span>
                            {msg.detectedFallacies.map((f, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Right Column (AI speech card or blank spacer) */}
                  <div className={`md:col-span-6 ${!isUser ? 'order-1' : 'order-2 hidden md:block'}`}>
                    {!isUser ? (
                      <div className="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30 shadow-lg shadow-violet-950/30 space-y-3 relative group">
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-violet-400">ROUND {msg.round}</span>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-400">{msg.timestamp}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.style}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans whitespace-pre-line">
                          {msg.content}
                        </p>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>Forensic Cross-Examination</span>
                          <span className="text-violet-400/80">Adversarial Logic Engine</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}

          {/* AI Thinking Animation */}
          {isAiThinking && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-6 hidden md:block" />
              <div className="md:col-span-6">
                <div className="p-5 rounded-2xl bg-violet-950/20 border border-violet-500/30 animate-pulse space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-violet-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping" />
                      <span className="font-bold">AI OPPONENT FORMULATING REBUTTAL</span>
                    </div>
                    <span className="text-[10px]">THINKING</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono italic">
                    {aiThinkingStep}
                  </p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full w-2/3 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. INPUT AREA & ARGUMENT STRENGTH INDICATOR */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          {/* Live Feedback / Argument Strength Indicator Banner */}
          {latestStrength !== null && (
            <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 font-medium">Last Round Argument Strength:</span>
                <span className="font-mono font-bold text-cyan-300">{latestStrength}%</span>
              </div>
              {latestFallacies.length > 0 ? (
                <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-mono">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flagged: {latestFallacies.join(', ')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Zero formal fallacies detected in last submission.</span>
                </div>
              )}
            </div>
          )}

          {/* Large Argument Textarea */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-violet-500/30">
            <div className="bg-[#080d1e] rounded-[15px] p-3 sm:p-4">
              <textarea
                ref={textareaRef}
                rows={4}
                disabled={isAiThinking}
                value={argumentInput}
                onChange={(e) => setArgumentInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    handleSubmitArgument();
                  }
                }}
                placeholder="Present your argument... Construct your premise, address counter-points, and provide evidence."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 self-start sm:self-center">
                  <span>{argumentInput.trim().split(/\s+/).filter(Boolean).length} words</span>
                  <span>·</span>
                  <span className="hidden sm:inline">Press Cmd + Enter to submit</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  {/* Pass Round Button */}
                  <button
                    type="button"
                    disabled={isAiThinking}
                    onClick={() => setShowPassConfirm(true)}
                    className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>PASS ROUND</span>
                  </button>

                  {/* Submit Argument Button */}
                  <button
                    type="button"
                    disabled={isAiThinking || !argumentInput.trim()}
                    onClick={handleSubmitArgument}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SUBMIT ARGUMENT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Pass Round */}
      {showPassConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#090d1a] border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="font-heading font-bold text-lg text-white">
              Yield the Floor for this Round?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Passing this round will yield the turn without presenting a rebuttal, which may lower your Rebuttal and Evidence scores in final evaluation.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowPassConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePassRound(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
