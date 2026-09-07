CREATE TABLE dashboard_preference (
    user_id bigint PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
    revision bigint NOT NULL DEFAULT 0,
    payload text NOT NULL
);
