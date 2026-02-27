# 🚀 Node.js CI/CD Trigger Webhook

A secure and modular Node.js backend service that listens for multiple repository platform events (`push`, `pull_request`, `merge`) and triggers a mock CI/CD pipeline. It logs events, verifies signatures, retries failures, and sends Slack notifications — all **without a frontend**.

> 🌐 **Live Deployment:** [https://pipelinehub.khakse.dev/](https://pipelinehub.khakse.dev/)

---

## 📌 Features

* ✅ Webhook listener for VCS platforms
* ✅ Supports multiple platforms simultaneously (GitHub, GitLab, Bitbucket)
* ✅ HMAC signature verification for security
* ✅ Event filtering (`push`, `pull_request`, `merge`)
* ✅ Mock CI/CD pipeline trigger
* ✅ MongoDB-based event logging
* ✅ Pipeline status API
* ✅ Environment-based configuration
* ✅ Slack channel notifications
* ✅ Jest tests for HMAC verification
* ✅ Retry mechanism for failed pipeline triggers (cron jobs)
* ✅ API documentation using Swagger
* ✅ Centralized error handling
* 🐳 Optional Docker support

---

## 🧪 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Security:** HMAC (SHA256)
* **Testing:** Jest
* **Docs:** Swagger
* **Utilities:** dotenv, body-parser, node-cron

---

## ⚙️ Setup Instructions (Local)

### 1. Clone the Repository

```bash
git clone https://github.com/VoyagerX21/PipelineHub.git
cd PipelineHub/
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
WEBHOOK_SECRET=your_webhook_secret
SLACK_WEBHOOK_URL=your_slack_incoming_webhook_url
```

### 4. Run the Server

```bash
npm start
```

Server runs at:

```
http://localhost:3000
```

---

## 🌐 Using the Live Deployed Server (Recommended for Testing)

You **do not need to run the server locally** to test this project.

The backend is already deployed at:

```
https://pipelinehub.khakse.dev
```

You can directly attach this service as a webhook endpoint in **your own GitHub / GitLab / Bitbucket repositories**.

> ⚠️ **Important Note**
>
> * Slack notifications are sent to **my Slack workspace/channel**.
> * To **see notifications**, you must have access to that Slack workspace.
> * You **do not** need to configure Slack yourself for testing.

---

## 📬 Webhook Usage (GitHub, GitLab & Bitbucket)

### 🔧 GitHub Webhook Setup

* Repository → **Settings** → **Webhooks** → **Add Webhook**
* **Payload URL:**

  ```
  https://pipelinehub.khakse.dev/webhook/github
  ```
* **Content-Type:** `application/json`
* **Secret:** Use the same value as `WEBHOOK_SECRET`
* **Events:**

  * `push`
  * `pull_request`
  * `merge_group` (optional)

---

### 🔧 GitLab Webhook Setup

* Project → **Settings** → **Webhooks**
* **URL:**

  ```
  https://pipelinehub.khakse.dev/webhook/gitlab
  ```
* **Secret Token:** Same as `WEBHOOK_SECRET`
* **Trigger events:**

  * Push events
  * Merge request events

---

### 🔧 Bitbucket Webhook Setup

* Repository → **Repository settings** → **Webhooks**
* **URL:**

  ```
  https://pipelinehub.khakse.dev/webhook/bitbucket
  ```
* **Events:**

  * Push
  * Pull request created
  * Pull request merged

> ℹ️ Bitbucket does not support HMAC secrets natively. IP whitelisting or custom header checks can be added if required.

---

## 🔄 What Happens When a Webhook Is Triggered

1. Incoming request is received
2. Signature / token is verified
3. Event is stored in MongoDB
4. Mock CI/CD pipeline is triggered
5. Slack notification is sent
6. Failed pipelines are retried via cron jobs

---

## 📡 API Documentation

Swagger UI is available at:

```
https://pipelinehub.khakse.dev/api-docs
```

> ⚠️ Ensure the server is awake (Render free tier may sleep).

---

## 🔔 Slack Notification Channel

All pipeline trigger notifications are sent to a **dedicated Slack channel**.

* **Slack Channel:**
  [https://app.slack.com/client/T0926KL6HN1/C0921L88WBV](https://app.slack.com/client/T0926KL6HN1/C0921L88WBV)

* **Demo Login Credentials (for assignment/testing only):**

  * **Email:** [khakse2gaurav2003@gmail.com](mailto:khakse2gaurav2003@gmail.com)
  * **Password:** Devify-Khakse@123

> ⚠️ Credentials are provided **only for demo/assignment purposes** and must be rotated before production use.

---

## 🧪 Testing via Postman (Optional)

* **Method:** POST
* **URL:**

  ```
  http://localhost:3000/webhook/github
  ```
* **Headers:**

  * `x-github-event: push`
  * `x-hub-signature-256: sha256=<computed-signature>`

Generate signature:

```bash
cat temp.json | openssl dgst -sha256 -hmac 'WEBHOOK_SECRET'
```

---

## 📁 Project Structure

```
📦 root
 ┣ 📂src
 ┃ ┣ 📂config
 ┃ ┃ ┗ db.js
 ┃ ┣ 📂controllers
 ┃ ┃ ┗ webhookController.js
 ┃ ┣ 📂jobs
 ┃ ┃ ┗ retryFailedEvents.js
 ┃ ┣ 📂models
 ┃ ┃ ┗ Event.js
 ┃ ┣ 📂routes
 ┃ ┃ ┗ webhookRoutes.js
 ┃ ┣ 📂services
 ┃ ┃ ┣ pipelineService.js
 ┃ ┃ ┗ notificationService.js
 ┃ ┣ 📂utils
 ┃ ┃ ┗ verifySignature.js
 ┃ ┣ app.js
 ┣ 📂tests
 ┃ ┗ verifySignature.test.js
 ┣ .env.example
 ┣ docker-compose.yml
 ┣ Dockerfile
 ┣ swagger.yaml
 ┣ server.js
```

---

## 🧠 Author

**Gourav Khakse**

---

⭐ If you find this useful, feel free to star the repo and test it using your own repositories!
