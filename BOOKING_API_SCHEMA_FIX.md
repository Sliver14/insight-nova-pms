# Booking API Schema Field Fix

## Problem
The `/app/api/bookings/route.ts` file was using outdated **camelCase** field names that didn't match the updated Prisma schema, which uses **snake_case** field names. This caused `PrismaClientValidationError` and 500 errors when trying to create or query bookings.

## Prisma Schema (Updated - snake_case)
```prisma
model Booking {
  id            String        @id @default(uuid())
  room_id       String        // ✅ snake_case
  guest_name    String        // ✅ snake_case
  guest_email   String        // ✅ snake_case
  check_in      DateTime      // ✅ snake_case
  check_out     DateTime      // ✅ snake_case
  total_price   Float         // ✅ snake_case
  status        BookingStatus
  created_at    DateTime      @default(now())
  updated_at    DateTime      @updatedAt
}
```

## Changes Made

### 1. GET /api/bookings - List Bookings
**Before:**
```typescript
orderBy: { checkInDate: "desc" }  // ❌ Invalid field name
```

**After:**
```typescript
orderBy: { check_in: "desc" }  // ✅ Correct field name
```

---

### 2. POST /api/bookings - Overlap Check Query
**Before:**
```typescript
const overlappingBooking = await prisma.booking.findFirst({
  where: {
    roomId,  // ❌ Invalid
    status: { not: BookingStatus.CANCELLED },
    OR: [
      {
        AND: [
          { checkInDate: { lte: checkIn } },    // ❌ Invalid
          { checkOutDate: { gte: checkIn } }    // ❌ Invalid
        ]
      },
      // ... more invalid fields
    ]
  }
});
```

**After:**
```typescript
const overlappingBooking = await prisma.booking.findFirst({
  where: {
    room_id: roomId,  // ✅ Correct
    status: { not: BookingStatus.CANCELLED },
    OR: [
      {
        AND: [
          { check_in: { lte: checkIn } },   // ✅ Correct
          { check_out: { gte: checkIn } }   // ✅ Correct
        ]
      },
      {
        AND: [
          { check_in: { lte: checkOut } },  // ✅ Correct
          { check_out: { gte: checkOut } }  // ✅ Correct
        ]
      },
      {
        AND: [
          { check_in: { gte: checkIn } },   // ✅ Correct
          { check_out: { lte: checkOut } }  // ✅ Correct
        ]
      }
    ]
  }
});
```

---

### 3. POST /api/bookings - Create Booking
**Before:**
```typescript
const booking = await prisma.booking.create({
  data: {
    roomId,           // ❌ Invalid
    guestName,        // ❌ Invalid
    guestEmail,       // ❌ Invalid
    checkInDate: checkIn,    // ❌ Invalid
    checkOutDate: checkOut,  // ❌ Invalid
    totalPrice,       // ❌ Invalid
    status,
  }
});
```

**After:**
```typescript
const booking = await prisma.booking.create({
  data: {
    room_id: roomId,         // ✅ Correct
    guest_name: guestName,   // ✅ Correct
    guest_email: guestEmail, // ✅ Correct
    check_in: checkIn,       // ✅ Correct
    check_out: checkOut,     // ✅ Correct
    total_price: totalPrice, // ✅ Correct
    status,
  }
});
```

---

### 4. PUT /api/bookings - Update Booking
**Before:**
```typescript
const booking = await prisma.booking.update({
  where: { id },
  data: {
    ...(roomId && { roomId }),               // ❌ Invalid
    ...(guestName && { guestName }),         // ❌ Invalid
    ...(guestEmail && { guestEmail }),       // ❌ Invalid
    ...(checkInDate && { checkInDate: new Date(checkInDate) }),   // ❌ Invalid
    ...(checkOutDate && { checkOutDate: new Date(checkOutDate) }), // ❌ Invalid
    ...(totalPrice !== undefined && { totalPrice }),  // ❌ Invalid
    ...(status && { status }),
  }
});
```

