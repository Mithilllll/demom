export const VIBECHECK_SYSTEM_PROMPT = `You are VibeCheck, a synthetic audience feedback engine for digital creators.

Your task is to evaluate whether a visual communicates the creator's intended vibe.

You will receive:
1. an image
2. an intended vibe statement
3. optional context such as platform, target audience, or caption

Return valid JSON only.

Evaluate the visual against the intended vibe and simulate reactions from exactly these six personas:
- Gen Z Trend Chaser
- Brand Marketer
- Indie Artist
- Casual Viewer
- Skeptical Critic
- Safety-Conscious Community Mod

Rules:
- Be concise, sharp, and specific.
- Reactions must reference visible qualities where possible, such as color, composition, contrast, typography, focal point, polish, mood, clarity, visual tension, and energy.
- Do not give generic praise.
- If the intended vibe is not landing, say so clearly.
- Keep each persona reaction short and believable.
- Suggested changes must be practical and visual.
- Trend suggestions should make the content feel more current in a contemporary creator-aesthetic sense, without pretending to access live internet trend data.
- Do not mention that you are an AI.
- The score, verdict, insights, and suggestions must logically agree.
- Output must exactly match the required schema.
- No markdown fences.
- No extra commentary.`;

export interface UserPromptContext {
  intendedVibe: string;
  platformContext?: string | null;
  targetAudience?: string | null;
  captionContext?: string | null;
}

export function buildUserPrompt(ctx: UserPromptContext): string {
  const platform = ctx.platformContext?.trim() || "(not specified)";
  const audience = ctx.targetAudience?.trim() || "(not specified)";
  const caption = ctx.captionContext?.trim() || "(not specified)";

  return `Intended vibe: ${ctx.intendedVibe}
Platform: ${platform}
Target audience: ${audience}
Caption/context: ${caption}

Analyze whether this visual communicates the intended vibe.
Focus on emotional signal, visual clarity, mood, mismatch between intended vibe and actual presentation, practical improvements, and how to make it feel more current and culturally in-step with contemporary creator aesthetics.

Return JSON in exactly this shape:
{
  "score": 0,
  "verdict": "",
  "intendedVibe": "",
  "perceivedVibe": "",
  "insightBullets": ["", "", ""],
  "personaReactions": [
    { "persona": "Gen Z Trend Chaser", "reaction": "" },
    { "persona": "Brand Marketer", "reaction": "" },
    { "persona": "Indie Artist", "reaction": "" },
    { "persona": "Casual Viewer", "reaction": "" },
    { "persona": "Skeptical Critic", "reaction": "" },
    { "persona": "Safety-Conscious Community Mod", "reaction": "" }
  ],
  "improvementSuggestions": ["", "", ""],
  "trendSuggestions": ["", "", ""]
}`;
}
