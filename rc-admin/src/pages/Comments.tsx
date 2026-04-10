import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../api/client';

interface Comment {
  id: number;
  author: string;
  content: string;
  articleId: number;
  article?: { title: string; type: string };
  createdAt: string;
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    api.get('/comments')
      .then((res) => setComments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-center mt-20">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Commentaires ({comments.length})
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 bg-gray-50">
              <th className="px-6 py-3">Auteur</th>
              <th className="px-6 py-3">Commentaire</th>
              <th className="px-6 py-3">Article</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{comment.author}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{comment.content}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {comment.article?.title || `Article #${comment.articleId}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  Aucun commentaire
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
