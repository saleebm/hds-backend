create schema home_design_solutions collate utf8_general_ci;

create table customer
(
    id_customer int auto_increment
        primary key,
    first_name varchar(191) not null,
    middle_initial varchar(191) null,
    last_name varchar(191) not null,
    address varchar(191) not null,
    city varchar(191) not null,
    zip_code int not null,
    state varchar(191) null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at datetime(3) not null
);

create table jobs
(
    id_jobs int auto_increment
        primary key,
    customer_id int not null,
    date_scheduled datetime not null,
    date_completed datetime not null,
    details varchar(191) null,
    hours_scheduled decimal(65,30) not null,
    hours_actual decimal(65,30) null,
    constraint customer_job
        foreign key (customer_id) references customer (id_customer)
);

create index customer_id_idx
    on jobs (customer_id);

create table operations
(
    id_operations int auto_increment
        primary key,
    operation_name varchar(191) not null,
    charge_per_hour decimal(65,30) not null,
    hours_charged decimal(65,30) not null,
    job_id int not null,
    constraint job_operations
        foreign key (job_id) references jobs (id_jobs)
);

create index job_id_idx
    on operations (job_id);

create table product
(
    id_product int auto_increment
        primary key,
    brand varchar(191) not null,
    model_number varchar(191) not null,
    product_category varchar(191) not null,
    description varchar(191) null,
    list_price decimal(65,30) not null,
    sale_price decimal(65,30) null,
    serial_number varchar(191) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at datetime(3) not null
);

create table store_locations
(
    id_store_locations int auto_increment
        primary key,
    address varchar(191) not null,
    city varchar(191) not null,
    state varchar(191) not null,
    zip_code int not null,
    phone varchar(191) not null
);

create table customer_order
(
    id_customer_order int auto_increment
        primary key,
    order_number int not null,
    expected_delivery_date datetime not null,
    actual_delivery_date datetime null,
    order_date timestamp default CURRENT_TIMESTAMP not null,
    is_canceled tinyint default 0 null,
    date_cancelled datetime null,
    order_total decimal(65,30) not null,
    customer_id int not null,
    store_location_id int not null,
    constraint order_number_UNIQUE
        unique (order_number),
    constraint customer__order_customer
        foreign key (customer_id) references customer (id_customer),
    constraint customer_order_store_location
        foreign key (store_location_id) references store_locations (id_store_locations)
);

create index customer_id_idx
    on customer_order (customer_id);

create index store_location_id_idx
    on customer_order (store_location_id);

create table customer_order_products
(
    id_customer_order_products int auto_increment
        primary key,
    customer_order_id int not null,
    product_id int not null,
    quantity int not null,
    per_unit_cost decimal(65,30) not null,
    constraint customer_order_product_products
        foreign key (customer_order_id) references customer_order (id_customer_order),
    constraint product_id_customer_orders
        foreign key (product_id) references product (id_product)
);

create index customer_order_id_idx
    on customer_order_products (customer_order_id);

create index product_id_idx
    on customer_order_products (product_id);

create table employee
(
    employee_id int auto_increment
        primary key,
    first_name varchar(32) not null,
    last_name varchar(32) not null,
    email varchar(255) not null,
    user_signing_secret varchar(191) not null,
    password varchar(32) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at datetime not null,
    address varchar(191) not null,
    city varchar(191) not null,
    state varchar(191) not null,
    zip_code int not null,
    salary decimal(65,30) not null,
    position_name enum('PRESIDENT_CEO', 'VP_CEO', 'STORE_MANAGER', 'OFFICE_MANAGER', 'SALES_DESIGN_MANAGER', 'SALES_DESIGN_ASSOCIATE', 'SCHEDULING', 'TECHNICIAN', 'DELIVERY', 'WAREHOUSE', 'INSTALLATIONS', 'INSTALLATIONS_DELIVERIES', 'INSTALLATIONS_DELIVERIES_SALES', 'WAREHOUSE_INSTALLATIONS_DELIVERIES', 'WAREHOUSE_DELIVERIES') not null,
    role_capability enum('READ_WRITE', 'READ', 'NONE') default 'NONE' not null,
    store_location_id int not null,
    constraint email_UNIQUE
        unique (email),
    constraint store_location_id
        foreign key (store_location_id) references store_locations (id_store_locations)
            on update cascade on delete cascade
);

create index store_location_id_idx
    on employee (store_location_id);

