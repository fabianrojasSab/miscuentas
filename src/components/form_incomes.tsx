import { useEffect, useState } from "react";
import { Button } from "./buttons"
import { Input } from "./ui/input"

type IncomesForm = {
    amount: number;
    income_date: string;
    description: string;
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

type Props = {
    createIncome: (income: IncomesForm) => void;
    incomeToEdit: IncomeRow | null;
    UpdateIncome: (income: IncomesForm) => void;
};

export const FormIncome = ({ createIncome, incomeToEdit, UpdateIncome }: Props) =>{
    const [error, setError] = useState<string | null>(null);
    const [income, setIncome] = useState<IncomesForm | null>(null);

    //Funcion para crear o actualizar el ingreso
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;

        const body : IncomesForm = {
            amount: form.amount.value,
            income_date: form.date.value,
            description: form.description.value,
        };

        if (incomeToEdit) {
            UpdateIncome(body);
        } else {
            createIncome(body);
        }
        
        form.reset();
    }

    useEffect(() => {
        if (incomeToEdit) {
            setIncome({
            amount: incomeToEdit.amount,
            income_date: incomeToEdit.income_date,
            description: incomeToEdit.description,
            });
        }
    }, [incomeToEdit]);

    return(
        <div className="w-full max-w-md mx-auto bg-card">
            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-lg border p-6 shadow-sm"
            >
                <div>
                    <h2 className="text-xl font-semibold">
                        {incomeToEdit ? "Actualizar ingreso" : "Registrar ingreso"}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        {incomeToEdit
                            ? "Modifica la información del ingreso seleccionado."
                            : "Ingresa la información de tu nuevo ingreso."}
                    </p>
                </div>

                {/* Valor */}
                <div className="space-y-2">
                    <label
                        htmlFor="amount"
                        className="text-sm font-medium"
                    >
                        Valor
                    </label>

                    <Input
                        id="amount"
                        type="number"
                        name="amount"
                        min="0"
                        step="0.01"
                        placeholder="Ej: 1500000"
                        value={income?.amount ?? ""}
                        onChange={(e) =>
                            setIncome((prev) => ({
                                ...prev!,
                                amount: Number(e.target.value),
                            }))
                        }
                        required
                    />
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                    <label
                        htmlFor="income_date"
                        className="text-sm font-medium"
                    >
                        Fecha de ingreso
                    </label>

                    <Input
                        id="income_date"
                        type="date"
                        name="date"
                        value={income?.income_date ?? ""}
                        onChange={(e) =>
                            setIncome((prev) => ({
                                ...prev!,
                                income_date: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium"
                    >
                        Descripción
                    </label>

                    <Input
                        id="description"
                        type="text"
                        name="description"
                        placeholder="Ej: Salario mensual"
                        value={income?.description ?? ""}
                        onChange={(e) =>
                            setIncome((prev) => ({
                                ...prev!,
                                description: e.target.value,
                            }))
                        }
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Botón */}
                <Button type="submit" className="w-full">
                    {incomeToEdit ? "Actualizar ingreso" : "Crear ingreso"}
                </Button>
            </form>
        </div>
    )
}