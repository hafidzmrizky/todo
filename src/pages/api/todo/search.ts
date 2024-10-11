import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const sessionId = req.headers['session-id'] as string;
        const query = req.query.q as string;

        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        const client = await pgdb.connect();

        try {
            let sql = 'SELECT todo_id, name FROM todo WHERE session_id = (SELECT session_id FROM session WHERE session = $1) AND (name ILIKE $2 OR status ILIKE $2)';
            const result = await client.query(sql, [sessionId, `%${query}%`]);
            return res.status(200).json(result.rows);
        } finally {
            client.release();
        }


    } else {
        return res.status(405).json({ message: 'You are not alowed to access this API'})
    }
}

export default handler