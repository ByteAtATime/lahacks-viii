import type { IEndpoint, SetItem, SwimSet } from '.';
import { GEMINI_API_KEY } from '$env/static/private';

export class GeminiEndpoint implements IEndpoint {
  public async generateSet(prompt: string, time: string): Promise<SwimSet> {
    const setPart = {
      type: 'ARRAY',
      nullable: false,
      items: {
        type: 'OBJECT',
        properties: {
          amount: {
            description: 'The number of times to repeat this part. Defaults to 1.',
            type: 'INTEGER',
            nullable: false
          },
          distance: {
            description: 'The distance to swim for this part.',
            type: 'INTEGER',
            nullable: false
          },
          stroke: {
            description: 'The stroke to swim for this part.',
            type: 'STRING',
            enum: ['free', 'back', 'breast', 'fly', 'IM'],
            nullable: false
          },
          interval: {
            description: 'The interval to swim on, in seconds.',
            type: 'NUMBER',
            nullable: true
          },
          type: {
            description:
              "The type of set for this part. If it is no particular type, mark as 'swim'.",
            type: 'STRING',
            enum: ['swim', 'kick', 'sprint', 'drill/technique'],
            nullable: false
          }
        }
      }
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `
Generate a creative, original swim set. All the intervals should add up to just under the time limit. The set should be challenging and engaging, and should be composed of a warmup, main set, and cooldown. The set should be composed of multiple parts, each contributing to the ask of the prompt. The main set should be the bulk of the time spent; if needed, repeat each part with the "amount" field.

Prompt: ${prompt}
Time limit: ${time}
`
                }
              ]
            }
          ],
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'result',
                  description: 'Handle the generated set',
                  parameters: {
                    type: 'object',
                    properties: {
                      warmup: {
                        description:
                          'The warmup of the set, ideally finishable in 10 minutes. Can be composed of a few parts.',
                        ...setPart
                      },
                      main: {
                        description:
                          'The main set of the workout, ideally fills up the rest of the time apart from the warmup and cooldown. This should be challenging and exercising. Should be composed of multiple parts, which each contribute to the ask of the prompt.',
                        ...setPart
                      },
                      cooldown: {
                        description:
                          'The cooldown of the set, ideally finishable in 5-10 minutes. This should allow the swimmer to relax and cool down. Can be composed of a few parts.',
                        ...setPart
                      }
                    }
                  }
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();
    return data.candidates[0].content.parts[0].functionCall.args;
  }

  public async interpretItem(item: string): Promise<SetItem | null> {
    if (!item) return null;

    const DEFAULT_RESULT = {
      amount: 1,
      type: 'swim',
      interval: null
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `
YOU MUST CALL THE FUNCTION. If you cannot interpret the line, or if it is blank, make sure the "valid" field is set to false.

FL or FLY = fly
BK = back
BR = breast
FR = free

Everything is case insensitive.

Text: 8x75s FR on the 1:30
Response: result({ valid: true, amount: 8, distance: 75, stroke: "free", interval: 90, type: "swim" })

Text: 4x100s im drill
Response: result({ valid: true, amount: 4, distance: 100, stroke: "IM", interval: null, type: "drill/technique" })

Text: 100 FR sprint
Response: result({ valid: true, amount: 1, distance: 100, stroke: "free", interval: null, type: "sprint" })

Text: 50 bk
Response: result({ valid: true, amount: 1, distance: 50, stroke: "back", interval: null, type: "swim" })

Text: 100 fr
Response: result({ valid: true, amount: 1, distance: 100, stroke: "free", interval: null, type: "swim" })

Text: 8x50s kick
Response: result({ valid: false })

Text: fdhjsihfd
Response: result({ valid: false })

REMEMBER: You must call the function with the result object. If you cannot interpret the line, or if it is blank, make sure the "valid" field is set to false. DO NOT, UNDER ANY CIRCUMSTANCES, OUTPUT TEXT.

Text: ${item}
Response: 
`.trim()
                }
              ]
            }
          ],
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'result',
                  description: 'Handle the result of the interpretation',
                  parameters: {
                    type: 'OBJECT',
                    description: 'The result of the line',
                    nullable: true,
                    properties: {
                      valid: {
                        type: 'BOOLEAN',
                        description: 'Whether the line was valid. REQUIRED.',
                        nullable: false
                      },
                      amount: {
                        type: 'INTEGER',
                        format: 'int32',
                        description:
                          'The number of times to repeat this. For example, if it was "8x50s free", the amount would be 8. REQUIRED. If not specified, should be 1.',
                        nullable: false
                      },
                      distance: {
                        type: 'INTEGER',
                        format: 'int32',
                        description:
                          'The distance to swim. For example, if it was "8x50s free", the distance would be 50. REQUIRED. This should always be a multiple of 25; If it is not, mark "valid" as false.',
                        nullable: false
                      },
                      stroke: {
                        type: 'STRING',
                        enum: ['free', 'back', 'breast', 'fly', 'IM'],
                        description:
                          'The stroke to swim. For example, if it was "8x50s free", the stroke would be "free". REQUIRED. Do not guess for this; if you are unsure, mark "valid" as false.',
                        nullable: false
                      },
                      interval: {
                        type: 'NUMBER',
                        format: 'float',
                        description:
                          'The interval to swim on, in seconds. For example, if it was "8x50s IM on the :50", the interval would be 50. OPTIONAL.',
                        nullable: true
                      },
                      type: {
                        type: 'STRING',
                        enum: ['swim', 'kick', 'sprint', 'drill/technique'],
                        description:
                          'The type of set. For example, if it was "8x50s IM on the :50", the type would be "swim". If it was "8x50s kick", the type would be "kick". REQUIRED. If not specified, should be "swim".',
                        nullable: false
                      }
                    }
                  }
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();
    try {
      const candidate = data.candidates[0];
      const functionCall = candidate.content.parts[0].functionCall;

      const result = { ...DEFAULT_RESULT, ...functionCall.args };

      if (!result.amount || !result.distance || !result.stroke || !result.type || !result.valid) {
        return null;
      }

      return result;
    } catch (e) {
      return null;
    }
  }
}
