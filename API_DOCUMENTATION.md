# PhoneVerse 2026 - REST API Documentation

This specification documents the REST API endpoints available across both the Next.js serverless architecture and the persistent Rust Axum backend.

---

## Base URLs
* **Next.js Serverless (Vercel)**: `https://<your-vercel-domain>.vercel.app/api`
* **Rust Axum Server**: `http://localhost:8080/api`

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user session.
* **Payload**:
```json
{
  "email": "customer@phoneverse.com",
  "password": "Customer@2026"
}
```
* **Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "usr_123",
    "email": "customer@phoneverse.com",
    "full_name": "Pakistani Tech Enthusiast",
    "role": "customer",
    "is_active": true
  }
}
```

---

## 2. Smartphones & Discovery Endpoints

### `GET /smartphones`
Retrieves a paginated and filtered list of verified smartphones.
* **Query Parameters**:
  * `search` (string): Filter by device name or chipset.
  * `brand` (string): Filter by brand slug (e.g. `apple`, `samsung`, `xiaomi`).
* **Response (200 OK)**:
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "p1",
      "name": "iPhone 16 Pro Max",
      "brand_name": "Apple",
      "base_price_pkr": 494999,
      "pta_status": "PTA Approved",
      "primary_image_url": "https://..."
    }
  ]
}
```

### `GET /smartphones/:slug`
Retrieves full hardware specifications, color variants, merchant prices, and reviews for a smartphone.

---

## 3. Comparison & AI Endpoints

### `POST /compare`
Generates a side-by-side technical evaluation matrix and AI verdict.
* **Payload**:
```json
{
  "phoneIds": ["iphone-16-pro-max", "galaxy-s25-ultra"]
}
```
* **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "categoryWinners": [
      {
        "category": "Camera & Optics",
        "winnerPhoneId": "p1",
        "reason": "4K@120fps Dolby Vision and 5x periscope optical stabilization."
      }
    ],
    "aiAnalysis": {
      "summary": "Comparing iPhone 16 Pro Max vs Galaxy S25 Ultra...",
      "gamingComparison": "Apple A18 Pro vs Snapdragon 8 Elite...",
      "valueForMoneyVerdict": "..."
    },
    "isAiGenerated": true
  }
}
```

### `POST /recommendations`
Generates AI-guided smartphone recommendations.
* **Payload**:
```json
{
  "budget_pkr": 250000,
  "preferred_brand": "Samsung",
  "usage_priorities": ["gaming", "camera"],
  "minimum_ram_gb": 12,
  "needs_5g": true
}
```

---

## 4. E-Commerce & Orders Endpoints

### `POST /orders`
Creates a verified order.
* **Payload**:
```json
{
  "customer_name": "Hamza Ali",
  "customer_email": "hamza@example.com",
  "customer_phone": "0300-9876543",
  "shipping_address": "House 45, Street 2, DHA Phase 5",
  "shipping_city": "Lahore",
  "shipping_province": "Punjab",
  "payment_method": "cod",
  "items": [
    {
      "smartphone_id": "p1",
      "product_name": "iPhone 16 Pro Max",
      "quantity": 1,
      "unit_price_pkr": 494999
    }
  ]
}
```

---

## 5. Background Automation (Cron Endpoints)

* `GET /cron/smartphones`: Synchronizes newly announced smartphone specifications.
* `GET /cron/prices`: Updates real-time Pakistani retail prices and logs price drops.
* `GET /cron/news`: Pulls technology RSS feeds and creates summaries.
