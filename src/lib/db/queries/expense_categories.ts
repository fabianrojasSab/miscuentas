import { getDb } from "../index";

export type DbCategoryRow = {
    name: string,
    category_type: string,
    description: string
};

export async function getAllExpenseCategories(): Promise<DbCategoryRow[]> {
    const db = getDb();
    return new Promise((resolve, reject) => {
        db.all<DbCategoryRow>(
        `SELECT 
            name,
            category_type,
            description
        FROM expense_categories`,
        (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        }
        );
    });
}