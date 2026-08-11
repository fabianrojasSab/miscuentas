import { allAsync, getDb, runAsync } from "../index";

type BdNewPeriodExpenseRow = {
    period_id: number,
    expense_id: number,
    expense_date: string,
    amount: number,
    expense_state_id: number,
}

export type BdPeriodExpensesRow = {
    id: number,
    month: number
    name: string,
    category_name: string,
    expense_date: string,
    amount: number,
    state: string,
}

export async function createPeriodExpenses({
    period_id,
    expense_id,
    expense_date,
    amount,
    expense_state_id,
}: BdNewPeriodExpenseRow): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const periodexpenses = await runAsync(
            db,
            `INSERT INTO period_expenses (period_id, expense_id, expense_date, amount, expense_state_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [period_id, expense_id, expense_date, amount, expense_state_id, isNow()],
        );

        await runAsync(db, "COMMIT");

        return {id: periodexpenses.lastID};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}

export async function getPeriodExpensesByUser(id: number): Promise<BdPeriodExpensesRow[]> {
    const db = getDb();
//modificar la columna income_date esta mal nombrada
    try {
        const allExpensesResult = await allAsync<BdPeriodExpensesRow>(
            db,
            `SELECT
                pe.id,
                p.month,
                e.name,
                ec.name as category_name,
                pe.expense_date,
                pe.amount,
                es.name as state
            FROM period_expenses pe
            INNER JOIN expenses e ON e.id = pe.expense_id
            INNER JOIN periods p ON pe.period_id = p.id
            INNER JOIN expense_states es ON es.id = pe.expense_state_id
            INNER JOIN expense_categories ec ON e.expense_category_id = ec.id
            WHERE e.user_id = ? `,
            [id],
        );

        if(!allExpensesResult){
            throw new Error("No hay gastos registrados")
        }

        return allExpensesResult;
    }finally {
        db.close();
    }   
}