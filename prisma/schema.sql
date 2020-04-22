create table if not exists Customer
(
    address       varchar(191)                       not null,
    city          varchar(191)                       not null,
    createdAt     datetime default CURRENT_TIMESTAMP not null,
    firstName     varchar(191)                       not null,
    idCustomer    int auto_increment
        primary key,
    lastName      varchar(191)                       not null,
    middleInitial varchar(191)                       null,
    state         varchar(191)                       not null,
    updatedAt     datetime(3)                        not null,
    zipCode       int                                not null
)
    collate = utf8mb4_unicode_ci;

create table if not exists Job
(
    customerId     int             not null,
    dateCompleted  datetime(3)     null,
    dateScheduled  datetime(3)     not null,
    details        varchar(191)    null,
    hoursActual    decimal(65, 30) null,
    hoursScheduled decimal(65, 30) not null,
    idJob          int auto_increment
        primary key,
    constraint job_ibfk_1
        foreign key (customerId) references Customer (idCustomer)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index customerId_idx
    on Job (customerId);

create index jobs_ibfk_1
    on Job (customerId);

create table if not exists Operations
(
    chargePerHour decimal(65, 30) not null,
    customerId    int             not null,
    details       varchar(191)    null,
    hoursCharged  decimal(65, 30) not null,
    idOperations  int auto_increment
        primary key,
    jobId         int             not null,
    operationName varchar(191)    not null,
    constraint operations_ibfk_1
        foreign key (jobId) references Job (idJob)
            on update cascade on delete cascade,
    constraint operations_ibfk_2
        foreign key (customerId) references Customer (idCustomer)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index customerId
    on Operations (customerId);

create index jobId_idx
    on Operations (jobId);

create table if not exists Product
(
    brand           varchar(191)                       not null,
    createdAt       datetime default CURRENT_TIMESTAMP not null,
    deliveryPrice   decimal(65, 30)                    not null,
    description     varchar(191)                       null,
    idProduct       int auto_increment
        primary key,
    listPrice       decimal(65, 30)                    not null,
    modelNumber     varchar(191)                       not null,
    productCategory varchar(191)                       not null,
    salePrice       decimal(65, 30)                    null,
    serialNumber    varchar(191)                       not null,
    unitPrice       decimal(65, 30)                    not null,
    updatedAt       datetime(3)                        not null,
    constraint `Product.serialNumber`
        unique (serialNumber)
)
    collate = utf8mb4_unicode_ci;

create table if not exists StoreLocations
(
    address          varchar(191) not null,
    city             varchar(191) not null,
    idStoreLocations int auto_increment
        primary key,
    phone            varchar(191) not null,
    state            varchar(191) not null,
    zipCode          int          not null
)
    collate = utf8mb4_unicode_ci;

create table if not exists Employee
(
    address           varchar(191)                                                                                                                                                                                                                                                                                                                                                                                not null,
    city              varchar(191)                                                                                                                                                                                                                                                                                                                                                                                not null,
    createdAt         datetime                                                                                                                                                                                                                                                                                                                                                          default CURRENT_TIMESTAMP not null,
    email             varchar(191)                                                                                                                                                                                                                                                                                                                                                                                not null,
    employeeId        int auto_increment
        primary key,
    firstName         varchar(191)                                                                                                                                                                                                                                                                                                                                                                                not null,
    lastName          varchar(191)                                                                                                                                                                                                                                                                                                                                                                                not null,
    password          varchar(191)                                                                                                                                                                                                                                                                                                                                                                                not null,
    positionName      enum ('PRESIDENT_CEO', 'VP_CEO', 'STORE_MANAGER', 'OFFICE_MANAGER', 'SALES_DESIGN_MANAGER', 'SALES_DESIGN_ASSOCIATE', 'SCHEDULING', 'TECHNICIAN', 'DELIVERY', 'WAREHOUSE', 'INSTALLATIONS', 'INSTALLATIONS_DELIVERIES', 'INSTALLATIONS_DELIVERIES_SALES', 'WAREHOUSE_INSTALLATIONS_DELIVERIES', 'WAREHOUSE_DELIVERIES', 'INFORMATION_TECHNOLOGY', 'NOT_ASSIGNED') default 'NOT_ASSIGNED'    not null,
    roleCapability    enum ('READ_WRITE', 'READ', 'NONE')                                                                                                                                                                                                                                                                                                                               default 'NONE'            not null,
    salary            decimal(65, 30)                                                                                                                                                                                                                                                                                                                                                                             not null,
    state             varchar(191)                                                                                                                                                                                                                                                                                                                                                                                not null,
    storeLocationId   int                                                                                                                                                                                                                                                                                                                                                                                         not null,
    updatedAt         datetime(3)                                                                                                                                                                                                                                                                                                                                                                                 not null,
    userSigningSecret varchar(191)                                                                                                                                                                                                                                                                                                                                                                                not null,
    zipCode           int                                                                                                                                                                                                                                                                                                                                                                                         not null,
    constraint `Employee.email`
        unique (email),
    constraint employee_ibfk_1
        foreign key (storeLocationId) references StoreLocations (idStoreLocations)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create table if not exists CustomerOrder
(
    actualDeliveryDate   datetime(3)                          null,
    customerId           int                                  not null,
    dateCancelled        datetime(3)                          null,
    employeeId           int                                  not null,
    expectedDeliveryDate datetime(3)                          not null,
    idCustomerOrder      int auto_increment
        primary key,
    isCanceled           tinyint(1) default 0                 not null,
    orderDate            datetime   default CURRENT_TIMESTAMP not null,
    orderTotal           decimal(65, 30)                      not null,
    storeLocationId      int                                  not null,
    constraint customerorder_ibfk_1
        foreign key (customerId) references Customer (idCustomer)
            on update cascade on delete cascade,
    constraint customerorder_ibfk_2
        foreign key (storeLocationId) references StoreLocations (idStoreLocations)
            on update cascade on delete cascade,
    constraint customerorder_ibfk_3
        foreign key (employeeId) references Employee (employeeId)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index customerId_idx
    on CustomerOrder (customerId);

create index employeeId
    on CustomerOrder (employeeId);

create index storeLocationId_idx
    on CustomerOrder (storeLocationId);

create table if not exists CustomerOrderProducts
(
    customerOrderId         int             not null,
    idCustomerOrderProducts int auto_increment
        primary key,
    perUnitCost             decimal(65, 30) not null,
    productId               int             not null,
    quantity                int             not null,
    constraint customerorderproducts_ibfk_1
        foreign key (customerOrderId) references CustomerOrder (idCustomerOrder)
            on update cascade on delete cascade,
    constraint customerorderproducts_ibfk_2
        foreign key (productId) references Product (idProduct)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index customerOrderId_idx
    on CustomerOrderProducts (customerOrderId);

create index productId_idx
    on CustomerOrderProducts (productId);

create index storeLocationId_idx
    on Employee (storeLocationId);

create table if not exists Inventory
(
    aisle          int          not null,
    bin            varchar(191) not null,
    idInventory    int auto_increment
        primary key,
    productId      int          not null,
    quantityOnHand int          not null,
    storeLocation  int          not null,
    constraint `Inventory.bin`
        unique (bin),
    constraint `Inventory.productId_storeLocation`
        unique (productId, storeLocation),
    constraint inventory_ibfk_1
        foreign key (productId) references Product (idProduct)
            on update cascade on delete cascade,
    constraint inventory_ibfk_2
        foreign key (storeLocation) references StoreLocations (idStoreLocations)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index productId_idx
    on Inventory (productId);

create index storeLocationId_idx
    on Inventory (storeLocation);

create table if not exists Invoice
(
    createdAt       datetime        default CURRENT_TIMESTAMP                not null,
    customerId      int                                                      not null,
    customerOrderId int                                                      not null,
    dueDate         datetime(3)                                              not null,
    employeeId      int                                                      not null,
    idInvoice       int auto_increment
        primary key,
    invoiceNumber   varchar(191)                                             not null,
    invoiceTotal    decimal(65, 30)                                          not null,
    jobFeeTotal     decimal(65, 30) default 0.000000000000000000000000000000 not null,
    jobId           int                                                      not null,
    orderTotal      decimal(65, 30)                                          not null,
    paidDate        datetime(3)                                              null,
    storeLocationId int                                                      not null,
    updatedAt       datetime(3)                                              not null,
    constraint `Invoice.invoiceNumber`
        unique (invoiceNumber),
    constraint Invoice_customerOrderId
        unique (customerOrderId),
    constraint Invoice_jobId
        unique (jobId),
    constraint invoice_ibfk_1
        foreign key (customerId) references Customer (idCustomer)
            on update cascade on delete cascade,
    constraint invoice_ibfk_2
        foreign key (customerOrderId) references CustomerOrder (idCustomerOrder)
            on update cascade on delete cascade,
    constraint invoice_ibfk_3
        foreign key (employeeId) references Employee (employeeId)
            on update cascade on delete cascade,
    constraint invoice_ibfk_4
        foreign key (jobId) references Job (idJob)
            on update cascade on delete cascade,
    constraint invoice_ibfk_5
        foreign key (storeLocationId) references StoreLocations (idStoreLocations)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index customerId_idx
    on Invoice (customerId);

create index customerOrderId_idx
    on Invoice (customerOrderId);

create index employeeId_idx
    on Invoice (employeeId);

create index invoice_ibfk_5_idx
    on Invoice (jobId);

create index storeLocationId_idx
    on Invoice (storeLocationId);

create table if not exists InvoiceLineItems
(
    dueDate           datetime default CURRENT_TIMESTAMP not null,
    idinvoiceLineItem int auto_increment
        primary key,
    invoiceId         int                                not null,
    lineItemTotal     decimal(65, 30)                    not null,
    constraint invoicelineitems_ibfk_1
        foreign key (invoiceId) references Invoice (idInvoice)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index invoiceId_idx
    on InvoiceLineItems (invoiceId);

create table if not exists MagicCode
(
    code      varchar(191) not null,
    updatedAt datetime(3)  not null,
    userId    int          not null,
    primary key (code),
    constraint `MagicCode.userId`
        unique (userId),
    constraint magiccode_ibfk_1
        foreign key (userId) references Employee (employeeId)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create table if not exists Suppliers
(
    city       varchar(191)                       not null,
    createdAt  datetime default CURRENT_TIMESTAMP not null,
    email      varchar(191)                       not null,
    idSupplier int auto_increment
        primary key,
    name       varchar(191)                       not null,
    phone      varchar(191)                       not null,
    state      varchar(191)                       not null,
    updatedAt  datetime(3)                        not null,
    zip        int                                not null,
    constraint `Suppliers.email`
        unique (email)
)
    collate = utf8mb4_unicode_ci;

create table if not exists SalesOrders
(
    deliverDate     datetime(3)                        not null,
    employeeId      int                                not null,
    idSalesOrders   int auto_increment
        primary key,
    orderDate       datetime default CURRENT_TIMESTAMP not null,
    orderPrice      decimal(65, 30)                    not null,
    storeLocationId int                                not null,
    supplierId      int                                not null,
    constraint salesorders_ibfk_1
        foreign key (employeeId) references Employee (employeeId)
            on update cascade on delete cascade,
    constraint salesorders_ibfk_2
        foreign key (storeLocationId) references StoreLocations (idStoreLocations)
            on update cascade on delete cascade,
    constraint salesorders_ibfk_3
        foreign key (supplierId) references Suppliers (idSupplier)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create table if not exists SalesOrderItem
(
    idSalesOrderItem  int auto_increment
        primary key,
    productId         int             not null,
    quantityPurchased int             not null,
    salesOrderId      int             not null,
    unitPrice         decimal(65, 30) not null,
    constraint salesorderitem_ibfk_1
        foreign key (productId) references Product (idProduct)
            on update cascade on delete cascade,
    constraint salesorderitem_ibfk_2
        foreign key (salesOrderId) references SalesOrders (idSalesOrders)
            on update cascade on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index productId_idx
    on SalesOrderItem (productId);

create index salesOrderId_idx
    on SalesOrderItem (salesOrderId);

create index idStoreLocationIdx
    on SalesOrders (storeLocationId);

create index idSupplierIdx
    on SalesOrders (supplierId);

create index id_employeeIdx
    on SalesOrders (employeeId);

create table if not exists _Migration
(
    revision           int auto_increment
        primary key,
    name               text        not null,
    datamodel          longtext    not null,
    status             text        not null,
    applied            int         not null,
    rolled_back        int         not null,
    datamodel_steps    longtext    not null,
    database_migration longtext    not null,
    errors             longtext    not null,
    started_at         datetime(3) not null,
    finished_at        datetime(3) null
);

