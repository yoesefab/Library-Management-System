alter table import_job add column payload text;

create table app_setting (
    setting_key varchar(120) primary key,
    setting_value varchar(2000) not null,
    description varchar(500),
    updated_at timestamp with time zone not null default current_timestamp,
    updated_by_user_id bigint references app_user(id)
);

insert into app_setting (setting_key, setting_value, description) values
    ('forecast.minimum_history_weeks', '12', 'Minimum de semaines requis avant comparaison des méthodes'),
    ('forecast.validation_weeks', '4', 'Nombre de semaines réservé à la validation'),
    ('forecast.safety_stock_days', '7', 'Couverture de sécurité utilisée pour les recommandations'),
    ('inventory.slow_moving_days', '90', 'Période sans vente avant classement faible rotation'),
    ('inventory.dead_stock_days', '180', 'Période sans vente avant classement stock dormant');
