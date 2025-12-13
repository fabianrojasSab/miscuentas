CREATE TABLE bank_account_incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bank_account_id INTEGER,
    income_id INTEGER,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (income_id) REFERENCES incomes(id) ON DELETE CASCADE
);

CREATE INDEX idx_bai_bank_account_id
ON bank_account_incomes(bank_account_id);

CREATE INDEX idx_bai_income_id
ON bank_account_incomes(income_id);
