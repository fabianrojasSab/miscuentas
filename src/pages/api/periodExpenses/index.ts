import { createIncomes, getAllIncomes, getAllIncomesByUser, deleteIncomes, updateIncomes } from "@/lib/db/queries/incomes";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { get } from "http";
import { createPeriodExpenses, getPeriodExpensesByUser, updatePeriodExpense } from "@/lib/db/queries/period_expenses";

type IncomeForm = {
    amount: number;
    income_date: string;
    description: string;
}

type BdNewPeriodExpenseRow = {
    id: number,
    expense_id: number,
    expense_date: string,
    amount: number,
    expense_state_id: number,
}

export type DbUpdatePeriodExpenseRow = {
    period_id: number,
    expense_id: number,
    expense_date: string,
    amount: number,
    expense_state_id: number,
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

            const { periodId, expenses} = req.body as {
                periodId: number,
                expenses: BdNewPeriodExpenseRow[]
            };

            if (!periodId || !expenses) {
                return res.status(400).json({
                    error: "Datos inválidos"
                });
            }

            const periodExpenses = expenses.map((expense) => ({
                period_id: periodId,
                expense_id: expense.id,
                expense_date: expense.expense_date,
                amount: expense.amount,
                expense_state_id: 1,
            }));

            const periodExpenseResult = await createPeriodExpenses(periodExpenses);

            return res.status(200).json({
                success: true,
                id: periodExpenseResult.inserted
            });
        }
        case "GET": {
            const periodExpenses =  await getPeriodExpensesByUser(user.id)


            return res.status(200).json({ periodExpenses });
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
            const { id, periodExpense } = req.body as {
                id: number,
                periodExpense: DbUpdatePeriodExpenseRow
            };

            if (!id || !periodExpense ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios"});
            }

            const incomeUpdated = await updatePeriodExpense(id, periodExpense);

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