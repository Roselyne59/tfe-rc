import { useEffect, useState } from 'react';
import { Eye, Clock, Share2, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/client';
import StatCard from '../components/StatCard';

interface Summary {
  totalEvents: number;
  mostViewedArticles: { articleId: number; viewCount: number }[];
  averageReadTimeGlobal: number;
}

interface Trend {
  date: string;
  views: number;
  interactions: number;
}

interface Ranking {
  articleId: number;
  title: string;
  type: string;
  views: number;
  averageReadTime: number;
  shares: number;
  favorites: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [articleCount, setArticleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/trends?period=day'),
      api.get('/analytics/rankings?sortBy=views&limit=5'),
      api.get('/articles/all'),
    ])
      .then(([summaryRes, trendsRes, rankingsRes, articlesRes]) => {
        setSummary(summaryRes.data);
        setTrends(
          trendsRes.data.map((t: Trend) => ({
            ...t,
            date: new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          })),
        );
        setRankings(rankingsRes.data);
        setArticleCount(articlesRes.data.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500 text-center mt-20">Chargement du dashboard...</div>;
  }

  const totalViews = summary?.mostViewedArticles.reduce((s, a) => s + a.viewCount, 0) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total articles" value={articleCount} icon={FileText} color="bg-indigo-500" />
        <StatCard title="Total vues" value={totalViews} icon={Eye} color="bg-green-500" />
        <StatCard
          title="Temps lecture moyen"
          value={`${Math.round(summary?.averageReadTimeGlobal ?? 0)}s`}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard title="Total événements" value={summary?.totalEvents ?? 0} icon={Share2} color="bg-pink-500" />
      </div>

      {/* Trends chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendance des vues</h2>
        {trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} name="Vues" />
              <Line type="monotone" dataKey="interactions" stroke="#f43098" strokeWidth={2} name="Interactions" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-10">Aucune donnée disponible</p>
        )}
      </div>

      {/* Top articles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 - Articles les plus vus</h2>
        {rankings.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">#</th>
                <th className="pb-3">Titre</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-right">Vues</th>
                <th className="pb-3 text-right">Partages</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((r, i) => (
                <tr key={r.articleId} className="border-b last:border-0">
                  <td className="py-3 text-gray-500">{i + 1}</td>
                  <td className="py-3 font-medium text-gray-900">{r.title}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.type === 'news' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {r.type === 'news' ? 'Article' : 'Vidéo'}
                    </span>
                  </td>
                  <td className="py-3 text-right">{r.views}</td>
                  <td className="py-3 text-right">{r.shares}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center py-10">Aucune donnée disponible</p>
        )}
      </div>
    </div>
  );
}
