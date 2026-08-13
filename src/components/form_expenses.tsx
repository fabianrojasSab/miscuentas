import { useEffect, useState } from "react";
import { Button } from "@/components/buttons"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    income_date: string;
    amount: number;
};

type ExpensesRow = {
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
            amount: form.amount.value,
            income_date: form.date.value,
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
                income_date: expenseToEdit.income_date,
                description: expenseToEdit.description ?? "",
                expense_category_id: expenseToEdit.expense_category_id,
            });
        }
    }, [expenseToEdit]);

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>Categoria</label>
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
                <label>Nombre</label>
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
                <label>descripcion</label>
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
                <label>Fecha gasto</label>
                <Input
                    className="mb-4"
                    type="date"
                    name="date"
                    value={expenses?.income_date ?? ""}
                    onChange={(e) =>
                        setExpenses(prev => ({
                            ...prev!,
                            income_date: e.target.value
                        }))
                    }
                />
                <label>Valor</label>
                <Input
                    className="mb-4"
                    type="number"
                    name="amount"
                    value={expenses?.amount ?? ""}
                    onChange={(e) =>
                        setExpenses(prev => ({
                            ...prev!,
                            amount: Number(e.target.value)
                        }))
                    }
                />
                
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}
        
                <Button type="submit">
                    {expenseToEdit ? "Actualizar gasto" : "Crear gasto"}
                </Button>
                
            </form>
        </div>
    )
}