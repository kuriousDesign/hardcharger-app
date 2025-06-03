import { connectToDatabase } from '@/actions/getActions';

import AdminDashboardCard from './AdminDashboardCard';


export default async function Dashboard() {
    await connectToDatabase();

    return (
        <div className="p-6 space-y-4 flex flex-col items-center justify-center">
            Dashboard
            <AdminDashboardCard />
        </div>
    );
}