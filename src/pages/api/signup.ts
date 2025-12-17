import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/lib/db/queries/users";
import bcrypt from "bcryptjs";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const { name, email, password, passwordConfirm } = req.body as {
        name?: string;
        email?: string;
        password?: string;
        passwordConfirm?: string;
        };

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ error: "Faltan campos obligatorios (nombre, correo, password)" });
        }

        if (password !== passwordConfirm) {
            return res
                .status(400)
                .json({ error: "Las contraseñas no coinciden" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await createUser({ name, email, passwordHash });

        return res.status(200).json({
            success: true,
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
