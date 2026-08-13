CREATE TABLE users (
    id INT AUTO_INCREMENT  PRIMARY KEY,
    name TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TEXT,
    password TEXT NOT NULL,
    two_factor_secret TEXT,
    two_factor_recovery_codes TEXT,
    two_factor_confirmed_at TEXT,
    remember_token TEXT,
    current_team_id INTEGER,
    profile_photo_path TEXT,
    created_at TEXT,
    updated_at TEXT,
    sw_admin INTEGER NOT NULL DEFAULT 0,
    onboarding_completed_at TEXT NULL
);
