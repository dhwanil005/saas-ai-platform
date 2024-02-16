import Image from "next/image"

export const Loader = () => {
    return (
        <div className="flex flex-col h-full gap-y-4 items-cetner justify-center">
            <div className="w-10 h-10 relative animate-spin">
                <Image
                src="/logo.png"
                fill
                alt="Logo"
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Genius is thinking...
            </p>
        </div>
    )
}