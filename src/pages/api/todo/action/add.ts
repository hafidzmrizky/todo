import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { name, start, end } = req.body;
        const sessionId = req.headers['session-id'] as string;

        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!name || !start || !end) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const client = await pgdb.connect();

        try {
            const sql = `INSERT INTO todo (session_id, name, start, "end") VALUES ((SELECT session_id FROM session WHERE session = $1), $2, $3, $4) RETURNING todo_id`;
            const values = [sessionId, name, start, end];
            const result = await client.query(sql, values);
            res.status(201).json({ todoId: result.rows[0].todo_id });
            
        } finally {
            client.release();
        }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler