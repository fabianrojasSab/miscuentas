import { createIncomes, getAllIncomesByUser } from "@/lib/db/queries/incomes";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

type IncomeForm = {
    amount: number;
    date: string;
    description: string;
}

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

            const { id, Income} = req.body as {
                id: number,
                Income: IncomeForm
            };

            if (!id || !Income) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" + id + Income});
            }

            const newData = {
                userId: id,
                amount: Income.amount,
                date: Income.date,
                description: Income.description
            }

            const incomeResult = await createIncomes(newData);

            return res.status(200).json({
                success: true,
                id: incomeResult.id
            });
        }
        case "GET": {
            const incomes = await getAllIncomesByUser(user.id);

            return res.status(200).json({ incomes });

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