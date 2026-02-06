import { useState } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Copy,
    Info,
    Loader2,
    AlertCircle,
    Check
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    setPrimaryAccount,
    type Account
} from '../lib/api';
import AccountModal from '../components/AccountModal';

export default function SettlementAccountPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // --- Queries ---
    const { data: accounts = [], isLoading, isError, error } = useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAccounts,
    });

    // --- Mutations ---
    const createMutation = useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            closeModal();
        },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Account> }) => updateAccount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            closeModal();
        },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (err: Error) => setErrorMsg(err.message),
    });

    const setPrimaryMutation = useMutation({
        mutationFn: setPrimaryAccount,
        onMutate: async (newPrimaryId) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['accounts'] });

            // Snapshot the previous value
            const previousAccounts = queryClient.getQueryData<Account[]>(['accounts']);

            // Optimistically update to the new value
            if (previousAccounts) {
                queryClient.setQueryData<Account[]>(['accounts'], (old) =>
                    old?.map(account => ({
                        ...account,
                        isPrimary: account.id === newPrimaryId
                    }))
                );
            }

            // Return a context object with the snapshotted value
            return { previousAccounts };
        },
        onError: (_err, _newPrimaryId, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousAccounts) {
                queryClient.setQueryData(['accounts'], context.previousAccounts);
            }
            setErrorMsg(_err.message);
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });

    // --- Handlers ---
    const openCreateModal = () => {
        setEditingAccount(null);
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const openEditModal = (account: Account) => {
        setEditingAccount(account);
        setErrorMsg(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
        setErrorMsg(null);
    };

    const handleSubmit = (formData: Omit<Account, 'id'>) => {
        if (editingAccount && editingAccount.id) {
            updateMutation.mutate({ id: editingAccount.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (id?: string) => {
        if (!id) return;
        if (confirm('Are you sure you want to delete this account?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleSetPrimary = (id?: string) => {
        if (!id) return;
        setPrimaryMutation.mutate(id);
    };

    const handleCopy = (text: string, id?: string) => {
        if (!id) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-6 flex items-center justify-between bg-gray-50  py-4 rounded-md">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        Settlement Accounts
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage the bank accounts where your settlements are paid out.
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-5 py-3.5 bg-[#1e5aa8] text-white text-sm font-semibold rounded-md shadow hover:bg-[#1a4d8f] transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add New Account
                </button>
            </div>

            {/* Error Message Toast/Banner */}
            {errorMsg && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-700">{errorMsg}</span>
                    <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                </div>
            )}
            {/* Global Error State */}
            {isError && !errorMsg && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Failed to load accounts. Please try again later. {(error as Error)?.message}
                </div>
            )}


            {/* Info Card */}
            <div className="bg-[#f1f7ff] border border-[#b9d7ff] rounded-lg px-5 py-4 mb-6 flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-[2px]">
                    <Info className="w-5 h-5 text-[#1e5aa8]" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-[#1e5aa8] leading-tight">
                        About Settlement Accounts
                    </h3>

                    <p className="text-xs text-[#2f3a4a] leading-relaxed mt-1 max-w-4xl">
                        Settlement accounts are external bank accounts where you receive payouts from your wallet.
                        Ensure the account name matches your registered business name to avoid delays. Changes to
                        settlement accounts may require additional verification.
                    </p>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: Accounts */}
                <div className="lg:col-span-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Your Linked Accounts
                    </h2>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p className="text-sm">Loading accounts...</p>
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">No settlement accounts found.</p>
                            <button
                                onClick={openCreateModal}
                                className="text-[#1e5aa8] font-semibold hover:underline"
                            >
                                Add your first account
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="bg-white border border-gray-200 rounded-xl px-5 py-4 hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">

                                        {/* Left Side (Icon + Details) */}
                                        <div className="flex gap-4">
                                            {/* Bank Icon */}
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                                                {account.icon || '🏛️'}
                                            </div>

                                            {/* Text Content */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        {account.bankName}
                                                    </h3>

                                                    {account.isPrimary && (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Business name */}
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {account.businessName}
                                                </p>

                                                {/* Account number row */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm font-semibold text-gray-900 tracking-wide">
                                                        {account.accountNumber}
                                                    </span>

                                                    <button
                                                        onClick={() => handleCopy(account.accountNumber, account.id)}
                                                        className={`transition-colors cursor-pointer ${copiedId === account.id ? 'text-green-600' : 'text-gray-400 hover:text-[#1e5aa8]'}`}
                                                        title="Copy Account Number"
                                                    >
                                                        {copiedId === account.id ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Verified + Settlement Type */}
                                                <div className="flex items-center gap-3 mt-2 text-xs">
                                                    {account.verified !== false && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                            <span className="text-green-700 font-medium">Verified</span>
                                                        </div>
                                                    )}
                                                    {account.verified === false && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                                                            <span className="text-yellow-700 font-medium">Pending</span>
                                                        </div>
                                                    )}

                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-gray-500">{account.settlementType}</span>
                                                    {account.currency && (
                                                        <>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="font-semibold text-gray-600">{account.currency}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side Actions */}
                                        <div className="flex items-center gap-2">
                                            {!account.isPrimary && (
                                                <button
                                                    onClick={() => handleSetPrimary(account.id)}
                                                    className="text-xs font-semibold text-[#1e5aa8] hover:underline disabled:opacity-50"
                                                    disabled={setPrimaryMutation.isPending}
                                                >
                                                    {setPrimaryMutation.isPending && setPrimaryMutation.variables === account.id ? 'Setting...' : 'Set as Primary'}
                                                </button>
                                            )}

                                            <button
                                                onClick={() => openEditModal(account)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4 text-gray-500" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 border border-gray-200 transition-colors group"
                                                title="Delete"
                                                disabled={deleteMutation.isPending && deleteMutation.variables === account.id}
                                            >
                                                {deleteMutation.isPending && deleteMutation.variables === account.id ? (
                                                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: Help Card */}
                <div className="lg:col-span-4">
                    <div className="bg-[#1e5aa8] rounded-xl p-6 text-white shadow-sm">
                        <h3 className="text-sm font-semibold mb-2">Need help?</h3>
                        <p className="text-blue-100 text-xs leading-relaxed mb-4">
                            Having trouble adding an account or receiving settlements?
                        </p>

                        <button className="w-full px-4 py-2 bg-white text-[#1e5aa8] text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>

            <AccountModal
                key={`${isModalOpen ? 'open' : 'closed'}-${editingAccount?.id ?? 'create'}`}
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialData={editingAccount}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
