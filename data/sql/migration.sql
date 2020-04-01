create schema hds collate utf8mb4_0900_ai_ci;

create table Bid
(
	bidAmount decimal(65,30) not null,
	id int auto_increment
		primary key,
	requiredHours decimal(65,30) not null
)
collate=utf8mb4_unicode_ci;

create table BidProduct
(
	id int auto_increment
		primary key,
	saleAmount decimal(65,30) not null,
	saleDate datetime default CURRENT_TIMESTAMP not null
)
collate=utf8mb4_unicode_ci;

create table Customer
(
	address varchar(191) not null,
	city varchar(191) not null,
	createdAt datetime default CURRENT_TIMESTAMP not null,
	firstName varchar(191) not null,
	id int auto_increment
		primary key,
	lastName varchar(191) not null,
	middleInitial varchar(191) not null,
	state varchar(191) not null,
	updatedAt datetime(3) not null,
	zip int not null
)
collate=utf8mb4_unicode_ci;

create table CustomerOrder
(
	deliveryCost decimal(65,30) not null,
	id int auto_increment
		primary key,
	orderDate datetime default CURRENT_TIMESTAMP not null,
	remainderDue decimal(65,30) not null,
	totalCost decimal(65,30) not null,
	totalCostDueDate datetime(3) not null
)
collate=utf8mb4_unicode_ci;

create table CustomerSale
(
	billNumber int not null,
	createdAt datetime default CURRENT_TIMESTAMP not null,
	dueDate datetime(3) not null,
	id int auto_increment
		primary key,
	saleAmount decimal(65,30) not null,
	saleDate datetime(3) not null
)
collate=utf8mb4_unicode_ci;

create table CustomerOrderProduct
(
	customerSaleId int not null,
	extendedCost decimal(65,30) not null,
	id int auto_increment
		primary key,
	quantityPurchased int not null,
	constraint customerorderproduct_ibfk_1
		foreign key (customerSaleId) references CustomerSale (id)
			on update cascade on delete cascade
)
collate=utf8mb4_unicode_ci;

create index customerSaleId
	on CustomerOrderProduct (customerSaleId);

create table Inventory
(
	aisle int not null,
	bin varchar(191) not null,
	id int auto_increment
		primary key,
	name varchar(191) not null,
	constraint `Inventory.bin`
		unique (bin)
)
collate=utf8mb4_unicode_ci;

create table Job
(
	actualEnd datetime(3) null,
	actualHours decimal(65,30) null,
	customerOrderId int not null,
	id int auto_increment
		primary key,
	scheduledEnd datetime(3) not null,
	scheduledHours decimal(65,30) not null,
	startDate datetime default CURRENT_TIMESTAMP not null,
	constraint job_ibfk_1
		foreign key (customerOrderId) references CustomerOrder (id)
			on update cascade on delete cascade
)
collate=utf8mb4_unicode_ci;

create table Fees
(
	chargePerHour decimal(65,30) not null,
	hoursCharged decimal(65,30) not null,
	id int auto_increment
		primary key,
	jobId int not null,
	operationName enum('DESIGN', 'INSTALLATION_CABINETS', 'RE_FACING_CABINETS', 'PLUMBING', 'ELECTRICAL', 'PAINTING_WALLPAPER', 'GENERAL_CONSTRUCTION', 'DELIVERY') not null,
	constraint Fees_jobId
		unique (jobId),
	constraint fees_ibfk_1
		foreign key (jobId) references Job (id)
			on update cascade on delete cascade
)
collate=utf8mb4_unicode_ci;

create index customerOrderId
	on Job (customerOrderId);

create table Location
(
	address varchar(191) not null,
	city varchar(191) not null,
	id int auto_increment
		primary key,
	inventoryId int not null,
	phone varchar(191) not null,
	state varchar(191) not null,
	zip int not null,
	constraint location_ibfk_1
		foreign key (inventoryId) references Inventory (id)
			on update cascade on delete cascade
)
collate=utf8mb4_unicode_ci;

create table Employee
(
	address varchar(191) not null,
	city varchar(191) not null,
	createdAt datetime default CURRENT_TIMESTAMP not null,
	email varchar(191) not null,
	firstName varchar(191) not null,
	id int auto_increment
		primary key,
	jwtUserSecret varchar(191) not null,
	lastName varchar(191) not null,
	locationId int not null,
	password varchar(191) not null,
	phone varchar(191) not null,
	positionName enum('PRESIDENT_CEO', 'VP_CEO', 'STORE_MANAGER', 'OFFICE_MANAGER', 'SALES_DESIGN_MANAGER', 'SALES_DESIGN_ASSOCIATE', 'SCHEDULING', 'TECHNICIAN', 'DELIVERY', 'WAREHOUSE', 'INSTALLATIONS', 'INSTALLATIONS_DELIVERIES', 'INSTALLATIONS_DELIVERIES_SALES', 'WAREHOUSE_INSTALLATIONS_DELIVERIES', 'WAREHOUSE_DELIVERIES') not null,
	roleCapability enum('READ_WRITE', 'READ', 'NONE') not null,
	salary decimal(65,30) not null,
	state varchar(191) not null,
	updatedAt datetime(3) not null,
	zip int not null,
	constraint `Employee.email`
		unique (email),
	constraint employee_ibfk_1
		foreign key (locationId) references Location (id)
			on update cascade on delete cascade
)
collate=utf8mb4_unicode_ci;

create index locationId
	on Employee (locationId);

create index inventoryId
	on Location (inventoryId);

create table MagicCode
(
	code varchar(191) not null
		primary key,
	updatedAt datetime(3) not null
)
collate=utf8mb4_unicode_ci;

create table Product
(
	brand varchar(191) not null,
	createdAt datetime default CURRENT_TIMESTAMP not null,
	description varchar(191) not null,
	id int auto_increment
		primary key,
	listPrice decimal(65,30) not null,
	modelNumber varchar(191) not null,
	productCategory varchar(191) not null,
	quantityOnHand int not null,
	serialNumber varchar(191) not null,
	unitCost decimal(65,30) not null,
	updatedAt datetime(3) not null
)
collate=utf8mb4_unicode_ci;

create table SalesOrder
(
	costEach decimal(65,30) not null,
	dueDate datetime(3) not null,
	extendedCost decimal(65,30) not null,
	id int auto_increment
		primary key,
	orderDate datetime default CURRENT_TIMESTAMP not null,
	productId int not null,
	quantityPurchased int not null,
	constraint salesorder_ibfk_1
		foreign key (productId) references Product (id)
			on update cascade on delete cascade
)
collate=utf8mb4_unicode_ci;

create index productId
	on SalesOrder (productId);

create table Supplier
(
	address varchar(191) not null,
	city varchar(191) not null,
	createdAt datetime default CURRENT_TIMESTAMP not null,
	email varchar(191) not null,
	id int auto_increment
		primary key,
	name varchar(191) not null,
	phone varchar(191) not null,
	state varchar(191) not null,
	updatedAt datetime(3) not null,
	zip int not null,
	constraint `Supplier.email`
		unique (email)
)
collate=utf8mb4_unicode_ci;

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

