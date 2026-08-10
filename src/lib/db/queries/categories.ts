import { allAsync, getDb, runAsync } from "../index";

type BdNewCategoryRow = {
    id: number,
    name: string,
    category_type: number,
    description: string,
    created_at: string,
    updated_at: string,
};

type DbUpdateCategoryRow = {
    name_category: string,
    category_type: number,
    description: string
};

export async function createCategory({
    name,
    category_type,
    description,
}: BdNewCategoryRow): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const expenses = await runAsync(
            db,
            `INSERT INTO expense_categories (name, category_type, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
            [ name, category_type, description, isNow(), isNow()],
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

export async function getAllCategoriesByUser(id: number): Promise<BdNewCategoryRow[]> {
    const db = getDb();

    try {
        const allCategoriesResult = await allAsync<BdNewCategoryRow>(
            db,
            `SELECT
                *
            FROM expense_categories
            WHERE user_id = ?`,
            [id],
        );

        if(!allCategoriesResult){
            throw new Error("No hay gastos registrados")
        }

        return allCategoriesResult;
    }finally {
        db.close();
    }   
}

export async function getAllCategories(): Promise<BdNewCategoryRow[]> {
    const db = getDb();

    try {
        const allCategoriesResult = await allAsync<BdNewCategoryRow>(
            db,
            `SELECT
                i.*
            FROM expense_categories i`,
        );

        if(!allCategoriesResult){
            throw new Error("No hay categorias registradas")
        }

        return allCategoriesResult;
    }finally {
        db.close();
    }   
}

export async function deleteCategory(id: number): Promise<{ id: number }> {
    const db = getDb();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const deleteResult = await runAsync(
            db,
            `DELETE FROM expense_categories WHERE id = ?`,
            [id],
        );
        await runAsync(db, "COMMIT");
        
        if(deleteResult.changes === 0){
            throw new Error("No se encontró la categoria a eliminar");
        }
        return {id};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}

export async function updateCategory(id: number, data: DbUpdateCategoryRow): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const updateResult = await runAsync(
            db,
            `UPDATE expense_categories SET
            (name, category_type, description, updated_at) = (?, ?, ?, ?)
            WHERE id = ?`,
            [data.name_category, data.category_type, data.description,  isNow(), id],
        );
        await runAsync(db, "COMMIT");

        if(updateResult.changes === 0){
            throw new Error("No se encontró la categoria a actualizar");
        }
        return {id};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}