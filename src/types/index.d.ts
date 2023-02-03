import DataURIParser from "datauri/parser";

export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        username: string,
        email: string,
        user_id: string,
        role: string
      };
    }
  }
}

declare module "jsonwebtoken" {
  export interface payloadJson extends JwtPayload {
      username: string;
      email: string;
      user_id: string;
      role: string
  }
}

declare module "datauri/parser" {
  export interface newDataURIParser extends DataURIParser {
      content: string
  }
}



