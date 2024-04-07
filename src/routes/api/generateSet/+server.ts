import { MODELS } from '$lib/ai';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  const prompt = url.searchParams.get('prompt');
  const time = url.searchParams.get('time');
  const model = url.searchParams.get('model');

  if (!prompt || !time || !model || !(model in MODELS)) {
    return {
      status: 400,
      body: { error: 'Missing required parameters.' }
    };
  }

  const set = await MODELS[model].generateSet(prompt, time);

  return json(set);
};
