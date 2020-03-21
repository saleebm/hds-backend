## How to Initialize

---

- generate keys for encryption as [stated below](keys-for-encryption)
- make sure .env has correct mysql_url for prisma2 in the prisma folder.
- create user hds_user and database hds.
- `grant all privileges on hds.* to hds_user@localhost`
- `npm run prisma2:init`
- to create a test user with a script, run seed:build and seed:run

### TODO

---

1.  API docs.
2.  Employee authentication

    1.  ~~fix seed so that I can actually have a password and matches~~
    2.  set up utils for token generation module
    3.  set up oauth endpoint and integrate strategy with secrets.
    4.  ```js
        const postmanTests = () => Promise.resolve(this.stepThree)
        return postmanTests.res.success
          ? 'set up login dashboard'
          : 'repeat steps 2 - 4'
        ```

3.  Check if front facing users need auth (ie customer entity)
4.  HOC for auth checking in api
5.  Config for auth codes and responses

# Keys for encryption

1. Generate:
   - `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`
   - `openssl rsa -in key.pem -pubout -out pubkey.pem`
   - `chmod 400 key.pem cert.pem pubkey.pem`
