import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function WritePost() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      fetchPost();
    }
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUser(session.user);
  };

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setExcerpt(data.excerpt || '');
        setCoverImage(data.cover_image || '');
        setPublished(data.published);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(generateSlug(newTitle));
    }
  };

  const savePost = async () => {
    if (!title || !content) {
      alert('标题和内容不能为空');
      return;
    }

    setSaving(true);

    try {
      const postData = {
        title,
        slug: slug || generateSlug(title),
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        cover_image: coverImage,
        published,
        author_id: user.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert(postData);
        if (error) throw error;
      }

      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert('保存失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin" style={{ color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={20} />
            返回管理
          </Link>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.5rem', fontWeight: 700 }}>
            {isEditing ? '编辑文章' : '写文章'}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setPublished(!published)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid rgba(168,85,247,0.3)',
              background: published ? 'rgba(34,197,94,0.2)' : 'transparent',
              color: published ? '#22c55e' : '#a855f7',
              cursor: 'pointer',
            }}
          >
            {published ? <Eye size={18} /> : <EyeOff size={18} />}
            {published ? '已发布' : '草稿'}
          </button>
          <button
            onClick={savePost}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
              borderRadius: '10px',
              border: 'none',
              color: 'white',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              fontWeight: 600,
            }}
          >
            <Save size={18} />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#d1d5db', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="输入文章标题..."
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(18,18,26,0.8)',
                border: '2px solid rgba(168,85,247,0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.25rem',
                fontFamily: "'Orbitron', sans-serif",
                outline: 'none',
              }}
            />
          </div>

          {/* Slug */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#d1d5db', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              URL 别名
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(18,18,26,0.8)',
                border: '2px solid rgba(168,85,247,0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#d1d5db', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              封面图片 URL
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(18,18,26,0.8)',
                border: '2px solid rgba(168,85,247,0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#d1d5db', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              摘要
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="文章摘要（可选，不填则自动截取正文）..."
              rows={3}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(18,18,26,0.8)',
                border: '2px solid rgba(168,85,247,0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: "'Rajdhani', sans-serif",
              }}
            />
          </div>

          {/* Content */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#d1d5db', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              正文内容 (支持 HTML)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<h2>标题</h2><p>正文内容...</p>"
              rows={20}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(18,18,26,0.8)',
                border: '2px solid rgba(168,85,247,0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'monospace',
                lineHeight: 1.6,
              }}
            />
          </div>

          {/* Preview */}
          {content && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#d1d5db', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                预览
              </label>
              <div
                style={{
                  padding: '24px',
                  background: 'rgba(18,18,26,0.8)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  borderRadius: '12px',
                  color: '#d1d5db',
                  lineHeight: 1.8,
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
