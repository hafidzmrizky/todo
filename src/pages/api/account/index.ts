import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const sessionToken = req.headers['session-id'] as string;

        if (!sessionToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const client = await pgdb.connect();

        try {
            const sql = `SELECT name FROM session WHERE session = $1`;
            const values = [sessionToken];

            const result = await client.query(sql, values);

            if (!result.rowCount) {
                return res.status(404).json({ message: 'Session not found' });
            }

            const name = result.rows[0].name;

            return res.json({ name });
        } finally {
            client.release();
        }

    }
};

export default handler;