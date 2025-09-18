import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ניהול משימות 3D | תיק עבודות',
  description: 'מערכת ניהול משימות אינטראקטיבית עם ויזואליזציה תלת-ממדית',
}

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}