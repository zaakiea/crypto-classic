"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
    href: string;
    label: string;
    icon: string;
    activeIcon?: string;
}

const SidebarLink = ({ href, label, icon, activeIcon }: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    const iconClass = `material-symbols-outlined text-[20px] transition-transform ${isActive ? "filled" : "group-hover:scale-110"
        }`;

    const baseClasses =
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border-l-4";
    const activeClasses =
        "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-600 font-semibold";
    const inactiveClasses =
        "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border-transparent font-medium";

    return (
        <Link
            href={href}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            <span className={iconClass}>
                {isActive && activeIcon ? activeIcon : icon}
            </span>
            <span className="text-sm">{label}</span>
        </Link>
    );
};

const Sidebar = () => {
    return (
        <aside className="w-72 flex-shrink-0 flex flex-col bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto z-20 transition-all duration-300">
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-indigo-600 rounded-lg size-10 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                        <span className="material-symbols-outlined text-2xl filled">
                            shield
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none tracking-tight">
                            Kripto Klasik
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">
                            Kalkulator Kriptografi
                        </p>
                    </div>
                </div>
                <nav className="flex flex-col gap-1.5">
                    <div className="px-3 py-2 mb-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Classical Ciphers
                    </div>
                    <SidebarLink href="/" label="Vigenère Cipher" icon="verified_user" />
                    <SidebarLink href="/affine" label="Affine Cipher" icon="lock" />
                    <SidebarLink href="/playfair" label="Playfair Cipher" icon="grid_view" />
                    <SidebarLink href="/hill" label="Hill Cipher" icon="trending_up" />
                    <SidebarLink href="/enigma" label="Enigma Cipher" icon="memory" />
                </nav>
            </div>
            <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800/50">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <span className="material-symbols-outlined text-xl">help</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                Butuh Bantuan?
                            </p>
                            <span className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium mt-0.5 block cursor-pointer">
                                Lihat Dokumentasi →
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
