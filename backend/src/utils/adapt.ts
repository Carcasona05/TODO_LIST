import type { Request, Response, NextFunction, RequestHandler } from "express";

// Generic adapter to accept handlers that may expect an augmented Request type.
export function adapt<Req extends Request = Request>(
  handler: (req: Req, res: Response, next: NextFunction) => Promise<unknown> | unknown
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = handler(req as Req, res, next);

      if (result && typeof (result as Promise<unknown>).then === "function") {
        (result as Promise<unknown>).catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}
