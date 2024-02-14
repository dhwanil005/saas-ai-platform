import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import {Menu} from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar/>
            <div className="flex w-full justify-end">
                <UserButton signInUrl="/"/>
            </div>
        </div>
    )
}

export default Navbar;