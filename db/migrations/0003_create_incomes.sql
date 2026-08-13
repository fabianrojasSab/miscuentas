CREATE TABLE incomes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    income_date TEXT NOT NULL,
    description TEXT,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_incomes_user_id
ON incomes(user_id);
