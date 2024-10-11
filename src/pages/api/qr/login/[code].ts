import pgdb from "@/services/db";
import { NextApiRequest, NextApiResponse } from "next";
import QRCode from 'qrcode';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const code = "https://todo.arcanius.id?connectcode=" + req.query.code as string;

        if (!code) {
            return res.status(400).json({ message: 'Code is required' });
        }

        try {
            res.setHeader('Content-Type', 'image/png');
            const qrCodeBuffer = await QRCode.toBuffer(code);
            return res.status(200).send(qrCodeBuffer);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to generate QR code', error });
        }
    }
};

export default handler;