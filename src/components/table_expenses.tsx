import { useEffect, useState } from "react";

type ExpensesRow = {
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
    user_name?: string,
};

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    income_date: string;
    amount: number;
};

type Props = {
    onEdit: (expense: ExpensesRow) => void;
    reload: boolean;
};

export const TableExpensesByUser = ({ onEdit, reload }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
    const [loading, setLoading] = useState(true);

    //debemos crear propiedades independientes para cada funcion
    async function handleUpdateIncome(expense: ExpensesRow){
        const expenseToUpdate : ExpensesForm = {
            amount: expense.amount,
            income_date: expense.income_date,
            description: expense.description,
        };

        onEdit(expense)
    }

    async function loadExpenses(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

        setExpenses(data.expenses ?? []);
        } catch (err) {
            setError("!Informacion de ingresos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, [reload]);
    

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : expenses.length === 0 ? (
                <p>No hay gastos registrados.</p>
            ) : (
                <table className="w-full border">
                <thead>
                    <tr>
                    <th className="border p-2">Fecha</th>
                    <th className="border p-2">Monto</th>
                    <th className="border p-2">Descripción</th>
                    <th className="border p-2">Creado en</th>
                    <th className="border p-2">Actualizado en</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((inc) => (
                    <tr key={inc.id}>
                        <td className="border p-2">{inc.income_date}</td>
                        <td className="border p-2">{inc.amount}</td>
                        <td className="border p-2">{inc.description ?? "-"}</td>
                        <td className="border p-2">{inc.created_at}</td>
                        <td className="border p-2">{inc.updated_at}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    )
}

export const TableAllExpenses = ({ onEdit, reload }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
    const [loading, setLoading] = useState(true);


    async function handleLoadExpenses(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setExpenses(data.expenses ?? []);
        } catch (err) {
            setError("!Informacion de gastos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    async function handleDeleteExpense(id: number){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error();
            }

            await handleLoadExpenses();
        } catch (err) {
            setError("!Error al eliminar ingreso¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateIncome(expense: ExpensesRow){
        const expenseToUpdate : ExpensesForm = {
            amount: expense.amount,
            income_date: expense.income_date,
            description: expense.description,
        };

        onEdit(expense)
    }

    useEffect(() => {
        handleLoadExpenses();
    }, [reload]);

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : expenses.length === 0 ? (
                <p>No hay gastos registrados.</p>
            ) : (
                <table className="w-full border">
                <thead>
                    <tr>
                    <th className="border p-2">Fecha</th>
                    <th className="border p-2">Monto</th>
                    <th className="border p-2">Descripción</th>
                    <th className="border p-2">Creado en</th>
                    <th className="border p-2">Actualizado en</th>
                    <th className="border p-2">Eliminado en</th>
                    <th className="border p-2">Usuario</th>
                    <th className="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((inc) => (
                    <tr key={inc.id}>
                        <td className="border p-2">{inc.income_date}</td>
                        <td className="border p-2">{inc.amount}</td>
                        <td className="border p-2">{inc.description ?? "-"}</td>
                        <td className="border p-2">{inc.created_at}</td>
                        <td className="border p-2">{inc.updated_at}</td>
                        <td className="border p-2">{inc.deleted_at}</td>
                        <td className="border p-2">{inc.user_name}</td>
                        <td className="border p-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdateIncome(inc)}>Editar</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteExpense(inc.id)}>Eliminar</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    )
}