export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-stone-900">Analytics</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-stone-300 rounded-md text-stone-700">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <div className="text-center py-8 text-stone-500">
          <p>Analytics dashboard will be displayed here</p>
          <p className="text-sm mt-2">View your blog performance metrics and insights</p>
        </div>
      </div>
    </div>
  );
}
