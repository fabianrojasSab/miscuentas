import { FormPeriods } from "@/components/form_periods";
import { Header } from "@/components/header";
import { TableAllPeriods } from "@/components/table_periods";
import { useState } from "react";

type PeriodForm = {
    name_period: string,
    description: string,
    period_type: number,
    period_value: number,
    year: number | null,
    month: number | null,
    week: number | null,
    day: number | null,
    parent_id: number | null,
}


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

export default function Periods(){
    const [periodToEdit, setPeriodToEdit] =  useState<PeriodRow | null>(null);
    const [error, setError] = useState<string | null>();
    const [success, setSuccess] = useState<string | null>();
    const [reloadTable, setReloadTable] = useState(false);

    //Funcion para crear un periodo
    async function handleCreatePeriod(period: PeriodForm){
        const body = {
            period: period
        };

        try {
            const res = await fetch("/api/periods", {
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
            setError("Error al crear el periodo. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    //Controlador para actualizar periodo
    async function handleUpdatePeriod(period: PeriodForm) {
        const body = {
            id: periodToEdit?.id,
            period: period
        };

        try {
            const res = await fetch("/api/periods", {
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
            setError("Error al actualizar el periodo. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    return(
        <div>
            <Header/>
            Administracion de periodos
            <FormPeriods createPeriod={handleCreatePeriod} periodToEdit={periodToEdit} UpdatePeriod={handleUpdatePeriod}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Periodo con ID {success} registrado</p>
            )}
            <br />
            <TableAllPeriods onEdit={setPeriodToEdit} reload={reloadTable}/>
        </div>
    )
}