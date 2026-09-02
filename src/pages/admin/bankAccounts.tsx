import { FormBankAccount } from "@/components/form_bank_accounts";
import { Header } from "@/components/header";
import { TableAllBankAccounts } from "@/components/tabla_bankAccounts";
import { useState } from "react";

type BankAccountForm = {
    account_number: string,
    account_type: number,
    bank_name: string,
};

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

export default function BankAccounts(){
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [reloadTable, setReloadTable] = useState(false);
    const [bankToEdit, setBankToEdit] = useState<BankRow | null>(null);

    //Funcion para crear lun banco
    async function handleCreateBank(bank: BankAccountForm) {
        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            bankAccount: bank
        };

        try {
            const res = await fetch("/api/bankAccount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            setReloadTable(prev => !prev);

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setSuccess(data.id);
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    //Funcion para actualizar el banco
    async function handleUpdateBank(bank: BankAccountForm) {
        const body = {
            id: bankToEdit?.id,
            bankAccount: bank
        };

        try {
            const res = await fetch("/api/bankAccount", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            setReloadTable(prev => !prev);

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setSuccess(data.id);
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    return(
        <div>
            <Header/>
            Administracion de cuentas de banco
            <br />
            <FormBankAccount createBankAccount={handleCreateBank} bankAccontToEdit={bankToEdit} UpdateBankAccount={handleUpdateBank}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
            )}
            <br />
            <TableAllBankAccounts onEdit={setBankToEdit} reload={reloadTable}/>
        </div>
    )
}