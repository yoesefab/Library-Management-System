create index idx_import_job_started_at on import_job(started_at);
create index idx_import_job_user on import_job(user_id);
create index idx_order_item_order on order_item(order_id);
create index idx_stock_alert_product on stock_alert(product_id);
create index idx_reorder_generated_at on reorder_recommendation(generated_at);
