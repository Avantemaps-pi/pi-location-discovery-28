
declare module 'next' {
  export type NextApiRequest = {
    method?: string;
    body: any;
    headers: {
      [key: string]: string | string[] | undefined;
      authorization?: string;
    };
  };
  
  export type NextApiResponse = {
    status: (code: number) => NextApiResponse;
    json: (data: any) => void;
    end: () => void;
  };
}
