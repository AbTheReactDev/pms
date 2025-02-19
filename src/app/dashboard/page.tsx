"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <div className=" bg-gray-100">
            {/* Hero Section */}
            <header className="bg-blue-600 text-white py-16 text-center">
                <h1 className="text-4xl font-bold">Manage Your Projects Efficiently</h1>
                <p className="mt-4 text-lg">Streamline your workflow and collaborate seamlessly with your team.</p>
                <button
                    onClick={() => router.push("/projects/create")}
                    className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                    Add Your Project
                </button>
            </header>
            
            {/* Features Section */}
            <section className="max-w-6xl mx-auto py-12 px-6">
                <h2 className="text-3xl font-semibold text-center mb-8">Key Features</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard title="Task Management" description="Create, assign, and track tasks effortlessly." />
                    <FeatureCard title="Collaboration" description="Work together with real-time updates and messaging." />
                    <FeatureCard title="Progress Tracking" description="Monitor your project timeline and deadlines easily." />
                    <FeatureCard title="Budget Control" description="Set and track budgets to avoid overspending." />
                    <FeatureCard title="File Sharing" description="Upload and manage documents in one place." />
                    <FeatureCard title="Analytics & Reports" description="Get insights with detailed project reports." />
                </div>
            </section>

           
            
        </div>
    );
}

// Reusable Feature Card Component
const FeatureCard = ({ title, description }: { title: string; description: string }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};
