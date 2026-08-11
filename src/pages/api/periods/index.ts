import { createIncomes, getAllIncomes, getAllIncomesByUser, deleteIncomes, updateIncomes } from "@/lib/db/queries/incomes";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { get } from "http";

type PeriodForm = {
    name_period: string,
    description: string,
    period_type: number,
    period_value: number,
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

            const { id, Period} = req.body as {
                id: number,
                Period: PeriodForm
            };

            if (!id || !Period) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" + id + Period});
            }

            const newData = {
                userId: id,
                amount: Period.amount,
                income_date: Period.income_date,
                description: Period.description
            }

            const incomeResult = await createIncomes(newData);

            return res.status(200).json({
                success: true,
                id: incomeResult.id
            });
        }
        case "GET": {
            const incomes =
                user.sw_admin === 0
                    ? await getAllIncomesByUser(user.id)
                    : await getAllIncomes();

            return res.status(200).json({ incomes });
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

            const incomeDeleted = await deleteIncomes(id);

            return res.status(200).json({
                success: true,
                id: incomeDeleted.id
            });
        }
        case "PUT": {
            const { id, Income } = req.body as {
                id: number,
                Income: IncomeForm
            };

            if (!id || !Income ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios"});
            }

            const incomeUpdated = await updateIncomes(id, Income);

            return res.status(200).json({
                success: true,
                id: incomeUpdated.id
            });
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