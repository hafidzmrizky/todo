import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const sessionId = req.headers['session-id'] as string;

        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const client = await pgdb.connect();
        try {
            const sql = 'SELECT * FROM session WHERE session = $1';
            const result = await client.query(sql, [sessionId]);

            if (!result.rows.length) {
                return res.status(404).json({ message: 'Session not found' });
            }

            return res.status(200).json({ message: 'Session is valid' });
        } finally {
            client.release();
        }
    }
};

export default handler;