CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    transaction_date TEXT NOT NULL,
    balance_after REAL NOT NULL,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
);

CREATE INDEX idx_transactions_user_id
ON transactions(user_id);

CREATE INDEX idx_transactions_account_id
ON transactions(account_id);
