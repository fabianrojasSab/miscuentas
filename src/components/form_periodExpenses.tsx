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
export const FormPeriodExpense = ({ createPeriodExpense, periodExpenseToEdit, UpdatePeriodExpense }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesForm[]>([]);
    const [expense, setExpense] = useState<ExpensesForm>();
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [period, setPeriod] = useState<PeriodRow |null>();
    const [periodsMonthly, setPeriodsMonthly] = useState<PeriodRow []>([]);

    //Funcion para obtener todos los periodos anuales
    async function handleGetPeriodsYearly() {
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`/api/periods?month=true`, {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setPeriodsMonthly(data.periodBymonth ?? []);
        } catch (err) {
            setError("!Informacion de periodos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }


    //Funcion para cargar los gastos
    async function handleLoadExpenses(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setExpenses(data.expenses ?? []);
        } catch (err) {
            setError("!Informacion de gastos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    async function handleLoadCategories(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/categories", {
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

        setExpenses([]);
        setCategory("");
    }

    useEffect(() => {
        handleLoadExpenses()
        handleLoadCategories()
        // if (periodExpenseToEdit) {
        //     setExpenses({
        //         name: periodExpenseToEdit.name,
        //         amount: periodExpenseToEdit.amount,
        //         expense_date: periodExpenseToEdit.expense_date,
        //         description: periodExpenseToEdit.description ?? "",
        //         expense_category_id: periodExpenseToEdit.expense_category_id,
        //     });
        // }
    }, [periodExpenseToEdit]);

    return(
        <div className="w-full max-w-md mx-auto bg-card rounded-lg">
            <form className="space-y-5 rounded-lg border p-6 shadow-sm" onSubmit={handleSubmit}>
                {/* Periodo */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Periodo</label>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <Select
                            name="year"
                            value={
                                period?.year != null
                                    ? String(period.year)
                                    : ""
                            }
                            onValueChange={(value) => {
                                const selectedPeriod = periodsMonthly.find(
                                    (item) => String(item.year) === value
                                );

                                if (!selectedPeriod) return;

                                setPeriod(prev => ({
                                    ...prev!,
                                    parent_id: selectedPeriod.id,
                                    year: selectedPeriod.year,
                                }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>

                            <SelectContent>
                                {periodsMonthly.map( period =>{
                                    return(
                                        <SelectItem value={String(period.year)} key={period.id}>
                                            {period.year}
                                        </SelectItem>
                                    )})
                                }
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* gastos */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Gatos</label>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <Select
                            name="expense_category_id"
                            value={expense?.name != null
                                    ? String(expense.name)
                                    : ""
                            }
                            onValueChange={(value) => {
                                const selectedPeriod = expenses.find(
                                    (item) => String(item.name) === value
                                );

                                if (!selectedPeriod) return;

                                // setExpense(prev => ({
                                //     ...prev!,
                                //     parent_id: selectedPeriod.id,
                                //     year: selectedPeriod.year,
                                // }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una Categoria" />
                            </SelectTrigger>

                            <SelectContent>
                                {expenses.map( expense =>{
                                    return(
                                        <SelectItem value={String(expense.name)} key={expense.expense_category_id}>
                                            {expense.name}
                                        </SelectItem>
                                    )})
                                }
                            </SelectContent>
                        </Select>
                    )}
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
                            expense?.amount !== undefined &&
                            expense?.amount !== null
                                ? expense.amount.toLocaleString("en-US")
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