import { findDependencies } from "./dependencies";
import { fetchFromIPFS } from "./ipfs";

export class Runner {
  #code: string;

  #dependencies: Record<string, Runner> | null = null;

  constructor({ code }: { code: string }) {
    this.#code = code;
  }

  async initialize() {
    const parsedDependencies = findDependencies(this.#code);

    // Find all dependencies and create runners for them, recursively finds dependencies of dependencies etc.
    this.#dependencies = await parsedDependencies.reduce<
      Promise<Record<string, Runner>>
    >(async (previousPromise, dependencyCid) => {
      const result = await Runner.fetch(dependencyCid);
      const acc = await previousPromise;
      if (result) {
        acc[dependencyCid] = result;
      }
      return acc;
    }, Promise.resolve({}));
  }

  #runDependency(dependencyCid: string) {
    const runner = this.#dependencies![dependencyCid];
    const { exports } = runner.run();
    return exports;
  }

  run() {
    const mod = { exports: {} };
    const compartment = new Compartment({
      module: mod,
      require: (cid: string) => this.#runDependency(cid),
    });
    compartment.evaluate(this.#code);
    return mod;
  }

  static async create(code: string): Promise<Runner> {
    const runner = new Runner({ code });
    await runner.initialize();
    return runner;
  }

  static async fetch(cid: string): Promise<Runner> {
    const code = await fetchFromIPFS(cid);
    return await Runner.create(code);
  }
}
