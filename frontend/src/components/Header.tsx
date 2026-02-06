import { useLocation } from 'react-router-dom';
import { Moon } from 'lucide-react';

export default function Header() {
    const location = useLocation();

    const getBreadcrumb = (pathname: string) => {
        if (pathname.startsWith('/settings/')) {
            let subPage = '';
            switch (pathname) {
                case '/settings/general': subPage = 'General'; break;
                case '/settings/profile': subPage = 'Profile & Team'; break;
                case '/settings/settlement-accounts': subPage = 'Settlement Accounts'; break;
                case '/settings/security': subPage = 'Security'; break;
                default: subPage = 'Settings';
            }
            return (
                <>
                    <span className="text-gray-500">Settings</span>
                    <span className="text-gray-300">&gt;</span>
                    <span className="text-gray-900 font-medium">{subPage}</span>
                </>
            );
        }

        let pageTitle = '';
        switch (pathname) {
            case '/dashboard': pageTitle = 'Dashboard'; break;
            case '/transaction': pageTitle = 'Transactions'; break;
            case '/accounts': pageTitle = 'Accounts'; break;
            case '/payment-link': pageTitle = 'Payment Link'; break;
            default: pageTitle = 'Overview';
        }

        return <span className="text-gray-900 font-medium">{pageTitle}</span>;
    };

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm">
                    {getBreadcrumb(location.pathname)}
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-green-700 uppercase">Active</span>
                    </div>

                    <button className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Moon className="w-4 h-4 text-gray-600" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">Akinsola Jegede</div>
                            <div className="text-xs text-gray-500">Admin</div>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#1e5aa8] font-semibold text-sm">
                            AJ
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
