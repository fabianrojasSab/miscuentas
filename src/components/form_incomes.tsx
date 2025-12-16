import { useState } from "react";
import { Button } from "./buttons"
import { Input } from "./ui/input"

type IncomesForm = {
    amount: number;
    date: string;
    description: string;
};

type Props = {
    onChange: (income: IncomesForm) => void;
};

export const Income = ({ onChange }: Props) =>{
    const [error, setError] = useState<string | null>(null);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;

        const body : IncomesForm = {
            amount: form.amount.value,
            date: form.date.value,
            description: form.description.value,
        };

        onChange(body)
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <Input type="number" name="amount" placeholder="Ingreso" className="mb-4"/>
                <Input type="text" name="date" placeholder="Fecha de pago (YYYY-MM-DD)" className="mb-4"/>
                <Input type="text" name="description" placeholder="Descripcion" className="mb-4"/>
                
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}
        
                <Button type="submit">Crear ingreso</Button>
                
            </form>
        </div>
    )
}