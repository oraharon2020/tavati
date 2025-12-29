"use client";

interface Stats {
  totalSessions: number;
  completedSessions: number;
  paidSessions: number;
  totalRevenue: number;
  last7Days: number;
  todaySessions: number;
}

interface StatsCardsProps {
  stats: Stats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "סה״כ תביעות", value: stats?.totalSessions || 0, icon: "📊", color: "bg-blue-500" },
    { label: "הושלמו", value: stats?.completedSessions || 0, icon: "✅", color: "bg-green-500" },
    { label: "שולמו", value: stats?.paidSessions || 0, icon: "💰", color: "bg-purple-500" },
    { label: "הכנסות", value: `₪${stats?.totalRevenue || 0}`, icon: "💵", color: "bg-amber-500" },
  ];

  const activityCards = [
    { label: "היום", value: stats?.todaySessions || 0, color: "from-blue-500 to-blue-600" },
    { label: "7 ימים", value: stats?.last7Days || 0, color: "from-green-500 to-green-600" },
    { 
      label: "המרה", 
      value: `${stats?.totalSessions ? Math.round((stats.paidSessions / stats.totalSessions) * 100) : 0}%`,
      color: "from-purple-500 to-purple-600"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <div className={`w-2 h-2 rounded-full ${card.color}`}></div>
            </div>
            <div className="text-2xl font-bold text-neutral-900">{card.value}</div>
            <div className="text-sm text-neutral-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-3 gap-4">
        {activityCards.map((card) => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-5 text-white`}>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-white/80 text-sm">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
