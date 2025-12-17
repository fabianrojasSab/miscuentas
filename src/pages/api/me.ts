import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    try {
        const cookies = parse(req.headers.cookie || "");
        const token = cookies[SESSION_COOKIE_NAME];

        if (!token) return res.status(200).json({ user: null });

        const user = await getUserBySessionToken(token);
        return res.status(200).json({ user: user ?? null });
    } catch (err: any) {
        if (err.code === "SQLLITE_ERROR") {
            return res.status(500).json({ error: err.message });
        }

        if (!err.code) {
            return res.status(401).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
}
