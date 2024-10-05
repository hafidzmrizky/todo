import rateLimiter from "@/middlewares/rateLimit";
import pgdb from "@/services/db";
import rateLimit from "express-rate-limit";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const client = await pgdb.connect();

        const randomizeKey = () => {
            return crypto.createHash('sha256').update(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + crypto.randomBytes(4).toString('hex')).digest('hex');
        }

        try {
            const sql = 'INSERT INTO session (session) VALUES ($1) RETURNING session';
            const result = await client.query(sql, [randomizeKey()]);

            if (!result.rows.length) {
                return res.status(500).json({ message: 'Failed to generate session' });
            }

            res.status(200).json({ sessionId: result.rows[0].session });
        } finally {
            client.release();
        }
        


    }

};

export default rateLimiter(handler); 