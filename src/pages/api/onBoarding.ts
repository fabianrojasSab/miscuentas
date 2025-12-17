import { createConfigInit } from "@/lib/db/queries/onboarding";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

type BankAccountForm = {
    account: number;
    type: string;
    bank: string;
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
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
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