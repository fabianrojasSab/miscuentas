import { FormPeriods } from "@/components/form_periods";
import { Header } from "@/components/header";
import { useState } from "react";

type PeriodForm = {
    name_period: string,
    description: string,
    period_type: number,
    period_value: number,
}

type PeriodRow = {
    id: number,
    name_period: string,
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
    const [periodToEdit, setPeriodToEdit] =  useState<PeriodRow | null>();
    const [error, setError] = useState<string | null>();
    const [success, setSuccess] = useState<string | null>();
    const [reloadTable, setReloadTable] = useState(false);

    async function handleCreatePeriod(period: PeriodForm){

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            Period: period
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
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    return(
        <div>
            <Header/>
            Administracion de periodos
            <FormPeriods createPeriod={handleCreatePeriod} periodToEdit={periodToEdit}/>
        </div>
    )
}