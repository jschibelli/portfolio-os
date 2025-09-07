import { Card, Metric, Text, AreaChart, DonutChart } from "@tremor/react";

export default function AnalyticsPage() {
  const chartdata = [
    {
      date: "Jan 22",
      "Page Views": 1670,
      "Unique Visitors": 1450,
    },
    {
      date: "Jan 23",
      "Page Views": 1800,
      "Unique Visitors": 1600,
    },
    {
      date: "Jan 24",
      "Page Views": 2100,
      "Unique Visitors": 1850,
    },
    {
      date: "Jan 25",
      "Page Views": 1950,
      "Unique Visitors": 1700,
    },
    {
      date: "Jan 26",
      "Page Views": 2200,
      "Unique Visitors": 1950,
    },
    {
      date: "Jan 27",
      "Page Views": 2400,
      "Unique Visitors": 2100,
    },
    {
      date: "Jan 28",
      "Page Views": 2600,
      "Unique Visitors": 2300,
    },
  ];

  const topPages = [
    { name: "Homepage", value: 456 },
    { name: "Getting Started Guide", value: 351 },
    { name: "API Documentation", value: 271 },
    { name: "About Us", value: 191 },
    { name: "Contact", value: 164 },
  ];

  const trafficSources = [
    { name: "Direct", value: 456 },
    { name: "Search", value: 351 },
    { name: "Social", value: 271 },
    { name: "Referral", value: 191 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your blog performance and visitor insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Text>Total Page Views</Text>
          <Metric>15,670</Metric>
          <Text className="text-green-600">+12.5% from last month</Text>
        </Card>
        <Card>
          <Text>Unique Visitors</Text>
          <Metric>13,450</Metric>
          <Text className="text-green-600">+8.2% from last month</Text>
        </Card>
        <Card>
          <Text>Bounce Rate</Text>
          <Metric>42.3%</Metric>
          <Text className="text-red-600">+2.1% from last month</Text>
        </Card>
        <Card>
          <Text>Avg. Session Duration</Text>
          <Metric>4m 32s</Metric>
          <Text className="text-green-600">+15.3% from last month</Text>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Text className="text-lg font-semibold mb-4">Page Views Trend</Text>
          <AreaChart
            className="h-72 mt-4"
            data={chartdata}
            index="date"
            categories={["Page Views", "Unique Visitors"]}
            colors={["blue", "green"]}
          />
        </Card>

        <Card>
          <Text className="text-lg font-semibold mb-4">Top Pages</Text>
          <DonutChart
            className="h-72 mt-4"
            data={topPages}
            category="value"
            index="name"
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
          />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Text className="text-lg font-semibold mb-4">Traffic Sources</Text>
          <DonutChart
            className="h-72 mt-4"
            data={trafficSources}
            category="value"
            index="name"
            colors={["blue", "green", "yellow", "red"]}
          />
        </Card>

        <Card>
          <Text className="text-lg font-semibold mb-4">Recent Activity</Text>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Peak traffic hour</p>
                <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
              </div>
              <span className="text-blue-600 font-semibold">1,234 views</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Most popular device</p>
                <p className="text-sm text-gray-600">Mobile (62%)</p>
              </div>
              <span className="text-green-600 font-semibold">9,715 users</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">Top country</p>
                <p className="text-sm text-gray-600">United States</p>
              </div>
              <span className="text-yellow-600 font-semibold">8,234 users</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

