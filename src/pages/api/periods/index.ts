import { createIncomes, getAllIncomes, getAllIncomesByUser, deleteIncomes, updateIncomes } from "@/lib/db/queries/incomes";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { get } from "http";
import { PeriodType } from "@/emuns/PeriodType";
import { createPeriod, deletePeriod, getAllPeriods, getPeriodByYear, updatePeriod } from "@/lib/db/queries/periods";

type PeriodForm = {
    name_period: string,
    description: string,
    period_type: number,
    period_value: number,
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

            const { id, Period } = req.body as {
                id: number;
                Period: PeriodForm;
            };

            if (!id || !Period) {
                return res.status(400).json({
                    error: "Faltan campos obligatorios"
                });
            }

            const periodType = Number(Period.period_type);

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
                    if (!Period.period_value) {
                        return res.status(400).json({
                            error: "El año es obligatorio"
                        });
                    }

                    year = Period.period_value;
                    break;

                case PeriodType.MONTHLY:
                    if (!Period.period_value || !Period.period_value) {
                        return res.status(400).json({
                            error: "El año y el mes son obligatorios"
                        });
                    }

                    year = Period.period_value;
                    month = Period.period_value;
                    break;

                case PeriodType.WEEKLY:
                    if (!Period.period_value || !Period.period_value) {
                        return res.status(400).json({
                            error: "El año y la semana son obligatorios"
                        });
                    }

                    year = Period.period_value;
                    week = Period.period_value;
                    break;

                case PeriodType.DAILY:
                    if (!Period.period_value || !Period.period_value || !Period.period_value) {
                        return res.status(400).json({
                            error: "El año, mes y día son obligatorios"
                        });
                    }

                    year = Period.period_value;
                    month = Period.period_value;
                    day = Period.period_value;
                    break;
            }

            const newData = {
                name: Period.name_period,
                description: Period.description,
                period_type: periodType,
                year: year,
                month: month,
                week: week,
                day: day,
            };

            const periodResult = await createPeriod(newData);

            return res.status(200).json({
                success: true,
                id: periodResult.id
            });
        }
        case "GET": {

            const { year, period_type, month } = req.query;

            let periods;

            if (year && period_type && month) {

                // periods = await getPeriods({
                //     year: Number(year),
                //     period_type: Number(period_type),
                //     month: Number(month),
                // });

            } else if (year) {

                periods = await getPeriodByYear(Number(year));

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
            const { id, Period } = req.body as {
                id: number,
                Period: PeriodForm
            };

            if (!id || !Period ) {
                return res
                .status(400)
                .json({ error: "Faltan campos obligatorios"});
            }

            const periodType = Number(Period.period_type);

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
                    if (!Period.period_value) {
                        return res.status(400).json({
                            error: "El año es obligatorio"
                        });
                    }

                    year = Period.period_value;
                    break;

                case PeriodType.MONTHLY:
                    if (!Period.period_value || !Period.period_value) {
                        return res.status(400).json({
                            error: "El año y el mes son obligatorios"
                        });
                    }

                    year = Period.period_value;
                    month = Period.period_value;
                    break;

                case PeriodType.WEEKLY:
                    if (!Period.period_value || !Period.period_value) {
                        return res.status(400).json({
                            error: "El año y la semana son obligatorios"
                        });
                    }

                    year = Period.period_value;
                    week = Period.period_value;
                    break;

                case PeriodType.DAILY:
                    if (!Period.period_value || !Period.period_value || !Period.period_value) {
                        return res.status(400).json({
                            error: "El año, mes y día son obligatorios"
                        });
                    }

                    year = Period.period_value;
                    month = Period.period_value;
                    day = Period.period_value;
                    break;
            }

            const updateData = {
                name: Period.name_period,
                description: Period.description,
                period_type: periodType,
                year: year,
                month: month,
                week: week,
                day: day,
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