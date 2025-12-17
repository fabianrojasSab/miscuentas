import type { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import { getDb } from "@/lib/db";
import { deleteSessionByToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = getDb();

    try {
        if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

        const cookies = parse(req.headers.cookie || "");
        const token = cookies[SESSION_COOKIE_NAME];

        if (token) {
        await deleteSessionByToken(token);
        }

        // borrar cookie
        res.setHeader(
        "Set-Cookie",
        serialize(SESSION_COOKIE_NAME, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        })
        );

        return res.status(200).json({ ok: true });
    } catch {
        return res.status(500).json({ error: "Error en logout" });
    } finally {
        db.close();
    }
}
