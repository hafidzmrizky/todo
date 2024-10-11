import { useLocalStorage } from "@/hooks/useLocalStorage";
import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const sessionId = req.headers['session-id'] as string;
        const date = req.query.date as string;

        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const client = await pgdb.connect();

        try {
            let sql;
            sql = 'SELECT * FROM todo WHERE session_id = (SELECT session_id FROM session WHERE session = $1)';

            if (date) {
                sql += ' AND DATE(start) <= $2 AND DATE("end") >= $2';
            }

            const result = date 
                ? await client.query(sql, [sessionId, date]) 
                : await client.query(sql, [sessionId]);

            return res.status(200).json(result.rows);
        } finally {
            client.release();
        }


    } else {
        return res.status(405).json({ message: 'You are not alowed to access this API'})
    }
}

export default handler;