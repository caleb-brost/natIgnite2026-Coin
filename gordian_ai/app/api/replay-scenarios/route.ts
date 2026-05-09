import { buildReplayScenarios } from "../../_lib/replay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await buildReplayScenarios(3);
    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Failed to build replay scenarios" },
      { status: 500 },
    );
  }
}
