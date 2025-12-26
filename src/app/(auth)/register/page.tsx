"use client"
import { UseAuthStore } from '@/store/Auth'
import React, { useState } from 'react'

const RegisterPage = () => {
    const {createAccount, login} = UseAuthStore()
    const [IsLoading, setIsLoading] = useState(false)
    const [error, seterror] = useState("")


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{

        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const firstname = formData.get("firstname")
        const lastname = formData.get("lastname")
        const email = formData.get("email")
        const password = formData.get("passowrd")

        if (!firstname || !lastname || !email || !password) {
            seterror(()=> "please fill all the field")
            return
        }

        setIsLoading(true)
        seterror("");
        
        
        
       const response =  await createAccount(
            `${firstname} ${lastname}`,
            email?.toString(),
            password?.toString(),
        )

        if (response.error) {
            seterror(()=>response.error!.message)
        }else{
          const loginResponse =  await login(email.toString(), password.toString());
          if(loginResponse.error){
            seterror(()=> loginResponse.error!.message)
          }
        }

        setIsLoading(false)





    }


  return (
    <div>
        {error && (
            <p>{error}</p>
        )}
        <form onSubmit={handleSubmit}>

        </form>
    </div>
  )
}

export default RegisterPage