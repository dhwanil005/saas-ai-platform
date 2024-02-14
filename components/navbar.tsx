import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import {Menu} from "lucide-react";
import Sidebar from "@/components/sidebar";

const Navbar = () => {
    return (
        <div>
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu/>
            </Button>
            <div className="flex w-full justify-end">
                <UserButton signInUrl="/"/>
            </div>
        </div>
    )
}

export default Navbar;