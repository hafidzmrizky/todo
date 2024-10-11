import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'PUT') {
        const { todo_id, share } = req.body;
        const sessionId = req.headers['session-id'] as string;

        if (!todo_id) {
            return res.status(400).json({ message: 'Todo ID is required' });
        }

        if (typeof share !== 'boolean') {
            return res.status(400).json({ message: 'Share must be a boolean' });
        }

        const client = await pgdb.connect();

        try {
            const sql = 'UPDATE todo SET shared = $1 WHERE todo_id = $2 AND session_id = (SELECT session_id FROM session WHERE session = $3)';
            const values = [share, todo_id, sessionId];
            const result = await client.query(sql, values);

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Todo not found' });
            }

            res.status(200).json({ message: 'Todo shared status updated' });
        } finally {
            client.release();
        }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler