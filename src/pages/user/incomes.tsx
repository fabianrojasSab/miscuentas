import { FormIncome } from "@/components/form_incomes";
import { Header } from "@/components/header";
import { TableIncomesByUser } from "@/components/table_incomes";
import { useState } from "react";

type BankAccountForm = {
    account: number;
    type: string;
    bank: string;
};

type IncomeForm = {
    amount: number;
    income_date: string;
    description: string;
}

type OnboardingData = {
    bankAccount: BankAccountForm | null;
    income: IncomeForm | null;
    expenses: {
        name: string;
        amount: number;
        category_id: number;
        date: string;
    }[];
};

type IncomeRow = {
    id: number,
    user_id: number,
    amount: number,
    income_date: string,
    description: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    user_name?: string,
};

export default function Incomes(){
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [incomeToEdit, setIncomeToEdit] = useState<IncomeRow | null>(null);
    const [reloadTable, setReloadTable] = useState(false);

    async function handleSubmit(income: OnboardingData["income"]) {

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            income: income
        };

        try {
            const res = await fetch("/api/incomes", {
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

    async function handleUpdateIncome(income: OnboardingData["income"]) {

        const body = {
            id: incomeToEdit?.id,
            Income: income
        };

        try {
            const res = await fetch("/api/incomes", {
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
            <FormIncome createIncome={handleSubmit} incomeToEdit={incomeToEdit} UpdateIncome={handleUpdateIncome}/>
            {/* Mensajes */}
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-600">
                    Ingreso con ID {success} registrado correctamente.
                </div>
            )}
            <br />
            <TableIncomesByUser onEdit={setIncomeToEdit} reload={reloadTable}/>
            <br />
        </div>
    )
}