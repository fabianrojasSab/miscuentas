import { useState } from "react";
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

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>Valor</label>
                <Input
                    className="mb-4"
                    type="number"
                    name="amount"
                    value={incomeToEdit?.amount ?? income?.amount}
                    onChange={(e) =>
                        setIncome(prev => ({
                            ...prev!,
                            amount: Number(e.target.value)
                        }))
                    }
                />
                <label>fecha de ingreso</label>
                <Input
                    className="mb-4"
                    type="text"
                    name="date"
                    value={incomeToEdit?.income_date ?? income?.income_date}
                    onChange={(e) =>
                        setIncome(prev => ({
                            ...prev!,
                            income_date: e.target.value
                        }))
                    }
                />
                <label>Descripcion</label>
                <Input
                    className="mb-4"
                    type="text"
                    name="description"
                    value={incomeToEdit?.description ?? income?.description}
                    onChange={(e) =>
                        setIncome(prev => ({
                            ...prev!,
                            description: e.target.value
                        }))
                    }
                />
                
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}
        
                <Button type="submit">
                    {incomeToEdit ? "Actualizar ingreso" : "Crear ingreso"}
                </Button>
                
            </form>
        </div>
    )
}