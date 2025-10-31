import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const safeName = (file.name || 'model').replace(/[^a-z0-9_.-]/gi, '_')
    const stamp = Date.now()
    const targetDir = path.join(process.cwd(), 'public', 'models')
    await fs.mkdir(targetDir, { recursive: true })
    const targetPath = path.join(targetDir, `${stamp}_${safeName}`)
    await fs.writeFile(targetPath, buffer)
    const publicPath = `/models/${stamp}_${safeName}`
    return NextResponse.json({ path: publicPath, name: `${stamp}_${safeName}` })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}

