"use client";

import { useState } from 'react';
import {
    LayoutDashboard,
    ArrowLeftRight,
    Building2,
    Link2,
    Settings,
    Webhook,
    ShieldCheck,
    FileText,
    LogOut,
    ChevronDown
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
    icon: LucideIcon;
    label: string;
    path: string;


}

export default function VitalSwapSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(true);

    const menuItems: NavItem[] = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ArrowLeftRight, label: 'Transactions', path: '/transaction' },
        { icon: Building2, label: 'Accounts', path: '/accounts' },
        { icon: Link2, label: 'Payment Link', path: '/payment-link' },
    ];

    return (
        <aside className="w-65 h-screen bg-white border-r border-gray-100 flex flex-col font-sans">
            {/* Logo Section */}
            <div className="p-6 mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#003366] rounded-lg flex items-center justify-center">
                        <div className="flex flex-col gap-1">
                            <div className="w-4 h-1 bg-white rounded-full opacity-40"></div>
                            <div className="w-4 h-1 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-[#001f3f] tracking-tight">VitalSwap</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">

                {/* Main Menu */}
                <div className="mb-6">
                    <h3 className="px-3 mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Main Menu
                    </h3>
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.label}>
                                <button
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${location.pathname === item.path
                                        ? 'bg-gray-50 text-gray-900'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => { navigate(item.path) }}
                                >
                                    <item.icon className="w-5 h-5" strokeWidth={2} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Configuration */}
                <div className="mb-6">
                    <h3 className="px-3 mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Configuration
                    </h3>
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Settings className="w-5 h-5 text-[#003366]" strokeWidth={2} />
                                    <span className="text-[#003366] font-semibold">Settings</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSettingsOpen ? '' : '-rotate-90'}`} />
                            </button>

                            {isSettingsOpen && (
                                <ul className="mt-1 ml-9 space-y-1 border-l border-gray-100">
                                    {[
                                        { label: 'General', path: '/settings/general' },
                                        { label: 'Profile & Team', path: '/settings/profile' },
                                        { label: 'Settlement Accounts', path: '/settings/settlement-accounts' },
                                        { label: 'Security', path: '/settings/security' }
                                    ].map((subItem) => (
                                        <li key={subItem.label}>
                                            <button
                                                onClick={() => navigate(subItem.path)}
                                                className={`w-full text-left px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${location.pathname === subItem.path
                                                    ? 'text-[#003366] bg-[#f0f7ff] rounded-r-lg border-l-2 border-[#003366] -ml-[1px]'
                                                    : 'text-gray-400 hover:text-gray-700'
                                                    }`}
                                            >
                                                {subItem.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>

                {/* Compliance */}
                <div className="space-y-1">
                    {[
                        { icon: Webhook, label: 'Webhooks' },
                        { icon: ShieldCheck, label: 'Due Diligence' },
                        { icon: FileText, label: 'API Docs' }
                    ].map((item) => (
                        <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all cursor-pointer">
                            <item.icon className="w-5 h-5" strokeWidth={2} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Logout Footer */}
            <div className="p-4 mt-auto border-t border-gray-50">
                <button className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-[#d32f2f] hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" strokeWidth={2.5} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}