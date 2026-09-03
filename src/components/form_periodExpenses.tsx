import { FormExpensesVariable } from "@/components/form_expenses";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/buttons"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
};

type ExpensesRow = {
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
    user_name?: string,
};

type Props = {
    createPeriodExpense: (expense: ExpensesForm) => void;
    periodExpenseToEdit: ExpensesRow | null;
    UpdatePeriodExpense: (expense: ExpensesForm) => void;
};

type CategoryRow = {
    id: number,
    name: string,
    category_type: number,
    description: string,
    created_at: string,
    updated_at: string,
};

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

//Componente para ingresar gastos variables desde el dashboard del usuario
export const FormPeriodExpenseVariableByUser = ({ createPeriodExpense, periodExpenseToEdit, UpdatePeriodExpense }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesForm | null>(null);
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    async function handleLoadCategories(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/categories?type=2", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setCategories(data.categories ?? []);
        } catch (err) {
            setError("!Informacion de ingresos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;

        const body : ExpensesForm = {
            name: form.name_expense.value,
            amount: expenses?.amount ?? 0,
            expense_date: form.date.value,
            description: form.description.value ?? "",
            expense_category_id: Number(form.expense_category_id.value),
        };

        if (periodExpenseToEdit) {
            UpdatePeriodExpense(body);
        } else {
            createPeriodExpense(body);
        }

        setExpenses(null);
        setCategory("");
    }

    useEffect(() => {
        handleLoadCategories()
        if (periodExpenseToEdit) {
            setExpenses({
                name: periodExpenseToEdit.name,
                amount: periodExpenseToEdit.amount,
                expense_date: periodExpenseToEdit.expense_date,
                description: periodExpenseToEdit.description ?? "",
                expense_category_id: periodExpenseToEdit.expense_category_id,
            });
        }
    }, [periodExpenseToEdit]);

    return(
        <div className="w-full max-w-md mx-auto bg-card rounded-lg">
            <form className="space-y-5 rounded-lg border p-6 shadow-sm" onSubmit={handleSubmit}>
                {/* Categoria */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <Select
                            name="expense_category_id"
                            value={category}
                            onValueChange={setCategory}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Categoria</SelectLabel>
                                {categories.map((inc) => (
                                    <SelectItem
                                        key={inc.id}
                                        value={String(inc.id)}
                                    >
                                        {inc.name}
                                    </SelectItem>
                                ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Nombre */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                        className="mb-4"
                        type="text"
                        name="name_expense"
                        value={expenses?.name ?? ""}
                        onChange={(e) =>
                            setExpenses(prev => ({
                                ...prev!,
                                name: e.target.value
                            }))
                        }
                    />
                </div>

                {/* descripcion */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">descripcion</label>
                    <Input
                        className="mb-4"
                        type="text"
                        name="description"
                        value={expenses?.description ?? ""}
                        onChange={(e) =>
                            setExpenses(prev => ({
                                ...prev!,
                                description: e.target.value
                            }))
                        }
                    />
                </div>

                {/* Fecha gasto */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fecha a pagar</label>
                    <Input
                        className="mb-4"
                        type="date"
                        name="date"
                        value={expenses?.expense_date ?? new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                            setExpenses(prev => ({
                                ...prev!,
                                expense_date: e.target.value
                            }))
                        }
                    />
                </div>

                {/* Valor */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Valor</label>
                    <Input
                        className="mb-4"
                        type="text"
                        inputMode="numeric"
                        name="amount"
                        value={
                            expenses?.amount !== undefined &&
                            expenses?.amount !== null
                                ? expenses.amount.toLocaleString("en-US")
                                : ""
                        }
                        onChange={(e) => {
                            // Elimina las comas antes de convertir el valor a número
                            const rawValue = e.target.value.replace(/,/g, "");

                            // Solo permite números o un campo vacío
                            if (rawValue === "" || /^\d+$/.test(rawValue)) {
                                setExpenses((prev) => ({
                                    ...prev!,
                                    amount: rawValue === "" ? 0 : Number(rawValue),
                                }));
                            }
                        }}
                    />
                </div>
                
                {/* Error */}
                {error && (
                    <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}
        
                <Button type="submit" >
                    {periodExpenseToEdit ? "Actualizar gasto" : "Crear gasto"}
                </Button>
            </form>
        </div>
    )
}

//Componente para la vista del administrador
// export const FormPeriodExpense = ({
//     createPeriodExpense,
//     periodExpenseToEdit,
//     UpdatePeriodExpense,
// }: Props) => {
//     const [error, setError] = useState<string | null>(null);

//     // Datos disponibles
//     const [expenses, setExpenses] = useState<ExpensesForm[]>([]);
//     const [periodsMonthly, setPeriodsMonthly] = useState<PeriodRow[]>([]);

//     // Selecciones
//     const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(
//         null
//     );

//     const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(
//         null
//     );

//     // Datos del formulario
//     const [formData, setFormData] = useState({
//         amount: 0,
//         expense_date: new Date().toISOString().split("T")[0],
//     });

//     const [loading, setLoading] = useState(false);

//     /*
//      * Obtener períodos mensuales
//      */
//     async function handleGetPeriodsMonthly() {
//         try {
//             const res = await fetch("/api/periods?month=true");

//             const data = await res.json();

//             if (!res.ok) {
//                 setError(data.error);
//                 return;
//             }

//             setPeriodsMonthly(data.periodBymonth ?? []);
//         } catch (err) {
//             console.error(err);
//             setError("No se pudieron cargar los períodos.");
//         }
//     }

//     /*
//      * Obtener gastos configurados
//      */
//     async function handleLoadExpenses() {
//         try {
//             const res = await fetch("/api/expenses");

//             const data = await res.json();

//             if (!res.ok) {
//                 setError(data.error);
//                 return;
//             }

//             setExpenses(data.expenses ?? []);
//         } catch (err) {
//             console.error(err);
//             setError("No se pudieron cargar los gastos.");
//         }
//     }

//     /*
//      * Cuando seleccionamos un gasto
//      */
//     function handleExpenseChange(value: string) {
//         const expenseId = Number(value);

//         setSelectedExpenseId(expenseId);

//         const selectedExpense = expenses.find(
//             (expense) => expense.id === expenseId
//         );

//         if (!selectedExpense) return;

//         setFormData({
//             amount: Number(selectedExpense.amount),
//             expense_date:
//                 selectedExpense.expense_date ??
//                 new Date().toISOString().split("T")[0],
//         });
//     }

//     /*
//      * Cuando seleccionamos un período
//      */
//     function handlePeriodChange(value: string) {
//         setSelectedPeriodId(Number(value));
//     }

//     /*
//      * Crear gasto del período
//      */
//     async function handleSubmit(
//         e: React.FormEvent<HTMLFormElement>
//     ) {
//         e.preventDefault();

//         setError(null);

//         if (!selectedPeriodId) {
//             setError("Debes seleccionar un período.");
//             return;
//         }

//         if (!selectedExpenseId) {
//             setError("Debes seleccionar un gasto.");
//             return;
//         }

//         if (!formData.amount || formData.amount <= 0) {
//             setError("El valor del gasto debe ser mayor a cero.");
//             return;
//         }

//         const body = {
//             period_id: selectedPeriodId,
//             expense_id: selectedExpenseId,
//             expense_date: formData.expense_date,
//             amount: formData.amount,
//             expense_state_id: 1,
//         };

//         try {
//             if (periodExpenseToEdit) {
//                 await UpdatePeriodExpense(body);
//             } else {
//                 await createPeriodExpense(body);
//             }

//             // Limpiar formulario
//             setSelectedExpenseId(null);
//             setSelectedPeriodId(null);

//             setFormData({
//                 amount: 0,
//                 expense_date: new Date()
//                     .toISOString()
//                     .split("T")[0],
//             });
//         } catch (err) {
//             console.error(err);
//             setError("No se pudo guardar el gasto.");
//         }
//     }

//     /*
//      * Cargar información inicial
//      */
//     useEffect(() => {
//         async function loadData() {
//             setLoading(true);

//             try {
//                 await Promise.all([
//                     handleGetPeriodsMonthly(),
//                     handleLoadExpenses(),
//                 ]);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadData();
//     }, []);

//     return (
//         <div className="mx-auto w-full max-w-md">
//             <form
//                 onSubmit={handleSubmit}
//                 className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
//             >
//                 {/* Título */}
//                 <div>
//                     <h2 className="text-xl font-semibold">
//                         Registrar gasto del período
//                     </h2>

//                     <p className="text-sm text-muted-foreground">
//                         Selecciona el período y el gasto que deseas registrar.
//                     </p>
//                 </div>

//                 {/* Período */}
//                 <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                         Período
//                     </label>

//                     <Select
//                         value={
//                             selectedPeriodId
//                                 ? String(selectedPeriodId)
//                                 : ""
//                         }
//                         onValueChange={handlePeriodChange}
//                     >
//                         <SelectTrigger>
//                             <SelectValue placeholder="Selecciona un período" />
//                         </SelectTrigger>

//                         <SelectContent>
//                             {periodsMonthly.map((period) => (
//                                 <SelectItem
//                                     key={period.id}
//                                     value={String(period.id)}
//                                 >
//                                     {period.name}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Gasto */}
//                 <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                         Gasto
//                     </label>

//                     <Select
//                         value={
//                             selectedExpenseId
//                                 ? String(selectedExpenseId)
//                                 : ""
//                         }
//                         onValueChange={handleExpenseChange}
//                     >
//                         <SelectTrigger>
//                             <SelectValue placeholder="Selecciona un gasto" />
//                         </SelectTrigger>

//                         <SelectContent>
//                             {expenses.map((expense) => (
//                                 <SelectItem
//                                     key={expense.id}
//                                     value={String(expense.id)}
//                                 >
//                                     {expense.name}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 {/* Fecha */}
//                 <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                         Fecha a pagar
//                     </label>

//                     <Input
//                         type="date"
//                         value={formData.expense_date}
//                         onChange={(e) =>
//                             setFormData((prev) => ({
//                                 ...prev,
//                                 expense_date: e.target.value,
//                             }))
//                         }
//                     />
//                 </div>

//                 {/* Valor */}
//                 <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                         Valor
//                     </label>

//                     <Input
//                         type="text"
//                         inputMode="numeric"
//                         value={
//                             formData.amount
//                                 ? formData.amount.toLocaleString("es-CO")
//                                 : ""
//                         }
//                         onChange={(e) => {
//                             const rawValue =
//                                 e.target.value.replace(/\D/g, "");

//                             setFormData((prev) => ({
//                                 ...prev,
//                                 amount:
//                                     rawValue === ""
//                                         ? 0
//                                         : Number(rawValue),
//                             }));
//                         }}
//                     />
//                 </div>

//                 {/* Error */}
//                 {error && (
//                     <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
//                         {error}
//                     </p>
//                 )}

//                 {/* Botón */}
//                 <Button
//                     type="submit"
//                     className="w-full"
//                     disabled={loading}
//                 >
//                     {periodExpenseToEdit
//                         ? "Actualizar gasto"
//                         : "Registrar gasto"}
//                 </Button>
//             </form>
//         </div>
//     );
// };