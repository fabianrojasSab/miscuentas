import { Button } from "@/components/buttons";
import { FormExpenses } from "@/components/form_expenses";
import { Header } from "@/components/header";
import { ExpenseCategoryType } from "@/emuns/ExpenseCategoryType";
import { useState } from "react";

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
    expense_date: string,
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

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
};

export default function Dasboard () {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [periodYear, setPeriodYear] = useState<PeriodRow |null>();
    const [periodMonth, setPeriodMonth] = useState<PeriodRow |null>();
    const [expenseToEdit, setExpenseToEdit] = useState<ExpenseRow | null>(null);
    const [reloadTable, setReloadTable] = useState(false);
    const [periodExpenses, setPeriodExpenses] = useState<BdPeriodExpensesRow[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [periodExpensesNoPayed, setPeriodExpensesNoPayed] = useState<BdPeriodExpensesRow[]>([]);

    //Funcion para calcular el total a pagar de los gastos del periodo teniendo el cuenta el estado del gasto
    function getTotalPeriodExpenses(
        periodExpenses: BdPeriodExpensesRow[]
    ): number {
        return periodExpenses
            .filter((expense) => expense.state === "Pendiente")
            .reduce((total, expense) => {
                return total + Number(expense.amount);
            }, 0);
    }

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

    //Funcion para hacer el cambio de estado del gasto del periodo
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
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        try {
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

                const res = await fetch(`/api/periodExpenses?periodId=${dataPeriodsMonth.periodBymonth.id}`, {
                    method: "GET",
                });
                const dataPeriodExpenses = await res.json();
    
                if (!res.ok) {
                    setError(dataPeriodExpenses.error);
                    return;
                }
    
                setPeriodExpenses(dataPeriodExpenses.periodExpenses ?? []);
            }
        } catch (err) {
            setError("!Informacion de ingresos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    async function handleLoadPeriodExpensesNoPayed(){
        setError(null);
        setLoading(true);
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        try {
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

                const res = await fetch(`/api/periodExpenses?periodId=${dataPeriodsMonth.periodBymonth.id}&noPayed=true`, {
                    method: "GET",
                });
                const dataPeriodExpenses = await res.json();
    
                if (!res.ok) {
                    setError(dataPeriodExpenses.error);
                    return;
                }
    
                setPeriodExpensesNoPayed(dataPeriodExpenses.periodExpenses ?? []);
            }
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
                    const res = await fetch(`/api/periodExpenses?periodId=${dataPeriodsMonth.periodBymonth.id}`, {
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
                        handleLoadPeriodExpensesNoPayed();
                    }
                }
            }
        } catch (err) {
            setError("!Informacion de gastos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }

    }

    //Funcion para crear un gasto variable
    async function handleCreateExpenseVariable(expense: ExpensesForm) {
        const res = await fetch("/api/me");
        const dataUser = await res.json();        
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        try {
            //consulta y valida si hay un periodo del mes actual, arreglar para que valide con el mes actual
            let res = await fetch(`/api/periods?month=${month}&year=${year}`, {
                method: "GET",
            });
            const dataPeriodsMonth = await res.json();

            if (!res.ok) {
                setError(dataPeriodsMonth.error);
                return;
            }

            const dataToSend = {
                id: dataUser.user.id,
                expense: expense,
                idPeriod: dataPeriodsMonth.periodBymonth.id,
                dashboard: true,
            }
    
            res = await fetch("/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });
            const data = await res.json();

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

    async function handleUpdateExpense(){

    }

return (
    <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto space-y-8 px-4 py-8">
            
            {/* Encabezado */}
            <section className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Administración de gastos
                </h1>

                <p className="text-muted-foreground">
                    Registra, administra y consulta tus gastos del período actual.
                </p>
            </section>

            {/* Acciones principales */}
            <section className="flex flex-wrap gap-3">
                <Button href="/user/incomes">
                    Registrar ingreso
                </Button>

                <Button href="/user/expenses">
                    Registrar gasto fijo
                </Button>

                <Button
                    variant="transparent"
                    onClick={handleSearchPeriod}
                >
                    Consultar gastos del mes
                </Button>
            </section>

            {/* Mensajes */}
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-600">
                    Ingreso con ID {success} registrado correctamente.
                </div>
            )}

            {/* Información del período */}
            <section className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    Mes actual
                </h2>

                {periodYear && periodMonth ? (
                    <div className="mt-2">
                        <p className="text-muted-foreground">
                            Datos del período:
                        </p>

                        <p className="text-xl font-medium">
                            {periodYear.name} {periodMonth.name}
                        </p>
                    </div>
                ) : (
                    <p className="mt-2 text-muted-foreground">
                        No hay un período creado para la fecha actual.
                    </p>
                )}
            </section>

            {/* Formulario */}
            <section className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                        {expenseToEdit
                            ? "Actualizar gasto"
                            : "Registrar nuevo gasto"}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Completa la información del gasto.
                    </p>
                </div>

                <FormExpenses
                    createExpense={handleCreateExpenseVariable}
                    expenseToEdit={expenseToEdit}
                    UpdateExpense={handleUpdateExpense}
                />
            </section>

            {/* Resumen */}
            <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Cantidad de gastos
                    </p>

                    <p className="mt-1 text-3xl font-bold">
                        {periodExpenses.length}
                    </p>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Total de gastos por pagar
                    </p>

                    <p className="mt-1 text-3xl font-bold">
                        {getTotalPeriodExpenses(periodExpenses).toLocaleString(
                            "es-CO",
                            {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                            }
                        )}
                    </p>
                </div>
            </section>

            {/* Tabla */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">
                        Gastos del mes
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Consulta y administra los gastos registrados.
                    </p>
                </div>

                {periodExpenses.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center">
                        <p className="text-muted-foreground">
                            No hay gastos registrados para este período.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Gasto
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Monto
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">
                                        Acción
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {periodExpenses.map((inc) => (
                                    <tr
                                        key={inc.id}
                                        className="border-t transition-colors hover:bg-muted/50"
                                    >
                                        <td className="px-4 py-3">
                                            {inc.name}
                                        </td>

                                        <td className="px-4 py-3 text-left font-medium">
                                            {Number(inc.amount).toLocaleString(
                                                "es-CO",
                                                {
                                                    style: "currency",
                                                    currency: "COP",
                                                    minimumFractionDigits: 0,
                                                }
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-muted px-3 py-1 text-sm">
                                                {inc.state}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            {inc.state === "Pendiente" ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleCheckpay(inc)
                                                    }
                                                >
                                                    Pagar
                                                </Button>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    Pagado
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Tabla de gastos de meses anteriores */}

                {periodExpensesNoPayed.length === 0 ? (
                    <>
                    </>
                ) : (
                    <section className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Gastos Pendientes
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Consulta y administra los gastos que quedaron pendientes de pagar de meses anteriores
                            </p>
                        </div>
                            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                                <table className="w-full min-w-[700px]">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Gasto
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Monto
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Estado
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {periodExpensesNoPayed.map((inc) => (
                                            <tr
                                                key={inc.id}
                                                className="border-t transition-colors hover:bg-muted/50 text-destructive"
                                            >
                                                <td className="px-4 py-3">
                                                    {inc.name}
                                                </td>

                                                <td className="px-4 py-3 text-left font-medium">
                                                    {Number(inc.amount).toLocaleString(
                                                        "es-CO",
                                                        {
                                                            style: "currency",
                                                            currency: "COP",
                                                            minimumFractionDigits: 0,
                                                        }
                                                    )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-muted px-3 py-1 text-sm">
                                                        {inc.state}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    {inc.state === "Pendiente" ? (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleCheckpay(inc)
                                                            }
                                                        >
                                                            Pagar
                                                        </Button>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            Pagado
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                    </section>
                )}
        </main>
    </div>
);
}