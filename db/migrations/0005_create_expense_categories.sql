CREATE TABLE expense_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    category_type INTEGER NOT NULL
        CHECK (category_type IN (1,2,3)),
    description TEXT,
    created_at TEXT,
    updated_at TEXT
);
