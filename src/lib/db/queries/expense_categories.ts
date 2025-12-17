import { getDb, allAsync } from "../index";

export type DbCategoryRow = {
    name: string,
    category_type: string,
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
        db.close();
    }  
}