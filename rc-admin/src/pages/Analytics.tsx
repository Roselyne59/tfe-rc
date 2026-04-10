import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../api/client';

interface Trend {
  date: string;
  views: number;
  interactions: number;
}

interface ContentTypeStats {
  news: { views: number; averageReadTime: number; shares: number; favorites: number };
  videos: { views: number; averageReadTime: number; shares: number; favorites: number };
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

const COLORS = ['#6366f1', '#f43098'];

export default function Analytics() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [contentStats, setContentStats] = useState<ContentTypeStats | null>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [period, setPeriod] = useState<'day' | 'week'>('day');
  const [sortBy, setSortBy] = useState<string>('views');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/analytics/trends?period=${period}`)
      .then((res) =>
        setTrends(
          res.data.map((t: Trend) => ({
            ...t,
            date: new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          })),
        ),
      )
      .catch(console.error);
  }, [period]);

  useEffect(() => {
    api.get(`/analytics/rankings?sortBy=${sortBy}&limit=20`)
      .then((res) => setRankings(res.data))
      .catch(console.error);
  }, [sortBy]);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/content-types'),
    ])
      .then(([contentRes]) => {
        setContentStats(contentRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500 text-center mt-20">Chargement...</div>;
  }

  const pieData = contentStats
    ? [
        { name: 'Articles', value: contentStats.news.views },
        { name: 'Vidéos', value: contentStats.videos.views },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      {/* Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tendances</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('day')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semaine
            </button>
          </div>
        </div>
        {trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
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
          <p className="text-gray-400 text-center py-10">Aucune donnée de tendance</p>
        )}
      </div>

      {/* Content type breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition par type</h2>
          {pieData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-10">Aucune donnée</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Détail par type</h2>
          {contentStats && (
            <div className="space-y-4">
              {(['news', 'videos'] as const).map((type) => (
                <div key={type} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {type === 'news' ? 'Articles' : 'Vidéos'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Vues:</span> {contentStats[type].views}</div>
                    <div><span className="text-gray-500">Temps moyen:</span> {Math.round(contentStats[type].averageReadTime)}s</div>
                    <div><span className="text-gray-500">Partages:</span> {contentStats[type].shares}</div>
                    <div><span className="text-gray-500">Favoris:</span> {contentStats[type].favorites}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rankings table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Classement</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="views">Par vues</option>
            <option value="readTime">Par temps de lecture</option>
            <option value="shares">Par partages</option>
            <option value="favorites">Par favoris</option>
          </select>
        </div>

        {rankings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">#</th>
                  <th className="pb-3">Titre</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Vues</th>
                  <th className="pb-3 text-right">Temps moy.</th>
                  <th className="pb-3 text-right">Partages</th>
                  <th className="pb-3 text-right">Favoris</th>
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
                    <td className="py-3 text-right">{Math.round(r.averageReadTime)}s</td>
                    <td className="py-3 text-right">{r.shares}</td>
                    <td className="py-3 text-right">{r.favorites}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-10">Aucune donnée de classement</p>
        )}
      </div>
    </div>
  );
}
