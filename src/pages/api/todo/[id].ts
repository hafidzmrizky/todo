import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const sessionId = req.headers['session-id'] as string;
        const todoId = req.query.id as string;

        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!todoId) {
            return res.status(400).json({ message: 'Todo ID is required' });
        }

        const client = await pgdb.connect();

        try {
            const sql = 'SELECT * FROM todo WHERE session_id = (SELECT session_id FROM session WHERE session = $1) AND todo_id = $2';
            const result = await client.query(sql, [sessionId, todoId]);

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            return res.status(200).json(result.rows[0]);
        } finally {
            client.release();
        }
    }
}

export default handler;