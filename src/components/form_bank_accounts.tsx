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
    account_number: string,
    account_type: number,
    bank_name: string,
};

type BankAccountRow = {
    id: number,
    user_id: number,
    account_number: string,
    account_type: number,
    bank_name: string,
    account_balance: string,
};

type Props = {
    createBankAccount: (account: BankAccountForm) => void;
    bankAccontToEdit: BankAccountRow | null;
    UpdateBankAccount: (account: BankAccountForm) => void;
};

export const BankAccounts = ({createBankAccount, bankAccontToEdit, UpdateBankAccount }: Props) =>{
    const [error, setError] = useState<string | null>(null);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;

        const body : BankAccountForm = {
            account_number: form.account_number.value,
            account_type: form.account_type.value,
            bank_name: form.bank_name.value,
        };

        if(bankAccontToEdit) {
            UpdateBankAccount(body)
        }else{
            createBankAccount(body)
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <Input type="number" name="account_number" placeholder="Numero de cuenta" className="mb-4"/>
                <Select name="account_type">
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
                <Input type="text" name="bank_name" placeholder="Nombre de banco" className="mb-4"/>
                
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}
        
                <Button type="submit">Crear banco</Button>
                
            </form>
        </div>
    )
}