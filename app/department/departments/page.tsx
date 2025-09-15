'use client';

import { useEffect, useState } from 'react';
import { fetchDepartments } from '@/app/lib/api/departments';
import DepartmentModal from '@/app/ui/payment/DepartmentModal';

type Department = {
    id: string;
    dept_name: string;
    logo_url?: string;
};

export default function DepartmentPaymentPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const data = await fetchDepartments();
                setDepartments(data);
            } catch (error) {
                console.error('Error loading departments:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDepartments();
    }, []);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-semibold mb-6">Choose Department</h1>

            {loading ? (
                <p>Loading departments...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                        <div
                            key={dept.id}
                            className="bg-white shadow rounded p-4 cursor-pointer hover:bg-blue-50 transition"
                            onClick={() => setSelectedDept(dept)}
                        >
                            <img
                                src={dept.logo_url}
                                alt={dept.dept_name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <h2 className="text-lg font-medium text-gray-700">{dept.dept_name}</h2>
                        </div>
                    ))}
                </div>
            )}

            {selectedDept && (
                <DepartmentModal
                    department={selectedDept}
                    onClose={() => setSelectedDept(null)}
                />
            )}

        </div>
    );
}
