# Freepass

The idea behind Freepass is to create a free and secure password manager. Free is probably impossible, but the idea is to be cheaper than the $38/year I spend on 1pass (which is admittedly, still very reasonable). If my bill for Freepass is < $38/year, then mission accomplished. If not, well, at least I made a cool project 😎.

## Getting Started (Local Development)

First, make sure [NodeJS](https://nodejs.org/en) is installed on your local machine (the LTS version). Now, install all Node Dependencies by running:

```shell
npm install
```

Then, copy [.env.example](.env.example) to [.env](.env):

```shell
cp .env.example .env
```

You will need a local MySQL database setup. You can download MySQL Community Edition [here](https://dev.mysql.com/downloads/mysql/).

You can then set the connection url in [.env](.env) to the value of your local DB's connection url (env var is `DATABASE_URL`). You can keep `NEXTAUTH_URL` as `"http://localhost:3000"`.

Now you need to generate a secret for NextAuth. Run:

```shell
openssl rand -base64 32
```

You can then set the value of `NEXTAUTH_SECRET` to the output. 

You will also need to set the `GITHUB_ID` and `GITHUB_SECRET` so that you can sign in via GitHub locally. See @paul-macfarlane for getting access to these.

Next, run a prisma migration to update your local database's schema:

```shell
npx prisma migrate dev
```

Now with all dependencies installed and Prisma setup you can run the app locally:

```shell
npm run dev
```

## Security Guidelines for Our Application

This document outlines the security measures we are implementing in our application, which uses a React frontend with NextJS, a NodeJS backend with tRPC, and a MySQL database with Prisma as the ORM.

### Secure Transmission

tRPC uses HTTP/HTTPS as a transport layer. All data must be transmitted over secure connections, such as HTTPS, to prevent man-in-the-middle attacks.

### Frontend Security

Avoid storing sensitive information in local storage, session storage, or cookies. Instead, use token-based authentication and transmit tokens securely, e.g., via HTTPS-only cookies. With tRPC, we handle authentication using a combination of HTTP-only cookies for storing tokens and a custom context function to read the token and add the user information to the tRPC request context.

### Backend Security

Passwords should be hashed and salted before being stored in the database. Use environment variables to manage secrets and apply the principle of least privilege for our database access.

### Database Security

We enable encryption at rest for our database and use parameterized queries or an ORM like Prisma to prevent SQL injection attacks. Keeping our database software up to date is a top priority. PlanetScale, the platform that hosts our DB, [encrypts data at rest and in transit](https://planetscale.com/blog/how-planetscale-keeps-your-data-safe).

### General Security Practices

We regularly review and update our security practices, collect and store only necessary data, and keep our team educated about secure coding practices and common vulnerabilities.

### Encrypting and Decrypting Data

We use Node.js's built-in `crypto` module for encrypting and decrypting data. Here's an example using AES-256-CBC encryption:

```javascript
const crypto = require('crypto');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}
```

We use these functions in our Prisma queries:

```javascript
// Encrypt data before storing it in the database
const secret = 'my secret data';
const encryptedSecret = encrypt(secret);
await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@prisma.io',
    secret: encryptedSecret
  },
});

// Decrypt data after retrieving it from the database
const user = await prisma.user.findUnique({
  where: {
    email: 'alice@prisma.io',
  },
});
const decryptedSecret = decrypt(user.secret);
```

### Displaying Passwords

In our password manager application, it's generally acceptable to allow users to unblur or reveal passwords, as long as the user is aware of the action and it is not the default behavior. We implement auto-hide functionality after a certain period, clearing clipboard after a certain period, and masking the password again when the user navigates away or closes the app.

