import { Button } from "@/components/buttons";
import { BankAccounts } from "@/components/form_bank_accounts";
import { FormIncome } from "@/components/form_incomes";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type BankAccountForm = {
    account_number: string,
    account_type: number,
    bank_name: string,
};

type IncomeForm = {
    amount: number;
    income_date: string;
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

type IncomeRow = {
    id: number,
    user_id: number,
    amount: number,
    income_date: string,
    description: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    user_name?: string,
};

export default function OnBoarding(){
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [bankAccount, setBankAccount] = useState<BankAccountForm | null>(null);
    const [income, setIncome] = useState<IncomeForm | null>(null);


    function updateBankAccount(account: OnboardingData["bankAccount"]) {
        setBankAccount(account);
    }

    function updateIncome(income: IncomeForm) {
        setIncome(income);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            BankAccount: bankAccount,
            Income: income
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

    async function handleCreatebankAccount(bankAccount: OnboardingData["bankAccount"]) {
        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            bankAccount: bankAccount
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


            if (!res.ok) {
                setError(data.error);
                return;
            }

            setBankAccount(body.bankAccount);

        } catch (err) {
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    async function handleCreateIncome(income: OnboardingData["income"]) {

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            income: income
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

            setIncome(body.income);

        } catch (err) {
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
            setTimeout(() => setError(null), 5000);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/onBoarding", {
                    method: "GET",
                });
                const onboardingResult = await res.json();


                if (!res.ok) {
                    setError(onboardingResult.error);
                    return;
                }
                const { incomes, bankAccounts } = onboardingResult.onboarding;

                if (incomes.length > 0) {
                    // Hay ingresos
                    setIncome(onboardingResult.onboarding.incomes);
                }
                
                if (bankAccounts.length > 0) {
                    // Hay cuentas bancarias
                    setBankAccount(onboardingResult.onboarding.bankAccounts)
                }
                

            } catch (err) {
                setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
                setTimeout(() => setError(null), 5000);
            }
        })();
    }, []);

    return(
        <div>
            <Header/>

            {bankAccount === null ? (
                <BankAccounts createBankAccount={handleCreatebankAccount} bankAccontToEdit={bankAccount} UpdateBankAccount={updateBankAccount} />
            ) : income === null ? (
                <FormIncome createIncome={handleCreateIncome} incomeToEdit={income} UpdateIncome={updateIncome}/>
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