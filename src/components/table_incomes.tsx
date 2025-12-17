import { useEffect, useState } from "react";

type IncomeRow = {
    id: number,
    user_id: number,
    amount: number,
    income_date: string,
    description: string,
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