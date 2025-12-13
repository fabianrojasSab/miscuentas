CREATE TABLE bank_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_number TEXT NOT NULL UNIQUE,
    account_type INTEGER NOT NULL,
    bank_name TEXT NOT NULL,
    account_balance REAL NOT NULL DEFAULT 0.00,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bank_accounts_user_id
ON bank_accounts(user_id);
