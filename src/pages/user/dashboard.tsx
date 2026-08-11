import { Button } from "@/components/buttons";
import { Header } from "@/components/header";
import { TableExpensesByUser } from "@/components/table_expenses";
import { useEffect, useState } from "react";
import { GiConsoleController } from "react-icons/gi";
//ARREGLAR EL FORMULARIO DE LOS PERIODOS AL MOMENTO DE CREAR LOS MESES
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

export default function Dasboard () {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [periodYear, setPeriodYear] = useState<PeriodRow |null>();
    const [periodMonth, setPeriodMonth] = useState<PeriodRow |null>();
    const [expenseToEdit, setExpenseToEdit] = useState<ExpenseRow | null>(null);
    const [reloadTable, setReloadTable] = useState(false);

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

            setPeriodYear(data.periods);
            if(data.periods){
                const res = await fetch(`/api/periods?month=${year}`, {
                    method: "GET",
                });
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error);
                    return;
                }

                setPeriodMonth(data.periods);
                if(data.periods){
                    const res = await fetch(`/api/periodExpenses`, {
                        method: "GET",
                    });
                    const data = await res.json();

                    if(data.periodExpenses.length == 0){
                        const res = await fetch(`/api/expenses?type=dashboard`, {
                            method: "GET",
                        });
                        const data = await res.json();

                        if (!res.ok) {
                            setError(data.error);
                            return;
                        }

                        if(data.expenses){

                            const dataToSend = {
                                periodMonth: periodMonth,
                                expenses: data.expeneses,
                            }

                            const res = await fetch(`/api/periodExpenses`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(dataToSend),
                            });
                            const data = await res.json();
                        }

                    }
                }
            }
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
            {periodYear ? (<div>Datos del: {periodYear?.name}</div>) : (<div> No hay periodo creado</div>)}
            <TableExpensesByUser onEdit={setExpenseToEdit} reload={reloadTable}/>
        </div>
    )
}