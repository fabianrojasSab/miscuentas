import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseCategoryType } from "@/emuns/ExpenseCategoryType";

export type ExpensePeriodRow = {
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
}

type UserRow = {
    id: number,
    name: string,
    email: string,
    email_verified_at: string,
    two_factor_secret: string,
    two_factor_recovery_codes: string,
    two_factor_confirmed_at: string,
    remember_token: string,
    current_team_id: string,
    profile_photo_path: string,
    created_at: string,
    updated_at: string,
    sw_admin: number,
    onboarding_completed_at: string
}

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
    onEdit: (expesePeriod: ExpensePeriodRow) => void;
    reload: boolean;
};

export const TableAllPeriodExpenses = ({ onEdit, reload }: Props) =>{
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState<boolean | null>();
    const [expensePeriod, setExpensePeriod] = useState<ExpensePeriodRow[]>([]);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [userSelected, setUserSelected] = useState("");
    const [month, setMonth] = useState("");
    const [periodYear, setPeriodYear] = useState<PeriodRow[]>([]);
    const currentYear = new Date().getFullYear();

    //Controlador al momento de seleccionar  un usuario se cargar los gastos del periodo
    async function handleLoadPeriodExpenses(userId: string){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/api/periodExpenses?periodId=${month}&userId=${userId}`, {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setExpensePeriod(data.periodExpenses ?? []);
        } catch (err) {
            setError("!Informacion de gastos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    //Funcion para eliminar un gasto del periodo
    async function handleDeletePeriodExpense(id: number){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/periodExpenses", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error();
            }

            await handleLoadPeriodExpenses(userSelected);
        } catch (err) {
            setError("!Error al eliminar el gasto");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    //Funcion para cargar los usuarios
    async function handleLoadUsers(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/users", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setUsers(data.users ?? []);
        } catch (err) {
            setError("!Informacion de usuarios vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    async function handleUpdatePeriodExpense(periodExpense: ExpensePeriodRow){
        onEdit(periodExpense)
    }

    //Funcion para cargar al formulario el listado de meses del año actual
    async function handleLoadMonthsPeriod () {
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

    useEffect(() => {
        handleLoadPeriodExpenses(userSelected);
    }, [reload]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            
            try {
                await Promise.all([
                    handleLoadUsers(),
                    handleLoadMonthsPeriod(),
                ]);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : expensePeriod.length === 0 ? (
                <div className="w-full max-w-md mx-auto bg-card rounded-lg">
                    {/* Select de periodos */}
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
                                onValueChange={(value) => {
                                    setMonth(value)
                                    setUserSelected("");
                                    }
                                }
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
                    {/* Select de usuario */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Usuarios</label>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <Select
                                name="expense_category_id"
                                value={userSelected}
                                // onValueChange={setUserSelected}
                                onValueChange={(value) => {
                                    setUserSelected(value)
                                    handleLoadPeriodExpenses(value);
                                    }
                                }
                                disabled={month == "" ? true : false}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un usuario" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Usuario</SelectLabel>
                                    {users.map((inc) => (
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
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg border bg-card shadow-sm">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-muted/50">
                            <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Categoria</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Valor</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Tipo de categoria</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expensePeriod.map((inc) => (
                            <tr key={inc.id}>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{inc.name}</td>
                                <td className="border p-2">{inc.category_name}</td>
                                <td className="border p-2">{inc.expense_date}</td>
                                <td className="border p-2">{inc.amount}</td>
                                <td className="border p-2">{inc.state}</td>
                                <td className="border p-2">{getCategoryTypeLabel(inc.category_type)}</td>
                                <td className="border p-2">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdatePeriodExpense(inc)}>Editar</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeletePeriodExpense(inc.id)}>Eliminar</button>
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