import "ses";
import type { NextApiRequest, NextApiResponse } from "next";
import { Runner } from "@/lib/Runner";

lockdown();
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const code = request.body;
  const runner = await Runner.create(code);
  const { exports } = runner.run();
  response.status(200).json({ exports });
}
