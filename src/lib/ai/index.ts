import { formatStroke } from '$lib/swimming';
import { GeminiEndpoint } from './gemini';
import { MistralEndpoint } from './mistral';
import { MockEndpoint } from './mock';

export type Stroke = 'free' | 'back' | 'breast' | 'fly' | 'im';
export type SetType = 'swim' | 'kick' | 'sprint' | 'drill/technique';

export type SetCategory = {
  stroke: Stroke;
  type: SetType;
};

export type SetItem = {
  stroke: Stroke;
  distance: number;
  interval?: number;
  amount: number;
};

export const formatItem = (item: SetItem) =>
  `${item.amount ? item.amount + 'x' : ''}${item.distance} ${formatStroke(item.stroke)}${item.interval ? ' on the' + item.interval : ''}`;

export type SetPart = SetItem[];

export type SwimSet = {
  warmup: SetPart;
  main: SetPart;
  cooldown: SetPart;
};

export interface IEndpoint {
  generateSet(prompt: string, time: string): Promise<SwimSet>;
  interpretItem(item: string): Promise<SetItem | null>;
}

export const MODELS: Record<string, IEndpoint> = {
  gemini: new GeminiEndpoint(),
  mock: new MockEndpoint(),
  mistral: new MistralEndpoint()
};
