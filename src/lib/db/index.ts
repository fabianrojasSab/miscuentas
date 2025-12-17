import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "db", "miscuentas.sqlite");

export function getDb() {
    const db = new sqlite3.Database(dbPath);
    db.run("PRAGMA foreign_keys = ON;");
    return db;
}

export function runAsync(
    db: sqlite3.Database,
    sql: string,
    params: any[] = []
): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (this: sqlite3.RunResult, err) {
        if (err) return reject(err);
        resolve({
            lastID: this.lastID ?? 0,
            changes: this.changes ?? 0,
        });
        });
    });
}

export function getAsync<T>(db: sqlite3.Database, sql: string, params: any[] = []) {
    return new Promise<T | undefined>((resolve, reject) => {
        db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row as T)));
    });
}

export function allAsync<T>(
    db: sqlite3.Database,
    sql: string,
    params: any[] = []
): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows as T[]);
        });
    });
}