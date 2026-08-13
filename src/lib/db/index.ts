import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "bqfr06jcfwjwbnvfgvmu-mysql.services.clever-cloud.com",
    port: Number(3306),
    user: "ujoqabahwd22fqob",
    password: "7dRzxSdtqp7w3dd9e9Vk",
    database: "bqfr06jcfwjwbnvfgvmu",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export function getDb() {
    return pool;
}

export async function runAsync(
    db: mysql.Pool,
    sql: string,
    params: unknown[] = []
): Promise<{ lastID: number; changes: number }> {

    const [result] = await db.query(sql, params);

    const resultSet = result as mysql.ResultSetHeader;

    return {
        lastID: resultSet.insertId ?? 0,
        changes: resultSet.affectedRows ?? 0,
    };
}

export async function getAsync<T>(
    db: mysql.Pool,
    sql: string,
    params: unknown[] = []
): Promise<T | undefined> {

    const [rows] = await db.query(sql, params);

    const result = rows as T[];

    return result[0];
}

export async function allAsync<T>(
    db: mysql.Pool,
    sql: string,
    params: unknown[] = []
): Promise<T[]> {

    const [rows] = await db.query(sql, params);

    return rows as T[];
}