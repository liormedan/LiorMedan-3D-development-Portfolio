"use client"

import * as zustand from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = { productId: string; qty: number }

type CartState = {
  items: CartItem[]
  add: (productId: string, qty?: number) => void
  remove: (productId: string) => void
  clear: () => void
  count: () => number
}

const createCompat: any = (zustand as any).default ?? (zustand as any).create

export const useCart = (createCompat as any)()(
  persist(
    (set: any, get: any) => ({
      items: [],
      add: (productId: string, qty: number = 1) => {
        set((state: any) => {
          const idx = state.items.findIndex((i: any) => i.productId === productId)
          if (idx >= 0) {
            const next = [...state.items]
            next[idx] = { ...next[idx], qty: next[idx].qty + qty }
            return { items: next }
          }
          return { items: [...state.items, { productId, qty }] }
        })
      },
      remove: (productId: string) => set((s: any) => ({ items: s.items.filter((i: any) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
      count: () => (get() as any).items.reduce((acc: number, i: any) => acc + i.qty, 0),
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
        : {
            getItem: (_: string) => null,
            setItem: (_: string, __: string) => {},
            removeItem: (_: string) => {},
          },
      // keep only items
      // @ts-ignore
      partialize: (state: CartState) => ({ items: state.items }),
    } as any
  )
)
