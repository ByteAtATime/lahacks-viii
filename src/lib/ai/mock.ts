import type { IEndpoint, SetCategory, SwimSet } from '.';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockEndpoint implements IEndpoint {
  public async generateSet(prompt: string, time: string): Promise<SwimSet> {
    await sleep(1000);

    return {
      warmup: [
        { stroke: 'free', distance: 100, amount: 1 },
        { stroke: 'back', distance: 100, amount: 1 }
      ],
      main: [
        { stroke: 'free', distance: 100, amount: 1 },
        { stroke: 'back', distance: 100, amount: 1 }
      ],
      cooldown: [
        { stroke: 'free', distance: 100, amount: 1 },
        { stroke: 'back', distance: 100, amount: 1 }
      ]
    };
  }

  public async interpretItem(item: string): Promise<SetItem | null> {
    await sleep(1000);

    return {
      stroke: 'free',
      distance: 100,
      amount: 1,
      interval: 15
    };
  }

  public async editSet(
    set: SwimSet,
    prompt: string
  ): Promise<{ newSet: SwimSet; response: string }> {
    await sleep(1000);

    return {
      newSet: set,
      response: 'Edit the set yourself you lazy a**'
    };
  }

  public async categorizeSet(set: SwimSet): Promise<SetCategory> {
    await sleep(1000);

    return {
      stroke: 'free',
      type: 'swim'
    };
  }
}
