import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  view_count: number;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUser(session.user);
    fetchPosts();
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const togglePublish = async (post: Post) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !post.published })
        .eq('id', post.id);
      
      if (error) throw error;
      setPosts(posts.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(168,85,247,0.3)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={20} />
            返回博客
          </Link>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', fontWeight: 700 }}>
            文章管理
          </h1>
        </div>
        <Link
          to="/admin/write"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
            borderRadius: '10px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <Plus size={18} />
          写文章
        </Link>
      </div>

      {/* Posts List */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>还没有文章，开始写第一篇吧！</p>
            <Link
              to="/admin/write"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                borderRadius: '10px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <Plus size={18} />
              写第一篇文章
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  background: 'linear-gradient(145deg, rgba(18,18,26,0.98) 0%, rgba(10,10,15,0.95) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(168,85,247,0.15)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{post.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} />
                      {post.view_count} 阅读
                    </span>
                    <span
                      style={{
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: post.published ? 'rgba(34,197,94,0.2)' : 'rgba(168,85,247,0.2)',
                        color: post.published ? '#22c55e' : '#a855f7',
                      }}
                    >
                      {post.published ? '已发布' : '草稿'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => togglePublish(post)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(168,85,247,0.3)',
                      background: 'transparent',
                      color: '#a855f7',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {post.published ? '下架' : '发布'}
                  </button>
                  <Link
                    to={`/admin/edit/${post.id}`}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(59,130,246,0.3)',
                      background: 'transparent',
                      color: '#3b82f6',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239,68,68,0.3)',
                      background: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
