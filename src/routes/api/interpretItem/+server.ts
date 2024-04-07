import { MODELS } from '$lib/ai';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  const prompt = url.searchParams.get('prompt');
  const model = url.searchParams.get('model');

  if (!prompt || !model || !(model in MODELS)) {
    return {
      status: 400,
      body: { error: 'Missing required parameters.' }
    };
  }

  const item = await MODELS[model].interpretItem(prompt);

  return json(item);
};
