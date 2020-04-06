## How to Initialize

---

- generate keys for encryption as stated below for the seed data and prisma authentication
- make sure .env has correct mysql_url for prisma in the prisma folder.
- also make sure .env in root dir is configured properly, see .env.example
- create user hds_user and database hds.
  - `create database hds;`
  - `create user hds_user@localhost identified by 'peaceBWithYou123!';`
  - `grant all privileges on hds.* to hds_user@localhost;`
- finally run `npm run prisma2:init` to have prisma generate database schema
- to seed the test data
  - `run npm run seed`

# TODO

---

## General cool stuff

~~1. add toast notification system to root~~
1. ~~drawer like zapier~~
2. stop wasting time with all this extra crap.
## data fetching

1. useSWR for REAL TIME DATA...

## auth service

1.  API docs.

---

## admin console

1. ~~Forms: login / register / reset password~~

2. ~~setting up all the tables~~

3. POS

# Keys for encryption

1. Generate:
   - `cd keys`
   - `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`
   - `openssl rsa -in key.pem -pubout -out pubkey.pem`
   - `chmod 400 key.pem cert.pem pubkey.pem`
