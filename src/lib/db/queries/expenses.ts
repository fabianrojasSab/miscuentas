import { allAsync, getDb, runAsync } from "../index";

export type BdNewExpenseRow = {
    userId: number,
    category: number,
    name: string,
    description: string,
    date: string,
    amount:number
};

export type DbUpdateExpenseRow = {
    expense_category_id: number,
    name: string,
    description: string,
    expense_date: string,
    amount:number
}

export type BdExpenseRow = {
    id: number,
    userId: number
    category_name: string,
    category_type: number,
    name: string,
    expense_date: string,
    amount: number,
}

export async function createExpenses({
    userId,
    category,
    name,
    description,
    date,
    amount
}: BdNewExpenseRow): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const expenses = await runAsync(
            db,
            `INSERT INTO expenses (user_id, expense_category_id, name, description, expense_date, amount, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, category, name, description, date, amount, isNow(), isNow()],
        );

        await runAsync(db, "COMMIT");

        return {id: expenses.lastID};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        //db.close();
    }  
}

export async function getAllExpensesByUser(id: number): Promise<BdNewExpenseRow[]> {
    const db = getDb();

    try {
        const allExpensesResult = await allAsync<BdNewExpenseRow>(
            db,
            `SELECT
                *
            FROM expenses
            WHERE user_id = ?`,
            [id],
        );

        if(!allExpensesResult){
            throw new Error("No hay gastos registrados")
        }

        return allExpensesResult;
    }finally {
        //db.close();
    }   
}

export async function getExpensesByUser(id: number): Promise<BdExpenseRow[]> {
    const db = getDb();

    try {
        const allExpensesResult = await allAsync<BdExpenseRow>(
            db,
            `SELECT
                e.id,
                e.user_id,
                ec.name as category_name,
                ec.category_type,
                e.name,
                e.expense_date,
                e.amount
            FROM expenses e
            INNER JOIN expense_categories ec ON e.expense_category_id = ec.id
            WHERE e.user_id = ?`,
            [id],
        );

        if(!allExpensesResult){
            throw new Error("No hay gastos registrados")
        }

        return allExpensesResult;
    }finally {
        //db.close();
    }   
}

export async function getAllExpenses(): Promise<BdNewExpenseRow[]> {
    const db = getDb();

    try {
        const allExpensesResult = await allAsync<BdNewExpenseRow>(
            db,
            `SELECT
                i.*,
                u.name as user_name
            FROM expenses i
            INNER JOIN users u ON i.user_id = u.id`,
        );

        if(!allExpensesResult){
            throw new Error("No hay gastos registrados")
        }

        return allExpensesResult;
    }finally {
        //db.close();
    }   
}

export async function deleteExpense(id: number): Promise<{ id: number }> {
    const db = getDb();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const deleteResult = await runAsync(
            db,
            `DELETE FROM expenses WHERE id = ?`,
            [id],
        );
        await runAsync(db, "COMMIT");
        
        if(deleteResult.changes === 0){
            throw new Error("No se encontró el gasto a eliminar");
        }
        return {id};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        //db.close();
    }  
}

export async function updateExpense(id: number, data: DbUpdateExpenseRow): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const updateResult = await runAsync(
            db,
            `UPDATE expenses SET
            (expense_category_id, name, description, expense_date, amount, updated_at) = (?, ?, ?, ?, ?, ?)
            WHERE id = ?`,
            [data.expense_category_id, data.name, data.description, data.expense_date, data.amount, isNow(), id],
        );
        await runAsync(db, "COMMIT");

        if(updateResult.changes === 0){
            throw new Error("No se encontró el gasto a actualizar");
        }
        return {id};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        //db.close();
    }  
}