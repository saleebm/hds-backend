# Migration `20200327065009-use-string-bc-fractions`

This migration has been generated by Mina Saleeb at 3/27/2020, 6:50:09 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `hds`.`Supplier` (
    `address` varchar(191) NOT NULL DEFAULT '' ,
    `city` varchar(191) NOT NULL DEFAULT '' ,
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `email` varchar(191) NOT NULL DEFAULT '' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `name` varchar(191) NOT NULL DEFAULT '' ,
    `phone` varchar(191) NOT NULL DEFAULT '' ,
    `state` varchar(191) NOT NULL DEFAULT '' ,
    `updatedAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `zip` int NOT NULL DEFAULT 0 ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`Product` (
    `brand` varchar(191) NOT NULL DEFAULT '' ,
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `customerOrder` int  ,
    `customerSale` int  ,
    `description` varchar(191) NOT NULL DEFAULT '' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `inventory` int  ,
    `listPrice` varchar(191) NOT NULL DEFAULT '' ,
    `modelNumber` varchar(191) NOT NULL DEFAULT '' ,
    `productCategory` varchar(191) NOT NULL DEFAULT '' ,
    `productOrder` int  ,
    `serialNumber` varchar(191) NOT NULL DEFAULT '' ,
    `unitCost` varchar(191) NOT NULL DEFAULT '' ,
    `updatedAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`ProductOrder` (
    `costEach` varchar(191) NOT NULL DEFAULT '' ,
    `dueDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `extendedCost` varchar(191) NOT NULL DEFAULT '' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `orderDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `quantityPurchased` int NOT NULL DEFAULT 0 ,
    `supplierId` int NOT NULL ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`Location` (
    `address` varchar(191) NOT NULL DEFAULT '' ,
    `city` varchar(191) NOT NULL DEFAULT '' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `inventory` int  ,
    `phone` varchar(191) NOT NULL DEFAULT '' ,
    `state` varchar(191) NOT NULL DEFAULT '' ,
    `zip` int NOT NULL DEFAULT 0 ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`MagicCode` (
    `code` varchar(191) NOT NULL  ,
    `updatedAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    PRIMARY KEY (`code`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`Employee` (
    `address` varchar(191) NOT NULL DEFAULT '' ,
    `city` varchar(191) NOT NULL DEFAULT '' ,
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `email` varchar(191) NOT NULL DEFAULT '' ,
    `firstName` varchar(191) NOT NULL DEFAULT '' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `jwtUserSecret` varchar(191) NOT NULL DEFAULT '' ,
    `lastName` varchar(191) NOT NULL DEFAULT '' ,
    `locationId` int NOT NULL ,
    `magicCode` varchar(191)  ,
    `password` varchar(191) NOT NULL DEFAULT '' ,
    `phone` varchar(191) NOT NULL DEFAULT '' ,
    `role` ENUM('MODERATOR', 'ADMIN') NOT NULL DEFAULT 'MODERATOR' ,
    `state` varchar(191) NOT NULL DEFAULT '' ,
    `updatedAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `zip` int NOT NULL DEFAULT 0 ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`Inventory` (
    `aisle` int NOT NULL DEFAULT 0 ,
    `bin` varchar(191) NOT NULL DEFAULT '' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`Customer` (
    `address` varchar(191) NOT NULL DEFAULT '' ,
    `city` varchar(191) NOT NULL DEFAULT '' ,
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `firstName` varchar(191) NOT NULL DEFAULT '' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `lastName` varchar(191) NOT NULL DEFAULT '' ,
    `middleInitial` varchar(191) NOT NULL DEFAULT '' ,
    `state` varchar(191) NOT NULL DEFAULT '' ,
    `updatedAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `zip` int NOT NULL DEFAULT 0 ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`Job` (
    `actualEnd` datetime(3)   ,
    `actualHours` varchar(191)   ,
    `customerId` int NOT NULL ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `scheduledEnd` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `scheduledHours` varchar(191) NOT NULL DEFAULT '' ,
    `startDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`CustomerOrder` (
    `customerId` int NOT NULL ,
    `customerSale` int  ,
    `dueDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `extendedCost` varchar(191) NOT NULL DEFAULT '' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `jobId` int NOT NULL ,
    `orderDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `quantityPurchased` int NOT NULL DEFAULT 0 ,
    `requestedDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `unitCost` varchar(191) NOT NULL DEFAULT '' ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`CustomerSale` (
    `billNumber` int NOT NULL DEFAULT 0 ,
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `customerId` int NOT NULL ,
    `dueDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `saleAmount` varchar(191) NOT NULL DEFAULT '' ,
    `saleDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`Bid` (
    `bidAmount` varchar(191) NOT NULL DEFAULT '' ,
    `customerId` int NOT NULL ,
    `id` int NOT NULL  AUTO_INCREMENT,
    `requiredHours` varchar(191) NOT NULL DEFAULT '' ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `hds`.`BidProduct` (
    `bidId` int NOT NULL ,
    `id` varchar(191) NOT NULL  ,
    `productId` int NOT NULL ,
    `saleAmount` varchar(191) NOT NULL DEFAULT '' ,
    `saleDate` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE UNIQUE INDEX `Supplier.email` ON `hds`.`Supplier`(`email`)

CREATE UNIQUE INDEX `Employee.email` ON `hds`.`Employee`(`email`)

CREATE UNIQUE INDEX `Employee_magicCode` ON `hds`.`Employee`(`magicCode`)

ALTER TABLE `hds`.`Product` ADD FOREIGN KEY (`productOrder`) REFERENCES `hds`.`ProductOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `hds`.`Product` ADD FOREIGN KEY (`inventory`) REFERENCES `hds`.`Inventory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `hds`.`Product` ADD FOREIGN KEY (`customerOrder`) REFERENCES `hds`.`CustomerOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `hds`.`Product` ADD FOREIGN KEY (`customerSale`) REFERENCES `hds`.`CustomerSale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `hds`.`ProductOrder` ADD FOREIGN KEY (`supplierId`) REFERENCES `hds`.`Supplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `hds`.`Location` ADD FOREIGN KEY (`inventory`) REFERENCES `hds`.`Inventory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `hds`.`Employee` ADD FOREIGN KEY (`locationId`) REFERENCES `hds`.`Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `hds`.`Employee` ADD FOREIGN KEY (`magicCode`) REFERENCES `hds`.`MagicCode`(`code`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `hds`.`Job` ADD FOREIGN KEY (`customerId`) REFERENCES `hds`.`Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `hds`.`CustomerOrder` ADD FOREIGN KEY (`customerId`) REFERENCES `hds`.`Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `hds`.`CustomerOrder` ADD FOREIGN KEY (`jobId`) REFERENCES `hds`.`Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `hds`.`CustomerOrder` ADD FOREIGN KEY (`customerSale`) REFERENCES `hds`.`CustomerSale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `hds`.`CustomerSale` ADD FOREIGN KEY (`customerId`) REFERENCES `hds`.`Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `hds`.`Bid` ADD FOREIGN KEY (`customerId`) REFERENCES `hds`.`Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `hds`.`BidProduct` ADD FOREIGN KEY (`productId`) REFERENCES `hds`.`Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `hds`.`BidProduct` ADD FOREIGN KEY (`bidId`) REFERENCES `hds`.`Bid`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200327054348-init..20200327065009-use-string-bc-fractions
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource mysql {
   provider = "mysql"
-  url = "***"
+  url      = env("MYSQL_URL")
 }
 generator client {
   provider      = "prisma-client-js"
@@ -29,10 +29,10 @@
   id              Int      @id @default(autoincrement())
   modelNumber     String
   productCategory String
   description     String
-  unitCost        Int
-  listPrice       Int
+  unitCost        String
+  listPrice       String
   serialNumber    String
   brand           String
   createdAt       DateTime @default(now())
   updatedAt       DateTime @updatedAt
@@ -44,10 +44,10 @@
   id                Int       @id @default(autoincrement())
   productId         Product[]
   supplierId        Supplier
   quantityPurchased Int
-  costEach          Int
-  extendedCost      Int
+  costEach          String
+  extendedCost      String
   dueDate           DateTime
   orderDate         DateTime  @default(now())
 }
@@ -110,10 +110,10 @@
   id             Int       @id @default(autoincrement())
   customerId     Customer
   startDate      DateTime  @default(now())
   scheduledEnd   DateTime
-  scheduledHours Int
-  actualHours    Int?
+  scheduledHours String
+  actualHours    String?
   actualEnd      DateTime?
 }
 // the single order for a customer
@@ -125,38 +125,38 @@
   productId         Product[]
   orderDate         DateTime  @default(now())
   requestedDate     DateTime
   quantityPurchased Int
-  unitCost          Int
-  extendedCost      Int
+  unitCost          String
+  extendedCost      String
   dueDate           DateTime
 }
-// the bill send to the customer monthly 
+// the bill send to the customer monthly
 // sales records, may have multiple customer orders
-// dueDate defaults to 15th of coming month 
+// dueDate defaults to 15th of coming month
 model CustomerSale {
   id              Int             @id @default(autoincrement())
   billNumber      Int
   customerId      Customer
   customerOrderId CustomerOrder[]
   productId       Product[]
   saleDate        DateTime        @default(now())
-  saleAmount      Int
+  saleAmount      String
   createdAt       DateTime        @default(now())
   dueDate         DateTime
 }
 model Bid {
   id            Int      @id @default(autoincrement())
   customerId    Customer
-  requiredHours Int
-  bidAmount     Int
+  requiredHours String
+  bidAmount     String
 }
 model BidProduct {
   id         String   @id @default(uuid())
   bidId      Bid
   productId  Product
   saleDate   DateTime @default(now())
-  saleAmount Int
-}
+  saleAmount String
+}
```

