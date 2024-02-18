import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import {Menu} from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileSidebar from "./mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const Navbar = async() => {
    const isPro = await checkSubscription();
    const apiLimitCount = await getApiLimitCount();
    return (
        <div className="flex items-center p-4">
            <MobileSidebar isPro={isPro} apiLimitCount ={apiLimitCount}/>
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    )
}

export default Navbar;