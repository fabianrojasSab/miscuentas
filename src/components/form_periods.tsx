import { useState } from "react"
import { Button } from "./buttons"
import { Input } from "./ui/input"
import { PeriodType } from "@/emuns/PeriodType"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type PeriodForm = {
    name_period: string,
    description: string,
    period_type: number,
    period_value: number,
}

type PeriodRow = {
    id: number,
    name: string,
    description: string,
    period_type: number,
    year: number,
    month: number,
    week: number,
    day: number,
    parent_id: number,
    created_at: string,
    updated_at: string,
}

type props = {
    createPeriod: (period: PeriodForm) => void;
    periodToEdit: PeriodRow | null;
    UpdatePeriod: (period: PeriodForm) => void;
}

export const FormPeriods = ({createPeriod, periodToEdit, UpdatePeriod}: props) =>{
    const [period, setPeriod] = useState<PeriodForm | null>();
    const [error, setError] = useState<string | null>()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;

        const body : PeriodForm = {
            name_period: form.name_period.value,
            description: form.description.value,
            period_type: form.period_type.value,
            period_value: form.period_value.value,
        };

        if (periodToEdit) {
            UpdatePeriod(body);
        } else {
            createPeriod(body);
        }
        
        form.reset();
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>Nombre</label>
                <Input
                    className="mb-4"
                    type="text"
                    name="name_period"
                    value={period?.name_period ?? ""}
                    onChange={(e) =>
                        setPeriod(prev => ({
                            ...prev!,
                            name_period: e.target.value
                        }))
                    }
                />
                <label>Descripcion</label>
                <Input
                    className="mb-4"
                    type="text"
                    name="description"
                    value={period?.description ?? ""}
                    onChange={(e) =>
                        setPeriod(prev => ({
                            ...prev!,
                            description: e.target.value
                        }))
                    }
                />
                <label>Tipo</label>
                <Select
                    name="period_type"
                    value={
                        period?.period_type != null
                            ? String(period.period_type)
                            : ""
                    }
                    onValueChange={(value) =>
                        setPeriod(prev => ({
                            ...prev!,
                            period_type: Number(value)
                        }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value={String(PeriodType.DAILY)}>
                            Diario
                        </SelectItem>

                        <SelectItem value={String(PeriodType.MONTHLY)}>
                            Mensual
                        </SelectItem>

                        <SelectItem value={String(PeriodType.WEEKLY)}>
                            Semanal
                        </SelectItem>

                        <SelectItem value={String(PeriodType.YEARLY)}>
                            Anual
                        </SelectItem>
                    </SelectContent>
                </Select>
                <label>Periodo</label>
                <Input
                    className="mb-4"
                    type="text"
                    name="period_value"
                    value={period?.period_value ?? ""}
                    onChange={(e) =>
                        setPeriod(prev => ({
                            ...prev!,
                            period_value: Number(e.target.value)
                        }))
                    }
                />
                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}
        
                <Button type="submit">
                    {periodToEdit ? "Actualizar periodo" : "Crear periodo"}
                </Button>
                
            </form>
        </div>
    )
}