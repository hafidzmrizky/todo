import rateLimit from 'express-rate-limit';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

export default function rateLimiter(handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        await new Promise((resolve, reject) => {
            limiter(req, res, (result: any) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });

        return handler(req, res);
    };
}