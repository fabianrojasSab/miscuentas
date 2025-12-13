CREATE TABLE periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    period_type INTEGER NOT NULL,
    year INTEGER,
    month INTEGER,
    week INTEGER,
    day INTEGER,
    parent_id INTEGER,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (parent_id) REFERENCES periods(id) ON DELETE CASCADE
);

CREATE INDEX idx_periods_parent_id
ON periods(parent_id);
