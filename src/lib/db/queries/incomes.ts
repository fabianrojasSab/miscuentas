import { getDb } from "../index";

export type NewBankAccount = {
    userId: number,
    amount: number,
    date: string,
    description: string
};

export async function createIncomes({
    userId,
    amount,
    date,
    description
}: NewBankAccount): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();

    return new Promise((resolve, reject) => {
        db.run(
        `INSERT INTO incomes (user_id, amount, income_date, description, created_at, update_at)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, amount, date, description, isNow(), isNow()],
        function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        }
        );
    });
}