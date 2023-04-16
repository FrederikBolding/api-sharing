import "ses";
import type { NextApiRequest, NextApiResponse } from "next";
import { Runner } from "@/lib/Runner";

lockdown();
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { cid } = request.query;
  const runner = await Runner.fetch(cid as string);
  const { exports } = runner.run();
  response.status(200).json({ exports });
}
