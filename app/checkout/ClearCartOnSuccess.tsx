"use client"

import { useEffect } from 'react'
import { useCart } from '@/lib/cart'

export default function ClearCartOnSuccess() {
  const clear = useCart((s) => s.clear)
  useEffect(() => {
    clear()
  }, [clear])
  return null
}

