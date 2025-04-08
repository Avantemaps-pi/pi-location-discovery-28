
// Basic Next.js type declarations to support API routes
// This is simplified for our specific use case

declare module 'next' {
  interface NextApiRequest {
    method?: string;
    body: any;
    headers: {
      [key: string]: string | string[] | undefined;
      authorization?: string;
    };
    query: {
      [key: string]: string | string[] | undefined;
    };
  }

  interface NextApiResponse {
    status: (code: number) => NextApiResponse;
    json: (data: any) => void;
    send: (data: any) => void;
    end: () => void;
    redirect: (statusCode: number, url: string) => void;
  }
}
