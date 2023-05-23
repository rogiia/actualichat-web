import { makeRequest } from "./base";

export async function getSummary(language: string): Promise<string> {
  const summary = await makeRequest('/summary');
  return summary as string;
}
