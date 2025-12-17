import { allAsync, getDb, runAsync } from "../index";

export type NewBankAccount = {
    userId: number,
    amount: number,
    date: string,
    description: string
};

export type DbIncomeRow = {
    id: number,
    user_id: number,
    amount: number,
    income_date: string,
    description: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
};

export async function createIncomes({
    userId,
    amount,
    date,
    description
}: NewBankAccount): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const incomes = await runAsync(
            db,
            `INSERT INTO incomes (user_id, amount, income_date, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, amount, date, description, isNow(), isNow()],
        );
        await runAsync(db, "COMMIT");
        
        return {id: incomes.lastID};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}

export async function getAllIncomesByUser(id: number): Promise<DbIncomeRow[]> {
    const db = getDb();

    try {
        const allIncomesResult = await allAsync<DbIncomeRow>(
            db,
            `SELECT id,
                user_id,
                amount,
                income_date,
                description,
                created_at,
                updated_at,
                deleted_at
            FROM incomes
            WHERE user_id = ?`,
            [id],
        );

        if(!allIncomesResult){
            throw new Error("No hay ingresos registrados")
        }

        return allIncomesResult;
    }finally {
        db.close();
    }   
}