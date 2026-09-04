import { FormExpensesFixed } from "@/components/form_expenses";
import { Header } from "@/components/header";
import { TableExpensesFixedByUser } from "@/components/table_expenses";
import { useState } from "react";

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
};

type OnboardingData = {
    // bankAccount: BankAccountForm | null;
    // income: IncomeForm | null;
    expenses: ExpensesForm | null;
};

type ExpenseRow = {
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
};

export default function Expenses(){
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [expenseToEdit, setExpenseToEdit] = useState<ExpenseRow | null>(null);
    const [reloadTable, setReloadTable] = useState(false);

    //funcion que crea el gasto fijo y registra el gasto del periodo al tiempo
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
                periodId: dataPeriodsMonth.periodBymonth.id,
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

            setReloadTable(prev => !prev);
            setSuccess(data.id);
            setTimeout(() => setSuccess(null), 5000);

        } catch (err) {
            setError("Error al crear el gasto variable. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    async function handleUpdateExpense(expense: OnboardingData["expenses"]) {

        const body = {
            id: expenseToEdit?.id,
            Expense: expense
        };

        try {
            const res = await fetch("/api/expenses", {
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
        <div className="h-full mb-4">
            <Header/>
            <FormExpensesFixed createExpense={handleCreatePeriodExpense} expenseToEdit={expenseToEdit} UpdateExpense={handleUpdateExpense}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
            )}
            <br />
            <TableExpensesFixedByUser onEdit={setExpenseToEdit} reload={reloadTable}/>
        </div>
    )
}