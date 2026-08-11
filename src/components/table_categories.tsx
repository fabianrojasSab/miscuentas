import { ExpenseCategoryType } from "@/emuns/ExpenseCategoryType";
import { useEffect, useState } from "react";

type CategoryRow = {
    id: number,
    name: string,
    category_type: number,
    description: string,
    created_at: string,
    updated_at: string,
};

type CategoryForm = {
    name_category: string;
    category_type: string;
    description: string;
};

type Props = {
    onEdit: (income: CategoryRow) => void;
    reload: boolean;
};

export const TableAllCategories = ({ onEdit, reload }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [loading, setLoading] = useState(true);

    function getCategoryTypeLabel(type: ExpenseCategoryType): string {
        switch (type) {
            case ExpenseCategoryType.FIXED:
                return "Fijo";

            case ExpenseCategoryType.VARIABLE:
                return "Variable";

            case ExpenseCategoryType.SAVINGS:
                return "Ahorro";

            default:
                return "Desconocido";
        }
    }

    async function handleLoadCategories(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/categories", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setCategories(data.categories ?? []);
        } catch (err) {
            setError("!Informacion de ingresos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    async function handleDeleteIncome(id: number){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/categories", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error();
            }

            await handleLoadCategories();
        } catch (err) {
            setError("!Error al eliminar ingreso¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateIncome(income: CategoryRow){
        const incomeToUpdate : CategoryForm = {
            name_category: income.name,
            category_type: income.category_type,
        };

        onEdit(income)
    }

    useEffect(() => {
        handleLoadCategories();
    }, [reload]);
    

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : categories.length === 0 ? (
                <p>No hay categorias registradas.</p>
            ) : (
                <table className="w-full border">
                <thead>
                    <tr>
                    <th className="border p-2">nombre de categoria</th>
                    <th className="border p-2">Tipo de categoria</th>
                    <th className="border p-2">Descripcion</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((inc) => (
                    <tr key={inc.id}>
                        <td className="border p-2">{inc.name}</td>
                        <td className="border p-2">{getCategoryTypeLabel(inc.category_type)}</td>
                        <td className="border p-2">{inc.description}</td>
                        <td className="border p-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdateIncome(inc)}>Editar</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteIncome(inc.id)}>Eliminar</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    )
}