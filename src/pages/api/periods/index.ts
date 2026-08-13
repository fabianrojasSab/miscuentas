import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { PeriodType } from "@/emuns/PeriodType";
import { createPeriod, deletePeriod, getAllPeriods, getPeriodByMonth, getPeriodByYear, getPeriodsYearly, updatePeriod } from "@/lib/db/queries/periods";

type PeriodForm = {
    name_period: string,
    description: string,
    period_type: number,
    period_value: number,
    year: number | null,
    month: number | null,
    week: number | null,
    day: number | null,
    parent_id: number | null,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies[SESSION_COOKIE_NAME];

    if (!token) return res.status(401).json({ error: "No auth" });

    const user = await getUserBySessionToken(token);
    if (!user) return res.status(401).json({ error: "No auth" });

    try {
        switch (req.method) {
        case "POST": {

            const { period } = req.body as {
                period: PeriodForm;
            };

            if (!period) {
                return res.status(400).json({
                    error: "Faltan campos obligatorios"
                });
            }

            const periodType = Number(period.period_type);

            if (!Object.values(PeriodType).includes(periodType)) {
                return res.status(400).json({
                    error: "Tipo de período inválido"
                });
            }

            let year: number | null = null;
            let month: number | null = null;
            let week: number | null = null;
            let day: number | null = null;

            switch (periodType) {

                case PeriodType.YEARLY:
                    if (!period.period_value) {
                        return res.status(400).json({
                            error: "El año es obligatorio"
                        });
                    }

                    year = period.period_value;
                    break;

                case PeriodType.MONTHLY:
                    if (!period.period_value || !period.period_value) {
                        return res.status(400).json({
                            error: "El año y el mes son obligatorios"
                        });
                    }

                    year = period.year;
                    month = period.period_value;
                    break;

                case PeriodType.WEEKLY:
                    if (!period.period_value || !period.period_value) {
                        return res.status(400).json({
                            error: "El año y la semana son obligatorios"
                        });
                    }

                    year = period.period_value;
                    week = period.period_value;
                    break;

                case PeriodType.DAILY:
                    if (!period.period_value || !period.period_value || !period.period_value) {
                        return res.status(400).json({
                            error: "El año, mes y día son obligatorios"
                        });
                    }

                    year = period.period_value;
                    month = period.period_value;
                    day = period.period_value;
                    break;
            }

            const newData = {
                name: period.name_period,
                description: period.description,
                period_type: periodType,
                year: year,
                month: month,
                week: week,
                day: day,
                parent_id: period.parent_id,
            };

            const periodResult = await createPeriod(newData);

            return res.status(200).json({
                success: true,
                id: periodResult.id
            });
        }
        case "GET": {

            const { year, period_type, month, yearly } = req.query;

            let periods;

            if(yearly){
                let periodsyearly = await getPeriodsYearly();
                return res.status(200).json({ periodsyearly });
            }

            if (month) {

                let periodBymonth = await getPeriodByMonth(Number(month), Number(year));
                return res.status(200).json({ periodBymonth });

            } else if (year) {

                let periodsByYear = await getPeriodByYear(Number(year));
                return res.status(200).json({ periodsByYear });

            } else {

                periods = await getAllPeriods();

            }

            return res.status(200).json({ periods });
        }
        case "DELETE": {
            const { id } = req.body as {
                id: number,
            };

            if (!id ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" + id });
            }

            const periodDeleted = await deletePeriod(id);

            return res.status(200).json({
                success: true,
                id: periodDeleted.id
            });
        }
        case "PUT": {
            const { id, period } = req.body as {
                id: number,
                period: PeriodForm
            };

            if (!id || !period ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios"});
            }

            const periodType = Number(period.period_type);

            if (!Object.values(PeriodType).includes(periodType)) {
                return res.status(400).json({
                    error: "Tipo de período inválido"
                });
            }

            let year: number | null = null;
            let month: number | null = null;
            let week: number | null = null;
            let day: number | null = null;

            switch (periodType) {

                case PeriodType.YEARLY:
                    if (!period.period_value) {
                        return res.status(400).json({
                            error: "El año es obligatorio"
                        });
                    }

                    year = period.period_value;
                    break;

                case PeriodType.MONTHLY:
                    if (!period.period_value || !period.period_value) {
                        return res.status(400).json({
                            error: "El año y el mes son obligatorios"
                        });
                    }

                    year = period.period_value;
                    month = period.period_value;
                    break;

                case PeriodType.WEEKLY:
                    if (!period.period_value || !period.period_value) {
                        return res.status(400).json({
                            error: "El año y la semana son obligatorios"
                        });
                    }

                    year = period.period_value;
                    week = period.period_value;
                    break;

                case PeriodType.DAILY:
                    if (!period.period_value || !period.period_value || !period.period_value) {
                        return res.status(400).json({
                            error: "El año, mes y día son obligatorios"
                        });
                    }

                    year = period.period_value;
                    month = period.period_value;
                    day = period.period_value;
                    break;
            }

            const updateData = {
                name: period.name_period,
                description: period.description,
                period_type: periodType,
                year: year,
                month: month,
                week: week,
                day: day,
                parent_id: period.parent_id,
            };

            const periodUpdated = await updatePeriod(id, updateData);

            return res.status(200).json({
                success: true,
                id: periodUpdated.id
            });
        }
        default:
            return res.status(405).json({ error: "Método no permitido" });
        }
    } catch (err: any) {
        if (err.code === "SQLLITE_ERROR") {
            return res.status(500).json({ error: err.message });
        }

        if (!err.code) {
            return res.status(401).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
}