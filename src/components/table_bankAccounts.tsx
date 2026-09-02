import { useEffect, useState } from "react"

type BankRow = {
    id: number,
    user_id: number,
    account_number: string,
    account_type: number,
    bank_name: string,
    account_balance: string,
    created_at: string,
    updated_at: string,
    user_name?: string,
}

type Props = {
    onEdit: (bank: BankRow) => void;
    reload: boolean;
};

export const TableAllBankAccounts = ({ onEdit, reload }: Props) =>{
    const [error, setError] = useState<string | null>();
    const [loading, setLoading] = useState<boolean | null>();
    const [banks, setBanks] = useState<BankRow[]>([]);

    //Funcion para cargar los bancos
    async function handleLoadBanks(){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/bankAccount", {
                method: "GET",
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setBanks(data.banks ?? []);
        } catch (err) {
            setError("!Informacion de gastos vacia¡");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        }finally {
            setLoading(false);
        }
    }

    //Funcion para eliminar un banco
    async function handleDeleteBank(id: number){
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/bankAccount", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error();
            }

            await handleLoadBanks();
        } catch (err) {
            setError("!Error al eliminar el gasto");
            console.log(err);
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateBank(expense: BankRow){
        onEdit(expense)
    }

    useEffect(() => {
        handleLoadBanks();
    }, [reload]);

    return(
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p>Cargando...</p>
            ) : banks.length === 0 ? (
                <p>No hay ingresos registrados.</p>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg border bg-card shadow-sm">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-muted/50">
                            <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Usuario</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">N° de Cuenta</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Nombre de banco</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Balance</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banks.map((inc) => (
                            <tr key={inc.id}>
                                <td className="border p-2">{inc.user_name}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{inc.account_number}</td>
                                <td className="border p-2">{inc.account_type}</td>
                                <td className="border p-2">{inc.bank_name}</td>
                                <td className="border p-2">{inc.account_balance}</td>
                                <td className="border p-2">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdateBank(inc)}>Editar</button>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteBank(inc.id)}>Eliminar</button>
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