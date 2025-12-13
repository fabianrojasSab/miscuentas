import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "db", "miscuentas.sqlite");
const migrationsDir = path.join(process.cwd(), "db", "migrations");

const db = new sqlite3.Database(dbPath);

async function applyMigrations() {
    const files = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith(".sql"))
        .sort(); //permite que se ejecute en orden alfabetico

    for (const file of files) {
        console.log("Ejecutando migración:", file);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

        await new Promise<void>((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) return reject(err);
            resolve();
        });
        });
    }

    console.log("Migraciones realizadas ✔");
}

applyMigrations().finally(() => db.close());
