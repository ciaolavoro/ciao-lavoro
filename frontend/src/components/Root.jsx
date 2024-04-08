import { Outlet } from "react-router-dom"
import Background from "./Background"
import Navbar from "./Navbar"
import { Toaster } from "./ui/toaster"
import { Dialog } from "./ui/dialog"

export default function Root() {
   return (
      <div className="relative font-sans">
         <Navbar />
         <Background />
         <main className="min-h-screen">
            <Outlet />
         </main>
         <Toaster />
         <Dialog />
         
      </div>
   )
}

