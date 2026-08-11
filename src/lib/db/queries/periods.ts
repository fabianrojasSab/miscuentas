import { allAsync, getAsync, getDb, runAsync } from "../index";

type BdNewPeriodRow = {
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

type DbPeriodRow = {
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

type DbUpdateIncomeRow = {
    name: string,
    description: string,
    period_type: number,
    year: number,
    month: number,
    week: number,
    day: number,
}

export async function createPeriod({
    name,
    description,
    period_type,
    year,
    month,
    week,
    day,
}: BdNewPeriodRow): Promise<{id: number}> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const period = await runAsync(
            db,
            `INSERT INTO periods (name, description, period_type, year, month, week, day, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, period_type, year, month, week, day, isNow()],
        );
        await runAsync(db, "COMMIT");
        
        return {id: period.lastID};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}

export async function getAllPeriods(): Promise<DbPeriodRow[]> {
    const db = getDb();

    try {
        const allPeriodsResult = await allAsync<DbPeriodRow>(
            db,
            `SELECT
                i.*
            FROM periods i`,
        );

        if(!allPeriodsResult){
            throw new Error("No hay periodos registrados")
        }

        return allPeriodsResult;
    }finally {
        db.close();
    }   
}

export async function getPeriodByYear(year: number): Promise<DbPeriodRow> {
    const db = getDb();

    try {
        const periodsResult = await getAsync<DbPeriodRow>(
            db,
            `SELECT
                i.*
            FROM periods i
            WHERE year = ?`,
            [year],
        );

        if(!periodsResult){
            throw new Error("No hay periodos registrados")
        }

        return periodsResult;
    }finally {
        db.close();
    }   
}

export async function getPeriodByMonth(year: number): Promise<DbPeriodRow> {
    const db = getDb();

    try {
        const periodsResult = await getAsync<DbPeriodRow>(
            db,
            `SELECT
                i.*
            FROM periods i
            WHERE period_type = 2`,
        );

        if(!periodsResult){
            throw new Error("No hay periodos registrados")
        }

        return periodsResult;
    }finally {
        db.close();
    }   
}

export async function deletePeriod(id: number): Promise<{ id: number }> {
    const db = getDb();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const deleteResult = await runAsync(
            db,
            `DELETE FROM periods WHERE id = ?`,
            [id],
        );
        await runAsync(db, "COMMIT");
        
        if(deleteResult.changes === 0){
            throw new Error("No se encontró el periodo a eliminar");
        }
        return {id};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}

export async function updatePeriod(id: number, data: DbUpdateIncomeRow): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const updateResult = await runAsync(
            db,
            `UPDATE periods SET (
            name,
            description,
            period_type,
            year,
            month,
            week,
            day,
            updated_at) = (?, ?, ?, ?, ?, ?, ?, ?)
            WHERE id = ?`,
            [data.name, data.description, data.period_type, data.year, data.month, data.week, data.day, isNow(), id],
        );
        await runAsync(db, "COMMIT");

        if(updateResult.changes === 0){
            throw new Error("No se encontró el periodo a actualizar");
        }
        return {id};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }  
}