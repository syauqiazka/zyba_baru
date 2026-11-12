import { MoodLevel } from "@/generated/account-client";

export interface ScoreInputData {
  dailyAssessments: Array<{
    date: string;
    mood: MoodLevel;
    stressLevel?: number | null;
    sleepRating?: number | null;
    energyTags?: string[];
    answers?: any;
    createdAt?: Date;
  }>;
  initialAssessment?: {
    initialMood?: MoodLevel | null;
    stressLevel?: number | null;
    sleepQualityRating?: number | null;
  } | null;
  completedActivitiesCount?: number;
  communityContributionsCount?: number;
}

export interface ScoreResult {
  zybaScore: number;
  mentalScore: number;
  physicalScore: number;
  socialScore: number;
  hasEnoughData: boolean;
  sampleDaysCount: number;
}

/**
 * Mood to 0-100 numerical value
 */
export function moodToPoints(mood: MoodLevel | null | undefined): number {
  switch (mood) {
    case MoodLevel.OVERJOYED:
      return 100;
    case MoodLevel.HAPPY:
      return 80;
    case MoodLevel.NEUTRAL:
      return 60;
    case MoodLevel.SAD:
      return 40;
    case MoodLevel.DEPRESSED:
      return 20;
    default:
      return 60;
  }
}

/**
 * 1-5 scale to 20-100 score
 */
export function scaleToPoints(val: number | null | undefined, reverse = false): number {
  if (val == null || val < 1 || val > 5) return 60;
  const normalized = reverse ? (6 - val) : val;
  return normalized * 20;
}

/**
 * Calculates dynamic Zyba Score over a rolling window (up to 7 days).
 * Formula: score = (mental * 0.5) + (fisik * 0.25) + (sosial * 0.25)
 * Clamped strictly to [0, 100].
 */
export function calculateZybaScore(input: ScoreInputData): ScoreResult {
  const {
    dailyAssessments = [],
    initialAssessment = null,
    completedActivitiesCount = 0,
    communityContributionsCount = 0,
  } = input;

  // If completely empty with zero baseline
  if (dailyAssessments.length === 0 && !initialAssessment) {
    return {
      zybaScore: 50,
      mentalScore: 50,
      physicalScore: 50,
      socialScore: 50,
      hasEnoughData: false,
      sampleDaysCount: 0,
    };
  }

  // Calculate averages from dailyAssessments (max 7 latest)
  const windowAssessments = dailyAssessments.slice(0, 7);
  const sampleCount = windowAssessments.length;

  let totalMental = 0;
  let totalPhysical = 0;
  let totalSocial = 0;

  if (sampleCount > 0) {
    for (const d of windowAssessments) {
      // 1. Mental domain: mood, stress, anxiety, satisfaction, productivity, selfTime
      const moodPts = moodToPoints(d.mood);
      const stressPts = d.stressLevel ? scaleToPoints(d.stressLevel, true) : 60;
      
      const ans = (d.answers as Record<string, any>) || {};
      const anxietyPts = ans.anxiety ? scaleToPoints(Number(ans.anxiety), true) : stressPts;
      const satisfactionPts = ans.satisfaction ? scaleToPoints(Number(ans.satisfaction)) : 60;
      const productivityPts = ans.productivity ? scaleToPoints(Number(ans.productivity)) : 60;
      const selfTimePts = ans.selfTime ? scaleToPoints(Number(ans.selfTime)) : 60;

      const dayMental = (moodPts * 0.3) + (stressPts * 0.2) + (anxietyPts * 0.2) + 
                        (satisfactionPts * 0.1) + (productivityPts * 0.1) + (selfTimePts * 0.1);
      totalMental += dayMental;

      // 2. Physical domain: sleepRating, sleepHours, energyTags, meals, activity
      const sleepPts = d.sleepRating ? scaleToPoints(d.sleepRating) : 60;
      
      let sleepHoursPts = 70;
      if (ans.sleepHours === "<5") sleepHoursPts = 45;
      else if (ans.sleepHours === "5-6") sleepHoursPts = 70;
      else if (ans.sleepHours === "7-8") sleepHoursPts = 95;
      else if (ans.sleepHours === ">8") sleepHoursPts = 85;

      let energyPts = 60;
      if (Array.isArray(d.energyTags)) {
        if (d.energyTags.some(t => ["Segar", "Bugar", "Fokus", "Berenergi"].includes(t))) energyPts += 20;
        if (d.energyTags.some(t => ["Lemas", "Lelah", "Butuh Rebahan", "Mengantuk"].includes(t))) energyPts -= 20;
      }
      energyPts = Math.min(100, Math.max(20, energyPts));

      let mealPts = 60;
      if (ans.regularMeals === "Sangat Teratur") mealPts = 100;
      else if (ans.regularMeals === "Cukup") mealPts = 75;
      else if (ans.regularMeals === "Belum") mealPts = 40;

      let actPts = 60;
      if (ans.physicalActivity === "Olahraga") actPts = 100;
      else if (ans.physicalActivity === "Jalan Santai") actPts = 80;
      else if (ans.physicalActivity === "Diam di Tempat") actPts = 45;

      const dayPhysical = (sleepPts * 0.3) + (sleepHoursPts * 0.25) + (energyPts * 0.15) + (mealPts * 0.15) + (actPts * 0.15);
      totalPhysical += dayPhysical;

      // 3. Social domain: connection, supported, communityInteraction
      const connectionPts = ans.connection ? scaleToPoints(Number(ans.connection)) : 60;
      const supportedPts = ans.supported ? scaleToPoints(Number(ans.supported)) : 60;
      const commPts = ans.communityInteraction ? scaleToPoints(Number(ans.communityInteraction)) : 60;

      const daySocial = (connectionPts * 0.4) + (supportedPts * 0.4) + (commPts * 0.2);
      totalSocial += daySocial;
    }

    totalMental = totalMental / sampleCount;
    totalPhysical = totalPhysical / sampleCount;
    totalSocial = totalSocial / sampleCount;
  } else if (initialAssessment) {
    // Fallback to baseline initial assessment
    totalMental = moodToPoints(initialAssessment.initialMood);
    if (initialAssessment.stressLevel) {
      totalMental = (totalMental * 0.6) + (scaleToPoints(initialAssessment.stressLevel, true) * 0.4);
    }
    totalPhysical = initialAssessment.sleepQualityRating 
      ? scaleToPoints(initialAssessment.sleepQualityRating) 
      : 60;
    totalSocial = 55; // Initial neutral baseline
  }

  // Bonus/reinforcement from completed activities (up to +10 pts on physical)
  if (completedActivitiesCount > 0) {
    totalPhysical = Math.min(100, totalPhysical + Math.min(10, completedActivitiesCount * 2));
  }

  // Bonus from community contributions (up to +10 pts on social)
  if (communityContributionsCount > 0) {
    totalSocial = Math.min(100, totalSocial + Math.min(10, communityContributionsCount * 2));
  }

  // Final weights: Mental 50%, Fisik 25%, Sosial 25%
  const finalScore = Math.round((totalMental * 0.5) + (totalPhysical * 0.25) + (totalSocial * 0.25));
  const clampedScore = Math.max(0, Math.min(100, finalScore));

  return {
    zybaScore: clampedScore,
    mentalScore: Math.round(Math.max(0, Math.min(100, totalMental))),
    physicalScore: Math.round(Math.max(0, Math.min(100, totalPhysical))),
    socialScore: Math.round(Math.max(0, Math.min(100, totalSocial))),
    hasEnoughData: sampleCount > 0,
    sampleDaysCount: sampleCount,
  };
}
