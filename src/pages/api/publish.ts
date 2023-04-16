import type { NextApiRequest, NextApiResponse } from "next";
import { publishToIPFS } from "@/lib/ipfs";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const cid = await publishToIPFS(request.body);
  response.status(200).json({ cid });
}
