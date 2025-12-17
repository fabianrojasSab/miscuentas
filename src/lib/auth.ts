import crypto from "crypto";
import { getAsync, runAsync } from "./db";
import { getDb } from "@/lib/db";

export type DbUserRow = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    two_factor_secret: string | null;
    two_factor_recovery_codes: string | null;
    two_factor_confirmed_at: string | null;
    remember_token: string | null;
    current_team_id: string | null;
    profile_photo_path: string | null;
    created_at: string | null;
    updated_at: string | null;
    sw_admin: number;
    onboarding_completed_at: string | null;
};

export const SESSION_COOKIE_NAME = "mc_session";
const SESSION_DAYS = 30;

function sha256(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

export function createSessionToken() {
    return crypto.randomBytes(32).toString("hex");
}

export function sessionExpiresAtISO() {
    const d = new Date();
    d.setDate(d.getDate() + SESSION_DAYS);
    return d.toISOString();
}

export async function createSession(userId: number) {
    const db = getDb();
    const token = createSessionToken();
    const tokenHash = sha256(token);
    const now = new Date().toISOString();
    const expiresAt = sessionExpiresAtISO();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;
        await runAsync(
            db,
            `INSERT INTO sessions (user_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?)`,
            [userId, tokenHash, now, expiresAt]
        );
        await runAsync(db, "COMMIT");

        return { token, expiresAt };
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }   
}

export async function deleteSessionByToken(token: string) {
    const db = getDb();
    const tokenHash = sha256(token);

    try {
        await runAsync(db, `DELETE FROM sessions WHERE token_hash = ?`, [tokenHash]);
    }finally {
        db.close();
    }  
}

export async function getUserBySessionToken(token: string) {
    const tokenHash = sha256(token);
    const db = getDb();

    try {
        const userResult = await getAsync<DbUserRow>(
            db,
            `SELECT u.id, u.name, u.email, u.sw_admin, u.onboarding_completed_at
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token_hash = ?
            AND s.expires_at > ?
            LIMIT 1
            `,
            [tokenHash, new Date().toISOString()]
        );

        if (!userResult) return null;

        const needsOnboarding = userResult?.onboarding_completed_at === null;

        return{
            id: userResult.id,
            name: userResult.name,
            email: userResult.email,
            sw_admin: userResult.sw_admin,
            needsOnboarding
        };
    }finally {
        db.close();
    }   
}
