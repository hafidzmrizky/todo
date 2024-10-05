import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'PUT') {
        const sessionId = req.headers['session-id'] as string;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const client = await pgdb.connect();
        try { 
            const sql = 'UPDATE session SET name = $1 WHERE session = $2';
            const values = [name, sessionId];

            const result = await client.query(sql, values);

            if (!result.rowCount) {
                return res.status(404).json({ message: 'Session not found' });
            }

            res.status(200).json({ message: 'Name modified successfully' });
        } finally {
            client.release();
        }

        return res.status(200).json({ message: 'Name modified successfully' });
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler; // todo: add useSession(handler); to protect the route