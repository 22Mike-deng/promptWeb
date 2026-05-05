import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

interface Post {
  id: string;
  title: string;
  content: string;
  cover_image: string;
  created_at: string;
  view_count: number;
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);
      
      // Increment view count
      if (data) {
        await supabase
          .from('posts')
          .update({ view_count: data.view_count + 1 })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
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

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '2rem', marginBottom: '16px' }}>文章未找到</h1>
        <Link to="/" style={{ color: '#a855f7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={20} />
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white' }}>
      <Navbar />
      {/* Cover Image */}
      {post.cover_image && (
        <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
          <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, #0a0a0f 100%)' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} />
            返回首页
          </Link>

          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '16px', lineHeight: 1.3 }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#6b7280', fontSize: '0.875rem', marginBottom: '40px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} />
              {new Date(post.created_at).toLocaleDateString('zh-CN')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={16} />
              {post.view_count} 次阅读
            </span>
          </div>

          <div
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: '#d1d5db',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </div>
    </div>
  );
}
