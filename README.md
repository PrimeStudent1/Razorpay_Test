# 💳 Razorpay Test Payment Gateway + Vite & Node.js CI/CD Demo

A production-grade, secure, full-stack demonstration for **Razorpay Test Mode** payments built with **React (Vite)**, **Node.js (Express)**, complete with **Automated Testing**, **Dockerization**, and an **Enterprise GitHub Actions CI/CD Pipeline**.

---

## 📑 Table of Contents

- [1. Project Architecture](#1-project-architecture)
- [2. Local Development & Quick Start](#2-local-development--quick-start)
- [3. Excel Credential Import](#3-excel-credential-import)
- [4. Environment Variables Configuration](#4-environment-variables-configuration)
- [5. Automated Testing Strategy](#5-automated-testing-strategy)
- [6. Code Quality & Linting](#6-code-quality--linting)
- [7. Production Build](#7-production-build)
- [8. One-Command Verification (`npm run verify`)](#8-one-command-verification-npm-run-verify)
- [9. Docker & Docker Compose](#9-docker--docker-compose)
- [10. GitHub Actions CI/CD Workflows](#10-github-actions-cicd-workflows)
- [11. GitHub Repository Secrets](#11-github-repository-secrets)
- [12. GitHub Environments Setup](#12-github-environments-setup)
- [13. Branching Strategy & PR Protection](#13-branching-strategy--pr-protection)
- [14. Deployment & Health Checks](#14-deployment--health-checks)
- [15. Rollback Strategy](#15-rollback-strategy)
- [16. Security & Test Mode Safety Audit](#16-security--test-mode-safety-audit)
- [17. Official Razorpay Test Credentials](#17-official-razorpay-test-credentials)
- [18. Troubleshooting](#18-troubleshooting)

---

## 1. Project Architecture

```text
Developer (Local Git Push / PR)
   │
   ├──> GitHub Actions
   │      ├── CI Workflow (.github/workflows/ci.yml)
   │      │     ├── Node.js LTS Matrix (20, 22)
   │      │     ├── npm ci (Strict lockfile dependencies)
   │      │     ├── ESLint (Backend & Frontend)
   │      │     ├── Unit/Integration Tests (Jest + Supertest with Razorpay Mocks)
   │      │     ├── Frontend Component Tests (Vitest + React Testing Library)
   │      │     ├── Vite Production Build
   │      │     ├── Backend Syntax & Route Validation
   │      │     └── Artifact Upload (dist/)
   │      │
   │      ├── Security Workflow (.github/workflows/security.yml)
   │      │     ├── Gitleaks Secret Scanning
   │      │     ├── Local Rule & Secret Leaks Scan
   │      │     └── npm audit Dependency Vulnerability Check
   │      │
   │      ├── Docker Workflow (.github/workflows/docker.yml)
   │      │     ├── Multi-Stage Docker Build
   │      │     ├── Immutable SHA Tagging (ghcr.io/OWNER/REPO:<sha>)
   │      │     └── Publish to GitHub Container Registry (GHCR)
   │      │
   │      └── CD Workflow (.github/workflows/cd.yml)
   │            ├── Deployment Environments (staging on develop, production on main)
   │            ├── Test Mode Deployment Guard (Enforces rzp_test_ & RAZORPAY_MODE=test)
   │            ├── Deployment Execution
   │            ├── Automated Health Check (/api/health)
   │            └── Fast-Fail & Notification
   │
   └──> Runtime Deployment
          ├── Multi-stage Docker Container
          ├── Express Backend (Port 5000)
          └── Serves Frontend Static Assets (frontend/dist)
```

---

## 2. Local Development & Quick Start

### Installation

Install all project dependencies across root, backend, and frontend:

```bash
npm run install:all
```

### Running Locally

You can run both servers together or in separate terminals:

#### Option A: Both Together (Recommended)
```bash
npm run dev
```
Starts backend (`http://localhost:5000`) and frontend Vite (`http://localhost:5173`) using `concurrently`.

#### Option B: Separately
- **Backend**:
  ```bash
  cd backend
  npm run dev
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```

---

## 3. Excel Credential Import

The project includes an automated spreadsheet importer that reads Razorpay credentials from an Excel file without printing secret keys in console output:

1. Place your spreadsheet in `config/credentials.xlsx`. Both table row and header column layouts are supported:

   **Format 1 (Key-Value Rows):**
   | Setting | Value |
   | :--- | :--- |
   | `RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxx` |
   | `RAZORPAY_KEY_SECRET` | `xxxxxxxxxxxxxxxx` |

2. Run the importer:
   ```bash
   npm run import-credentials
   ```

Output confirms that credentials are encrypted/masked and written to `backend/.env`.

---

## 4. Environment Variables Configuration

### Root & Backend (`backend/.env`)
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
RAZORPAY_MODE=test
```

### Frontend (`frontend/.env.example`)
```env
# Only non-sensitive, public variables are permitted in frontend
VITE_API_BASE_URL=
```

> [!CAUTION]
> **CRITICAL SECURITY RULE**: Never prefix secret keys with `VITE_` and never place `RAZORPAY_KEY_SECRET` in frontend code or environment files. The secret must remain exclusively on the server.

---

## 5. Automated Testing Strategy

Automated tests do **not** require real credentials and run with full isolation via mocks:

### Backend Tests (Jest + Supertest)
Located in `backend/tests/`:
- `health.test.js`: Validates `/api/health` status, service name, and test mode.
- `payment.test.js`:
  - `GET /api/payment/config`: Verifies public key and ensures secret is never leaked.
  - `POST /api/payment/create-order`: Validates rupee-to-paise conversion, rejects 0, negative, or invalid amounts, and handles SDK errors.
  - `POST /api/payment/verify`: Tests valid HMAC-SHA256 signatures, rejects tampered signatures, and validates required parameters.
  - `GET /api/payment/test-connection`: Verifies success and failure branches.

Run backend tests:
```bash
npm --prefix backend test
```

### Frontend Component Tests (Vitest + React Testing Library)
Located in `frontend/src/tests/`:
- `PaymentCard.test.jsx`: Preset amount buttons, custom inputs, prefill forms, and button states.
- `PaymentStatus.test.jsx`: Idle, success receipts, and retry workflows.
- `ConnectionTest.test.jsx`: Gateway status pill, key masking, and test trigger.

Run frontend tests:
```bash
npm --prefix frontend test
```

### Run All Tests
```bash
npm test
```

---

## 6. Code Quality & Linting

ESLint configurations are established for both backend and frontend:

```bash
# Run linting across entire project
npm run lint

# Or individually
npm --prefix backend run lint
npm --prefix frontend run lint
```

---

## 7. Production Build

Build the optimized Vite distribution:

```bash
npm run build
```
Output is emitted to `frontend/dist/`. In production mode (`NODE_ENV=production`), Express statically serves this folder and redirects client routing to `index.html`.

---

## 8. One-Command Verification (`npm run verify`)

Before pushing code or opening a Pull Request, run the local verification suite:

```bash
npm run verify
```

This single command executes:
1. `npm run lint` — ESLint validation across backend and frontend.
2. `npm test` — All 26 automated unit & integration tests.
3. `npm run build` — Production Vite frontend build.
4. `npm run security-check` — Gitignore integrity, credential leak scan, and audit.

---

## 9. Docker & Docker Compose

### Multi-Stage Dockerfile
- **Stage 1 (Builder)**: Builds the Vite React application.
- **Stage 2 (Runner)**: Minimal `node:20-alpine` image with only production dependencies (`npm ci --omit=dev`), runs as non-root user `node`, exposes port 5000, and includes container `HEALTHCHECK`.

### Build & Run with Docker Compose
```bash
# Build and start container in detached mode
docker compose up -d --build

# View logs
docker compose logs -f

# Stop container
docker compose down
```

Access the application in Docker at: [http://localhost:5000](http://localhost:5000)

### Manual Docker Build
```bash
# Build image
docker build -t razorpay-test-app:latest .

# Run image
docker run -p 5000:5000 \
  -e RAZORPAY_KEY_ID="rzp_test_your_key" \
  -e RAZORPAY_KEY_SECRET="your_secret" \
  -e RAZORPAY_MODE="test" \
  razorpay-test-app:latest
```

---

## 10. GitHub Actions CI/CD Workflows

### 1. `ci.yml` (Continuous Integration)
- **Triggers**: Push to `main`, `develop` | Pull Request to `main`.
- **Matrix**: Node.js 20 & 22 LTS.
- **Steps**:
  - `actions/checkout@v4`
  - Dependency caching with `npm ci`
  - Linting (`npm run lint`)
  - Automated tests with Razorpay mocks (`npm test`)
  - Production build (`npm run build`)
  - Backend route & syntax validation
  - Upload `frontend/dist` artifact

### 2. `security.yml` (Secret & Vulnerability Scanning)
- **Triggers**: Push, Pull Request, and weekly Sunday cron.
- **Steps**:
  - Gitleaks secret scanner
  - Local repository rule verification (`node scripts/securityScan.js`)
  - Dependency vulnerability audit (`npm audit --omit=dev`)

### 3. `docker.yml` (Container Build & GHCR Publishing)
- **Triggers**: Push to `main` | Version tags (`v*.*.*`).
- **Steps**:
  - Docker Buildx setup
  - GHCR Authentication
  - Multi-tagging with immutable commit SHA (`ghcr.io/OWNER/REPO:<commit-sha>`) and `latest`
  - Push to GitHub Container Registry

### 4. `cd.yml` (Continuous Deployment)
- **Triggers**: Push to `main` (production) | Push to `develop` (staging).
- **Steps**:
  - Test Mode Guard: validates `RAZORPAY_MODE=test` and Key ID prefix `rzp_test_`
  - Pre-deployment test & build gate
  - Zero-downtime deployment execution
  - Automated health check against `/api/health`
  - Automatic failure if health check does not return HTTP 200 and `"status": "healthy"`

---

## 11. GitHub Repository Secrets

Configure the following secrets in **Settings > Secrets and variables > Actions**:

| Secret Name | Description | Example Placeholder |
| :--- | :--- | :--- |
| `RAZORPAY_KEY_ID` | Razorpay Test API Key ID | `rzp_test_xxxxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay Test API Key Secret | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| `DEPLOY_URL` | Domain / URL of deployed server | `https://staging.example.com` |
| `DEPLOY_HOST` | SSH host for deployment server (if using SSH) | `192.168.1.100` |
| `DEPLOY_USERNAME` | SSH username | `deployer` |
| `DEPLOY_SSH_KEY` | Private SSH Key for deployment server | `-----BEGIN OPENSSH PRIVATE KEY...` |

---

## 12. GitHub Environments Setup

Configure environments in **Settings > Environments**:

1. **`development`**:
   - For local developer branches and initial testing.
2. **`staging`**:
   - Tied to the `develop` branch.
   - Deploys automatically on merge.
3. **`production`**:
   - Tied to the `main` branch.
   - Requires **Required Reviewers** (manual approval) prior to deployment.
   - Environment-specific secrets isolate production keys from staging keys.

---

## 13. Branching Strategy & PR Protection

```text
feature/* (Feature Development)
   ↓
Pull Request (Automated CI & Security Checks)
   ↓
develop (Integration & Staging Deployment)
   ↓
Pull Request & Peer Review
   ↓
main (Production Deployment via Docker & GHCR)
```

### Branch Protection Rules for `main`:
- Require pull request before merging.
- Require status checks to pass:
  - `Lint, Test & Build (Node 20)`
  - `Lint, Test & Build (Node 22)`
  - `Gitleaks & Secret Scanning`
  - `Dependency Vulnerability Audit`
- Require linear commit history.

---

## 14. Deployment & Health Checks

The backend provides a standardized health check endpoint:

`GET /api/health`

**Response:**
```json
{
  "success": true,
  "service": "Razorpay Test Gateway",
  "status": "healthy",
  "mode": "test",
  "configured": true,
  "maskedKeyId": "rzp_test_**************",
  "timestamp": "2026-09-03T00:00:00.000Z"
}
```

In the CD pipeline, post-deployment validation curls `/api/health`. If the HTTP response code is not 200 or `"status"` is not `"healthy"`, the deployment pipeline automatically halts and fails.

---

## 15. Rollback Strategy

Because all Docker images are tagged immutably with the Git commit SHA (`ghcr.io/OWNER/REPO:<commit-sha>`), rolling back to any previous working version is instant and safe:

### Rollback Procedure:
1. Identify the previous stable commit SHA from GitHub Releases or Git log:
   ```bash
   git log --oneline -n 5
   ```
2. Pull and start the previous immutable image:
   ```bash
   docker pull ghcr.io/OWNER/REPO:PREVIOUS_COMMIT_SHA

   docker stop razorpay-test-app
   docker run -d --name razorpay-test-app -p 5000:5000 \
     --env-file /etc/razorpay/.env \
     ghcr.io/OWNER/REPO:PREVIOUS_COMMIT_SHA
   ```
3. Re-verify health check:
   ```bash
   curl -f http://localhost:5000/api/health
   ```

---

## 16. Security & Test Mode Safety Audit

- [x] **Zero Secret Leakage in Frontend**: `RAZORPAY_KEY_SECRET` never enters React, Vite, HTML, or frontend bundles.
- [x] **Cryptographic Verification**: Signatures are verified server-side with `crypto.createHmac('sha256', secret)` and `crypto.timingSafeEqual`.
- [x] **Test Mode Safety Guard**: At server startup and in CI/CD, the key prefix `rzp_test_` and `RAZORPAY_MODE=test` are validated.
- [x] **Git & Docker Isolation**: `.gitignore` and `.dockerignore` exclude `.env`, `*.xlsx`, `credentials.xlsx`, and `node_modules`.
- [x] **Masked Logging**: Server and importer logs mask credentials (`rzp_test_****`, `****`).

---

## 17. Official Razorpay Test Credentials

> [!IMPORTANT]
> Use Razorpay's official Test Mode credentials/cards. Never use real card details in this demo.

| Payment Method | Card Number | Expiry | CVV | OTP |
| :--- | :--- | :--- | :--- | :--- |
| **Visa (Domestic)** | `4111 1111 1111 1111` | Any future date (e.g. `12/28`) | `123` | `123456` or click **Success** |
| **Mastercard (Domestic)**| `5123 4567 8901 2346` | Any future date (e.g. `11/29`) | `456` | `123456` or click **Success** |
| **UPI / QR** | VPA: `success@razorpay` | N/A | N/A | Simulated accept |
| **Netbanking** | HDFC / SBI / ICICI | N/A | N/A | Click **Success** on test bank page |

---

## 18. Troubleshooting

### Port 5000 or 5173 already in use
```bash
# Check running process
netstat -ano | findstr :5000
# Kill process by PID
taskkill /PID <PID> /F
```

### Credentials missing error
Run the Excel importer or check `backend/.env`:
```bash
npm run import-credentials
```

### Verify local pipeline before pushing
```bash
npm run verify
```
