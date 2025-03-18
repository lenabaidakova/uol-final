# Shelter Connect Application

This platform helps animal shelters connect with their communities for support. Shelters can post requests 
for supplies, services, and volunteers, while supporters can respond and communicate through a simple messaging system.

## Production Deployment

- **Hosted application:** [https://keebeex.com](https://keebeex.com)
- **Email service:** [Brevo](https://www.brevo.com/)

### **Test accounts in production**

To simplify testing, the following user accounts are available in the production environment:

- **Shelter account:**
    - Email: `shelter@example.com`
    - Password: `password123`
- **Supporter account:**
    - Email: `supporter@example.com`
    - Password: `password123`

These accounts allow you to log in and explore the platform features.

## Running the project locally

You can run the project in two ways: **locally** (manual setup) or **using Docker** (recommended for a full setup).

### **Option 1: Running locally (manual setup)**

#### **Requirements**

- **Node.js v20.17.0**
- **SQLite** (no configuration needed)
- **MailHog** (for local email testing - [Installation guide](https://github.com/mailhog/MailHog))

#### **Steps**

1. **Clone the repository:**
   ```shell
   git clone https://github.com/lenabaidakova/uol-final.git
   cd uol-final
   ```
2. **Install dependencies:**
   ```shell
   npm install
   ```
3. **Run database migrations:**
   ```shell
   npx prisma migrate dev --name init
   ```
4. **Build and start the application:**
   ```shell
   npm run build
   npm run start
   ```
    - The application will be available at [http://localhost:3000](http://localhost:3000)
    - MailHog UI (for email testing) at [http://localhost:8025](http://localhost:8025)

### **Option 2: Running with Docker (recommended)**

This method runs the full application, including the database and MailHog, inside Docker containers.

#### **Steps**

1. **Ensure Docker is installed** on your machine.
2. **Run the application:**
   ```shell
   docker compose up --build
   ```
    - The application will be available at [http://localhost:3000](http://localhost:3000)
    - MailHog UI (for email testing) at [http://localhost:8025](http://localhost:8025)

### **Test accounts in development**

The same test accounts are available when running locally:

- **Shelter account:**
    - Email: `shelter@example.com`
    - Password: `password123`
- **Supporter account:**
    - Email: `supporter@example.com`
    - Password: `password123`

These accounts allow you to log in and interact with the platform in a local environment.

## **Database Management**

### **Prisma Studio (Database UI)**

```shell
npx prisma studio
```

### **Run migrations**

```shell
npx prisma migrate dev --name migration_name
npx prisma generate
```

### **Seed database**

```shell
npx prisma db seed
```

### **Reset and seed satabase**

```shell
npx prisma migrate reset
```

## **Stopping the application**

```shell
docker compose down
```

## **Rebuilding and restarting**

```shell
docker compose up --build --force-recreate
```
