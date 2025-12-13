import sqlite3 from "sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv as any;

loadEnvConfig(process.cwd());
const dbPath = path.join(process.cwd(), "db", "miscuentas.sqlite");

const db = new sqlite3.Database(dbPath);

function runAsync(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve();
        });
    }); 
}

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword  = process.env.ADMIN_PASSWORD || "123";
    const isNow = () => new Date().toISOString();
    
    try {
        console.log("Usando base de datos en:", dbPath);
        await runAsync("DELETE FROM expense_states;");

        console.log("Tablas limpiadas.");

        //expense_states
        await runAsync(
            `INSERT INTO expense_states (name, description) VALUES (?, ?);`,
            ["Pendiente", "El gasto está pendiente de pago"]
        );

        await runAsync(
            `INSERT INTO expense_states (name, description) VALUES (?, ?);`,
            ["Pago", "El gasto está pago"]
        );

        //users (admin idempotente)
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await runAsync(
            `
            INSERT OR IGNORE INTO users
            (name, email, password, created_at, updated_at, sw_admin)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
            ["Administrador", adminEmail, passwordHash, isNow(), isNow(), 1]
        );

        console.log("Seed completado con éxito ✅");
    } catch (err) {
        console.error("Error ejecutando seed:", err);
    } finally {
        db.close();
    }
}

main();