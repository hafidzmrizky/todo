import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const importId = req.query.importId as string;
        const sessionId = req.headers['session-id'] as string;

        if (!importId) {
            res.status(400).json({ message: 'importId is required' });
            return;
        }

        if (!sessionId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const client = await pgdb.connect();
        try {
            const checkTodo = await client.query('SELECT * FROM todo WHERE todo_id = $1 AND shared = true', [importId]);
            const todo = checkTodo.rows[0];

            if (!todo) {
                res.status(404).json({ message: 'Todo not found' });
                return;
            }

            const insertTodo = await client.query('INSERT INTO todo (session_id, name, start, "end") VALUES ((SELECT session_id FROM session WHERE session = $1), $2, $3, $4) RETURNING *', [sessionId, todo.name, todo.start, todo.end]);
            const newTodo = insertTodo.rows[0];

            res.status(200).json(newTodo);
        } finally {
            client.release();
        }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler