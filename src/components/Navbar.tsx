import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 mix-blend-difference pointer-events-none">
            <div className="font-orbitron font-bold text-xl uppercase tracking-widest pointer-events-auto">
                <Link href="/">Aryan&apos;s Energy</Link>
            </div>

            <div className="flex gap-8 items-center pointer-events-auto font-medium text-sm tracking-wider uppercase">
                <Link href="#products" className="hover:text-white/70 transition-colors">Products</Link>
                <Link href="#technology" className="hover:text-white/70 transition-colors">Technology</Link>
                <Link href="#about" className="hover:text-white/70 transition-colors">About</Link>
                <button aria-label="Menu" className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </nav>
    );
}
