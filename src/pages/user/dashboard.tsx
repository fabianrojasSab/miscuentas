import { Button } from "@/components/buttons";
import { Header } from "@/components/header";
import { TableExpensesByUser } from "@/components/table_expenses";
import { ExpenseCategoryType } from "@/emuns/ExpenseCategoryType";
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

export type BdPeriodExpensesRow = {
    id: number,
    month: number
    name: string,
    category_name: string,
    expense_date: string,
    amount: number,
    state: string,
    category_type: number,
}

export default function Dasboard () {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [periodYear, setPeriodYear] = useState<PeriodRow |null>();
    const [periodMonth, setPeriodMonth] = useState<PeriodRow |null>();
    const [expenseToEdit, setExpenseToEdit] = useState<ExpenseRow | null>(null);
    const [reloadTable, setReloadTable] = useState(false);
    const [periodExpenses, setPeriodExpenses] = useState<BdPeriodExpensesRow[]>([]);

    function getCategoryTypeLabel(type: ExpenseCategoryType): string {
        switch (type) {
            case ExpenseCategoryType.FIXED:
                return "Fijo";

            case ExpenseCategoryType.VARIABLE:
                return "Variable";

            case ExpenseCategoryType.SAVINGS:
                return "Ahorro";

            default:
                return "Desconocido";
        }
    }

    async function handleCheckpay(expense: BdPeriodExpensesRow){
        try {

            const expenseToPay = {
                expense_date: expense.expense_date,
                amount: expense.amount,
                expense_state_id: 2,
            }

            const body = {
                id: expense.id,
                periodExpense: expenseToPay
            }

            const res = await fetch("/api/periodExpenses", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error();
            }

            await handleLoadPeriodExpenses();
        } catch (err) {
            setError("!Error al eliminar ingreso¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    async function handleLoadPeriodExpenses(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/api/periodExpenses`, {
                method: "GET",
            });
            const dataPeriodExpenses = await res.json();

            if (!res.ok) {
                setError(dataPeriodExpenses.error);
                return;
            }

            setPeriodExpenses(dataPeriodExpenses.periodExpenses ?? []);
        } catch (err) {
            setError("!Informacion de ingresos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    async function handleSearchPeriod () {
        setError(null);
        setLoading(true);
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        try { 
            //realiza consulta y valida si hay un periodo del año actual, creado
            const res = await fetch(`/api/periods?year=${year}`, {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }
            setPeriodYear(data.periodsByYear);
            if(Object.keys(data).length != 0){

                //consulta y valida si hay un periodo del mes actual, arreglar para que valide con el mes actual
                const res = await fetch(`/api/periods?month=${month}&year=${year}`, {
                    method: "GET",
                });
                const dataPeriodsMonth = await res.json();

                if (!res.ok) {
                    setError(dataPeriodsMonth.error);
                    return;
                }
                setPeriodMonth(dataPeriodsMonth.periodBymonth);
                if(Object.keys(dataPeriodsMonth).length != 0){

                    //consulta y valida si tiene gastos del periodo actual creados
                    const res = await fetch(`/api/periodExpenses`, {
                        method: "GET",
                    });
                    const dataPeriodExpenses = await res.json();

                    //si no tiene gastos del periodos creados consulta los gastos configurados por el usuario y los crea en los gastos del periodo actual
                    if(dataPeriodExpenses.periodExpenses.length == 0){
                        const res = await fetch(`/api/expenses?type=dashboard`, {
                            method: "GET",
                        });
                        const dataExpenses = await res.json();

                        if(dataExpenses.expenses.length > 0){
                            //recopila la data para realizar la creacion de los gastos del periodo actual
                            const dataToSend = {
                                periodId: dataPeriodsMonth.periodBymonth.id,
                                expenses: dataExpenses.expenses,
                            }

                            //crea los gastos del periodo con los gastos consultados
                            const res = await fetch(`/api/periodExpenses`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(dataToSend),
                            });
                            const data = await res.json();
                        }
                    }else{
                        setPeriodExpenses(dataPeriodExpenses.periodExpenses ?? []);
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

    return (
        <div>
            <Header/>
            dashboard de usuario
            <Button href="/user/incomes">Registrar Ingreso</Button>
            <Button href="/user/expenses">Registrar gasto</Button>
            <Button onClick={handleSearchPeriod}>ver</Button>
            {periodYear ? (<div>Datos del: {periodYear?.name} {periodMonth?.name}</div>) : (<div> No hay periodo creado</div>)}
            {/* <TableExpensesByUser onEdit={setExpenseToEdit} reload={reloadTable}/> */}

                    {periodExpenses.map((inc) => (
                    <tr key={inc.id}>
                        <td className="border p-2">{inc.name}</td>
                        <td className="border p-2">{inc.month}</td>
                        <td className="border p-2">{inc.category_name}</td>
                        <td className="border p-2">{inc.amount}</td>
                        <td className="border p-2">{inc.state}</td>
                        <td className="border p-2">{getCategoryTypeLabel(inc.category_type)}</td>
                        {inc.state === "Pendiente" && (
                            <td className="border p-2"><Button onClick={() => handleCheckpay(inc)}>Pagar</Button></td>

                        )}
                    </tr>
                    ))}
        </div>
    )
}