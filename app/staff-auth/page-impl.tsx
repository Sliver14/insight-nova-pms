"use client";

import { Suspense } from "react";
import StaffAuthPage from "./page-impl";

export default function StaffAuthPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffAuthPage />
    </Suspense>
  );
}
