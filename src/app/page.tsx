import LoginForm from '@/components/ui/derived/LoginForm'
import React from 'react'

const page = async({searchParams}:{
  searchParams: Promise<{ error?: string }>
}) => {
  const t=await searchParams
console.log(t)
  return (
    <LoginForm searchParams={t}></LoginForm>
  )
}

export default page
