import { FormCategory } from "@/components/form_categories";
import { Header } from "@/components/header";
import { TableAllCategories } from "@/components/table_categories";
import { useState } from "react";
//hace falta que reinicie los datos del formulario cuando se envien los datos

type CategoryForm = {
    name_category: string;
    category_type: number;
    description: string;
};

type CategoryRow = {
    id: number,
    name: string,
    category_type: number,
    description: string,
    created_at: string,
    updated_at: string,
};

export default function Categories(){
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [incomeToEdit, setIncomeToEdit] = useState<CategoryRow | null>(null);
    const [reloadTable, setReloadTable] = useState(false);

    //Funcion para crear la categoria
    async function handleCreateCategory(category: CategoryForm) {

        const body = {
            category: category
        };

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            setReloadTable(prev => !prev);

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setSuccess(data.id);
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            setError("Error crear la categoria. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    //Funcion para actualizar al categoria
    async function handleUpdateCategory(category: CategoryForm) {
        const body = {
            id: incomeToEdit?.id,
            category: category
        };

        try {
            const res = await fetch("/api/categories", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            setReloadTable(prev => !prev);

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setSuccess(data.id);
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            setError("Error al actualizar la categoria. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    return(
        <div>
            <Header/>
            Administracion de categorias
            <br />
            <FormCategory createCategory={handleCreateCategory} categoryToEdit={incomeToEdit} UpdateCategory={handleUpdateCategory}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Categoria con ID {success} registrada</p>
            )}
            <br />
            <TableAllCategories onEdit={setIncomeToEdit} reload={reloadTable}/>
        </div>
    )
}