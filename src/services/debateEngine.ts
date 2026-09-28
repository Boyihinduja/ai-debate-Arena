import {
  AIResponseType,
  DebateEvaluation,
  DebateMessage,
  DebateTopic,
  Difficulty,
  Side,
} from '../types';

export interface ArgumentAnalysis {
  strengthScore: number;
  detectedFallacies: string[];
  strengths: string[];
  flaws: string[];
  feedbackTip: string;
}

// Logic check and fallacy heuristic detectors
const FALLACY_PATTERNS = [
  {
    type: 'Overgeneralization',
    regex: /\b(always|never|everyone|nobody|every single|all people|completely impossible)\b/i,
    explanation: 'Uses absolute quantifiers (always, never, everyone) without accounting for exceptions or nuances.',
  },
  {
    type: 'False Dichotomy',
    regex: /\b(either we|only two choices|if we don't .* then we will fail|it's simple: either)\b/i,
    explanation: 'Frames the dilemma as an all-or-nothing binary, ignoring viable middle paths or alternative solutions.',
  },
  {
    type: 'Slippery Slope',
    regex: /\b(will inevitably lead to|next thing you know|lead down a slippery slope|catastrophe)\b/i,
    explanation: 'Asserts an extreme chain of causal events without demonstrating intermediate causal probability.',
  },
  {
    type: 'Appeal to Emotion',
    regex: /\b(heartless|cruel|monstrous|unimaginable horror|disgusting|pure evil)\b/i,
    explanation: 'Relies predominantly on emotionally charged adjectives rather than empirical or structural rationale.',
  },
  {
    type: 'Circular Reasoning',
    regex: /\b(because it is right|obviously true because|self-evident and therefore true)\b/i,
    explanation: 'Presupposes the truth of the conclusion within the supporting premise.',
  },
  {
    type: 'Unsupported Assertion',
    regex: /\b(studies prove that|it is common knowledge|scientists all agree|history shows that)\b/i,
    explanation: 'Cites generic consensus or studies without referencing specific mechanisms or verifiable citations.',
  },
];

export function analyzeUserArgument(
  text: string,
  topic: DebateTopic,
  userSide: Side,
  round: number
): ArgumentAnalysis {
  const clean = text.trim();
  const wordCount = clean.split(/\s+/).length;
  
  const detectedFallacies: string[] = [];
  const flaws: string[] = [];
  const strengths: string[] = [];

  // Fallacy detection
  FALLACY_PATTERNS.forEach((pattern) => {
    if (pattern.regex.test(clean)) {
      detectedFallacies.push(pattern.type);
    }
  });

  // Structural checks
  const hasEvidenceKeywords = /\b(data|evidence|research|empirical|example|study|demonstrated|instance|specifically|percent|statistics|analogy)\b/i.test(clean);
  const hasCausalReasoning = /\b(because|consequently|therefore|thus|results in|leads to|furthermore|given that)\b/i.test(clean);
  const hasCounterAcknowledgement = /\b(while|although|granted|critics argue|opponents claim|despite|admittedly)\b/i.test(clean);

  let score = 50;

  // Length scoring
  if (wordCount < 15) {
    score -= 20;
    flaws.push('Argument is too terse; lacks foundational premises.');
  } else if (wordCount >= 25 && wordCount <= 120) {
    score += 15;
    strengths.push('Concise and focused delivery.');
  } else if (wordCount > 120) {
    score += 10;
    strengths.push('Richly articulated position.');
  }

  // Reasoning depth
  if (hasCausalReasoning) {
    score += 12;
    strengths.push('Established explicit causal links.');
  } else {
    flaws.push('Lacks connective causal reasoning phrases (e.g. therefore, consequently).');
  }

  // Evidence
  if (hasEvidenceKeywords) {
    score += 15;
    strengths.push('Incorporated evidentiary or concrete reference markers.');
  } else {
    flaws.push('Lacks empirical grounding or verifiable examples.');
  }

  // Concession / Nuance
  if (hasCounterAcknowledgement) {
    score += 10;
    strengths.push('Proactively anticipates and hedges against counterarguments.');
  }

  // Fallacy deductions
  if (detectedFallacies.length > 0) {
    score -= detectedFallacies.length * 8;
    flaws.push(`Identified potential ${detectedFallacies.join(', ')}.`);
  }

  // Clamp 20 - 98
  const finalScore = Math.max(25, Math.min(96, Math.round(score)));

  let feedbackTip = 'Solid argument. Next round, bolster your claim with a specific empirical case study.';
  if (detectedFallacies.includes('Overgeneralization')) {
    feedbackTip = 'Refine absolute terms like "never" or "always" to withstand scrutiny.';
  } else if (!hasEvidenceKeywords) {
    feedbackTip = 'Introduce concrete data, precedents, or operational mechanics to reinforce this claim.';
  } else if (hasCounterAcknowledgement) {
    feedbackTip = 'Excellent counter-anticipation. Press the AI on its core vulnerabilities.';
  }

  return {
    strengthScore: finalScore,
    detectedFallacies,
    strengths,
    flaws,
    feedbackTip,
  };
}

