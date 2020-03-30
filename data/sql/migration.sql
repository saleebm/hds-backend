create schema hds collate utf8mb4_0900_ai_ci;

create table Customer
(
    address varchar(191) default '' not null,
    city varchar(191) default '' not null,
    createdAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    firstName varchar(191) default '' not null,
    id int auto_increment
        primary key,
    lastName varchar(191) default '' not null,
    middleInitial varchar(191) default '' not null,
    state varchar(191) default '' not null,
    updatedAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    zip int default 0 not null
)
    collate=utf8mb4_unicode_ci;

create table Bid
(
    bidAmount varchar(191) default '' not null,
    customerId int not null,
    id int auto_increment
        primary key,
    requiredHours varchar(191) default '' not null,
    constraint bid_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index customerId
    on Bid (customerId);

create table CustomerSale
(
    billNumber int default 0 not null,
    createdAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    customerId int not null,
    dueDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    id int auto_increment
        primary key,
    saleAmount int default 0 not null,
    saleDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    constraint customersale_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index customerId
    on CustomerSale (customerId);

create table Inventory
(
    aisle int default 0 not null,
    bin varchar(191) default '' not null,
    id int auto_increment
        primary key,
    name varchar(191) default '' not null,
    constraint `Inventory.bin`
        unique (bin)
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
    customerSale int null,
    deliveryCost int default 0 not null,
    id int auto_increment
        primary key,
    jobId int not null,
    orderDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    remainderDue int default 0 not null,
    totalCost int default 0 not null,
    totalCostDueDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    constraint customerorder_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade,
    constraint customerorder_ibfk_2
        foreign key (jobId) references Job (id)
            on update cascade on delete cascade,
    constraint customerorder_ibfk_3
        foreign key (customerSale) references CustomerSale (id)
            on update cascade on delete set null
)
    collate=utf8mb4_unicode_ci;

create index customerId
    on CustomerOrder (customerId);

create index customerSale
    on CustomerOrder (customerSale);

create index jobId
    on CustomerOrder (jobId);

create index customerId
    on Job (customerId);

create table Location
(
    address varchar(191) default '' not null,
    city varchar(191) default '' not null,
    id int auto_increment
        primary key,
    inventory int null,
    phone varchar(191) default '' not null,
    state varchar(191) default '' not null,
    zip int default 0 not null,
    constraint location_ibfk_1
        foreign key (inventory) references Inventory (id)
            on update cascade on delete set null
)
    collate=utf8mb4_unicode_ci;

create index inventory
    on Location (inventory);

create table MagicCode
(
    code varchar(191) not null
        primary key,
    updatedAt datetime(3) default '1970-01-01 00:00:00.000' not null
)
    collate=utf8mb4_unicode_ci;

create table Employee
(
    address varchar(191) default '' not null,
    city varchar(191) default '' not null,
    createdAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    email varchar(191) default '' not null,
    firstName varchar(191) default '' not null,
    id int auto_increment
        primary key,
    jwtUserSecret varchar(191) default '' not null,
    lastName varchar(191) default '' not null,
    locationId int not null,
    magicCode varchar(191) null,
    password varchar(191) default '' not null,
    phone varchar(191) default '' not null,
    role enum('MODERATOR', 'ADMIN') default 'MODERATOR' not null,
    state varchar(191) default '' not null,
    updatedAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    zip int default 0 not null,
    constraint `Employee.email`
        unique (email),
    constraint Employee_magicCode
        unique (magicCode),
    constraint employee_ibfk_1
        foreign key (magicCode) references MagicCode (code)
            on update cascade on delete set null,
    constraint employee_ibfk_2
        foreign key (locationId) references Location (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index locationId
    on Employee (locationId);

create table Product
(
    brand varchar(191) default '' not null,
    createdAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    description varchar(191) default '' not null,
    id int auto_increment
        primary key,
    inventory int null,
    listPrice int default 0 not null,
    modelNumber varchar(191) default '' not null,
    productCategory varchar(191) default '' not null,
    quantityOnHand int default 0 not null,
    serialNumber varchar(191) default '' not null,
    unitCost int default 0 not null,
    updatedAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    constraint product_ibfk_1
        foreign key (inventory) references Inventory (id)
            on update cascade on delete set null
)
    collate=utf8mb4_unicode_ci;

create table BidProduct
(
    bidId int not null,
    id int auto_increment
        primary key,
    productId int not null,
    saleAmount varchar(191) default '' not null,
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

create table CustomerOrders_Products
(
    customerSale int not null,
    extendedCost int default 0 not null,
    productId int not null,
    quantityPurchased int default 0 not null,
    primary key (productId, customerSale),
    constraint customerorders_products_ibfk_1
        foreign key (productId) references Product (id)
            on update cascade on delete cascade,
    constraint customerorders_products_ibfk_2
        foreign key (customerSale) references CustomerSale (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index customerSale
    on CustomerOrders_Products (customerSale);

create index inventory
    on Product (inventory);

create table Supplier
(
    address varchar(191) default '' not null,
    city varchar(191) default '' not null,
    createdAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    email varchar(191) default '' not null,
    id int auto_increment
        primary key,
    name varchar(191) default '' not null,
    phone varchar(191) default '' not null,
    state varchar(191) default '' not null,
    updatedAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    zip int default 0 not null,
    constraint `Supplier.email`
        unique (email)
)
    collate=utf8mb4_unicode_ci;

create table SalesOrder
(
    costEach int default 0 not null,
    dueDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    extendedCost int default 0 not null,
    id int auto_increment
        primary key,
    orderDate datetime(3) default '1970-01-01 00:00:00.000' not null,
    productId int not null,
    quantityPurchased int default 0 not null,
    supplierId int not null,
    constraint salesorder_ibfk_1
        foreign key (supplierId) references Supplier (id)
            on update cascade on delete cascade,
    constraint salesorder_ibfk_2
        foreign key (productId) references Product (id)
            on update cascade on delete cascade
)
    collate=utf8mb4_unicode_ci;

create index productId
    on SalesOrder (productId);

create index supplierId
    on SalesOrder (supplierId);

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

