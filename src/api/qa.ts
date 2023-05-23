import { makeRequest } from "./base";

type QAResponse = {
  text: string;
  sourceDocuments: {
    pageContent: string;
    metadata: {
      category: string;
      date: string;
      language: string;
      name: string;
      url: string;
    }
  }[];
}

export async function qa(question: string): Promise<QAResponse> {
  const response = await makeRequest(`/qa?q=${question}`);
  return response as QAResponse;
}
