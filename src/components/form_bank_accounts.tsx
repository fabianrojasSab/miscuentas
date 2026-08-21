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
        <div className="w-full max-w-md mx-auto bg-card">
            <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border p-6 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold">
                        Registra Cuenta de banco.
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Puedes ingresar los ultimos 4 digitos de tu cuenta para que lleves el control de lo que ingresa o sale de tu cuenta de banco
                    </p>
                </div>
                {/* Numero de cuenta */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Numero de cuenta
                    </label>
                    <Input type="number" name="account_number" placeholder="Numero de cuenta" className="mb-4"/>
                </div>

                {/* Tipo de cuenta */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Tipo de cuenta
                    </label>
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
                </div>

                {/* Nombre de banco */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Nombre de banco
                    </label>
                    <Input type="text" name="bank_name" placeholder="Nombre de banco" className="mb-4"/>
                </div>
                {/* Error */}
                {error && (
                    <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}
        
                {/* Botón */}
                <Button type="submit" className="w-full">Crear banco</Button>
            </form>
        </div>
    )
}