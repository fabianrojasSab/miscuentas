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

        /*
        |--------------------------------------------------------------------------
        | Limpiar categorias de gastos
        |--------------------------------------------------------------------------
        */

        await connection.execute(
            `DELETE FROM expense_categories`
        );

        console.log("Tabla de categorias limpiada.");

        /*
        |--------------------------------------------------------------------------
        | expense_categories
        |--------------------------------------------------------------------------
        */

        const categories = [
            [
                "Vivienda",
                1,
                "Arriendo, cuota del conjunto, seguro del hogar"
            ],
            [
                "Servicios publicos",
                1,
                "Energía, agua, internet"
            ],
            [
                "Transporte",
                2,
                "Seguro del vehículo, parqueadero, transporte diario"
            ],
            [
                "Educación",
                1,
                "Matrícula, pensión, suscripciones educativas"
            ],
            [
                "Seguros",
                1,
                "De vida, hogar, vehículo"
            ],
            [
                "Deudas",
                1,
                "Créditos, préstamos"
            ],
            [
                "Suscripciones",
                1,
                "Membresías, plataformas, software"
            ],
            [
                "Salud",
                2,
                "Medicamentos, medicina prepagada, seguro médico"
            ],
            [
                "Alimentación",
                2,
                "Snacks, bebidas, domicilios"
            ],
            [
                "Mercado",
                1,
                "Dinero destinado mensualmente para la alimentación"
            ],
            [
                "Compras personales",
                2,
                "Ropa, calzado, accesorios, cuidado personal"
            ],
            [
                "Entretenimiento",
                2,
                "Cine, videojuegos, eventos, salidas"
            ],
            [
                "Hogar",
                2,
                "Reparaciones, mantenimiento, muebles"
            ],
            [
                "Familia",
                2,
                "Regalos, actividades familiares, gastos imprevistos"
            ],
            [
                "Mascotas",
                2,
                "Veterinarios, medicamentos, accesorios"
            ],
            [
                "Viajes",
                2,
                "Transporte, hospedaje, alimentación"
            ],
            [
                "Otros variables",
                2,
                "Imprevistos, comisiones, multas, gastos varios"
            ],
            [
                "Vehículos",
                1,
                "Repuestos, SOAT, gasolina, seguros"
            ],
        ];

        await connection.query(
            `
            INSERT INTO expense_categories
                (name, category_type, description)
            VALUES ?
            `,
            [categories]
        );

        console.log(
            `${categories.length} categorías de gastos creadas.`
        );

        console.log("Seed completado con éxito ✅");

    } catch (err) {
        console.error("❌ Error ejecutando seed:", err);

    } finally {
        await connection.end();
    }
}

main();