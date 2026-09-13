// import { FormPeriodExpense } from "@/components/form_periodExpenses";
import { FormPeriodExpense } from "@/components/form_periodExpenses";
import { Header } from "@/components/header";
import { TableAllPeriodExpenses } from "@/components/table_periodExpenses";
import { useState } from "react";

export type ExpensePeriodRow = {
    id: number,
    month_id: number,
    month_name: string,
    name: string,
    description: string,
    category_id: number,
    category_name: string,
    category_type: number,
    expense_date: string,
    amount: number,
    state: string,
}

type ExpensesRow = {
    id: number,
    user_id: number,
    expense_category_id: number,
    name: string,
    description: string,
    expense_date: string,
    amount: number,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    user_name?: string,
};

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
    period_id?: number;
};

export default function ExpensesPeriods() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [reloadTable, setReloadTable] = useState(false);
    const [expensePeriodToEdit, setExpensePeriodToEdit] = useState<ExpensePeriodRow | null>(null);
    
    async function handleCreatePeriodExpense(expense: ExpensesForm) {
        const res = await fetch("/api/me");
        const dataUser = await res.json();        
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        try {
            //consulta y valida si hay un periodo del mes actual, arreglar para que valide con el mes actual
            let res = await fetch(`/api/periods?month=${month}&year=${year}`, {
                method: "GET",
            });
            const dataPeriodsMonth = await res.json();

            if (!res.ok) {
                setError(dataPeriodsMonth.error);
                return;
            }

            const dataToSend = {
                id: dataUser.user.id,
                expense: expense,
                idPeriod: dataPeriodsMonth.periodBymonth.id,
            }
    
            res = await fetch("/api/periodExpenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });
            const data = await res.json();

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

    async function handleUpdatePeriodExpense(periodExpense: ExpensesForm){
        const body = {
            id: expensePeriodToEdit?.id,
            periodExpense: periodExpense,
        };

        try {
            const res = await fetch("/api/periodExpenses", {
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
            setError("Error al actualizar el gasto. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    return(
        <div>
            <Header/>
            Administracion de gastos por periodo
            <br />
            <FormPeriodExpense createPeriodExpense={handleCreatePeriodExpense} periodExpenseToEdit={expensePeriodToEdit} UpdatePeriodExpense={handleUpdatePeriodExpense}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
            )}
            <br />
            <TableAllPeriodExpenses onEdit={setExpensePeriodToEdit} reload={reloadTable}/>
        </div>
    )
}