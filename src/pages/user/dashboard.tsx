import { Button } from "@/components/buttons";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";

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

export default function Dasboard () {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState<PeriodRow |null>();

    async function handleSearchPeriod () {
        setError(null);
        setLoading(true);
        let date = new Date();
        let year = date.getFullYear();

        try { 
            const res = await fetch(`/api/periods?year=${year}`, {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setPeriod(data.periods ?? []);
        } catch (err) {
            setError("!Informacion de ingresos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        handleSearchPeriod()
    }, [])

    return (
        <div>
            <Header/>
            dashboard de usuario
            <Button href="/user/incomes">Registrar Ingreso</Button>
            <Button href="/user/expenses">Registrar gasto</Button>
            {period ? (<div>Datos del: {period?.name}</div>) : (<div> No hay periodo creado</div>)}
        </div>
    )
}