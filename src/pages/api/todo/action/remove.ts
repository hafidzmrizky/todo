import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'DELETE') {
        const sessionId = req.headers['session-id'] as string;
        const { todo_id } = req.body;
    
        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!todo_id) {
            return res.status(400).json({ message: 'Bad Request' });
        }

        const client = await pgdb.connect();

        try {
            const sql = `DELETE FROM todo WHERE todo_id = $1 AND session_id = (SELECT session_id FROM session WHERE session = $2)`;
            const result = await client.query(sql, [todo_id, sessionId]);

            if (result.rowCount > 0) {
                return res.status(200).json({ message: 'Todo has been deleted' });
            } else {
                return res.status(404).json({ message: 'Todo not found' });
            }
        } finally {
            client.release();
        }
    }
}

export default handler