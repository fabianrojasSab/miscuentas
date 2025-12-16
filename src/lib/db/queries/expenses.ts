import { getDb } from "../index";

export type NewBankAccount = {
    userId: number,
    category: number,
    name: string,
    description: string,
    date: string,
    amount:number
};

export async function createExpenses({
    userId,
    category,
    name,
    description,
    date,
    amount
}: NewBankAccount): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();

    return new Promise((resolve, reject) => {
        db.run(
        `INSERT INTO expenses (user_id, expense_category_id, name, description, income_date, amount, created_at, update_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, category, name, description, date, amount, isNow(), isNow()],
        function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        }
        );
    });
}