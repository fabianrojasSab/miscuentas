import { getDb } from "../index";
import bcrypt from "bcryptjs";

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
    return new Promise((resolve, reject) => {
        db.all<DbUserRow>(
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
        (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        }
        );
    });
}

export async function getUserByEmail(email: string): Promise<DbUserRow> {
    const db = getDb();

    return new Promise((resolve, reject) => {
        db.get<DbUserRow>(
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
        WHERE email = ?`,
        [email],
        (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        }
        );
    });
}

export async function getUserById(id: number): Promise<DbUserRow> {
    const db = getDb();

    return new Promise((resolve, reject) => {
        db.get<DbUserRow>(
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
        WHERE id = ?`,
        [id],
        (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        }
        );
    });
}

export async function createUser({
    name,
    email,
    passwordHash,
}: NewUser): Promise<{ id: number }> {
    const db = getDb();
    const isNow = () => new Date().toISOString();

    return new Promise((resolve, reject) => {
        db.run(
        `INSERT INTO users  (name, email, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)`,
        [name, email, passwordHash, isNow(), isNow()],
        function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        }
        );
    });
}

export async function login({
    email,
    password,
}: UserLogin): Promise<{ id: number; name: string, sw_admin: number }> {
    const db = getDb();

    return new Promise((resolve, reject) => {
        db.get<DbUserRow>(
        `SELECT id, name, password, sw_admin 
        FROM users 
        WHERE email = ?`,
        [email],
        async (err, row) => {
            if (err) return reject(err);

            // Usuario no encontrado
            if (!row) {
                return reject(new Error("Usuario no encontrado"));
            }

            // Validar contraseña
            const passwordCorrecta = await bcrypt.compare(password, row.password);

            if (!passwordCorrecta) {
                return reject(new Error("Contraseña incorrecta"));
            }

            // Login exitoso
            resolve({
            id: row.id,
            name: row.name,
            sw_admin: row.sw_admin,
            });
        }
        );
    });
}
