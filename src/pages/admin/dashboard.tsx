import { Button } from "@/components/buttons";
import { Header } from "@/components/header";

export default function Dashboard () {
    return (
        <div>
            <Header/>

            <main className="container mx-auto space-y-8 px-4 py-8">
                {/* Acciones principales */}
                <section className="flex flex-wrap gap-3">
                    <Button href="/admin/incomes">Administrar Ingresos</Button>
                    <Button href="/admin/expenses">Administrar gastos</Button>
                    <Button href="/admin/categories">Administrar categorias</Button>
                    <Button href="/admin/periods">Administrar periodos</Button>
                    <Button href="/admin/bankAccounts">Administrar cuentas de banco</Button>
                    <Button href="/admin/expensesPeriods">Administrar gastos por periodo</Button>
                </section>
            </main>
        </div>
        
    )
}