export default function StatCard({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="bg-white shadow-md rounded-md p-6 text-center">
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-xl font-semibold text-blue-600 mt-2">{value}</p>
        </div>
    );
}
