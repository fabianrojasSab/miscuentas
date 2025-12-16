import { getDb } from "../index";

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

    return new Promise((resolve, reject) => {
        db.run(
        `INSERT INTO bank_accounts (user_id, account_number, account_type, bank_name, created_at, update_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, account, type, bank, isNow(), isNow()],
        function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        }
        );
    });
}