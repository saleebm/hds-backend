create schema hds collate utf8mb4_general_ci;

create table Customer
(
    address varchar(191) default '' not null,
    city varchar(191) default '' not null,
    email varchar(191) default '' not null,
    id int auto_increment
        primary key,
    name varchar(191) default '' not null,
    phone varchar(191) default '' not null,
    state varchar(191) default '' not null,
    zip int default 0 not null,
    constraint `Customer.email`
        unique (email)
)
    collate=utf8mb4_unicode_ci;

create table Bid
(
    bidAmount int default 0 not null,
    customerId int not null,
    id int auto_increment
        primary key,
    requiredHours int default 0 not null,
    constraint bid_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index customerId
    on Bid (customerId);

create table Inventory
(
    aisle int default 0 not null,
    bin varchar(191) default '' not null,
    id int auto_increment
        primary key,
    serialNumber int default 0 not null
)
    collate=utf8mb4_unicode_ci;

create table Job
(
    actualEnd datetime(3) null,
    actualHours int null,
    customerId int not null,
    id int auto_increment
        primary key,
    scheduledEnd datetime(3) default '1970-01-01 00:00:00.000' not null,
    scheduledHours int default 0 not null,
    startDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    constraint job_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create table CustomerOrder
(
    customerId int not null,
    dueDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    extendedCost int default 0 not null,
    id int auto_increment
        primary key,
    jobId int not null,
    orderDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    quantityPurchased int default 0 not null,
    requestedDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    unitCost int default 0 not null,
    constraint customerorder_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade,
    constraint customerorder_ibfk_2
        foreign key (jobId) references Job (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index customerId
    on CustomerOrder (customerId);

create index jobId
    on CustomerOrder (jobId);

create table CustomerSale
(
    customerId int not null,
    customerOrderId int not null,
    id int auto_increment
        primary key,
    saleAmount int default 0 not null,
    saleDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    constraint customersale_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade,
    constraint customersale_ibfk_2
        foreign key (customerOrderId) references CustomerOrder (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index customerId
    on CustomerSale (customerId);

create index customerOrderId
    on CustomerSale (customerOrderId);

create index customerId
    on Job (customerId);

create table Location
(
    address varchar(191) default '' not null,
    city varchar(191) default '' not null,
    id int auto_increment
        primary key,
    phone varchar(191) default '' not null,
    state varchar(191) default '' not null,
    zip int default 0 not null,
    inventory int null,
    constraint location_ibfk_1
        foreign key (inventory) references Inventory (id)
            on update cascade on delete set null
)
    collate=utf8mb4_unicode_ci;

create table Employee
(
    address varchar(191) default '' not null,
    city varchar(191) default '' not null,
    email varchar(191) default '' not null,
    id int auto_increment
        primary key,
    locationId int not null,
    name varchar(191) default '' not null,
    phone varchar(191) default '' not null,
    role enum('USER', 'ADMIN') default 'USER' not null,
    state varchar(191) default '' not null,
    zip int default 0 not null,
    constraint `Employee.email`
        unique (email),
    constraint employee_ibfk_1
        foreign key (locationId) references Location (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index locationId
    on Employee (locationId);

create index inventory
    on Location (inventory);

create table Supplier
(
    address varchar(191) default '' not null,
    city varchar(191) default '' not null,
    email varchar(191) default '' not null,
    id int auto_increment
        primary key,
    name varchar(191) default '' not null,
    phone varchar(191) default '' not null,
    state varchar(191) default '' not null,
    zip int default 0 not null,
    constraint `Supplier.email`
        unique (email)
)
    collate=utf8mb4_unicode_ci;

create table ProductOrder
(
    costEach int default 0 not null,
    dueDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    extendedCost int default 0 not null,
    id int auto_increment
        primary key,
    quantityPurchased int default 0 not null,
    supplierId int not null,
    constraint productorder_ibfk_1
        foreign key (supplierId) references Supplier (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create table Product
(
    createdAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    customerSale int null,
    description varchar(191) default '' not null,
    id int auto_increment
        primary key,
    modelNumber int default 0 not null,
    price int default 0 not null,
    productCategory varchar(191) default '' not null,
    unitCost int default 0 not null,
    updatedAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    customerOrder int null,
    inventory int null,
    productOrder int null,
    constraint product_ibfk_1
        foreign key (productOrder) references ProductOrder (id)
            on update cascade on delete set null,
    constraint product_ibfk_2
        foreign key (inventory) references Inventory (id)
            on update cascade on delete set null,
    constraint product_ibfk_3
        foreign key (customerOrder) references CustomerOrder (id)
            on update cascade on delete set null,
    constraint product_ibfk_4
        foreign key (customerSale) references CustomerSale (id)
            on update cascade on delete set null
)
    collate=utf8mb4_unicode_ci;

create table BidProduct
(
    bidId int not null,
    id varchar(191) not null
        primary key,
    productId int not null,
    saleAmount int default 0 not null,
    saleDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    constraint bidproduct_ibfk_1
        foreign key (productId) references Product (id)
            on update cascade on delete cascade,
    constraint bidproduct_ibfk_2
        foreign key (bidId) references Bid (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index bidId
    on BidProduct (bidId);

create index productId
    on BidProduct (productId);

create index customerOrder
    on Product (customerOrder);

create index customerSale
    on Product (customerSale);

create index inventory
    on Product (inventory);

create index productOrder
    on Product (productOrder);

create index supplierId
    on ProductOrder (supplierId);

create table _Migration
(
    revision int auto_increment
        primary key,
    name text not null,
    datamodel longtext not null,
    status text not null,
    applied int not null,
    rolled_back int not null,
    datamodel_steps longtext not null,
    database_migration longtext not null,
    errors longtext not null,
    started_at datetime(3) not null,
    finished_at datetime(3) null
);

