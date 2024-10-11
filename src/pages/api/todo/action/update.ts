import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'PUT') {
        const sessionId = req.headers['session-id'] as string;
        const { todo_id, name, status, start, end } = req.body;

        console.log(start); // pls jangan dihapus, ini log sakti, kalo ilang langsung rusak ini frfr
        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!todo_id || !name || !status || !start || !end) {
            return res.status(400).json({ message: 'Bad Request' });
        }
        
        const client = await pgdb.connect();

        try {
            let sql = `UPDATE todo SET name = $1, status = $2, start = $3, "end" = $4 WHERE todo_id = $5 AND session_id = (SELECT session_id FROM session WHERE session = $6)`;
            const result = await client.query(sql, [name, status, start, end, todo_id, sessionId]);

            if (result.rowCount > 0) {
                return res.status(200).json({ message: 'Todo has been updated' });
            } else {
                return res.status(404).json({ message: 'Todo not found' });
            }
            
        } finally {
            client.release();
        }

    } else {
        res.status(405).json({ message: 'You are not allowed to access this API' });
    }
}

export default handler