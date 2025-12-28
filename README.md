# eBank - Digital Banking System

A full-stack Digital Banking Application built with **Spring Boot 3** and **React**. This application manages bank accounts, customers, and transactions with a secure authentication system and real-time email notifications.

> [cite_start]**Project for Architecture of Enterprise Components (ACE)** [cite: 1]

## Features

### Security & Authentication
* [cite_start]**JWT Authentication:** Secure login with JSON Web Tokens (valid for 1 hour)[cite: 14, 50].
* **Role-Based Access Control:**
    * [cite_start]**AGENT_GUICHET (Admin):** Can create clients and accounts[cite: 33, 39].
    * **CLIENT (User):** Can view dashboard, history, and make transfers[cite: 33, 41].
* [cite_start]**Password Encryption:** All passwords are encrypted using `BCryptPasswordEncoder`[cite: 48].

### 📧 Notifications
* [cite_start]**Real Email Integration:** Uses SMTP (Gmail) to send login credentials automatically when a new client is created[cite: 53].

### Banking Operations
* **Client Management:** Create clients with uniqueness checks (Email & ID)[cite: 53].
* [cite_start]**Account Management:** Create accounts with valid RIB checks (24 digits) and default status "Ouvert"[cite: 55].
* [cite_start]**Transfers:** Secure transfers between accounts with balance and status validation[cite: 67, 75, 76].
* **Dashboard:** Real-time view of balance, recent operations, and transaction history with pagination[cite: 56, 63].

---

## Tech Stack

### Backend
* [cite_start]**Framework:** Spring Boot 3 [cite: 12]
* [cite_start]**Database:** MySQL 8 [cite: 16]
* **ORM:** Spring Data JPA [cite: 15]
* [cite_start]**Security:** Spring Security & JWT [cite: 13, 14]
* [cite_start]**Tools:** Lombok, Java Mail Sender, AOP (Logging Aspect)[cite: 25].

### Frontend
* **Framework:** React JS [cite: 19]
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Styling:** Bootstrap 5 & Custom CSS (Glassmorphism UI).

---

## Installation & Setup

### 1. Prerequisites
* Java 17+
* Node.js & npm
* MySQL Server

### 2. Database Setup
Create a database named `ebank_db` in MySQL:
```sql
CREATE DATABASE ebank_db;

3. Backend Configuration
Navigate to ebank-backend/src/main/resources/application.properties and configure your credentials:

Properties

# Database Config
spring.datasource.url=jdbc:mysql://localhost:3306/ebank_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

# Email Config (Required for creating clients)
spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_APP_PASSWORD_16_CHARS
4. Run the Backend
Bash

cd ebank-backend
mvn spring-boot:run
5. Run the Frontend
Bash

cd ebank-frontend
npm install
npm start
