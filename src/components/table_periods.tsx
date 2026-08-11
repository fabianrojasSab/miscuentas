import { PeriodType } from "@/emuns/PeriodType";
import { useEffect, useState } from "react"

type PeriodRow = {
    id: number,
    name: string,
    description: string,
    period_type: number,
    year: number,
    month: number,
    week: number,
    day: number,
    parent_id: number,
    created_at: string,
    updated_at: string,
}

type Props = {
    onEdit:(period: PeriodRow) => void;
    reload: boolean;
};

export const TableAllPeriods = ({ onEdit, reload }: Props) => {
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState<boolean | null>();
    const [periods, setPeriods] = useState<PeriodRow[]>([]);

    function getPeriodValue(period: PeriodRow): string {
        switch (period.period_type) {
            case PeriodType.YEARLY:
                return `${period.year}`;

            case PeriodType.MONTHLY:
                return `${period.month}/${period.year}`;

            case PeriodType.WEEKLY:
                return `Semana ${period.week} - ${period.year}`;

            case PeriodType.DAILY:
                return `${period.day}/${period.month}/${period.year}`;

            default:
                return "-";
        }
    }

    function getPeriodType(type: PeriodType): string {
        switch (type) {
            case PeriodType.DAILY:
                return "Diario";

            case PeriodType.MONTHLY:
                return "Mensual";

            case PeriodType.WEEKLY:
                return "Semanal";


            case PeriodType.YEARLY:
                return "Anual";
        }
    }

    async function handleLoadPeriods(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/periods", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setPeriods(data.periods ?? []);
        } catch (err) {
            setError("!Informacion de ingresos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    async function handleDeletePeriod(id: number){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/periods", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error();
            }

            await handleLoadPeriods();
        } catch (err) {
            setError("!Error al eliminar ingreso¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateIncome(period: PeriodRow){
        // const periodToUpdate : PeriodRow = {
        //     amount: period.amount,
        //     income_date: period.income_date,
        //     description: period.description,
        // };

        onEdit(period)
    }

    useEffect(() => {
        handleLoadPeriods();
    }, [reload]);

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : periods.length === 0 ? (
                <p>No hay ingresos registrados.</p>
            ) : (
                <table className="w-full border">
                <thead>
                    <tr>
                    <th className="border p-2">Nombre</th>
                    <th className="border p-2">Descripción</th>
                    <th className="border p-2">Tipo</th>
                    <th className="border p-2">valor</th>
                    </tr>
                </thead>
                <tbody>
                    {periods.map((inc) => (
                    <tr key={inc.id}>
                        <td className="border p-2">{inc.name}</td>
                        <td className="border p-2">{inc.description ?? "-"}</td>
                        <td className="border p-2">{getPeriodType(inc.period_type)}</td>
                        <td className="border p-2">{getPeriodValue(inc)}</td>
                        <td className="border p-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdateIncome(inc)}>Editar</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeletePeriod(inc.id)}>Eliminar</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    )
}