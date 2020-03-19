# How to Initialize

1. make sure .env has correct mysql_url for prisma2 in the prisma folder.
2. create user hds_user and database hds.
3. `grant all privileges on hds.* to hds_user@localhost`
4. `npm run prisma2:init`

# TODO

1.  API docs.
2.  Employee authentication

    1.  DONE <details>
        - fix seed so that I can actually have a password and matches
          </details>
    2.  set up utils for token generation module
    3.  set up oauth endpoint and integrate strategy with secrets.
    4.  ```js
        const postmanTests = () => Promise.resolve(this.stepThree)
        ```
    5.  ```js
        postmanTests.res.success
          ? 'set up login dashboard'
          : 'repeat steps 2 - 4'
        ```
    6.  stop trying so hard!

3.  Check if front facing users need auth (ie customer entity)

# Keys for encryption

1. Generate:
   - `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`
   - `openssl rsa -in key.pem -pubout -out pubkey.pem`
