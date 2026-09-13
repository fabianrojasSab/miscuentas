import { ExpenseCategoryType } from "@/emuns/ExpenseCategoryType";
import { useEffect, useState } from "react";
import { Button } from "@/components/buttons";
import { HandCoins, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatMoneyCol } from "@/lib/formatMoney";

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

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
};

export type BdExpenseRow = {
    id: number,
    userId: number
    category_name: string,
    category_type: number,
    name: string,
    expense_date: string,
    amount: number,
}

type Props = {
    onEdit: (expense: ExpensesRow) => void;
    reload: boolean;
};

//Componente especifico para traer los gastos del periodo del usuario (no se esta usando en ningun componente 04/09/2026)
export const TableExpensesByUser = ({ reload }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<BdExpenseRow[]>([]);
    const [loading, setLoading] = useState(true);

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

    //Funcion que carga los gastos
    async function loadExpenses(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/expenses?type=dashboard", {
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

    useEffect(() => {
        loadExpenses();
    }, [reload]);

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : expenses.length === 0 ? (
                <p>No hay gastos registrados.</p>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg border bg-card shadow-sm">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-muted/50">
                            <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Categoria</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((inc) => (
                            <tr key={inc.id}>
                                <td className="border p-2">{inc.name}</td>
                                <td className="border p-2">{inc.category_name}</td>
                                <td className="border p-2">{getCategoryTypeLabel(inc.category_type)}</td>
                                <td className="border p-2">{inc.expense_date}</td>
                                <td className="border p-2">{formatMoneyCol(inc.amount)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

//componente que muestra todos los gastos del usuario sin filtros (no se esta usando en ningun componente 04/09/2026)
export const TableAllExpensesByUser = ({ reload }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadExpenses(){
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

    useEffect(() => {
        loadExpenses();
    }, [reload]);

    return(
        <div className=" max-w-md mx-auto">
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : expenses.length === 0 ? (
                <p>No hay gastos registrados.</p>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg border bg-card shadow-sm">
                    <table className="w-full min-w-[500px]">
                        <thead className="bg-muted/50">
                            <tr>
                            <th className="px-2 py-3 text-left text-sm font-semibold">Fecha</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Monto</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((inc) => (
                            <tr key={inc.id}>
                                <td className="p-2">{inc.expense_date}</td>
                                <td className="px-4 py-3 text-right text-sm font-medium">{formatMoneyCol(inc.amount)}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{inc.description ?? "-"}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

//Componente que traer todos los gastos en general, usado para la gestion de gastos por el admin
export const TableAllExpenses = ({ onEdit, reload }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
    const [loading, setLoading] = useState(true);

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

    //Funcion para eliminar un gasto
    async function handleDeleteExpense(id: number){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error();
            }

            await handleLoadExpenses();
        } catch (err) {
            setError("!Error al eliminar el gasto");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    //Controlador para actualizar un gasto (Se envia a la funcion del padre)
    async function handleUpdateExpense(expense: ExpensesRow){
        onEdit(expense)
    }

    useEffect(() => {
        handleLoadExpenses();
    }, [reload]);

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : expenses.length === 0 ? (
                <p>No hay gastos registrados.</p>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg border bg-card shadow-sm">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-muted/50">
                            <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Monto</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Creado en</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Actualizado en</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Eliminado en</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Usuario</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((inc) => (
                            <tr key={inc.id}>
                                <td className="border p-2">{inc.expense_date}</td>
                                <td className="px-4 py-3 text-right text-sm font-medium">{formatMoneyCol(inc.amount)}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{inc.description ?? "-"}</td>
                                <td className="border p-2">{inc.created_at}</td>
                                <td className="border p-2">{inc.updated_at}</td>
                                <td className="border p-2">{inc.deleted_at}</td>
                                <td className="border p-2">{inc.user_name}</td>
                                <td className="border p-2">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdateExpense(inc)}>Editar</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteExpense(inc.id)}>Eliminar</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

//componente que muestra los gastos fijos configurados por el usuario
export const TableExpensesFixedByUser = ({ reload }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadExpenses(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/expenses?type=fixed", {
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

    //Funcion para eliminar un gasto
    async function handleDeleteExpense(id: number){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error();
            }

            await loadExpenses();
        } catch (err) {
            setError("!Error al eliminar el gasto");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, [reload]);

    return(
        <div className=" max-w-md mx-auto">
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : expenses.length === 0 ? (
                <p>No hay gastos registrados.</p>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="divide-y">
                        {expenses.map((inc) => (
                            <div
                                key={inc.id}
                                className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-6"
                            >
                                {/* Icono */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                    <span className="text-lg">
                                        <HandCoins />
                                    </span>
                                </div>

                                {/* Información del gasto */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">
                                        {inc.name ?? "-"}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {inc.description ?? "-"}
                                    </p>
                                </div>

                                {/* Monto */}
                                <div className="text-right">
                                    <p className="font-semibold">
                                        {formatMoneyCol(inc.amount)}
                                    </p>
                                </div>

                                {/* Eliminar */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="transparent"
                                        size="icon"
                                        className="h-4 w-4 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        title="Eliminar gasto"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Estas seguro que deseas eliminar el gasto?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción es irreversible. Esto eliminará permanentemente su
                                            cuenta de nuestros servidores.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteExpense(inc.id)}>Continuar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}