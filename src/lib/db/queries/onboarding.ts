import { getDb, runAsync } from "../index";

export type NewData = {
    id: number;
    BankAccount : {
        account_number: number;
        account_type: string;
        bank_name: string;
    };
    Income : {
        amount: number;
        date: string;
        description: string;
    }
};

export async function createConfigInit({
    id,
}: NewData): Promise<{ ok: boolean }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        await runAsync(
            db,
            `UPDATE users SET onboarding_completed_at = ?, updated_at = ? WHERE id = ?`,
            [isNow(), isNow(), id]
        );

        await runAsync(db, "COMMIT");

        return { ok:true };
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        //db.close();
    }        
}