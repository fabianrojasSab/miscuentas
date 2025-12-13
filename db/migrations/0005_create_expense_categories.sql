CREATE TABLE expense_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_type INTEGER NOT NULL,
    description TEXT,
    created_at TEXT,
    updated_at TEXT
);
