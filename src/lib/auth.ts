import crypto from "crypto";
import type sqlite3 from "sqlite3";
import { getAsync, runAsync } from "./db";

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

export async function createSession(db: sqlite3.Database, userId: number) {
    const token = createSessionToken();
    const tokenHash = sha256(token);
    const now = new Date().toISOString();
    const expiresAt = sessionExpiresAtISO();

    await runAsync(
        db,
        `INSERT INTO sessions (user_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?)`,
        [userId, tokenHash, now, expiresAt]
    );

    return { token, expiresAt };
}

export async function deleteSessionByToken(db: sqlite3.Database, token: string) {
    const tokenHash = sha256(token);
    await runAsync(db, `DELETE FROM sessions WHERE token_hash = ?`, [tokenHash]);
}

export async function getUserBySessionToken(db: sqlite3.Database, token: string) {
    const tokenHash = sha256(token);

    return await getAsync<{
        id: number;
        name: string;
        email: string;
        sw_admin: number;
    }>(
        db,
        `
        SELECT u.id, u.name, u.email, u.sw_admin
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ?
        AND s.expires_at > ?
        LIMIT 1
        `,
        [tokenHash, new Date().toISOString()]
    );
}
