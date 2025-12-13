CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    expense_category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    income_date TEXT NOT NULL,
    amount REAL NOT NULL,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_expenses_user_id
ON expenses(user_id);

CREATE INDEX idx_expenses_category_id
ON expenses(expense_category_id);
