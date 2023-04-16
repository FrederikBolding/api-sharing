import { Readable } from "stream";
import { Web3Storage } from "web3.storage";

const API_KEY = process.env.STORAGE_API_KEY;

const client = new Web3Storage({ token: API_KEY });

export const publishToIPFS = async (code: string) => {
  const file = { name: "code.js", stream: () => Readable.from(code) };
  const cid = await client.put([file]);
  return cid;
};

export const fetchFromIPFS = async (cid: string) => {
  const response = await client.get(cid);
  const files = await response?.files();
  const codeFile = files?.find((f) => f.name === "code.js");
  const code = await codeFile?.text();
  if (!code) {
    throw new Error(`${cid} not found`);
  }
  return code;
};
