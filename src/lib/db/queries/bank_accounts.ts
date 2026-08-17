import { allAsync, getDb, runAsync } from "../index";

export type NewBankAccount = {
    userId: number,
    account_number: string,
    account_type: number,
    bank: string
};

type DbBankAccountRow = {
    account_number: string,
    account_type: number,
    bank_name: string,
    account_balance: number,
    created_at: string,
    updated_at: string,
    deleted_at: string,
};

type DbUpdateBankAccountRow = {
    account_number: string,
    account_type: number,
    bank_name: string,
};

export async function createBankAccount(bankAccount: NewBankAccount): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;
        const bankAcount = await runAsync(
            db,
            `INSERT INTO bank_accounts (user_id, account_number, account_type, bank_name, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [bankAccount.userId, bankAccount.account_number, bankAccount.account_type, bankAccount.bank, isNow(), isNow()]
        );

        await runAsync(db, "COMMIT");

        return { id: bankAcount.lastID };
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        //db.close();
    }  
}

export async function getAllBankAccount(): Promise<DbBankAccountRow[]>  {
    const db = getDb();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;
        const banckAccountResult = await allAsync<DbBankAccountRow>(
            db,
            `select
            ba.*
            from bank_accounts ba`,
        );

        if(!banckAccountResult){
            throw new Error("No hay cuentas de banco registrados")
        }

        return banckAccountResult;
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        //db.close();
    }  
}

export async function deleteBankAccount(id: number): Promise<{ id: number }> {
    const db = getDb();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const deleteResult = await runAsync(
            db,
            `DELETE FROM bank_accounts WHERE id = ?`,
            [id],
        );
        await runAsync(db, "COMMIT");
        
        if(deleteResult.changes === 0){
            throw new Error("No se encontró la cuenta de banco a eliminar");
        }
        return {id};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        //db.close();
    }  
}

export async function updateBankAccount(id: number, data: DbUpdateBankAccountRow): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const updateResult = await runAsync(
            db,
            `UPDATE bank_accounts SET
            (account_number, account_type, bank_name, updated_at) = (?, ?, ?, ?)
            WHERE id = ?`,
            [data.account_number, data.account_type, data.bank_name, isNow(), id],
        );
        await runAsync(db, "COMMIT");

        if(updateResult.changes === 0){
            throw new Error("No se encontró la cuenta de banco a actualizar");
        }
        return {id};
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        //db.close();
    }  
}

export async function getBankAccountByUser(id: number): Promise<DbBankAccountRow[]> {
    const db = getDb();

    try {
        const allBankAccountResult = await allAsync<DbBankAccountRow>(
            db,
            `SELECT
                *
            FROM bank_accounts e
            WHERE e.user_id = ?`,
            [id],
        );

        if(!allBankAccountResult){
            throw new Error("No hay gastos registrados")
        }

        return allBankAccountResult;
    }finally {
        //db.close();
    }   
}