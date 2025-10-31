import Link from 'next/link'
import ClearCartOnSuccess from '../ClearCartOnSuccess'
import PrintReceiptButton from '../PrintReceiptButton'
import { getVatPercent } from '@/lib/pricing'

type Props = { searchParams?: { [key: string]: string | string[] | undefined } }

export default async function SuccessPage({ searchParams }: Props) {
  const status = (searchParams?.status as string) || 'demo'

  const vatPercent = getVatPercent()

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      {/* Clear local cart now that payment succeeded */}
      <ClearCartOnSuccess />
      <div className="max-w-3xl mx-auto space-y-6 text-right">
        <h1 className="text-2xl font-semibold">התשלום הושלם בהצלחה</h1>
        <p className="text-zinc-300">מצב: {status === 'demo' ? 'דמו (ללא חיוב)' : 'הצלחה'}</p>
        <p className="text-zinc-400">זהו עמוד הצלחה לדמו. במעבר לפרודקשן ניתן להציג כאן פירוט הזמנה.</p>
        <div className="flex gap-4 justify-end">
          <PrintReceiptButton />
          <Link href="/products" className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500">חזרה לחנות</Link>
          <Link href="/" className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700">לדף הבית</Link>
        </div>
      </div>
    </main>
  )
}
