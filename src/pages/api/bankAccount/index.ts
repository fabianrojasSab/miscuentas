import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { createBankAccount, deleteBankAccount, getAllBankAccount, getBankAccountByUser, updateBankAccount } from "@/lib/db/queries/bank_accounts";

type BankAccountForm = {
    account_number: string,
    account_type: number,
    bank_name: string,
    account_balance: number,
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

            const { id, bankAccount} = req.body as {
                id: number,
                bankAccount: BankAccountForm
            };

            if (!id || !bankAccount) {
                return res
                .status(400)
                .json({ error: "Datos invalidos"});
            }

            const newData = {
                userId: id,
                account_number: bankAccount.account_number,
                account_type: bankAccount.account_type,
                bank: bankAccount.bank_name,
            }

            const bankAccountResult = await createBankAccount(newData);

            return res.status(200).json({
                success: true,
                id: bankAccountResult.id
            });
        }
        case "GET": {

            const bankAccounts =
                user.sw_admin === 0
                    ? await getBankAccountByUser(user.id)
                    : await getAllBankAccount();

            return res.status(200).json({ bankAccounts });
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

            const bankAccountDeleted = await deleteBankAccount(id);

            return res.status(200).json({
                success: true,
                id: bankAccountDeleted.id
            });
        }
        case "PUT": {
            const { id, bankAccount } = req.body as {
                id: number,
                bankAccount: BankAccountForm
            };

            if (!id || !bankAccount ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios"});
            }

            const bankAccountUpdated = await updateBankAccount(id, bankAccount);

            return res.status(200).json({
                success: true,
                id: bankAccountUpdated.id
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