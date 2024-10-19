import { useLocalStorage } from "@/hooks/useLocalStorage";
import pgdb from "@/services/db";
import { param } from "framer-motion/client";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const sessionId = req.headers['session-id'] as string;
        const date = req.query.date as string;
        const status = req.query.status as string;

        let params = [];

        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const client = await pgdb.connect();

        try {
            let sql;
            sql = 'SELECT * FROM todo WHERE session_id = (SELECT session_id FROM session WHERE session = $1)';
            params.push(sessionId);
            if (date) {
                params.push(date);
                sql += ' AND DATE(start) <= $' + params.length + ' AND DATE("end") >= $' + params.length;
            }

            if (status) {

                const validStatuses = ['Selesai', 'Belum Selesai', 'Dalam Progress'];
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({ message: 'Invalid status' });
                }
                params.push(status);
                
                sql += ' AND status = $' + params.length;
            }

            const result = await client.query(sql, params);

            return res.status(200).json(result.rows);
        } finally {
            client.release();
        }


    } else {
        return res.status(405).json({ message: 'You are not alowed to access this API'})
    }
}

export default handler;