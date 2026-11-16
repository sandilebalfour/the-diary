import { connection } from 'next/server'
import { supabase } from '@/lib/supabase'

export default async function Test() {
  await connection()

  const { data: brands } = await supabase.from('brands').select('*')
  const { data: products } = await supabase.from('products').select('*, brands(name)')
  const { data: specials } = await supabase.from('specials').select('*, products(name)')

  return (
    <div style={{ padding: 20 }}>
      <h1>✅ DB Works!</h1>
      
      <h2>Brands: {brands?.length}</h2>
      {brands?.map((b:any) => <p key={b.id}>- {b.name} - {b.location}</p>)}
      
      <h2>Products: {products?.length}</h2>
      {products?.map((p:any) => (
        <p key={p.id}>- {p.name} | R{(p.price_cents/100).toFixed(2)} | Stock: {p.stock} | {p.brands?.name}</p>
      ))}

      <h2>Specials: {specials?.length}</h2>
      {specials?.map((s:any) => (
        <p key={s.id}>- {s.discount_percent}% off {s.products?.name}</p>
      ))}
    </div>
  )
}