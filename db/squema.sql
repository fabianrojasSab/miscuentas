PRAGMA foreign_keys = ON;

-- =========================
-- users
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    email_verified_at TEXT NULL,
    password TEXT NOT NULL,
    two_factor_secret TEXT NULL,
    two_factor_recovery_codes TEXT NULL,
    two_factor_confirmed_at TEXT NULL,
    remember_token TEXT NULL,
    current_team_id INTEGER NULL,
    profile_photo_path TEXT NULL,
    created_at TEXT NULL,
    updated_at TEXT NULL,
    sw_admin INTEGER NOT NULL DEFAULT 0
    onboarding_completed_at TEXT NULL
);

-- =========================
-- bank_accounts
-- =========================
CREATE TABLE IF NOT EXISTS bank_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_number TEXT NOT NULL UNIQUE,
    account_type INTEGER NOT NULL,
    bank_name TEXT NOT NULL,
    account_balance REAL NOT NULL DEFAULT 0.00,
    created_at TEXT NULL,
    updated_at TEXT NULL,
    deleted_at TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);

-- =========================
-- incomes
-- =========================
CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    income_date TEXT NOT NULL, -- YYYY-MM-DD
    description TEXT NULL,
    created_at TEXT NULL,
    updated_at TEXT NULL,
    deleted_at TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_incomes_user_id ON incomes(user_id);

-- =========================
-- bank_account_incomes (pivot)
-- =========================
CREATE TABLE IF NOT EXISTS bank_account_incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bank_account_id INTEGER NULL,
    income_id INTEGER NULL,
    created_at TEXT NULL,
    updated_at TEXT NULL,
    deleted_at TEXT NULL,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (income_id) REFERENCES incomes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bai_bank_account_id ON bank_account_incomes(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bai_income_id ON bank_account_incomes(income_id);

-- =========================
-- expense_categories
-- =========================
CREATE TABLE IF NOT EXISTS expense_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_type INTEGER NOT NULL,
    description TEXT NULL,
    created_at TEXT NULL,
    updated_at TEXT NULL
);

-- =========================
-- expense_states
-- =========================
CREATE TABLE IF NOT EXISTS expense_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NULL
);

-- =========================
-- expenses
-- =========================
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    expense_category_id INTEGER NULL,
    name TEXT NOT NULL,
    description TEXT NULL,
    income_date TEXT NOT NULL,
    amount REAL NOT NULL,
    created_at TEXT NULL,
    updated_at TEXT NULL,
    deleted_at TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(expense_category_id);

-- =========================
-- periods
-- =========================
CREATE TABLE IF NOT EXISTS periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    period_type INTEGER NOT NULL,
    year INTEGER NULL,
    month INTEGER NULL,
    week INTEGER NULL,
    day INTEGER NULL,
    parent_id INTEGER NULL,
    created_at TEXT NULL,
    updated_at TEXT NULL,
    FOREIGN KEY (parent_id) REFERENCES periods(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_periods_parent_id ON periods(parent_id);

-- =========================
-- period_expenses
-- =========================
CREATE TABLE IF NOT EXISTS period_expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_id INTEGER NOT NULL,
    expense_id INTEGER NOT NULL,
    expense_date TEXT NOT NULL, -- YYYY-MM-DD
    amount REAL NOT NULL,
    expense_state_id INTEGER NOT NULL,
    created_at TEXT NULL,
    updated_at TEXT NULL,
    deleted_at TEXT NULL,
    FOREIGN KEY (period_id) REFERENCES periods(id) ON DELETE CASCADE,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (expense_state_id) REFERENCES expense_states(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_period_expenses_period_id ON period_expenses(period_id);
CREATE INDEX IF NOT EXISTS idx_period_expenses_expense_id ON period_expenses(expense_id);
CREATE INDEX IF NOT EXISTS idx_period_expenses_state_id ON period_expenses(expense_state_id);

-- =========================
-- transactions
-- =========================
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    description TEXT NULL,
    amount REAL NOT NULL,
    transaction_date TEXT NOT NULL, -- ISO datetime
    balance_after REAL NOT NULL,
    created_at TEXT NULL,
    updated_at TEXT NULL,
    deleted_at TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
