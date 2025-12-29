# InsightNova PMS Product Requirements Document (PRD) - v3.0

**Product Name**: InsightNova Hotel PMS  
**Version**: 3.0 (Dual-Positioning + Smart Locks + Future-Proof Auth)  
**Product Owner**: InsightNova Tech Ltd, Lagos, Nigeria  
**Date**: December 23, 2025

## 1. Strategic Context
Mid-tier Lagos hotels (20-100 rooms) lose 10-30% revenue to staff underreporting, short-stay theft, OTA overbookings, and unrecorded cash. Nigeria's ₦1.67B industry sees 48 new projects, but 80% rely on manuals. InsightNova delivers theft-proofing via staff-linked transactions, CCTV/door sync, and future-proof auth abstraction—20% uplift in 14 days.

## 2. Problem Statement
Managers lack real-time revenue visibility and physical access correlation. Existing solutions (CCTV, smart doors) show occupancy but miss cash logging, staff accountability, and payment mismatches. Future biometrics/mobile keys need revenue enforcement.

## 3. Opportunity
Dual-model: Standalone PMS for new/OTA hotels; security overlay for eZee/MyHotelLine. Offline-first with modular auth (locks → biometrics) ensures longevity amid hardware evolution.

## 4. Solution Vision
Cloud PWA logs every transaction/staff/access event, syncs POS/OTA/CCTV/doors/biometrics, automates short-stays, flags discrepancies with proof. Auth-agnostic layer survives smart lock upgrades.

## 5. Key Differentiators
- Offline-first IndexedDB
- 100% staff-ID + access event logging
- CCTV/door/biometrics → folio linkage
- OPay/PalmPay + bank polling (95% auto-recon)
- Dual deployment + future-proof auth abstraction
- 14-day ROI trial

## 6. Target Users
**Primary**: Managers (35-50) – dashboards with multi-proof revenue verification.  
**Secondary**: Front desk (staff accounts), owners (remote alerts).

## 7. Core Features (P0 MVP)
**7.1 Real-Time Sales Tracking**  
Staff-ID transactions, 95% auto-recon, offline sync, anomaly alerts.

**7.2 Short-Stay Booking**  
30-min timers, auto-billing, no-checkout-without-payment.

**7.3 POS Multi-Payment**  
Cash/OPay QR, manager approvals, unlogged flags.

**7.4 OTA Channel Manager**  
5s sync, double-booking prevention.

## 8. P1 Features (Post-MVP)
**8.1 CCTV Event Sync**  
ONVIF/RTSP folio → desk footage (Hikvision/Dahua).

**8.2 Smart Lock Integration**  
REST/HTTP (SALTO/Luchismart): Check-in keys, entry/exit logs vs. folios.

**8.3 Audit Theft Alerts**  
SMS/WhatsApp on voids >5%, access/payment mismatches.

**8.4 Housekeeping**  
Status dashboard, cleaning notifications.

## 9. P2 Future-Proofing
**9.1 Auth Abstraction Gateway**  
Modular microservice unifies:

Auth Gateway (Node.js)
├── Smart Locks (HTTP/REST: SALTO)
├── Mobile Keys (BLE/NFC APIs)
├── PIN Pads (WebSocket/Serial)
├── Biometrics (Fingerprint/Face: ONVIF+)
└── Event Stream: staffID+timestamp+method+room → Folio

**Acceptance**: Vendor swap <1 week; supports mixed auth; 98% event correlation.

**9.2 Advanced Analytics**  
Trends, mobile app, PDF/Excel exports.

## 10. Technical Requirements
**Stack**: Next.js/React | Node.js | PostgreSQL  
**Offline**: PWA/IndexedDB auto-sync  
**Security**: RBAC, HTTPS, 2FA, full audit logs  
**Performance**: 2s load, 100+ rooms  

**Integrations**:
- Payments: OPay/PalmPay
- OTA: XML (hotels.ng)
- CCTV: ONVIF/RTSP
- Doors/Auth: HTTP/BLE/WebSocket/ONVIF (modular)
- PMS Overlay: eZee/MyHotelLine APIs

**Architecture**:

┌─────────────────┐ ┌──────────────────┐
│ Standalone PMS │ │ Add-On Layer │
│ (Tier 1) │◄──►│ (Tier 2) │
└────────┼────────┘ └──────────────────┘
│
┌────────▼────────┐
│ Auth Gateway │ ──→ PostgreSQL Events
└─────────────────┘
↑
Locks/Bio/Mobile


## 11. Go-To-Market (Dual-Positioning)
**Tier 1: Standalone (70%)**  
New builds/OTA-only: ₦75K/mo + ₦10K security. 10 Q1 signups, ₦9M ARR.

**Tier 2: Add-On (30%)**  
eZee partners (20-30% commission): ₦10K/mo + ₦500K CCTV/door kits. 2 Week 4 pilots.

**Pitch**: "Theft-Proof PMS: Auth-Agnostic Revenue Recovery"

## 12. Project Plan (6 Weeks)
- W1: Core UI/rooms  
- W2: POS/OPay  
- W3: OTA + eZee adapters  
- W4: CCTV/Doors + pilots  
- W5-6: Auth Gateway prototype

**Team**: Solo dev, VA (₦100K), POS (₦200K), Auth freelancer (₦150K).

## 13. Risks & Mitigation
- Power: Offline-first  
- Staff: Login enforcement  
- Partner lock-in: 30% revenue cap  
- Auth evolution: Modular gateway (1-week swaps)

## 14. Budget
₦850K MVP (+₦150K auth layer).

## Positioning Statement
Nigeria's first **auth-agnostic, theft-proof PMS**—CCTV + smart locks + biometrics → guaranteed revenue recovery. Standalone control or legacy overlay, built for Lagos evolution.

