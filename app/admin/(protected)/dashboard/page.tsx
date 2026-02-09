'use client';

import Link from 'next/link';

const ActionCard = ({ title, href, desc }: { title: string, href: string, desc?: string }) => (
    <Link href={href} className="block group">
        <div className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all hover:scale-[1.02] cursor-pointer h-full">
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-yellow-400">{title}</h3>
            {desc && <p className="text-gray-400 text-sm">{desc}</p>}
        </div>
    </Link>
);

const AdminDashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. CREATE STAFF - FIXED */}
                <ActionCard
                    title="1. Create Staff Account"
                    href="/admin/staff/create"
                    desc="Username/Password → Flutter login instant"
                />

                {/* 2. CUSTOMER ACCESS */}
                <ActionCard
                    title="2. Enable Customer Login"
                    href="/admin/customer-access"
                    desc="Phone → Customer app + SMS"
                />

                {/* 3-7 OTHER ACTIONS */}
                <ActionCard title="3. Manage Assignments" href="/admin/staff/manage" desc="Assign customers to staff" />
                <ActionCard title="4. Manage Schemes" href="/admin/schemes" desc="Create/Edit investment schemes" />
                <ActionCard title="5. Market Rates" href="/admin/market-rates" desc="Update Gold/Silver rates" />
                <ActionCard title="6. Toggle Schemes" href="/admin/schemes" desc="Enable/Disable schemes" />
                <ActionCard title="7. Approve Withdrawals" href="/admin/withdrawals" desc="Review withdrawal requests" />
            </div>
        </div>
    );
};

export default AdminDashboard;
