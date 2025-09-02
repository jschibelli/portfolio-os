export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-stone-900">Settings</h1>
        <button className="bg-stone-600 text-white px-4 py-2 rounded-md hover:bg-stone-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <div className="text-center py-8 text-stone-500">
          <p>Settings configuration will be displayed here</p>
          <p className="text-sm mt-2">Configure your blog settings and preferences</p>
        </div>
      </div>
    </div>
  );
}
