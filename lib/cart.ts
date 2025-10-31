"use client"

import create from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = { productId: string; qty: number }

type CartState = {
  items: CartItem[]
  add: (productId: string, qty?: number) => void
  remove: (productId: string) => void
  clear: () => void
  count: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId, qty = 1) => {
        set((state) => {
          const idx = state.items.findIndex((i) => i.productId === productId)
          if (idx >= 0) {
            const next = [...state.items]
            next[idx] = { ...next[idx], qty: next[idx].qty + qty }
            return { items: next }
          }
          return { items: [...state.items, { productId, qty }] }
        })
      },
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
    }),
    {
      name: 'cart-v1',
      version: 1,
      // Compatible storage without createJSONStorage; works across zustand versions
      // @ts-ignore
      storage: typeof window !== 'undefined'
        ? {
            getItem: (name: string) => localStorage.getItem(name),
            setItem: (name: string, value: string) => localStorage.setItem(name, value),
            removeItem: (name: string) => localStorage.removeItem(name),
          }
        : undefined,
      // keep only items
      // @ts-ignore
      partialize: (state: CartState) => ({ items: state.items }),
    } as any
  )
)
