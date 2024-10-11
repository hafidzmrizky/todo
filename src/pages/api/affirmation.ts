import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const response = await fetch('https://www.affirmations.dev');
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching affirmation:', error);
            res.status(500).json({ message: 'Error fetching affirmation' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler