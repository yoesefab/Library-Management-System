alter table product add column image_key varchar(160);

create unique index uk_product_image_key on product(image_key);
