// import { FormPeriodExpense } from "@/components/form_periodExpenses";
import { Header } from "@/components/header";
import { TableAllPeriodExpenses } from "@/components/table_periodExpenses";
import { useState } from "react";

export type ExpensePeriodRow = {
    id: number,
    month: number
    name: string,
    category_name: string,
    expense_date: string,
    amount: number,
    state: string,
    category_type: number,
}

export default function ExpensesPeriods() {
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);
//     const [reloadTable, setReloadTable] = useState(false);
//     const [expensePeriod, setExpensePeriod] = useState<ExpensePeriodRow | null>(null);
    
//     async function handleCreatePeriodExpense(expense: ExpensesForm) {
//         const res = await fetch("/api/me");
//         const dataUser = await res.json();        
//         let date = new Date();
//         let year = date.getFullYear();
//         let month = date.getMonth() + 1;

//         try {

//             const dataToSend = {
//                 id: dataUser.user.id,
//                 expense: expense,
//                 idPeriod: dataPeriodsMonth.periodBymonth.id,
//             }
    
//             let res = await fetch("/api/periodExpense", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(dataToSend),
//             });
//             const data = await res.json();

//             if (!res.ok) {
//                 setError(data.error);
//                 return;
//             }

//             setSuccess(data.id);
//             setTimeout(() => setSuccess(null), 5000);

//         } catch (err) {
//             setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
//             setTimeout(() => setError(null), 5000);
//         }
//     }

//    return(
//         <div>
//             <Header/>
//             Administracion de gastos por periodo
//             <br />
//             <FormPeriodExpense createPeriodExpense={handleCreatePeriodExpense} periodExpenseToEdit={periodExpenseToEdit} UpdatePeriodExpense={handleUpdatePeriodExpense}/>
//             {error && (
//                 <p className="text-red-600 text-center">{error}</p>
//             )}
//             {success && (
//                 <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
//             )}
//             <br />
//             <TableAllPeriodExpenses onEdit={setExpensePeriod} reload={reloadTable}/>
//         </div>
//     )
}