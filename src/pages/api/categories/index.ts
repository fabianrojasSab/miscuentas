import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "@/lib/db/queries/categories";

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

            const { category} = req.body as {
                category: CategoryForm
            };

            if (!category) {
                return res
                .status(400)
                .json({ error: "Datos invalidos"});
            }

            const newData = {
                name: category.name_category ?? "",
                category_type: category.category_type,
                description: category.description,
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

            const categoryDeleted = await deleteCategory(id);

            return res.status(200).json({
                success: true,
                id: categoryDeleted.id
            });
        }
        case "PUT": {
            const { id, category } = req.body as {
                id: number,
                category: CategoryForm
            };

            if (!id || !category ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios"});
            }

            const categoryUpdated = await updateCategory(id, category);

            return res.status(200).json({
                success: true,
                id: categoryUpdated.id
            });
        }
        default:
            return res.status(405).json({ error: "Método no permitido" });
        }
    } catch (err: unknown) {

        if (err instanceof Error) {
            return res.status(500).json({
                error: err.message
            });
        }

        return res.status(500).json({
            error: "Ocurrió un error desconocido"
        });
    }
}