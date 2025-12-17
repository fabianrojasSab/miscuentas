import { Button } from "@/components/buttons";
import { BankAccounts } from "@/components/form_bank_accounts";
import { Income } from "@/components/form_incomes";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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

export default function OnBoarding(){
    const [data, setData] = useState<OnboardingData>({
        bankAccount: null,
        income: null,
        expenses: [],
    });
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    function updateBankAccount(account: OnboardingData["bankAccount"]) {
        setData((prev) => ({ ...prev, bankAccount: account }));
    }

    function updateIncome(income: OnboardingData["income"]) {
        setData((prev) => ({ ...prev, income: income }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            BankAccount: data.bankAccount,
            Income: data.income
        };

        try {
            const res = await fetch("/api/onBoarding", {
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

            router.push("/user/dashboard");
        } catch (err) {
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/me");
            const data = await res.json();
            setUser(data.user);
        })();
    }, []);

    return(
        <div>
            <Header/>

            {data.bankAccount === null ? (
                <BankAccounts onChange={updateBankAccount} />
            ) : data.income === null ? (
                <Income onChange={updateIncome} />
            ) : (
                <div>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-xl font-semibold">
                            Cuenta bancaria registrada ✅
                        </h2>
                        {error && (
                            <p className="text-red-600 text-center">{error}</p>
                        )}
                        <Button type="submit">Continuar</Button>
                    </form>
                </div>
            )}

        </div>
    )
}