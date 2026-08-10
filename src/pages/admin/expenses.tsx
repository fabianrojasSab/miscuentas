import { FormExpenses } from "@/components/form_expenses";
import { Header } from "@/components/header";
import { TableAllExpenses } from "@/components/table_expenses";
import { useState } from "react";


type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    income_date: string;
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
    income_date: string,
    amount: number,
    created_at: string,
    updated_at: string,
    deleted_at: string,
};

export default function Expenses(){
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [reloadTable, setReloadTable] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<ExpenseRow | null>(null);
    

    async function handleCreateExpense(expenses: OnboardingData["expenses"]) {

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            Expense: expenses
        };

        try {
            const res = await fetch("/api/expenses", {
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

    return (
        <div>
            <Header/>
            Administracion de Gastos
            <br />
            <FormExpenses createExpense={handleCreateExpense} expenseToEdit={expenseToEdit} UpdateExpense={handleUpdateExpense}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
            )}
            <br />
            <TableAllExpenses onEdit={setExpenseToEdit} reload={reloadTable}/>
        </div>
    )
}