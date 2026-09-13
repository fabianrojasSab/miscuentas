//Funcion para dar formato de moneda colombiana al numero que se le pase
export function formatMoneyCol(amount: number) {
    if (!amount) {
        return ""
    }

    return Number(amount).toLocaleString(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }
    )
}