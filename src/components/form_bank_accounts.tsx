import { useState } from "react";
import { Button } from "./buttons";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type BankAccountForm = {
    account: number;
    type: string;
    bank: string;
};

type Props = {
    onChange: (account: BankAccountForm) => void;
};

export const BankAccounts = ({ onChange }: Props) =>{
    const [error, setError] = useState<string | null>(null);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;

        const body : BankAccountForm = {
            account: form.account.value,
            type: form.type.value,
            bank: form.bank.value,
        };

        onChange(body)
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <Input type="number" name="account" placeholder="Numero de cuenta" className="mb-4"/>
                <Select name="type">
                    <SelectTrigger>
                        <SelectValue placeholder="Tipo de cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Tipo</SelectLabel>
                        <SelectItem value="1">Ahorro</SelectItem>
                        <SelectItem value="2">Corriente</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input type="text" name="bank" placeholder="Nombre de banco" className="mb-4"/>
                
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}
        
                <Button type="submit">Crear banco</Button>
                
            </form>
        </div>
    )
}