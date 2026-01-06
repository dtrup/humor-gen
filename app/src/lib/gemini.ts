/**
 * LLM Service - Gemini API integration with streaming support
 * Adapted for Next.js
 */

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash-latest';

if (!API_KEY) {
    console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not set. AI features will not work.');
}

export interface StreamChunk {
    text: string;
    done: boolean;
}

/**
 * Generate streaming content from Gemini
 * Yields text chunks as they arrive
 */
export async function* generateStream(
    systemPrompt: string,
    userPrompt: string
): AsyncGenerator<StreamChunk> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${API_KEY}`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    console.log('[LLM] Starting stream request to:', MODEL);
    console.log('[LLM] Prompt length:', fullPrompt.length);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: fullPrompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                },
            }),
        });

        console.log('[LLM] Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[LLM] API error:', errorData);
            throw new Error(
                errorData.error?.message || `API request failed with status ${response.status}`
            );
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body available');
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let fullResponse = ''; // Keep track for debugging/logging, though unused logic removed

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                // Try to parse any remaining buffer
                if (buffer.trim()) {
                    console.log('[LLM] Processing remaining buffer:', buffer.length, 'chars');
                    try {
                        // The response might be a JSON array
                        let jsonData = buffer.trim();
                        if (jsonData.startsWith('[')) {
                            const parsed = JSON.parse(jsonData);
                            for (const item of parsed) {
                                const text = item.candidates?.[0]?.content?.parts?.[0]?.text;
                                if (text) {
                                    console.log('[LLM] Final chunk from array:', text.length, 'chars');
                                    yield { text, done: false };
                                }
                            }
                        }
                    } catch (e) {
                        console.log('[LLM] Could not parse remaining buffer');
                    }
                }
                yield { text: '', done: true };
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            fullResponse += chunk;

            // Debug: log raw chunks
            // console.log('[LLM] Raw chunk received:', chunk.length, 'chars');

            // Try to extract complete JSON objects from buffer
            // Gemini streaming returns newline-delimited JSON objects wrapped in array brackets

            // First, try to parse as a complete JSON array (for non-streaming response format if applicable)
            try {
                if (buffer.trim().startsWith('[') && buffer.trim().endsWith(']')) {
                    const parsed = JSON.parse(buffer.trim());
                    for (const item of parsed) {
                        const text = item.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            console.log('[LLM] Chunk from complete array:', text.length, 'chars');
                            yield { text, done: false };
                        }
                    }
                    buffer = ''; // Clear buffer after successful parse
                    continue;
                }
            } catch (e) {
                // Not a complete array yet, continue with line-by-line parsing
            }

            // Extract complete JSON objects by counting braces
            // Gemini returns: [{...},\n{...},\n{...}] format
            let startIdx = -1;
            let braceCount = 0;
            let inString = false;
            let escapeNext = false;

            for (let i = 0; i < buffer.length; i++) {
                const char = buffer[i];

                if (escapeNext) {
                    escapeNext = false;
                    continue;
                }

                if (char === '\\' && inString) {
                    escapeNext = true;
                    continue;
                }

                if (char === '"') {
                    inString = !inString;
                    continue;
                }

                if (inString) continue;

                if (char === '{') {
                    if (braceCount === 0) startIdx = i;
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                    if (braceCount === 0 && startIdx !== -1) {
                        // Found complete object
                        const jsonStr = buffer.slice(startIdx, i + 1);
                        try {
                            const data = JSON.parse(jsonStr);
                            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                // console.log('[LLM] Chunk received:', text.length, 'chars');
                                yield { text, done: false };
                            }
                        } catch (e) {
                            console.log('[LLM] Failed to parse object');
                        }
                        // Remove parsed content from buffer
                        buffer = buffer.slice(i + 1);
                        // Reset and continue from start of new buffer
                        i = -1;
                        startIdx = -1;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Stream generation error:', error);
        throw error;
    }
}

/**
 * Generate complete content (non-streaming) from Gemini
 * Useful for situations where you need the full response at once
 */
export async function generateContent(
    systemPrompt: string,
    userPrompt: string
): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: fullPrompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error?.message || `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No response from AI');
        }

        return text;
    } catch (error) {
        console.error('Content generation error:', error);
        throw error;
    }
}
