import { Category } from "@/components/form_categories";
import { Header } from "@/components/header";
import { TableAllCategories } from "@/components/table_categories";
import { useState } from "react";
//hace falta que reinicie los datos del formulario cuando se envien los datos
type BankAccountForm = {
    account: number;
    type: string;
    bank: string;
};

type CategoryForm = {
    name_category: string;
    category_type: string;
    description: string;
};

type OnboardingData = {
    bankAccount: BankAccountForm | null;
    category: CategoryForm | null;
    expenses: {
        name: string;
        amount: number;
        category_id: number;
        date: string;
    }[];
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

    async function handleCreateCategory(category: OnboardingData["category"]) {

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            Category: category
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
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    async function handleUpdateCategory(category: OnboardingData["category"]) {

        const body = {
            id: incomeToEdit?.id,
            Income: category
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
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    return(
        <div>
            <Header/>
                Administracion de categorias
            <br />
            <Category createCategory={handleCreateCategory} categoryToEdit={incomeToEdit} UpdateCategory={handleUpdateCategory}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
            )}
            <br />
            <TableAllCategories onEdit={setIncomeToEdit} reload={reloadTable}/>
        </div>
    )
}