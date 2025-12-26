import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs{
    reputation: number
}

interface IAuthStore{
    session: Models.Session | null;
    jwt: string | null;
    user:Models.User<UserPrefs>| null;
    hydrated: boolean;


    setHydrated(): void;
    verifySession(): Promise<void>;
    login(
        email:string,
        password: string,

    ): Promise<{success: boolean; error?:AppwriteException | null}>

    createAccount(
        name:string,
        email:string,
        password: string,

    ): Promise<{success: boolean; error?:AppwriteException | null}>
    logout(): Promise<void>


}


export const UseAuthStore = create<IAuthStore>()(
    persist(
        immer((set)=>({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            setHydrated: () => set({ hydrated: true }),

            verifySession: async () => {
                try {
                    const session = await account.getSession("current");
                    set({ session });
                } catch (error) {
                    console.log(error);
                }
            },

            login: async (email: string, password: string) => {
                try {
                    const session = await account.createEmailPasswordSession(email, password);
                    const [user, jwtRes] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ]);
                    const jwt = (jwtRes as any)?.jwt ?? null;

                    if (!user?.prefs?.reputation) {
                        await account.updatePrefs<UserPrefs>({ reputation: 0 });
                    }

                    set({ session, user, jwt });
                    return { success: true };
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null,
                    };
                }
            },

            createAccount: async (name: string, email: string, password: string) => {
                try {
                    await account.create(ID.unique(), email, password, name);
                    return { success: true };
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null,
                    };
                }
            },

            logout: async () => {
                try {
                    await account.deleteSession('current');
                    set({ session: null, jwt: null, user: null });
                } catch (error) {
                    console.log(error);
                }
            }
        })),
        {
            name:"auth",
            onRehydrateStorage(){
                return (state, error) =>{
                    if (!error) state?.setHydrated()
                }
            }
        }
    )
)