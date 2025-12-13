CREATE TABLE period_expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_id INTEGER NOT NULL,
    expense_id INTEGER NOT NULL,
    expense_date TEXT NOT NULL,
    amount REAL NOT NULL,
    expense_state_id INTEGER NOT NULL,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    FOREIGN KEY (period_id) REFERENCES periods(id) ON DELETE CASCADE,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (expense_state_id) REFERENCES expense_states(id) ON DELETE CASCADE
);

CREATE INDEX idx_period_expenses_period_id
ON period_expenses(period_id);

CREATE INDEX idx_period_expenses_expense_id
ON period_expenses(expense_id);

CREATE INDEX idx_period_expenses_state_id
ON period_expenses(expense_state_id);
