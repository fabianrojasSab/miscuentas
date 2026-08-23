import { createConfigInit } from "@/lib/db/queries/onboarding";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getAllIncomes, getAllIncomesByUser } from "@/lib/db/queries/incomes";
import { getAllBankAccount, getBankAccountByUser } from "@/lib/db/queries/bank_accounts";
import { getAllExpenses, getAllExpensesByUser } from "@/lib/db/queries/expenses";

type BankAccountForm = {
    account_number: number;
    account_type: string;
    bank_name: string;
};

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
            const { id, BankAccount, Income} = req.body as {
                id: number,
                BankAccount: BankAccountForm,
                Income: IncomeForm
            };

            if (!id || !BankAccount || !Income) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" + id + BankAccount + Income});
            }

            const cookies = parse(req.headers.cookie || "");
            const token = cookies[SESSION_COOKIE_NAME];
            if (!token) return res.status(401).json({ error: "No auth" });

            const user = await getUserBySessionToken(token);
            if (!user) return res.status(401).json({ error: "No auth" });

            const newData = {
                id: id,
                BankAccount: BankAccount,
                Income: Income
            }

            await createConfigInit(newData);

            return res.status(200).json({
                success: true,
            });
        }
        case "GET": {
            const incomes =
                user.sw_admin === 0
                    ? await getAllIncomesByUser(user.id)
                    : await getAllIncomes();

            const allBankAccountResult =
                user.sw_admin === 0
                    ? await getBankAccountByUser(user.id)
                    : await getAllBankAccount();
            
            const expenses =
                user.sw_admin === 0
                    ? await getAllExpensesByUser(user.id)
                    : await getAllExpenses();
            
            const onboarding = {
                incomes: incomes,
                bankAccounts: allBankAccountResult,
                expenses: expenses,
            }

            return res.status(200).json({ onboarding });
        }
        case "DELETE": {
            return res.status(405).json({ error: "Método no permitido" });
        }
        case "PUT": {
            return res.status(405).json({ error: "Método no permitido" });
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