import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {user?.fullName || "User Profile"}
              </h2>
              <p className="text-gray-600">@{user?.username || "username"}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}