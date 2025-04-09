interface MetricsCardProps {
    title: string;
    value: string;
}

export default function MetricsCard({ title, value }: MetricsCardProps) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-2xl font-bold text-blue-400">{value}</p>
        </div>
    );
}
