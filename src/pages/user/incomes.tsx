import { Income } from "@/components/form_incomes";
import { Header } from "@/components/header";
import { TableIncomesByUser } from "@/components/table_incomes";
import { useState } from "react";

type BankAccountForm = {
    account: number;
    type: string;
    bank: string;
};

type IncomeForm = {
    amount: number;
    date: string;
    description: string;
}

type OnboardingData = {
    bankAccount: BankAccountForm | null;
    income: IncomeForm | null;
    expenses: {
        name: string;
        amount: number;
        category_id: number;
        date: string;
    }[];
};

export default function Incomes(){
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(income: OnboardingData["income"]) {

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            Income: income
        };

        try {
            const res = await fetch("/api/incomes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

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
            Registro de ingreso
            <br />
            <TableIncomesByUser/>
            <br />
            <Income onChange={handleSubmit}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
            )}
        </div>
    )
}