// Generate an intelligent, adversarial AI opponent speech
export async function generateAiOpponentSpeech(params: {
  topic: DebateTopic;
  userSide: Side;
  difficulty: Difficulty;
  round: number;
  totalRounds: number;
  userArgument: string;
  previousMessages: DebateMessage[];
}): Promise<{
  content: string;
  responseType: AIResponseType;
}> {
  const { topic, userSide, difficulty, round, totalRounds, userArgument } = params;

  // Response type rotation for realistic debate clash
  const responseTypes: AIResponseType[] = [
    'COUNTERARGUMENT',
    'CHALLENGE',
    'QUESTION',
    'REBUTTAL',
    'LOGIC CHECK',
  ];

  let selectedType: AIResponseType = responseTypes[(round - 1) % responseTypes.length];
  if (round === totalRounds) {
    selectedType = 'REBUTTAL';
  } else if (round === 1) {
    selectedType = 'COUNTERARGUMENT';
  }

  // Difficulty prefix & tone
  let toneRigor = 'direct and analytical';
  if (difficulty === 'Beginner') {
    toneRigor = 'pedagogical, pointing out premises';
  } else if (difficulty === 'Cross Examination') {
    selectedType = 'QUESTION';
  } else if (difficulty === "Devil's Advocate") {
    selectedType = 'CHALLENGE';
  }

  // Dynamic context generation
  const opposingSide: Side = userSide === 'FOR' ? 'AGAINST' : 'FOR';
  const opposingPerspective = userSide === 'FOR' ? topic.againstPerspective : topic.forPerspective;
  const userPerspective = userSide === 'FOR' ? topic.forPerspective : topic.againstPerspective;

  // High quality contextually tailored statements
  const responsesByCategory: Record<AIResponseType, string[]> = {
    COUNTERARGUMENT: [
      `While you contend that ${topic.title.replace('Should ', '').replace('?', '')} is justified, this perspective overlooks the foundational structural friction: ${opposingPerspective.split(';')[0] || opposingPerspective}. If your position holds, how do you mitigate systemic externalities?`,
      `Your argument establishes that ${userArgument.slice(0, 50)}..., yet it presupposes optimal execution in real-world friction. In practice, ${opposingPerspective} creates an asymmetric downside that outweighs any theoretical upside.`,
      `I counter your premise directly: focusing exclusively on the immediate benefits obscures the systemic secondary effects. Specifically, ${opposingPerspective.toLowerCase()} demonstrates why your stance fails under macroeconomic stress.`
    ],
    CHALLENGE: [
      `Challenge to your fundamental premise: your assertion rests upon an untested assumption. You take for granted that human institutions will execute this impartially. What verifiable historical precedent shows this model avoiding institutional capture?`,
      `You claim that your stance safeguards fairness, but I challenge the causality: isn't this merely treating a symptom while ignoring root-cause incentives? Defend how your argument survives the free-rider dilemma.`,
      `I challenge your risk assessment. You have framed this as a low-risk intervention, but catastrophic tail-risk analysis suggests that ${opposingPerspective.toLowerCase()}. Why should society gamble on that outcome?`
    ],
    QUESTION: [
      `Under cross-examination: If your thesis is valid, where do you draw the normative boundary? Would you apply this exact same logic if the political or economic stakeholders were entirely reversed?`,
      `Consider this concrete dilemma: if implementing your solution causes a 15% reduction in individual liberty or systemic efficiency, does the net utility still justify state coercion? State your clear threshold.`,
      `What empirical metrics or falsifiable conditions would convince you that your position has produced more harm than good? If none exist, is your stance an unfalsifiable dogma rather than a reasoned argument?`
    ],
    REBUTTAL: [
      `Your rebuttal fails to engage with the core contention I raised in the prior round. You pivoted to high-level ideals rather than addressing the structural constraint that ${opposingPerspective.toLowerCase()}.`,
      `I dismantle your primary assertion: your line of reasoning commits an implicit false dichotomy. You imply that rejecting your approach leaves no viable alternatives, deliberately ignoring hybrid institutional compromises.`,
      `In this closing exchange, your framework collapses under scrutiny. While appealing in sentiment, it lacks operational mechanics. Without accountability mechanisms, ${opposingPerspective.toLowerCase()} remains the unavoidable reality.`
    ],
    'LOGIC CHECK': [
      `LOGIC AUDIT: Your argument contains an unstated premise: you equate correlation with systemic causation. Just because two trends coincide does not validate that your intervention caused the stabilization.`,
      `LOGIC AUDIT: Notice the implicit overgeneralization in your submission. You cite isolated success conditions and extrapolate them universally, discounting asymmetric local governance variables.`,
      `LOGIC AUDIT: Your premise attempts to shift the burden of proof. The burden rests on your position to prove structural viability, not on the opposition to prove universal impossibility.`
    ]
  };

  const pool = responsesByCategory[selectedType];
  const template = pool[Math.floor(Math.random() * pool.length)];

  return {
    content: template,
    responseType: selectedType,
  };
}

