import { Navbar } from '@/components/shared/navbar'
import React from 'react'
const dashboardlayout=(
    {

    children

    }:{
        children:React.ReactNode

    }
)=>{
    return(
        <div>
            {/* <Navbar></Navbar> */}
  {children}
      
        </div>
      
       
    )
}
export default dashboardlayout