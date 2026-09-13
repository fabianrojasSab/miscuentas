import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/buttons"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseCategoryType } from "@/emuns/ExpenseCategoryType";

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
    period_id?:number,
    expense_state_id: number,
};

type ExpensePeriodRow = {
    id: number,
    month_id: number,
    month_name: string,
    name: string,
    description: string,
    category_id: number,
    category_name: string,
    category_type: number,
    expense_date: string,
    amount: number,
    state: string,
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

type Props = {
    createPeriodExpense: (expense: ExpensesForm) => void;
    periodExpenseToEdit: ExpensePeriodRow | null;
    UpdatePeriodExpense: (expense: ExpensesForm) => void;
};

//Componente para ingresar gastos variables desde el dashboard del usuario
export const FormPeriodExpenseVariableByUser = ({ createPeriodExpense, periodExpenseToEdit, UpdatePeriodExpense }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesForm | null>(null);
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    //funcion para obtener las categorias
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

    //funcion para creacion o actualizacion del gasto-
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
                expense_category_id: periodExpenseToEdit.category_id,
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
export const FormPeriodExpense = ({
    createPeriodExpense,
    periodExpenseToEdit,
    UpdatePeriodExpense,
}: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [month, setMonth] = useState("");
    const [periodYear, setPeriodYear] = useState<PeriodRow[]>([]);
    const [category, setCategory] = useState("");
    
    const currentYear = new Date().getFullYear();

    // Datos disponibles
    const [expense, setExpense] = useState<ExpensesForm | null>(null);
    const [categories, setCategories] = useState<CategoryRow[]>([]);

    const [loading, setLoading] = useState(false);

    // Crear gasto del período
    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError(null);

        const formPeriodExpense = e.currentTarget;

        // Convertir el mes seleccionado a una fecha
        // Ejemplo: month = "8" -> 2026-08-01
        const expenseDate = `${currentYear}-${String(month).padStart(2, "0")}-01`;

        if (!formPeriodExpense.amount || formPeriodExpense.amount <= 0) {
            setError("El valor del gasto debe ser mayor a cero.");
            return;
        }

        const body = {
            period_id: Number(month),
            expense_category_id: Number(category),
            name: formPeriodExpense.name_expense.value,
            description: formPeriodExpense.description.value,
            expense_date: expenseDate,
            amount: expense?.amount ?? 0,
            expense_state_id: Number(formPeriodExpense.expense_state_id.value),
        };

        try {
            if (periodExpenseToEdit) {
                await UpdatePeriodExpense(body);
            } else {
                await createPeriodExpense(body);
            }

            setCategory("");
            setExpense(null);
            setMonth("");

        } catch (err) {
            console.error(err);
            setError("No se pudo guardar el gasto.");
        }
    }

    //Funcion para cargar al formulario el listado de meses del año actual
    async function handleLoadMonthsPeriods() {
        setLoading(true);
        try {
            //consulta y trae todos los meses del año en curso
            const res = await fetch(`/api/periods?period_type=monthsByYear&year=${currentYear}`, {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setPeriodYear(data.monthsByYear ?? []);
        } catch (err) {
            setError("Error al consultar los meses del año en curso. Por favor, inténtalo de nuevo.");
        }finally {
            setTimeout(() => setError(null), 5000);
            setLoading(false);
        }
    }

    //funcion para cargar las categorias al formulario
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
        }finally {
            setTimeout(() => setError(null), 5000);
            setLoading(false);
        }
    }

    //Funcion auxiliar para obtener el tipo de categoria
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

    //Hook al recibir cambios en periodExpenseToEdit y poner la informacion en el formulario
    useEffect(() => {
        if (periodExpenseToEdit) {
            setExpense({
                name: periodExpenseToEdit.name,
                amount: periodExpenseToEdit.amount,
                expense_date: periodExpenseToEdit.expense_date,
                description: periodExpenseToEdit.description ?? "",
                expense_category_id: periodExpenseToEdit.category_id,
                period_id: periodExpenseToEdit.month_id,
                expense_state_id: periodExpenseToEdit.state === "Pendiente" ? 1 : 2,
            });
            setCategory(String(periodExpenseToEdit.category_id));
            setMonth(String(periodExpenseToEdit.month_id));
        }
    }, [periodExpenseToEdit]);

    //Cargar información inicial
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            
            try {
                await Promise.all([
                    handleLoadCategories(),
                    handleLoadMonthsPeriods(), //consulta los periodos
                ]);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
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
                            disabled={true}
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
                                        {inc.name} ({getCategoryTypeLabel(inc.category_type)})
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
                        value={expense?.name ?? ""}
                        disabled={true}
                        onChange={(e) =>
                            setExpense(prev => ({
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
                        value={expense?.description ?? ""}
                        disabled={true}
                        onChange={(e) =>
                            setExpense(prev => ({
                                ...prev!,
                                description: e.target.value
                            }))
                        }
                    />
                </div>

                {/* Fecha gasto */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Mes
                    </label>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <Select
                            name="expense_month"
                            value={month}
                            onValueChange={setMonth}
                            disabled={true}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un mes" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        {currentYear}
                                    </SelectLabel>

                                    {periodYear.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={String(item.id)}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
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
                                setExpense((prev) => ({
                                    ...prev!,
                                    amount: rawValue === "" ? 0 : Number(rawValue),
                                }));
                            }
                        }}
                    />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Estado</label>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <Select
                            name="expense_state_id"
                            value={String(expense?.expense_state_id)}
                            onValueChange={(e) =>
                            setExpense(prev => ({
                                    ...prev!,
                                    expense_state_id:  Number(e)
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Categoria</SelectLabel>
                                    <SelectItem value="2">
                                        Pagado
                                    </SelectItem>
                                    <SelectItem value="1">
                                        Pendiente
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </div>
                
                {/* Error */}
                {error && (
                    <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}
        
                <Button type="submit" disabled={loading}>
                    {periodExpenseToEdit ? "Actualizar gasto" : "Crear gasto"}
                </Button>
            </form>
        </div>
    );
};