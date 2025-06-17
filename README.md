# 🚀 DevifyX Node.js CI/CD Trigger Webhook

A secure and modular Node.js backend service that listens for GitHub repository events (`push`, `pull_request`, `merge`) and triggers a mock CI/CD pipeline. It logs events, verifies signatures, and provides a status API — all without a frontend.

---

## 📌 Features

- ✅ Webhook listener for GitHub
- ✅ HMAC signature verification for security
- ✅ Event filtering (push, pull_request, merge)
- ✅ Mock CI/CD pipeline trigger
- ✅ MongoDB-based logging of events
- ✅ Pipeline status endpoint
- ✅ Environment-based configuration
- 🐳 Optional Docker support

---

## 🧪 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: HMAC (SHA256)
- **Tools**: dotenv, body-parser

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/VoyagerX21/Devify-CI-CD-pipeline.git
cd Devify-CI-CD-pipeline/
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on the `.env.example` provided.

```env
PORT=3000
MONGODB_URI=mongodb+srv://VoyagerX21:h7r4RVCcEbU71Cn3@cluster1.kw3xd3o.mongodb.net/
WEBHOOK_SECRET=supersecretstring
```

### 4. Run the Server
```bash
npm start
```

The server will start at: `http://localhost:3000`

---

## 📬 Webhook Usage (GitHub)

### Step 1: Add GitHub Webhook
- Go to your GitHub repo → Settings → Webhooks → Add Webhook
- **Payload URL**: `http://your-server.com/webhook/github`
- **Content-Type**: `application/json`
- **Secret**: Same as `WEBHOOK_SECRET` in your `.env`
- Select events: `push`, `pull_request`, `merge` (or "Send me everything" for testing)

### Step 2: GitHub will send signed payloads to your server

---

## 📡 API Documentation

### 🔹 POST `/webhook/github`
Trigger the CI/CD pipeline via GitHub webhook.

**Headers**:
- `x-github-event`: `push` | `pull_request` | `merge`
- `x-hub-signature-256`: HMAC signature of the payload

**Body**:
- GitHub JSON webhook payload

**Response**:
```json
{ "message": "Pipeline triggered for push" }
```

---

### 🔹 GET `/webhook/status`
Get the list of recent pipeline events.

**Response**:
```json
{
  "count": 2,
  "events": [
    {
      "type": "push",
      "repository": "user/repo",
      "pusher": "username",
      "message": "Commit message",
      "status": "triggered",
      "receivedAt": "2025-06-17T12:34:56Z"
    }
  ]
}
```

---

## 📁 Project Structure

```
📦 root
 ┣ 📂controllers
 ┃ ┗ 📜webhookController.js
 ┣ 📂routes
 ┃ ┗ 📜webhookRoutes.js
 ┣ 📂services
 ┃ ┗ 📜pipelineService.js
 ┣ 📂models
 ┃ ┗ 📜Event.js
 ┣ 📜app.js
 ┣ 📜server.js
 ┣ 📜.env
 ┣ 📜.env.example
 ┣ 📜package.json
 ┗ 📜README.md
```

---

## 🧪 Testing with Postman (for debugging)

- Set method: `POST`
- URL: `http://localhost:3000/webhook/github`
- Body → `raw` → `JSON`
- Headers:
  - `x-github-event`: `push`
  - `x-hub-signature-256`: `sha256=your-computed-signature`
- Payload: Sample GitHub JSON

Use `echo -n '{"your":"payload"}' | openssl dgst -sha256 -hmac 'yourSecret'` to generate the correct signature.

---

## 🧠 Author

Made by Gourav Khakse | DevifyX Assignment Submission