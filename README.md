## How to Initialize

---

- generate keys for encryption as stated below for the seed data and prisma authentication
  - `cd keys`
  - `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`
  - `openssl rsa -in key.pem -pubout -out pubkey.pem`
  - `chmod 400 key.pem cert.pem pubkey.pem`
- make sure .env has correct mysql_url for prisma in the prisma folder.
- also make sure .env in root dir is configured properly, see [.env.example](./.env.example)
- create user hds_user and database hds.
  - `create database hds;`
  - `create user hds_user@localhost identified by 'peaceBWithYou123!';`
  - `grant all privileges on hds.* to hds_user@localhost;`
- finally run `npm run prisma2:init` to have prisma generate database schema
- to seed the test data
  - `run npm run seed`

# TODO

---

## admin console

1. ~~Forms: login / register / reset password~~

2. ~~setting up all the tables~~

3. POS
   - ~~finish customer order products display.~~
   - ~~seal the deal with redux action, i.e. put customer order in db async~~
     1. ~~will have to deduct quantity picked from each CustomerOrderProduct off the Product's inventory location quantity~~
   - show the customer orders as invoices
     1. create base invoice on server side if not created already
     2. line items - bill to pay, deducts amount from invoice total as added.

## Unit tests

1. just get started. no excuses dude.

## General refactoring

1. It would be wise to refactor these aspects of this application before considering it ready for production:
   - Redux store states do not accommodate for transient states.
     1. for example, customer order state should handle the states of the order, i.e. attempt add product, add product success, add product fail.
     2. I wonder if it would make sense to submit the order partially in steps to the server concurrently, and handle the canceled order by time out or allow the store location to resume previous orders.
   - Refine data fetching methods, ie remove axios dependency and stick to fetch.
   - Reduce redundant instantiations of prisma client from the api routes and server side requests into single utility
   - API routes checking for auth redundancy as well as verifying request params / method

2. Database structure + documentation
   - a lot of crap in the database makes no sense without a documentation of the underlying structure and planning that went into it, i.e. "Jobs" - "Invoice" relationship
   - it would help to at least comment the info into the schema file for prisma
   
3. I did absolutely zero seo, not to mention even the basics like page title and unique meta.