import { getDb, runAsync } from "../index";

export type NewBankAccount = {
    userId: number,
    account: string,
    type: number,
    bank: string
};

export async function createBankAccount({
    userId,
    account,
    type,
    bank
}: NewBankAccount): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;
        const bankAcount = await runAsync(
            db,
            `INSERT INTO bank_accounts (user_id, account_number, account_type, bank_name, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, account, type, bank, isNow(), isNow()]
        );

        await runAsync(db, "COMMIT");

        return { id: bankAcount.lastID };
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}