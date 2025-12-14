import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "db", "miscuentas.sqlite");

export function getDb() {
    const db = new sqlite3.Database(dbPath);
    db.run("PRAGMA foreign_keys = ON;");
    return db;
}

export function runAsync(db: sqlite3.Database, sql: string, params: any[] = []) {
    return new Promise<void>((resolve, reject) => {
        db.run(sql, params, (err) => (err ? reject(err) : resolve()));
    });
}

export function getAsync<T>(db: sqlite3.Database, sql: string, params: any[] = []) {
    return new Promise<T | undefined>((resolve, reject) => {
        db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row as T)));
    });
}
