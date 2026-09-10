import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

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

type Props = {
    onEdit: (bank: ExpensePeriodRow) => void;
    reload: boolean;
};

export const TableAllPeriodExpenses = ({ onEdit, reload }: Props) =>{
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState<boolean | null>();
    const [expensePeriod, setExpensePeriod] = useState<ExpensePeriodRow[]>([]);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [userSelected, setUserSelected] = useState("");

    //Funcion para cargar los gastos del periodo
    async function handleLoadPeriodExpenses(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/api/periodExpenses?periodId=${userSelected.id}`, {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setExpensePeriod(data.periodEpenses ?? []);
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

            await handleLoadPeriodExpenses();
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

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            
            try {
                await Promise.all([
                    handleLoadUsers(),
                    handleLoadPeriodExpenses(),
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Usuarios</label>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <Select
                                name="expense_category_id"
                                value={userSelected}
                                onValueChange={setUserSelected}
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
                            <th className="px-4 py-3 text-left text-sm font-semibold">Mes</th>
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
                                <td className="border p-2">{inc.month}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{inc.name}</td>
                                <td className="border p-2">{inc.category_name}</td>
                                <td className="border p-2">{inc.expense_date}</td>
                                <td className="border p-2">{inc.amount}</td>
                                <td className="border p-2">{inc.state}</td>
                                <td className="border p-2">{inc.category_type}</td>
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