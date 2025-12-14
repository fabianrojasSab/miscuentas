import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getDb } from "@/lib/db";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = getDb();

    try {
        if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

        const cookies = parse(req.headers.cookie || "");
        const token = cookies[SESSION_COOKIE_NAME];

        if (!token) return res.status(200).json({ user: null });

        const user = await getUserBySessionToken(db, token);
        return res.status(200).json({ user: user ?? null });
    } catch {
        return res.status(200).json({ user: null });
    } finally {
        db.close();
    }
}
