import Link from 'next/link'

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6 text-right">
        <h1 className="text-2xl font-semibold">הפעולה בוטלה</h1>
        <p className="text-zinc-400">מצב דמו: אין חיוב. ניתן לחזור לסל או להמשיך לקנות.</p>
        <div className="flex gap-4 justify-end">
          <Link href="/cart" className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700">חזרה לסל</Link>
          <Link href="/products" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500">המשך קניות</Link>
        </div>
      </div>
    </main>
  )
}
