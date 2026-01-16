# InsightNova PMS Full Database Schema and Execution Guide

**Document Title:** InsightNova PMS Database Schema and Project Execution Guide  
**Version:** 1.0  
**Date:** December 29, 2025  
**Prepared By:** Grok AI (Based on PRD v3.0)

---

## Overview

This document provides a comprehensive database schema for the **InsightNova Hotel PMS**, expanding on any existing subscription schema (assumed basic; if provided, it can be integrated).

It also includes a **detailed, step-by-step project execution guide** aligned with the PRD’s **6-week delivery plan** and technical requirements.

The schema is designed for **PostgreSQL**, with a strong emphasis on:

- **Offline-first support** (IndexedDB + server sync)
- **Theft-proofing** through audit logs and access events
- **Multi-hotel, multi-role RBAC**
- **Scalable integrations** (OTA, payments, CCTV, smart locks)

All tables include audit and sync fields to support **full traceability and conflict resolution**.

---

# 1. Full Database Schema

### Key Design Principles

- **Normalization:** 3NF to reduce redundancy  
- **Security:** Role-Based Access Control (RBAC) + immutable audit logs  
- **Offline Sync:** UUIDs + `last_synced_at` for conflict handling  
- **Integrations:** Foreign keys + event streams  
- **Subscription Model:** Tiered (Standalone / Add-On)

---

## 1.1 Entity-Relationship Overview

### Core Entities
- Hotels
- Rooms
- Users (Staff / Managers / Owners)
- Folios (Bookings)
- Transactions

### Logging & Security
- Access Events
- Audit Logs
- Alerts

### Integrations
- Payment Reconciliation
- OTA Sync
- Auth Gateway Events

### Analytics (P2)
- Aggregated reports and trends

---

## 1.2 Tables

---

## Users & Authentication

### `users`
RBAC-enabled users (staff, managers, owners, admins)

- `id` UUID PRIMARY KEY  
- `fullname` VARCHAR(50) UNIQUE NOT NULL  
- `email` VARCHAR(100) UNIQUE  
- `password_hash` VARCHAR(255) NOT NULL  
- `role` ENUM('manager','staff','owner','admin') NOT NULL  
- `hotel_id` UUID REFERENCES hotels(id)  
- `staff_id` VARCHAR(20) UNIQUE  
- `two_factor_enabled` BOOLEAN DEFAULT FALSE  
- `last_login_at` TIMESTAMP  
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
- `last_synced_at` TIMESTAMP  

---

### `user_sessions`
Offline PWA sessions

- `id` UUID PRIMARY KEY  
- `user_id` UUID REFERENCES users(id)  
- `session_token` VARCHAR(255) UNIQUE  
- `device_info` JSONB  
- `expires_at` TIMESTAMP  
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP  

---

## Hotels & Rooms

### `hotels`
Multi-hotel support

- `id` UUID PRIMARY KEY  
- `name` VARCHAR(100) NOT NULL  
- `address` TEXT  
- `room_count` INTEGER NOT NULL  
- `subscription_tier` ENUM('standalone','add_on')  
- `subscription_status` ENUM('active','trial','expired') DEFAULT 'trial'  
- `subscription_start` DATE  
- `subscription_end` DATE  
- `owner_id` UUID REFERENCES users(id)  
- `created_at` TIMESTAMP  
- `updated_at` TIMESTAMP  
- `last_synced_at` TIMESTAMP  

---

### `rooms`

- `id` UUID PRIMARY KEY  
- `hotel_id` UUID REFERENCES hotels(id) ON DELETE CASCADE  
- `room_number` VARCHAR(20) UNIQUE NOT NULL  
- `type` ENUM('standard','deluxe','suite')  
- `status` ENUM('available','occupied','cleaning','maintenance')  
- `rate_per_hour` DECIMAL(10,2)  
- `rate_per_night` DECIMAL(10,2)  
- `last_occupied_at` TIMESTAMP  
- `created_at` TIMESTAMP  
- `updated_at` TIMESTAMP  
- `last_synced_at` TIMESTAMP  

---

## Subscriptions

### `subscription_plans`

- `id` UUID PRIMARY KEY  
- `name` VARCHAR(50)  
- `price_monthly` DECIMAL(10,2)  
- `features` JSONB  
- `created_at` TIMESTAMP  

---

### `subscriptions`

- `id` UUID PRIMARY KEY  
- `hotel_id` UUID REFERENCES hotels(id)  
- `plan_id` UUID REFERENCES subscription_plans(id)  
- `status` ENUM('active','pending','canceled')  
- `start_date` DATE  
- `end_date` DATE  
- `payment_method` ENUM('opay','palmpay','bank')  
- `last_payment_at` TIMESTAMP  
- `auto_renew` BOOLEAN DEFAULT TRUE  
- `created_at` TIMESTAMP  
- `updated_at` TIMESTAMP  

