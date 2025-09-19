import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Learning Platform
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Hello, {user?.fullName || user?.username || "User"}! 
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Learning Paths
                </h3>
                <p className="text-gray-600">
                  Explore structured learning paths tailored to your goals.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Community
                </h3>
                <p className="text-gray-600">
                  Connect with other learners and share knowledge.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Opportunities
                </h3>
                <p className="text-gray-600">
                  Discover internships, jobs, and events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}