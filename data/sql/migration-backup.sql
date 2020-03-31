create table Customer
(
    address       varchar(191) default ''                        not null,
    city          varchar(191) default ''                        not null,
    createdAt     datetime(3)  default '1970-01-01 00:00:00.000' not null,
    firstName     varchar(191) default ''                        not null,
    id            int auto_increment
        primary key,
    lastName      varchar(191) default ''                        not null,
    middleInitial varchar(191) default ''                        not null,
    state         varchar(191) default ''                        not null,
    updatedAt     datetime(3)  default '1970-01-01 00:00:00.000' not null,
    zip           int          default 0                         not null
)
    collate = utf8mb4_unicode_ci;

create table Bid
(
    bidAmount     decimal(65, 30) default 0.000000000000000000000000000000 not null,
    customerId    int                                                      not null,
    id            int auto_increment
        primary key,
    requiredHours decimal(65, 30) default 0.000000000000000000000000000000 not null,
    constraint bid_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index customerId
    on Bid (customerId);

create table CustomerSale
(
    billNumber int             default 0                                not null,
    createdAt  datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    customerId int                                                      not null,
    dueDate    datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    id         int auto_increment
        primary key,
    saleAmount decimal(65, 30) default 0.000000000000000000000000000000 not null,
    saleDate   datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    constraint customersale_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index customerId
    on CustomerSale (customerId);

create table EmployeeModel
(
    id             int auto_increment
        primary key,
    positionName   enum ('PRESIDENT_CEO', 'VP_CEO', 'STORE_MANAGER', 'OFFICE_MANAGER', 'SALES_DESIGN_MANAGER', 'SALES_DESIGN_ASSOCIATE', 'SCHEDULING', 'TECHNICIAN', 'DELIVERY', 'WAREHOUSE', 'INSTALLATIONS') default 'PRESIDENT_CEO'                  not null,
    roleCapability enum ('READ_WRITE', 'READ', 'WRITE', 'NONE')                                                                                                                                                default 'READ_WRITE'                     not null,
    salary         decimal(65, 30)                                                                                                                                                                             default 0.000000000000000000000000000000 not null
)
    collate = utf8mb4_unicode_ci;

create table Inventory
(
    aisle int          default 0  not null,
    bin   varchar(191) default '' not null,
    id    int auto_increment
        primary key,
    name  varchar(191) default '' not null,
    constraint `Inventory.bin`
        unique (bin)
)
    collate = utf8mb4_unicode_ci;

create table Job
(
    actualEnd      datetime(3)                                              null,
    actualHours    decimal(65, 30)                                          null,
    customerId     int                                                      not null,
    id             int auto_increment
        primary key,
    scheduledEnd   datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    scheduledHours decimal(65, 30) default 0.000000000000000000000000000000 not null,
    startDate      datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    constraint job_ibfk_1
        foreign key (customerId) references Customer (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create table CustomerOrder
(
    customerId       int                                                      not null,
    customerSale     int                                                      null,
    deliveryCost     decimal(65, 30) default 0.000000000000000000000000000000 not null,
    id               int auto_increment
        primary key,
    jobId            int                                                      not null,
    orderDate        datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    remainderDue     decimal(65, 30) default 0.000000000000000000000000000000 not null,
    totalCost        decimal(65, 30) default 0.000000000000000000000000000000 not null,
    totalCostDueDate datetime(3)     default '1970-01-01 00:00:00.000'        not null,
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
    collate = utf8mb4_unicode_ci;

create index customerId
    on CustomerOrder (customerId);

create index customerSale
    on CustomerOrder (customerSale);

create index jobId
    on CustomerOrder (jobId);

create table Fees
(
    charge        int                                                                                                                                                default 0        not null,
    customerOrder int                                                                                                                                                                 null,
    operationName enum ('DESIGN', 'INSTALLATION_CABINETS', 'RE_FACING_CABINETS', 'PLUMBING', 'ELECTRICAL', 'PAINTING_WALLPAPER', 'GENERAL_CONSTRUCTION', 'DELIVERY') default 'DESIGN' not null,
    constraint `Fees.operationName`
        unique (operationName),
    constraint fees_ibfk_1
        foreign key (customerOrder) references CustomerOrder (id)
            on update cascade on delete set null
)
    collate = utf8mb4_unicode_ci;

create index customerOrder
    on Fees (customerOrder);

create index customerId
    on Job (customerId);

create table Location
(
    address   varchar(191) default '' not null,
    city      varchar(191) default '' not null,
    id        int auto_increment
        primary key,
    inventory int                     null,
    phone     varchar(191) default '' not null,
    state     varchar(191) default '' not null,
    zip       int          default 0  not null,
    constraint location_ibfk_1
        foreign key (inventory) references Inventory (id)
            on update cascade on delete set null
)
    collate = utf8mb4_unicode_ci;

create index inventory
    on Location (inventory);

create table MagicCode
(
    code      varchar(191)                                  not null,
    updatedAt datetime(3) default '1970-01-01 00:00:00.000' not null,
    primary key (code)
)
    collate = utf8mb4_unicode_ci;

create table Employee
(
    address          varchar(191) default ''                        not null,
    city             varchar(191) default ''                        not null,
    createdAt        datetime(3)  default '1970-01-01 00:00:00.000' not null,
    email            varchar(191) default ''                        not null,
    employeePosition int                                            not null,
    firstName        varchar(191) default ''                        not null,
    id               int auto_increment
        primary key,
    jwtUserSecret    varchar(191) default ''                        not null,
    lastName         varchar(191) default ''                        not null,
    locationId       int                                            not null,
    magicCode        varchar(191)                                   null,
    password         varchar(191) default ''                        not null,
    phone            varchar(191) default ''                        not null,
    state            varchar(191) default ''                        not null,
    updatedAt        datetime(3)  default '1970-01-01 00:00:00.000' not null,
    zip              int          default 0                         not null,
    constraint `Employee.email`
        unique (email),
    constraint Employee_employeePosition
        unique (employeePosition),
    constraint Employee_magicCode
        unique (magicCode),
    constraint employee_ibfk_2
        foreign key (magicCode) references MagicCode (code)
            on update cascade on delete set null,
    constraint employee_ibfk_3
        foreign key (locationId) references Location (id)
            on update cascade on delete cascade,
    constraint employee_ibfk_4
        foreign key (employeePosition) references EmployeeModel (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index locationId
    on Employee (locationId);

create table Product
(
    brand           varchar(191)    default ''                               not null,
    createdAt       datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    description     varchar(191)    default ''                               not null,
    id              int auto_increment
        primary key,
    inventory       int                                                      null,
    listPrice       decimal(65, 30) default 0.000000000000000000000000000000 not null,
    modelNumber     varchar(191)    default ''                               not null,
    productCategory varchar(191)    default ''                               not null,
    quantityOnHand  int             default 0                                not null,
    serialNumber    varchar(191)    default ''                               not null,
    unitCost        decimal(65, 30) default 0.000000000000000000000000000000 not null,
    updatedAt       datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    constraint product_ibfk_1
        foreign key (inventory) references Inventory (id)
            on update cascade on delete set null
)
    collate = utf8mb4_unicode_ci;

create table BidProduct
(
    bidId      int                                                      not null,
    id         int auto_increment
        primary key,
    productId  int                                                      not null,
    saleAmount decimal(65, 30) default 0.000000000000000000000000000000 not null,
    saleDate   datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    constraint bidproduct_ibfk_1
        foreign key (productId) references Product (id)
            on update cascade on delete cascade,
    constraint bidproduct_ibfk_2
        foreign key (bidId) references Bid (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index bidId
    on BidProduct (bidId);

create index productId
    on BidProduct (productId);

create table CustomerOrderProduct
(
    customerSale      int                                                      not null,
    extendedCost      decimal(65, 30) default 0.000000000000000000000000000000 not null,
    productId         int                                                      not null,
    quantityPurchased int             default 0                                not null,
    primary key (productId, customerSale),
    constraint customerorderproduct_ibfk_1
        foreign key (productId) references Product (id)
            on update cascade on delete cascade,
    constraint customerorderproduct_ibfk_2
        foreign key (customerSale) references CustomerSale (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index customerSale
    on CustomerOrderProduct (customerSale);

create index inventory
    on Product (inventory);

create table Supplier
(
    address   varchar(191) default ''                        not null,
    city      varchar(191) default ''                        not null,
    createdAt datetime(3)  default '1970-01-01 00:00:00.000' not null,
    email     varchar(191) default ''                        not null,
    id        int auto_increment
        primary key,
    name      varchar(191) default ''                        not null,
    phone     varchar(191) default ''                        not null,
    state     varchar(191) default ''                        not null,
    updatedAt datetime(3)  default '1970-01-01 00:00:00.000' not null,
    zip       int          default 0                         not null,
    constraint `Supplier.email`
        unique (email)
)
    collate = utf8mb4_unicode_ci;

create table SalesOrder
(
    costEach          decimal(65, 30) default 0.000000000000000000000000000000 not null,
    dueDate           datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    extendedCost      decimal(65, 30) default 0.000000000000000000000000000000 not null,
    id                int auto_increment
        primary key,
    orderDate         datetime(3)     default '1970-01-01 00:00:00.000'        not null,
    productId         int                                                      not null,
    quantityPurchased int             default 0                                not null,
    supplierId        int                                                      not null,
    constraint salesorder_ibfk_1
        foreign key (supplierId) references Supplier (id)
            on update cascade on delete cascade,
    constraint salesorder_ibfk_2
        foreign key (productId) references Product (id)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index productId
    on SalesOrder (productId);

create index supplierId
    on SalesOrder (supplierId);
