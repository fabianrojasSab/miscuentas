import { useEffect, useState } from "react";

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

type IncomesForm = {
    amount: number;
    income_date: string;
    description: string;
};

type Props = {
    onEdit: (income: IncomeRow) => void;
    reload: boolean;
};

export const TableIncomesByUser = () =>{
    const [error, setError] = useState<string | null>(null);
    const [incomes, setIncomes] = useState<IncomeRow[]>([]);
    const [loading, setLoading] = useState(true);


    async function loadIncomes(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/incomes", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

        setIncomes(data.incomes ?? []);
        } catch (err) {
            setError("!Informacion de ingresos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        loadIncomes();
    }, []);
    

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : incomes.length === 0 ? (
                <p>No hay ingresos registrados.</p>
            ) : (
                <table className="w-full border">
                <thead>
                    <tr>
                    <th className="border p-2">Fecha</th>
                    <th className="border p-2">Monto</th>
                    <th className="border p-2">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {incomes.map((inc) => (
                    <tr key={inc.id}>
                        <td className="border p-2">{inc.income_date}</td>
                        <td className="border p-2">{inc.amount}</td>
                        <td className="border p-2">{inc.description ?? "-"}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    )
}

export const TableAllIncomes = ({ onEdit, reload }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [incomes, setIncomes] = useState<IncomeRow[]>([]);
    const [loading, setLoading] = useState(true);


    async function handleLoadIncomes(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/incomes", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setIncomes(data.incomes ?? []);
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
            const res = await fetch("/api/incomes", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error();
            }

            await handleLoadIncomes();
        } catch (err) {
            setError("!Error al eliminar ingreso¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateIncome(income: IncomeRow){
        const incomeToUpdate : IncomesForm = {
            amount: income.amount,
            income_date: income.income_date,
            description: income.description,
        };

        onEdit(income)
    }

    useEffect(() => {
        handleLoadIncomes();
    }, [reload]);
    

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : incomes.length === 0 ? (
                <p>No hay ingresos registrados.</p>
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
                    {incomes.map((inc) => (
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