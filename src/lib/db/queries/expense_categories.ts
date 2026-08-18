import { getDb, allAsync, getAsync } from "../index";

export type DbCategoryRow = {
    name: string,
    category_type: number,
    description: string
};

export async function getAllExpenseCategories(): Promise<DbCategoryRow[]> {
    const db = getDb();

    try {
        const categoriesResult = await allAsync<DbCategoryRow>(
            db,
            `SELECT 
                name,
                category_type,
                description
            FROM expense_categories`,
        );

        return categoriesResult;
    }finally {
        //db.close();
    }  
}

export async function getExpenseCateroryById(id: number): Promise<DbCategoryRow> {
    const db = getDb();

    try {
        const categoryResult = await getAsync<DbCategoryRow>(
            db,
            `SELECT 
                name,
                category_type,
                description
            FROM expense_categories
            WHERE id = ?`,
            [id]
        );

        if(!categoryResult){
            throw new Error("No hay registros")
        }

        return categoryResult;
    }finally {
        //db.close();
    }  
}