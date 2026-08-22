import { Button } from "@/components/buttons";
import { BankAccounts } from "@/components/form_bank_accounts";
import { FormIncome } from "@/components/form_incomes";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FormExpenses } from "@/components/form_expenses";

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

type ExpensesForm = {
    expense_category_id: number;
    name: string;
    description: string;
    expense_date: string;
    amount: number;
};

type OnboardingData = {
    bankAccount: BankAccountForm | null;
    income: IncomeForm | null;
    expenses: ExpensesForm | null;
};

export default function OnBoarding(){
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [bankAccount, setBankAccount] = useState<BankAccountForm | null>(null);
    const [income, setIncome] = useState<IncomeForm | null>(null);
    const [expenses, setExpenses] = useState<ExpensesForm | null>(null);


    function updateBankAccount(account: OnboardingData["bankAccount"]) {
        setBankAccount(account);
    }

    function updateIncome(income: IncomeForm) {
        setIncome(income);
    }

    function updateExpenses(expenses: ExpensesForm) {
        setExpenses(expenses);
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

    async function handleCreateExpenses(expense: OnboardingData["expenses"]) {

        const res = await fetch("/api/me");
        const dataUser = await res.json();

        const body = {
            id: dataUser.user.id,
            expense: expense
        };

        try {
            const res = await fetch("/api/expenses", {
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

            setExpenses(body.expense);

        } catch (err) {
            setError("Error al crear los gastos. Por favor, inténtalo de nuevo.");
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
                const { incomes, bankAccounts, expenses } = onboardingResult.onboarding;

                if (incomes.length > 0) {
                    // Hay ingresos
                    setIncome(onboardingResult.onboarding.incomes);
                }
                
                if (bankAccounts.length > 0) {
                    // Hay cuentas bancarias
                    setBankAccount(onboardingResult.onboarding.bankAccounts)
                }

                if (expenses.length > 0) {
                    //hay gastos fijos creados
                    setExpenses(expenses.onBoarding.expenses);
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
            ) : expenses === null ? (
                <FormExpenses createExpense={handleCreateExpenses} expenseToEdit={expenses} UpdateExpense={updateExpenses}/>
            ) : (
                <div>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-xl font-semibold">
                            !Registro inicial exitoso¡ ✅
                        </h2>
                        {error && (
                            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </p>
                        )}
                        <Button type="submit">Continuar</Button>
                    </form>
                </div>
            )}
        </div>
    )
}