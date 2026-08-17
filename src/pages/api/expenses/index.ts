import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { get } from "http";
import { createExpenses, deleteExpense, getAllExpenses, getAllExpensesByUser, getExpensesByUser, updateExpense } from "@/lib/db/queries/expenses";

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    income_date: string;
    amount: number;
};

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

            const { id, expense} = req.body as {
                id: number,
                expense: ExpensesForm
            };

            if (!id || !expense) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" + id + expense});
            }

            const newData = {
                userId: id,
                name: expense.name,
                amount: expense.amount,
                date: expense.income_date,
                description: expense.description ?? "",
                category: expense.expense_category_id,
            }

            const expenseResult = await createExpenses(newData);

            return res.status(200).json({
                success: true,
                id: expenseResult.id
            });
        }
        case "GET": {
            const { type } = req.query;

            if (type === "dashboard") {

                const expenses = await getExpensesByUser(user.id);

                return res.status(200).json({ expenses });
            }

            const expenses =
                user.sw_admin === 0
                    ? await getAllExpensesByUser(user.id)
                    : await getAllExpenses();

            return res.status(200).json({ expenses });
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

            const expenseDeleted = await deleteExpense(id);

            return res.status(200).json({
                success: true,
                id: expenseDeleted.id
            });
        }
        case "PUT": {
            const { id, expense } = req.body as {
                id: number,
                expense: ExpensesForm
            };

            if (!id || !expense ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios"});
            }

            const expenseUpdated = await updateExpense(id, expense);

            return res.status(200).json({
                success: true,
                id: expenseUpdated.id
            });
        }
        default:
            return res.status(405).json({ error: "Método no permitido" });
        }
    } catch (err: unknown) {

        if (err instanceof Error) {
            return res.status(500).json({
                error: err.message
            });
        }

        return res.status(500).json({
            error: "Ocurrió un error desconocido"
        });
    }
}