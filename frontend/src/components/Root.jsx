import { Outlet } from "react-router-dom";
import Background from "./Background";
import Navbar from "./Navbar";

export default function Root() {
    return (
        <div className="relative font-sans">
            <Navbar />
            <Background />
            <main className="h-screen">
                <Outlet />
            </main>
        </div>
    )
}