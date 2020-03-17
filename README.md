# Initialize

1. make sure .env has correct mysql_url for prisma2 in the prisma folder.
2. create user hds_user and database hds.
3. `grant all privileges on hds.\* to hds_user@localhost`.
4. `npm run prisma2:init`.
