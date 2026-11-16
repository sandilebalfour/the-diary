import { connection } from 'next/server'
import { supabase } from '@/lib/supabase'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
  await connection()

  const { data: products } = await supabase
    .from('products')
    .select('*, brands(name, location), specials(discount_percent)')
    .order('created_at', { ascending: false })

  return <HomeClient realProducts={products || []} />
}