---

### `subscription_payments`

- `id` UUID PRIMARY KEY  
- `subscription_id` UUID REFERENCES subscriptions(id)  
- `amount` DECIMAL(10,2)  
- `status` ENUM('success','failed','pending')  
- `transaction_id` VARCHAR(50)  
- `paid_at` TIMESTAMP  
- `created_at` TIMESTAMP  

---

## Bookings & Folios

### `folios`

- `id` UUID PRIMARY KEY  
- `hotel_id` UUID  
- `room_id` UUID  
- `guest_name` VARCHAR(100)  
- `guest_phone` VARCHAR(20)  
- `check_in` TIMESTAMP  
- `check_out` TIMESTAMP  
- `duration_minutes` INTEGER  
- `total_amount` DECIMAL(10,2)  
- `payment_status` ENUM('paid','partial','unpaid')  
- `staff_id` UUID REFERENCES users(id)  
- `ota_source` VARCHAR(50)  
- `created_at` TIMESTAMP  
- `updated_at` TIMESTAMP  
- `last_synced_at` TIMESTAMP  

---

## Transactions & Payments

### `transactions`

- `id` UUID PRIMARY KEY  
- `folio_id` UUID REFERENCES folios(id)  
- `amount` DECIMAL(10,2)  
- `type` ENUM('cash','opay','palmpay','bank')  
- `status` ENUM('success','pending','failed','voided')  
- `staff_id` UUID REFERENCES users(id)  
- `approval_required` BOOLEAN  
- `approved_by` UUID REFERENCES users(id)  
- `transaction_ref` VARCHAR(50)  
- `created_at` TIMESTAMP  
- `updated_at` TIMESTAMP  
- `last_synced_at` TIMESTAMP  

---

### `reconciliations`

- `id` UUID PRIMARY KEY  
- `transaction_id` UUID REFERENCES transactions(id)  
- `bank_polled_at` TIMESTAMP  
- `matched` BOOLEAN  
- `discrepancy_note` TEXT  
- `created_at` TIMESTAMP  

---

## Events, Logs & Theft-Proofing

### `access_events`

- `id` UUID PRIMARY KEY  
- `folio_id` UUID  
- `room_id` UUID  
- `event_type` ENUM('entry','exit','attempt')  
- `auth_method` ENUM('lock','biometric','mobile_key','pin')  
- `staff_id` UUID  
- `timestamp` TIMESTAMP  
- `cctv_clip_url` VARCHAR(255)  
- `success` BOOLEAN  
- `created_at` TIMESTAMP  
- `last_synced_at` TIMESTAMP  

---

### `audit_logs`

- `id` UUID PRIMARY KEY  
- `user_id` UUID  
- `action` VARCHAR(100)  
- `entity_id` UUID  
- `details` JSONB  
- `timestamp` TIMESTAMP  

---

### `alerts`

- `id` UUID PRIMARY KEY  
- `type` ENUM('void_excess','mismatch','unlogged')  
- `related_id` UUID  
- `message` TEXT  
- `sent_to` VARCHAR(100)  
- `sent_at` TIMESTAMP  
- `resolved` BOOLEAN  
- `created_at` TIMESTAMP  

---

## Integrations & Housekeeping

### `ota_syncs`
### `housekeeping_tasks`

---

## Analytics (P2)

### `analytics_reports`

---

## 1.3 Indexes & Constraints

- Composite unique indexes (e.g., room_number + hotel_id)
- Indexes on timestamps
- FK indexes for joins
- Triggers for `updated_at`
- Full audit logging
- Views for discrepancy detection

---

## 1.4 Migration Notes

- Prisma or Knex for migrations
- Seed default plans and demo hotel
- Daily `pg_dump` backups

---

# 2. Project Execution Guide (6 Weeks)

## Phase 0: Preparation (3–5 Days)
Infrastructure, schema finalization, team onboarding, risk assessment

## Phase 1: Core UI & Rooms
Auth, RBAC, rooms dashboard, offline PWA

## Phase 2: POS & Payments
OPay / PalmPay, reconciliation, approvals

## Phase 3: OTA & Subscriptions
Channel manager, tier enforcement

## Phase 4: CCTV & Smart Locks
Access events, pilots, security validation

## Phase 5: Auth Gateway & Polish
Unified auth layer, analytics, mobile prototype

## Phase 6: Post-Launch
Monitoring, scaling, marketing, cost audit

---

## Completion Criteria

- MVP live with all P0 features  
- Successful pilot hotels  
- Auth gateway prototype ready  
- Extend to P1/P2 as needed  

---
