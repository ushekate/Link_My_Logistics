'use client';

import { useRouter } from 'next/navigation'

export default function ViewPage() {
  const router = useRouter()
  return router.replace('/client/3pl/services');
}
