"use client";

import { useState } from "react";

export default function Disclaimer() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-sm text-amber-800">
      <span>
        This tool provides general information about tenant rights and is not a
        substitute for legal advice. Consult a qualified attorney for advice
        specific to your situation.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-3 text-amber-600 hover:text-amber-800 font-medium"
        aria-label="Dismiss disclaimer"
      >
        Dismiss
      </button>
    </div>
  );
}
