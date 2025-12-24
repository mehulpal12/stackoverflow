import { UseAuthStore } from "@/store/Auth"
import { useRouter } from "next/router";
import { useEffect } from "react";

const Layout = ({children} : {children: React.ReactNode}) =>{

    const {session} = UseAuthStore();
    const router = useRouter();
    useEffect(() => {
     if (session) {
        router.push('/')
     }
    }, [session,router])
    if (session) {
        return null
    }

    return (
        <div>
            <div>
                {children}
            </div>
        </div>
    )
    
}

export default Layout