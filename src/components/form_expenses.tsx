import { useEffect, useState } from "react";
import { Button } from "@/components/buttons"
import { Input } from "@/components/ui/input"
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

type CategoryRow = {
    id: number,
    name: string,
    category_type: number,
    description: string,
    created_at: string,
    updated_at: string,
};

type Props = {
    createExpense: (expense: ExpensesForm) => void;
    expenseToEdit: ExpensesRow | null;
    UpdateExpense: (expense: ExpensesForm) => void;
};

export const FormExpenses = ({ createExpense, expenseToEdit, UpdateExpense }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesForm | null>(null);
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

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

        if (expenseToEdit) {
            UpdateExpense(body);
        } else {
            createExpense(body);
        }

        setExpenses(null);
    }

    useEffect(() => {
        handleLoadCategories()
        if (expenseToEdit) {
            setExpenses({
                name: expenseToEdit.name,
                amount: expenseToEdit.amount,
                expense_date: expenseToEdit.expense_date,
                description: expenseToEdit.description ?? "",
                expense_category_id: expenseToEdit.expense_category_id,
            });
        }
    }, [expenseToEdit]);

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
                    {expenseToEdit ? "Actualizar gasto" : "Crear gasto"}
                </Button>
            </form>
        </div>
    )
}

//Componente de formulario con las categorias fijas
export const FormExpensesFixed = ({ createExpense, expenseToEdit, UpdateExpense }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesForm | null>(null);
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    async function handleLoadCategories(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/categories?type=1", {
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

        if (expenseToEdit) {
            UpdateExpense(body);
        } else {
            createExpense(body);
        }

        setExpenses(null);
    }

    useEffect(() => {
        handleLoadCategories()
        if (expenseToEdit) {
            setExpenses({
                name: expenseToEdit.name,
                amount: expenseToEdit.amount,
                expense_date: expenseToEdit.expense_date,
                description: expenseToEdit.description ?? "",
                expense_category_id: expenseToEdit.expense_category_id,
            });
        }
    }, [expenseToEdit]);

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
                    <label className="text-sm font-medium">Fecha gasto</label>
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
                        placeholder="Ej: 1500,000"
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
                    {expenseToEdit ? "Actualizar gasto" : "Crear gasto"}
                </Button>
            </form>
        </div>
    )
}