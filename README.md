# Bookstoore – CRUD Books & Quotes med JWT (Angular + .NET)

En responsiv CRUD-webbapplikation byggd med Angular (frontend) och .NET 9 (backend API).
Applikationen stödjer registrering/inloggning med JWT och kräver autentisering för CRUD-operationer.
Innehåller även en separat vy **“Mina citat”** med begränsningen max 5 citat per användare.

## Live-demo

* **Frontend (Vercel):** [https://bookstoore.vercel.app](https://bookstoore.vercel.app)
* **Backend API (Render):** [https://bookstoore-0wkm.onrender.com](https://bookstoore-0wkm.onrender.com)

> API:et är skyddat av JWT för Books/Quotes. Auth-endpoints är öppna.

---

## Funktionalitet

### Auth (JWT)

* Registrera användare
* Logga in och få JWT-token
* Token används automatiskt i efterföljande API-anrop (Authorization: Bearer)

### Böcker (CRUD)

* Lista böcker
* Skapa bok
* Redigera bok
* Radera bok

> Alla böcker är knutna till inloggad användare.

### Mina citat (CRUD)

* Lista citat
* Skapa citat
* Redigera citat
* Radera citat
* **Max 5 citat per användare** (servervalidering)

### UI / UX

* Responsiv layout med Bootstrap
* Ikoner med Font Awesome
* Ljus/mörk design (dark mode toggle)
* Navigationsmeny mellan Books och Quotes

---

## Teknik

* Frontend: Angular (standalone components), Bootstrap, Font Awesome
* Backend: .NET 9 Minimal API, JWT Bearer Auth
* Databas: SQLite (Entity Framework Core)

Hosting:

* Frontend: Vercel
* Backend: Render

---

## Lokalt: komma igång

### Förutsättningar

* Node.js + npm
* .NET SDK 9.x

### 1) Starta backend (API)

```bash
cd server/Api
dotnet restore
dotnet run
```

API kör lokalt enligt din launch profile (t.ex. `http://localhost:5027`).

### 2) Starta frontend (Angular)

```bash
cd client
npm install
npm start
```

Frontend kör normalt på `http://localhost:4200`.

---

## Konfiguration

### Backend – inställningar

Backend läser konfiguration från `appsettings.json` + environment variables.

Exempel (Render env vars):

* `Jwt__Key` = (hemlig nyckel, minst 32 tecken)
* `Jwt__Issuer` = `BookstoreApi`
* `Jwt__Audience` = `BookstoreClient`
* `ConnectionStrings__Default` = `Data Source=app.db`

### Frontend – API base i produktion

I `environment.prod.ts` används:

* `apiBase: https://bookstoore-0wkm.onrender.com/api`

---

## API-endpoints (översikt)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Books (kräver JWT)

* `GET /api/books`
* `POST /api/books`
* `PUT /api/books/{id}`
* `DELETE /api/books/{id}`

### Quotes (kräver JWT)

* `GET /api/quotes`
* `POST /api/quotes` (max 5 per user)
* `PUT /api/quotes/{id}`
* `DELETE /api/quotes/{id}`

---

## Noteringar / Begränsningar

* Databas är SQLite. I hosting-miljö kan data nollställas vid omdeploy om persistent storage inte används.
* Inloggning krävs för Books/Quotes, annars returneras 401.
