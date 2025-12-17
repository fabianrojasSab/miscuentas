import { allAsync, getAsync, runAsync, getDb } from "../index";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export type NewUser = {
    name: string;
    email: string;
    passwordHash: string;
};

export type UserLogin = { 
    email: string;
    password: string; 
};

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

export async function updateUserById(
    id: number,
    fieldsToUpdate: Partial<{
        name: string;
        email: string;
        password: string;
        sw_admin: number;
    }>
): Promise<void> {
    const db = getDb();
    const setClauses: string[] = [];
    const values: any[] = [];
    for (const [field, value] of Object.entries(fieldsToUpdate)) {
        setClauses.push(`${field} = ?`);
        values.push(value);
    }
    values.push(id); // Para la cláusula WHERE

    const sql = `UPDATE users SET ${setClauses.join(", ")}, updated_at = ? WHERE id = ?`;
    values.splice(values.length - 1, 0, new Date().toISOString()); // Insertar updated_at antes del id
    return new Promise((resolve, reject) => {
        db.run(sql, values, function (err) {
        if (err) return reject(err);
        resolve();
        });
    });
}

export async function getAllUsers(): Promise<DbUserRow[]> {
    const db = getDb();

    try {
        const allUsersResult = await allAsync<DbUserRow>(
            db,
            `SELECT id,
                name,
                email,
                email_verified_at,
                password,
                two_factor_secret,
                two_factor_recovery_codes,
                two_factor_confirmed_at,
                remember_token,
                current_team_id,
                profile_photo_path,
                created_at,
                updated_at,
                sw_admin
            FROM users`,
        );

        return allUsersResult;
    }finally {
        db.close();
    }   
}

export async function getUserByEmail(email: string): Promise<DbUserRow> {
    const db = getDb();

    try {
        const userResult = await getAsync<DbUserRow>(
            db,
            `SELECT id, 
                name,
                email,
                email_verified_at,
                password,
                two_factor_secret,
                two_factor_recovery_codes,
                two_factor_confirmed_at,
                remember_token,
                current_team_id,
                profile_photo_path,
                created_at,
                updated_at,
                sw_admin
            FROM users
            WHERE email = ?
            LIMIT 1`,
            [email],
        );

        if (!userResult) {
            throw new Error("Usuario no encontrado");
        }

        return userResult;
    }finally {
        db.close();
    }  
}

export async function getUserById(id: number): Promise<DbUserRow> {
    const db = getDb();

    try {
        const userResult = await getAsync<DbUserRow>(
            db,
            `SELECT id, 
                name,  
                email, 
                email_verified_at, 
                password, 
                two_factor_secret, 
                two_factor_recovery_codes, 
                two_factor_confirmed_at, 
                remember_token, 
                current_team_id, 
                profile_photo_path,
                created_at, 
                updated_at, 
                sw_admin
            FROM users
            WHERE id = ?
            LIMIT 1`,
            [id],
        );

        if (!userResult) {
            throw new Error("Usuario no encontrado");
        }

        return userResult;
    }finally {
        db.close();
    }  
}

export async function createUser({
    name,
    email,
    passwordHash,
}: NewUser): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();
    let began = false;

    try {
        await runAsync(db, "BEGIN");
        began = true;

        const user = await runAsync(
            db,
            `INSERT INTO users  (name, email, password, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
            [name, email, passwordHash, isNow(), isNow()],
        );

        await runAsync(db, "COMMIT");

        return{id: user.lastID}
    }catch (e) {
        if (began) await runAsync(db, "ROLLBACK");
        throw e;
    } finally {
        db.close();
    }   
}

export async function login({
    email,
    password,
}: UserLogin): Promise<{ id: number; name: string, sw_admin: number, token: string, expiresAt: string, needsOnboarding: boolean }> {
    const db = getDb();

    try {
        const userResult = await getAsync<DbUserRow>(
            db,
            `SELECT id, name, password, sw_admin, onboarding_completed_at
            FROM users 
            WHERE email = ?`,
            [email],
        );

        // Usuario no encontrado
        if (!userResult) {
            throw new Error("Usuario no encontrado");
        }

        // Validar contraseña
        const passwordCorrecta = await bcrypt.compare(password, userResult.password);

        if (!passwordCorrecta) {
            throw new Error("Contraseña incorrecta");
        }

        const { token, expiresAt } = await createSession(userResult.id);

        const needsOnboarding = userResult.onboarding_completed_at === null;

        return({
            id: userResult.id,
            name: userResult.name,
            sw_admin: userResult.sw_admin,
            token: token,
            expiresAt: expiresAt,
            needsOnboarding: needsOnboarding
        });
    }finally {
        db.close();
    }   
}
