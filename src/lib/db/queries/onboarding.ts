import { getDb, runAsync } from "../index";

export type NewData = {
    id: number;
    BankAccount : {
        account: number;
        type: string;
        bank: string;
    };
    Income : {
        amount: number;
        date: string;
        description: string;
    }
};

export async function createConfigInit({
    id,
    BankAccount,
    Income
}: NewData): Promise<{ ok: boolean }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();

    try {
        await runAsync(db, "BEGIN");

        const accResult = await runAsync(
            db,
            `INSERT INTO bank_accounts (user_id, account_number, account_type, bank_name, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [id, BankAccount.account, BankAccount.type, BankAccount.bank, isNow(), isNow()]
        );

        const incomeResult = await runAsync(
            db,
            `INSERT INTO incomes (user_id, amount, income_date, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [id, Income.amount, Income.date, Income.description, isNow(), isNow()]
        );

        await runAsync(
            db,
            `UPDATE users SET onboarding_completed_at = ?, updated_at = ? WHERE id = ?`,
            [isNow(), isNow(), id]
        );

        await runAsync(db, "COMMIT");

        return { ok:true };
    }catch (e) {
        await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }        
}