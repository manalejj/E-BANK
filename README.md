

# 🏦 eBank - Digital Banking System

A full-stack Digital Banking Application built with **Spring Boot 3** and **React**. This application manages bank accounts, customers, and transactions with a secure authentication system and real-time email notifications.



## Features

### Security & Authentication
* **JWT Authentication:** Secure login with JSON Web Tokens (valid for 1 hour).
* **Role-Based Access Control:**
    * **AGENT_GUICHET (Admin):** Can create clients and accounts.
    * **CLIENT (User):** Can view dashboard, history, and make transfers.
* **Password Encryption:** All passwords are encrypted using `BCryptPasswordEncoder`.

### Notifications
* **Real Email Integration:** Uses SMTP (Gmail) to send login credentials automatically when a new client is created.

### Banking Operations
* **Client Management:** Create clients with uniqueness checks (Email & ID).
* **Account Management:** Create accounts with valid RIB checks (24 digits) and default status "Ouvert".
* **Transfers:** Secure transfers between accounts with balance and status validation.
* **Dashboard:** Real-time view of balance, recent operations, and transaction history with pagination.

---

## Tech Stack

### Backend
* **Framework:** Spring Boot 3
* **Database:** MySQL 8
* **ORM:** Spring Data JPA
* **Security:** Spring Security & JWT
* **Tools:** Lombok, Java Mail Sender, AOP (Logging Aspect)

### Frontend
* **Framework:** React JS
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Styling:** Bootstrap 5 & Custom CSS (Glassmorphism UI)



## Installation & Setup

### 1. Prerequisites
* Java 17+
* Node.js & npm
* MySQL Server

### 2. Database Setup
Create a database named `ebank_db` in MySQL:
```sql
CREATE DATABASE ebank_db;

```

### 3. Backend Configuration

Navigate to `ebank-backend/src/main/resources/application.properties` and configure your credentials:


# Database Config
spring.datasource.url=jdbc:mysql://localhost:3306/ebank_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

# Email Config (Required for creating clients)
spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_APP_PASSWORD_16_CHARS


### 4. Run the Backend


cd ebank-backend
mvn spring-boot:run



### 5. Run the Frontend


cd ebank-frontend
npm install
npm start




## Default Credentials (Simulation)

Since the app uses `InMemoryUserDetailsManager` for demonstration:

| Role | Username | Password |
| --- | --- | --- |
| **Agent (Admin)** | `admin` | `admin` |
| **Client (Demo)** | `client` | `client` |




