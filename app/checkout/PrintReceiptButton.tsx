"use client"

export default function PrintReceiptButton() {
  return (
    <button onClick={() => window.print()} className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm">
      הדפס/שמור כ‑PDF
    </button>
  )
}

