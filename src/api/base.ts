const BASE_URL = 'https://p41f1ulhl9.execute-api.eu-west-1.amazonaws.com/prod';

export async function makeRequest(path: string, method: string = 'GET'): Promise<unknown> {
  const result = await fetch(`${BASE_URL}/${path}`, {
    method
  });

  return await result.json();
}