import { createIncomes, getAllIncomes, getAllIncomesByUser, deleteIncomes, updateIncomes } from "@/lib/db/queries/incomes";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { get } from "http";
import { createExpenses } from "@/lib/db/queries/expenses";
import { createCategory, deleteCategory, getAllCategories, getAllCategoriesByUser, updateCategory } from "@/lib/db/queries/categories";
import { getAllExpenseCategories } from "@/lib/db/queries/expense_categories";

type CategoryForm = {
    name_category: string;
    category_type: number;
    description: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies[SESSION_COOKIE_NAME];

    if (!token) return res.status(401).json({ error: "No auth" });

    const user = await getUserBySessionToken(token);
    if (!user) return res.status(401).json({ error: "No auth" });

    try {
        switch (req.method) {
        case "POST": {

            const { id, Category} = req.body as {
                id: number,
                Category: CategoryForm
            };

            if (!id || !Category) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" + id + Category});
            }

            const newData = {
                userId: id,
                name: Category.name_category ?? "",
                category_type: Category.category_type,
                description: Category.description,
            }

            const expenseResult = await createCategory(newData);

            return res.status(200).json({
                success: true,
                id: expenseResult.id
            });
        }
        case "GET": {
            const categories = await getAllCategories();

            return res.status(200).json({ categories });
        }
        case "DELETE": {
            const { id } = req.body as {
                id: number,
            };

            if (!id ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" + id });
            }

            const categoryDelete = await deleteCategory(id);

            return res.status(200).json({
                success: true,
                id: categoryDelete.id
            });
        }
        case "PUT": {
            const { id, Category } = req.body as {
                id: number,
                Category: CategoryForm
            };

            if (!id || !Category ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios"});
            }

            const categoryUpdated = await updateCategory(id, Category);

            return res.status(200).json({
                success: true,
                id: categoryUpdated.id
            });
        }
        default:
            return res.status(405).json({ error: "Método no permitido" });
        }
    } catch (err: any) {
        if (err.code === "SQLLITE_ERROR") {
            return res.status(500).json({ error: err.message });
        }

        if (!err.code) {
            return res.status(401).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
}