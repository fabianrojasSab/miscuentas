import { Button } from "@/components/buttons";
import { Header } from "@/components/header";

export default function Dasboard () {
    return (
        <div>
            <Header/>
            dashboard de usuario
            <Button href="/user/incomes">Registrar Ingreso</Button>
            <Button href="/user/expenses">Registrar gasto</Button>
        </div>
    )
}