create table inventory
(
    id_inventory int auto_increment
        primary key,
    store_location int not null,
    product int not null,
    aisle int not null,
    bin varchar(191) not null,
    quantity_on_hand int not null,
    constraint bin_UNIQUE
        unique (bin),
    constraint product_inventory
        foreign key (product) references product (id_product)
            on update cascade on delete cascade,
    constraint store_location_inventory
        foreign key (store_location) references store_locations (id_store_locations)
            on update cascade on delete cascade
);

create index product_id_idx
    on inventory (product);

create index store_location_id_idx
    on inventory (store_location);

create table invoice
(
    id_invoice int auto_increment
        primary key,
    invoice_number varchar(191) not null,
    store_location_id int not null,
    customer_order_id int not null,
    customer_id int not null,
    employee_id int not null,
    invoice_total decimal(65,30) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    due_date datetime not null,
    paid_date datetime not null,
    updated_at datetime(3) not null,
    constraint invoice_number_UNIQUE
        unique (invoice_number),
    constraint customer_id_invoice
        foreign key (customer_id) references customer (id_customer),
    constraint customer_order_id_invoice
        foreign key (customer_order_id) references customer_order (id_customer_order),
    constraint employee_id_invoice
        foreign key (employee_id) references employee (employee_id),
    constraint store_location_id_invoice
        foreign key (store_location_id) references store_locations (id_store_locations)
);

create index customer_id_idx
    on invoice (customer_id);

create index customer_order_id_idx
    on invoice (customer_order_id);

create index employee_id_idx
    on invoice (employee_id);

create index store_location_id_idx
    on invoice (store_location_id);

create table invoice_line_items
(
    id_invoice_line_item int auto_increment
        primary key,
    invoice_id int not null,
    product_id int null,
    operation_id int null,
    job_id int null,
    is_installation_cost tinyint default 0 null,
    task_name varchar(191) null,
    line_item_total decimal(65,30) not null,
    quantity int not null,
    constraint invoice_invoice_line_items
        foreign key (invoice_id) references invoice (id_invoice),
    constraint job_id_invoice_line_items
        foreign key (job_id) references jobs (id_jobs),
    constraint operation_id_invoice_line_items
        foreign key (operation_id) references operations (id_operations),
    constraint product_invoice_line_items
        foreign key (product_id) references product (id_product)
);

create index invoice_id_idx
    on invoice_line_items (invoice_id);

create index job_id_idx
    on invoice_line_items (job_id);

create index operation_id_idx
    on invoice_line_items (operation_id);

create index product_id_idx
    on invoice_line_items (product_id);

create table suppliers
(
    id_supplier int auto_increment
        primary key,
    name varchar(191) not null,
    email varchar(191) not null,
    phone varchar(191) not null,
    city varchar(191) not null,
    state varchar(191) not null,
    zip int not null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    updated_at datetime(3) not null,
    constraint email_UNIQUE
        unique (email)
);

create table sales_orders
(
    id_sales_orders int auto_increment
        primary key,
    order_number varchar(191) not null,
    order_date timestamp default CURRENT_TIMESTAMP not null,
    deliver_date datetime not null,
    order_price decimal(65,30) not null,
    supplier_id int not null,
    employee_id int not null,
    store_location_id int not null,
    constraint order_number_UNIQUE
        unique (order_number),
    constraint id_employee_sales_order
        foreign key (employee_id) references employee (employee_id)
            on update cascade on delete cascade,
    constraint id_store_location_sales_order
        foreign key (store_location_id) references store_locations (id_store_locations),
    constraint id_supplier_sales_order
        foreign key (supplier_id) references suppliers (id_supplier)
            on update cascade on delete cascade
);

create table sales_order_item
(
    id_sales_order_item int auto_increment
        primary key,
    sales_order_id int not null,
    product_id int not null,
    quantity_purchased int not null,
    unit_price decimal(65,30) not null,
    constraint product_id_sales_order
        foreign key (product_id) references product (id_product),
    constraint sales_order_id_sales_order_item
        foreign key (sales_order_id) references sales_orders (id_sales_orders)
);

create index product_id_idx
    on sales_order_item (product_id);

create index sales_order_id_idx
    on sales_order_item (sales_order_id);

create index id_employee_idx
    on sales_orders (employee_id);

create index id_store_location_idx
    on sales_orders (store_location_id);

create index id_supplier_idx
    on sales_orders (supplier_id);

