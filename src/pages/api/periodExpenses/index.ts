import { createIncomes, getAllIncomes, getAllIncomesByUser, deleteIncomes, updateIncomes } from "@/lib/db/queries/incomes";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { get } from "http";
import { createMasivePeriodExpenses, createPeriodExpenseVariable, deletePeriodExpense, getPeriodExpensesByUser, getPeriodExpensesNoPayed, updatePeriodExpense } from "@/lib/db/queries/period_expenses";

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

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    expense_date: string;
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

            const { periodId, expenses, id, expense} = req.body as {
                periodId: number,
                expenses: BdNewPeriodExpenseRow[]
                id: number,
                expense: ExpensesForm,
            };

            //crea gastos del periodo masivo - usado en el onboarding
            if(expenses){
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

                const periodExpenseResult = await createMasivePeriodExpenses(periodExpenses);

                return res.status(200).json({
                    success: true,
                    id: periodExpenseResult.inserted
                });
            }

            if(expense){
                if (!id || !expense.expense_category_id || !expense.name || !expense.expense_date || !expense.amount) {
                    return res
                    .status(400)
                    .json({ error: "Faltan campos obligatorios"});
                }

                const newData = {
                    userId: id,
                    name: expense.name,
                    amount: expense.amount,
                    date: expense.expense_date,
                    description: expense.description ?? "",
                    category: expense.expense_category_id,
                }

                const expenseResult = await createPeriodExpenseVariable(id, newData, periodId, 1)

                return res.status(200).json({
                    success: true,
                    id: expenseResult.id
                });
            }
        }
        case "GET": {
            const { periodId, noPayed } = req.query;

            if(noPayed === "true"){
                const periodExpenses =  await getPeriodExpensesNoPayed(user.id, Number(periodId))

                return res.status(200).json({ periodExpenses });
            }

            const periodExpenses =  await getPeriodExpensesByUser(user.id, Number(periodId))


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

            const periodExpenseDeleted = await deletePeriodExpense(id);

            return res.status(200).json({
                success: true,
                id: periodExpenseDeleted.id
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