export function evaluateFullDebate(params: {
  topic: DebateTopic;
  userSide: Side;
  difficulty: Difficulty;
  messages: DebateMessage[];
}): DebateEvaluation {
  const { topic, userSide, difficulty, messages } = params;
  const userMessages = messages.filter((m) => m.sender === 'user');
  const aiMessages = messages.filter((m) => m.sender === 'ai');

  // Compute average of message strength scores
  let rawLogic = 78;
  let rawClarity = 82;
  let rawEvidence = 65;
  let rawRebuttal = 72;
  let rawRelevance = 88;

  if (userMessages.length > 0) {
    const avgStrength =
      userMessages.reduce((acc, m) => acc + (m.strengthScore || 70), 0) /
      userMessages.length;
    rawLogic = Math.round(avgStrength * 0.95 + 4);
    rawClarity = Math.round(avgStrength * 1.02);
    rawEvidence = Math.round(avgStrength * 0.86);
    rawRebuttal = Math.round(avgStrength * 0.9 + 5);
    rawRelevance = Math.round(Math.min(98, avgStrength + 10));
  }

  // Difficulty multiplier / penalty
  if (difficulty === 'Expert' || difficulty === "Devil's Advocate") {
    rawLogic = Math.max(55, rawLogic - 4);
    rawEvidence = Math.max(50, rawEvidence - 6);
  }

  // Find strongest and weakest arguments based on score/length
  let strongestMsg = userMessages[0];
  let weakestMsg = userMessages[0];

  userMessages.forEach((msg) => {
    if ((msg.strengthScore || 0) > (strongestMsg?.strengthScore || 0)) {
      strongestMsg = msg;
    }
    if ((msg.strengthScore || 100) < (weakestMsg?.strengthScore || 100)) {
      weakestMsg = msg;
    }
  });

  const collectedFallacies = new Set<string>();
  userMessages.forEach((msg) => {
    msg.detectedFallacies?.forEach((f) => collectedFallacies.add(f));
  });

  const fallbackFallacies = ['Overgeneralization', 'Unsupported assumption'];
  const finalFallaciesList =
    collectedFallacies.size > 0
      ? Array.from(collectedFallacies)
      : fallbackFallacies;

  const logicalIssues = finalFallaciesList.map((f) => {
    const found = FALLACY_PATTERNS.find((p) => p.type === f);
    return {
      type: f,
      explanation:
        found?.explanation ||
        'Premise relied on unverified extrapolations without counter-weight evidence.',
    };
  });

  const aiStrongestCounter =
    aiMessages.length > 0
      ? aiMessages[Math.floor(aiMessages.length / 2)].content
      : `If ${topic.title.replace('Should ', '').replace('?', '')} were implemented, systemic negative externalities would immediately overwhelm the intended benefits.`;

  const overallScore = Math.round(
    (rawLogic * 0.25 +
      rawClarity * 0.2 +
      rawEvidence * 0.2 +
      rawRebuttal * 0.2 +
      rawRelevance * 0.15)
  );

  return {
    logicScore: Math.min(99, Math.max(40, rawLogic)),
    clarityScore: Math.min(99, Math.max(45, rawClarity)),
    evidenceScore: Math.min(99, Math.max(35, rawEvidence)),
    rebuttalScore: Math.min(99, Math.max(40, rawRebuttal)),
    relevanceScore: Math.min(99, Math.max(50, rawRelevance)),
    overallScore,
    strongestArgument: {
      text: strongestMsg?.content || 'Your defense of foundational principles.',
      explanation:
        'You clearly linked your core thesis to measurable structural outcomes and defended your premises with high clarity.',
    },
    weakestArgument: {
      text: weakestMsg?.content || 'Your brief response in the middle exchange.',
      explanation:
        'You made a broad claim without supporting data or concrete mechanisms, leaving an opening for the AI to exploit.',
    },
    logicalIssues,
    aiStrongestCounterargument: aiStrongestCounter,
    detailedFeedback: `Throughout this debate on whether "${topic.title}", you demonstrated strong thematic focus (${rawRelevance}/100) and articulate clarity. However, your debate performance against the ${difficulty} AI opponent exposed vulnerabilities in empirical citations and vulnerability to counter-interrogation.`,
    areasToImprove: [
      'Supporting high-level claims with verifiable statistical or historical evidence',
      'Directly addressing adversarial counterarguments before advancing new points',
      'Eliminating sweeping generalizations and absolute terms (always, never)',
    ],
  };
}
