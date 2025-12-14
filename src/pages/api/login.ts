import { login } from "@/lib/db/queries/users";
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const { email, password} = req.body as {
        email?: string;
        password?: string;
        };

        if (!email || !password) {
            return res
            .status(400)
            .json({ error: "Faltan campos obligatorios (Correo, Contraseña)" });
        }

        const user = await login({ email, password });

        res.setHeader(
            "Set-Cookie",
            serialize(SESSION_COOKIE_NAME, user.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                expires: new Date(user.expiresAt),
            })
        );

        return res.status(200).json({
            success: true,
            user,
        });
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