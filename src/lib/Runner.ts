import { fetchFromIPFS } from "./ipfs";

export class Runner {
  #code: string;

  constructor({ code }: { code: string }) {
    this.#code = code;
  }

  async #runDependency(dependencyCid: string) {
    const runner = await Runner.fetch(dependencyCid);
    return runner.run();
  }

  run() {
    const mod = { exports: {} };
    const compartment = new Compartment({ module: mod });
    compartment.evaluate(this.#code);
    return mod;
  }

  static async fetch(cid: string): Promise<Runner> {
    const code = await fetchFromIPFS(cid);
    return new Runner({ code });
  }
}
