import { FormBankAccount, FormBankAccounts } from "@/components/form_bank_accounts";
import { Header } from "@/components/header";

export default function BankAccounts(){
        <div>
            <Header/>
            Administracion de cuentas de banco
            <br />
            <FormBankAccount createIncome={handleCreateIncome} incomeToEdit={incomeToEdit} UpdateIncome={handleUpdateIncome}/>
            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
            {success && (
                <p className="text-green-600 text-center">Ingreso con ID {success} registrado</p>
            )}
            <br />
            <TableAllBankAccounts onEdit={setIncomeToEdit} reload={reloadTable}/>
        </div>
    )
}