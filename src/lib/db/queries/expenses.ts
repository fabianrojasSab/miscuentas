import { getDb, runAsync } from "../index";

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
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const expenses = await runAsync(
            db,
            `INSERT INTO expenses (user_id, expense_category_id, name, description, income_date, amount, created_at, update_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, category, name, description, date, amount, isNow(), isNow()],
        );

        await runAsync(db, "COMMIT");

        return {id: expenses.lastID};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}