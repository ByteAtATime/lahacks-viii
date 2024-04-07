import type { IEndpoint, SwimSet } from '.';
import { MISTRAL_API_KEY } from '$env/static/private';

export class MistralEndpoint implements IEndpoint {
  public async generateSet(prompt: string, time: string): Promise<SwimSet> {
    const setPart = {
      type: 'array',
      items: {
        type: 'object',
        required: ['amount', 'distance', 'stroke', 'type'],
        properties: {
          amount: {
            description: 'The number of times to repeat this part. Defaults to 1.',
            type: 'integer'
          },
          distance: {
            description: 'The distance to swim for this part.',
            type: 'integer'
          },
          stroke: {
            description: 'The stroke to swim for this part.',
            type: 'string',
            enum: ['free', 'back', 'breast', 'fly', 'IM']
          },
          interval: {
            description:
              'The interval to swim on, in seconds. Aim for about 40 seconds for every 50 yards.',
            type: 'number'
          },
          type: {
            description:
              "The type of set for this part. If it is no particular type, mark as 'swim'.",
            type: 'string',
            enum: ['swim', 'kick', 'sprint', 'drill/technique']
          }
        }
      }
    };

    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: `
Generate a creative, original swim set. All the intervals should add up to just under the time limit. The set should be challenging and engaging, and should be composed of a warmup, main set, and cooldown. The set should be composed of multiple parts, each contributing to the ask of the prompt. The main set should be the bulk of the time spent; if needed, repeat each part with the "amount" field.

Prompt: ${prompt}
Time limit: ${time}
`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'result',
              description: 'Handle the generated set',
              parameters: {
                type: 'object',
                properties: {
                  warmup: setPart,
                  main: setPart,
                  cooldown: setPart
                }
              }
            }
          }
        ],
        tool_choice: 'any'
      })
    });

    const jsonRes = await res.json();

    return JSON.parse(jsonRes.choices[0].message.tool_calls[0].function.arguments);
  }
}