**After:**
```typescript
const booking = await prisma.booking.update({
  where: { id },
  data: {
    ...(roomId && { room_id: roomId }),              // ✅ Correct
    ...(guestName && { guest_name: guestName }),     // ✅ Correct
    ...(guestEmail && { guest_email: guestEmail }),  // ✅ Correct
    ...(checkInDate && { check_in: new Date(checkInDate) }),    // ✅ Correct
    ...(checkOutDate && { check_out: new Date(checkOutDate) }), // ✅ Correct
    ...(totalPrice !== undefined && { total_price: totalPrice }), // ✅ Correct
    ...(status && { status }),
  }
});
```

---

### 5. Enhanced Error Handling
Added better error responses that include Prisma validation errors in development mode:

**Before:**
```typescript
catch (error) {
  console.error("Error creating booking:", error);
  return NextResponse.json(
    { error: "Failed to create booking" },
    { status: 500 }
  );
}
```

**After:**
```typescript
catch (error) {
  console.error("Error creating booking:", error);
  const errorMessage = error instanceof Error ? error.message : "Failed to create booking";
  return NextResponse.json(
    { 
      error: "Failed to create booking",
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined
    },
    { status: 500 }
  );
}
```

Now when Prisma validation errors occur, you'll see the specific error message in the API response during development, making it easier to debug schema mismatches.

---

## Field Mapping Reference

| API Request (camelCase) | Prisma Schema (snake_case) | Notes |
|------------------------|---------------------------|-------|
| `roomId` | `room_id` | Foreign key to Room table |
| `guestName` | `guest_name` | Guest's full name |
| `guestEmail` | `guest_email` | Guest's email address |
| `checkInDate` | `check_in` | Check-in datetime |
| `checkOutDate` | `check_out` | Check-out datetime |
| `totalPrice` | `total_price` | Booking total price |
| `status` | `status` | BookingStatus enum (unchanged) |

**Note:** The API continues to accept camelCase from frontend requests (for backward compatibility), but internally converts them to snake_case for Prisma queries.

---

## Testing Checklist

✅ **GET /api/bookings**
- Should list all bookings without errors
- Should be sorted by check_in date (descending)

✅ **POST /api/bookings**
- Should successfully create bookings with valid data
- Should correctly detect overlapping bookings
- Should return 409 conflict for overlapping dates
- Should validate room existence before creating

✅ **PUT /api/bookings**
- Should successfully update booking fields
- Should handle partial updates correctly
- Should validate dates if provided

✅ **DELETE /api/bookings**
- Should successfully cancel bookings
- Should update status to CANCELLED

---

## Error Responses

### Development Mode
```json
{
  "error": "Failed to create booking",
  "details": "Invalid `prisma.booking.create()` invocation:\n  Unknown field `roomId` for type `BookingCreateInput`"
}
```

### Production Mode
```json
{
  "error": "Failed to create booking"
}
```

---

## Breaking Changes
**None** - This is a bug fix that restores proper functionality. The API request/response format remains the same (camelCase), only the internal Prisma queries were fixed.

---

## Related Files
- ✅ **Modified:** `/app/api/bookings/route.ts` - Fixed all Prisma queries
- 📄 **Reference:** `prisma/schema.prisma` - Booking model definition (lines 127-141)

---

## Verification

To verify the fix is working:

1. **Test Create Booking:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "your-room-id",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "checkInDate": "2025-01-15T14:00:00Z",
    "checkOutDate": "2025-01-17T11:00:00Z",
    "totalPrice": 500.00,
    "status": "CONFIRMED"
  }'
```

2. **Check Response:**
- ✅ Should return 201 with booking data
- ❌ Should NOT return 500 with Prisma validation error

3. **Check Server Logs:**
- Should NOT see `PrismaClientValidationError`
- Should NOT see "Unknown field" errors

---

**Status:** ✅ Fixed and Tested
**Date:** 2025-12-31
**Version:** 1.0
