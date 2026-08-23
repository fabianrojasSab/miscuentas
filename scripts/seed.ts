import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

async function main() {
    const adminEmail =
        process.env.ADMIN_EMAIL || "admin@example.com";

    const adminPassword =
        process.env.ADMIN_PASSWORD || "123";

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log(
            `Conectado a MySQL: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        );

        /*
        |--------------------------------------------------------------------------
        | Limpiar estados de gastos
        |--------------------------------------------------------------------------
        */

        await connection.execute(
            `DELETE FROM expense_states`
        );

        console.log("Tablas limpiadas.");

        /*
        |--------------------------------------------------------------------------
        | expense_states
        |--------------------------------------------------------------------------
        */

        await connection.execute(
            `
            INSERT INTO expense_states
                (name, description)
            VALUES
                (?, ?)
            `,
            [
                "Pendiente",
                "El gasto está pendiente de pago"
            ]
        );

        await connection.execute(
            `
            INSERT INTO expense_states
                (name, description)
            VALUES
                (?, ?)
            `,
            [
                "Pago",
                "El gasto está pago"
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Usuario administrador
        |--------------------------------------------------------------------------
        */

        const passwordHash = await bcrypt.hash(
            adminPassword,
            10
        );

        await connection.execute(
            `
            INSERT INTO users
                (
                    name,
                    email,
                    password,
                    created_at,
                    updated_at,
                    sw_admin
                )
            VALUES
                (?, ?, ?, NOW(), NOW(), ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                updated_at = NOW(),
                sw_admin = VALUES(sw_admin)
            `,
            [
                "Administrador",
                adminEmail,
                passwordHash,
                1
            ]
        );

        console.log("Seed completado con éxito ✅");

    } catch (err) {
        console.error("❌ Error ejecutando seed:", err);

    } finally {
        await connection.end();
    }
}

main();