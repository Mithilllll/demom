import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { analyzeContent } from "@/lib/analysis/service";
import { buildUserPrompt, VIBECHECK_SYSTEM_PROMPT } from "@/lib/openai/prompts";
import { vibeAnalysisSchema } from "@/lib/validations/analysis";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const prompt = buildUserPrompt({
      intendedVibe: project.intendedVibe,
      platformContext: project.platformContext,
      targetAudience: project.targetAudience,
      captionContext: project.captionContext,
    });

    const text = await analyzeContent(`${VIBECHECK_SYSTEM_PROMPT}\n\n${prompt}`);

    let analysisJson: unknown;
    try {
      analysisJson = JSON.parse(text);
    } catch {
      console.error("Invalid JSON from model:", text);
      return NextResponse.json(
        { error: "Model returned invalid JSON" },
        { status: 500 }
      );
    }

    const analysis = vibeAnalysisSchema.parse(analysisJson);

    const analysisResult = await prisma.analysisResult.create({
      data: {
        projectId: project.id,
        score: analysis.score,
        verdict: analysis.verdict,
        intendedVibe: analysis.intendedVibe,
        perceivedVibe: analysis.perceivedVibe,
        insightBullets: analysis.insightBullets,
        personaReactions: analysis.personaReactions,
        improvementSuggestions: analysis.improvementSuggestions,
        trendSuggestions: analysis.trendSuggestions,
        rawModelResponse: analysis,
      },
    });

    return NextResponse.json(analysisResult, { status: 201 });
  } catch (error) {
    console.error("[ANALYZE_ROUTE_ERROR]", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}