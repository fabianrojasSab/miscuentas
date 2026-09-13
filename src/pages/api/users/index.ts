import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { deletePeriod } from "@/lib/db/queries/periods";
import { createUser, getAllUsers } from "@/lib/db/queries/users";
import bcrypt from "bcryptjs";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies[SESSION_COOKIE_NAME];

    if (!token) return res.status(401).json({ error: "No auth" });

    const user = await getUserBySessionToken(token);
    if (!user) return res.status(401).json({ error: "No auth" });

    try {
        switch (req.method) {
        case "POST": {
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
        }
        case "GET": {

            const { userId } = req.query;

            let users = await getAllUsers();
            return res.status(200).json({ users });
        }
        case "DELETE": {
            const { id } = req.body as {
                id: number,
            };

            if (!id ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" + id });
            }

            const userDeleted = await deletePeriod(id);

            return res.status(200).json({
                success: true,
                id: userDeleted.id
            });
        }
        case "PUT": {
            //editar informacion de usuario falta crear formulario
        }
        default:
            return res.status(405).json({ error: "Método no permitido" });
        }
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