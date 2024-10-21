'use client'
import { AppStore, makeStore } from '@/redux/store'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';


type Props = {
   children: React.ReactNode
}

interface contextProps {
   value: string
   setValue: React.Dispatch<React.SetStateAction<string>>
}

const GlobalContext = React.createContext<contextProps>({
   value: 'dark',
   setValue: () => { },
})

export const GlobalProvider = ({ children }: Props) => {
   const [value, setValue] = React.useState('dark')
   const storeRef = useRef<AppStore>()
   if (!storeRef.current) {
      // Create the store instance the first time this renders
      storeRef.current = makeStore()
   }

  
   return (
      <GlobalContext.Provider
         value={{
            value,
            setValue,
         }}
      >
         <Provider store={storeRef.current}>
         <SessionProvider>               

            <ToastContainer />
               {children}
         </SessionProvider>

         </Provider>
      </GlobalContext.Provider>
   )
}

export const useGlobalContext = () => React.useContext(GlobalContext)
