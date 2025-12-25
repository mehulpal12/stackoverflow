"use client"
import { UseAuthStore } from '@/store/Auth'
import React, { useState } from 'react'

const Login = () => {
    const {login} = UseAuthStore();
     const [IsLoading, setIsLoading] = useState(false)
        const [error, seterror] = useState("")
    
    
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    
            e.preventDefault();
            const formData = new FormData(e.currentTarget)
            const email = formData.get("email")
            const password = formData.get("passowrd")
    
            if (!email || !password) {
                seterror(()=> "please fill all the field")
                return
            }
    
            setIsLoading(true)
            seterror("");
            
            
            const loginResponse = await login(email.toString(), password.toString());
            if (loginResponse.error) {
                seterror(()=> loginResponse.error!.message)
            }
            setIsLoading(false)
    
    
    
        }
  return (
    <div>Login</div>
  )
}

export default Login