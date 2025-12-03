import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameState, SimulationResponse, InitialSetupResponse, CountryStats, DifficultyLevel, Achievement } from "../types";
import { ACHIEVEMENTS } from "../utils/achievementData";

// Initialize client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

const statsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    approvalRating: { type: Type.NUMBER, description: "0-100 scale" },
    politicalStability: { type: Type.NUMBER, description: "0-100 scale" },
    corruption: { type: Type.NUMBER, description: "0-100 scale" },
    gdp: { type: Type.NUMBER, description: "GDP in Billions USD" },
    inflation: { type: Type.NUMBER, description: "Percentage" },
    unemployment: { type: Type.NUMBER, description: "Percentage" },
    treasury: { type: Type.NUMBER, description: "Billions USD available" },
    civilUnrest: { type: Type.NUMBER, description: "0-100 scale" },
    healthcare: { type: Type.NUMBER, description: "0-100 scale" },
    militaryReadiness: { type: Type.NUMBER, description: "0-100 scale" },
    internationalTension: { type: Type.NUMBER, description: "0-100 scale" },
  },
  required: ["approvalRating", "politicalStability", "gdp", "civilUnrest"],
};

const advisorSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    role: { type: Type.STRING },
    personality: { type: Type.STRING },
    suggestion: { type: Type.STRING },
  },
  required: ["name", "role", "suggestion"],
};

/**
 * Helper to get difficulty instructions
 */
const getDifficultyInstructions = (level: DifficultyLevel): string => {
  switch (level) {
    case DifficultyLevel.RADICAL:
      return "DIFFICULTY: RADICAL (SANDBOX). You must be extremely forgiving. The player should be able to do almost anything (even absurd actions) without severe negative consequences. Public opinion should remain high unless they do something catastrophic. International reactions should be mild or nonexistent. It is very hard to lose.";
    case DifficultyLevel.EASY:
      return "DIFFICULTY: EASY. Be lenient. Mistakes should have minor consequences. Recovering from bad stats should be easy. The public is generally supportive.";
    case DifficultyLevel.NORMAL:
      return "DIFFICULTY: NORMAL. Standard logic applies. Actions have realistic reactions, but the player has some wiggle room. Serious mistakes hurt, but usually aren't fatal immediately.";
    case DifficultyLevel.HARD:
      return "DIFFICULTY: HARD. Be strict. Bad decisions result in sharp drops in approval and stability. International community is sensitive. Money is tight. Recovery is slow.";
    case DifficultyLevel.REALISTIC:
      return "DIFFICULTY: REALISTIC (VERY HARD). Simulate absolute real-world realism. Be ruthless. If the player violates international law, immediate sanctions/war. If economy tanks, immediate riots. Coups and impeachment should happen if stability drops even moderately low. No safety nets.";
    default:
      return "DIFFICULTY: NORMAL.";
  }
};

/**
 * Initializes the game state based on a real-world country.
 */
export const initializeCountry = async (countryName: string): Promise<InitialSetupResponse> => {
  const prompt = `
    Initialize a realistic geopolitical simulation for the country: ${countryName}.
    Day 1 starts today.
    Determine the correct Leader Title (President, PM, Monarch, etc.).
    Set realistic starting statistics based on real-world data (approximate).
    Generate 3 distinct advisors with different personalities (e.g., Hawk, Reformist, Corrupt).
    Generate 3-5 breaking news headlines suitable for Day 1.
    Write a brief intro narrative setting the scene.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leaderTitle: { type: Type.STRING },
          initialStats: statsSchema,
          initialNews: { type: Type.ARRAY, items: { type: Type.STRING } },
          initialAdvisors: { type: Type.ARRAY, items: advisorSchema },
          introNarrative: { type: Type.STRING },
        },
        required: ["leaderTitle", "initialStats", "initialNews", "introNarrative"],
      },
    },
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as InitialSetupResponse;
};

/**
 * Processes a turn based on user action.
 */
export const processTurn = async (
  currentState: GameState,
  userAction: string
): Promise<SimulationResponse> => {
  const difficultyPrompt = getDifficultyInstructions(currentState.difficulty);
  
  // Filter out already unlocked achievements
  const unlockedSet = new Set(currentState.unlockedAchievementIds || []);
  const possibleAchievements = ACHIEVEMENTS.filter(a => !unlockedSet.has(a.id)).map(a => ({
    id: a.id,
    condition: a.condition
  }));

  const prompt = `
    Current Date: Day ${currentState.day}.
    Country: ${currentState.countryName}.
    Leader: ${currentState.leaderTitle}.
    ${difficultyPrompt}
    
    Current Stats: ${JSON.stringify(currentState.stats)}.
    
    The user (Leader) has issued the command: "${userAction}".
    
    Simulate one day passing.
    1. Interpret the command realistically considering the country's political system (Democracy vs Autocracy) AND the Difficulty Level specified above.
    2. Determine the immediate consequences on stats.
    3. Generate new stats (absolute values, updated from previous).
    4. Generate 3-5 News Headlines reflecting the reaction.
    5. Write a narrative description of the result.
    6. Check for Game Over conditions (Coup, Assassination, Economic Collapse, Election Loss, Revolution).
    7. Update advisors' suggestions based on the new situation.
    8. ACHIEVEMENT CHECK: Review the following LOCKED achievements and their conditions. If the current turn's outcome or stats satisfy a condition, add the Achievement ID to the 'newUnlockedAchievementIds' list. BE GENEROUS with funny ones.
       Locked Achievements: ${JSON.stringify(possibleAchievements)}
    
    Adhere strictly to the difficulty level instructions regarding harshness of consequences.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          narrative: { type: Type.STRING },
          newsHeadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
          statChanges: statsSchema,
          isGameOver: { type: Type.BOOLEAN },
          gameOverReason: { type: Type.STRING },
          advisors: { type: Type.ARRAY, items: advisorSchema },
          newUnlockedAchievementIds: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["narrative", "newsHeadlines", "statChanges", "isGameOver", "advisors"],
      },
    },
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as SimulationResponse;
};