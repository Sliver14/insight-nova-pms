"use client";

import { Suspense } from "react";
import StaffSignupPage from "./page-impl";

export default function StaffSignupPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffSignupPage />
    </Suspense>
  );
}