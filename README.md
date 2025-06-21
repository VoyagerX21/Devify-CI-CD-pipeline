# 🚀 DevifyX Node.js CI/CD Trigger Webhook

A secure and modular Node.js backend service that listens for multiple repository platform's events (`push`, `pull_request`, `merge`) and triggers a mock CI/CD pipeline. It logs events, verifies signatures, and provides a status API — all without a frontend.

---

## 📌 Features

- ✅ Webhook listener for VCS
- ✅ Support for multiple repository platform simultaneously (GitHub, GitLab, BitBucket)
- ✅ HMAC signature verification for security
- ✅ Event filtering (push, pull_request, merge)
- ✅ Mock CI/CD pipeline trigger
- ✅ MongoDB-based logging of events
- ✅ Pipeline status endpoint
- ✅ Environment-based configuration
- ✅ Notification-integration on Channel using Slack
- ✅ Tested for the HMAC signature verification using jest library
- ✅ Retry Mechanism for failed pipline triggers using cron jobs
- ✅ API Documentation using Swagger
- ✅ Error-handling at each point
- 🐳 Optional Docker support

---

## 🧪 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: HMAC (SHA256)
- **Tools**: dotenv, body-parser, jest, swagger, etc..

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
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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
```

### 4. Run the Server
```bash
npm start
```

The server will start at: `http://localhost:3000`

---

## 📬 Webhook Usage (GitHub, GitLab & Bitbucket)

### 🔧 Step 1: Add Webhook on Your Repository Platform

#### 📌 GitHub
- Go to your GitHub **repository** → **Settings** → **Webhooks** → **Add Webhook**
- **Payload URL**:  
  ```
  http://<your-server>/webhook/github
  ```
- **Content-Type**: `application/json`
- **Secret**: Use the same value as `WEBHOOK_SECRET` in your `.env`
- **Events to trigger**:  
  - Choose `push`, `pull_request`, `merge_group` *(or select "Send me everything" for testing)*

#### 📌 GitLab
- Go to your GitLab **project** → **Settings** → **Webhooks**
- **URL**:  
  ```
  http://<your-server>/webhook/gitlab
  ```
- **Secret Token**: Use the same value as `WEBHOOK_SECRET` in your `.env`
- **Trigger events**:  
  - Enable `Push events`, `Merge request events`

#### 📌 Bitbucket
- Go to your Bitbucket **repo** → **Repository settings** → **Webhooks**
- **Title**: e.g., `DevifyX Webhook`
- **URL**:  
  ```
  http://<your-server>/webhook/bitbucket
  ```
- **Secret**: Bitbucket doesn't support HMAC secrets for webhook requests by default — implement IP whitelisting or custom header checks for security if needed.
- **Events**: Enable `Push`, `Pull Request Created`, `Pull Request Merged`

> ⚠️ Replace `<your-server>` with your actual deployed domain or `http://localhost:3000` during local testing.

---

### ✅ Step 2: Your Server Will Handle Webhook Payloads Securely

- When an event (like `push` or `pull request`) occurs, the platform sends a `POST` request to your API:
  - GitHub → `/webhook/github`
  - GitLab → `/webhook/gitlab`
  - Bitbucket → `/webhook/bitbucket`
  
- Your Node.js backend:
  1. **Verifies** the request signature/token.
  2. **Logs** the event into the database.
  3. **Triggers a mock CI/CD pipeline**.
  4. Optionally sends a **Slack notification**.
  5. Retries failed pipelines automatically (if implemented).

---

## 📡 API Documentation

- Complete API Documentation with Usage : <a href="http://localhost:3000/api-docs" target="_blank">api-docs</a>

> ⚠️ **Note**: Please ensure that the server is running

## 📡 Notification Channel

> All pipeline trigger notifications are sent to a dedicated Slack channel.

- **🔔 Slack Channel:** <a href="https://app.slack.com/client/T0926KL6HN1/C0921L88WBV" target="_blank">View on slack</a>
- **👤 Login Credentials** *(if required for testing purposes)*:
  - **Email:** `khakse2gaurav2003@gmail.com`
  - **Password:** `Devify-Khakse@123`

> ⚠️ **Note**: Please ensure your access to Slack workspace before using the above credentials. Credentials should only be used for assignment/demo purposes and changed before production deployment.


## 🧪 Testing with Postman (for debugging)

- Set method: `POST`
- URL: `http://localhost:3000/webhook/github`
- Body → `raw` → `JSON`
- Headers:
  - `x-github-event`: `push`
  - `x-hub-signature-256`: `sha256=your-computed-signature`
- Payload: Sample GitHub JSON

Write your body in temp.json file
Use `cat temp.json | openssl dgst -sha256 -hmac 'supersecretstring'` to generate the correct signature.

---

## 📁 Project Structure

```
📦 root
 ┣ 📂src
  ┣ 📂config
  ┃ ┗ 📜db.js
  ┣ 📂controllers
  ┃ ┗ 📜webhookController.js
  ┣ 📂jobs
  ┃ ┗ 📜retryFailedEvents.js
  ┣ 📂models
  ┃ ┗ 📜Event.js
  ┣ 📂routes
  ┃ ┗ 📜webhookRoutes.js
  ┣ 📂services
  ┃ ┗ 📜pipelineService.js
  ┃ ┗ 📜notificationService.js
  ┣ 📂utils
  ┃ ┗ 📜verifySignature.js
  ┣ 📜app.js
 ┣ 📂tests
  ┃ ┗ 📜verifySignature.test.js
 ┣ 📜.dockerignore
 ┣ 📜.env
 ┣ 📜.env.example
 ┣ 📜docker-compose.yml
 ┣ 📜Dockerfile
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜README.md
 ┣ 📜server.js
 ┣ 📜swagger.yaml
 ┗ 📜temp.json
```

---

## 🧠 Author

Made by Gourav Khakse | DevifyX Assignment Submission
