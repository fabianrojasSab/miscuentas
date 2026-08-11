import { Button } from "@/components/buttons";
import { Header } from "@/components/header";

export default function Dashboard () {
    return (
        <div>
            <Header/>
            dashboard de administrador
            <Button href="/admin/incomes">Administrar Ingresos</Button>
            <Button href="/admin/expenses">Administrar gastos</Button>
            <Button href="/admin/categories">Administrar categorias</Button>
            <Button href="/admin/periods">Administrar periodos</Button>
        </div>
        
    )
}