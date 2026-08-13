import { FormIncome } from "@/components/form_incomes";
import { Header } from "@/components/header";
import { TableAllIncomes } from "@/components/table_incomes";
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

    //Funcion para crear el ingreso
    async function handleCreateIncome(income: IncomeForm) {
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
            setError("Error al crear el ingreso. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    //Funcion para actualizar un ingreso
    async function handleUpdateIncome(income: IncomeForm) {
        const body = {
            id: incomeToEdit?.id,
            income: income
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
            setError("Error actualizar el ingreso. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    return(
        <div>
            <Header/>
            Administracion de ingreso
            <br />
            <FormIncome createIncome={handleCreateIncome} incomeToEdit={incomeToEdit} UpdateIncome={handleUpdateIncome}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
            )}
            <br />
            <TableAllIncomes onEdit={setIncomeToEdit} reload={reloadTable}/>
        </div>
    )
}