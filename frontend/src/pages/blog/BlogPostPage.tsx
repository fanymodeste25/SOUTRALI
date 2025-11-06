import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiTag, FiEye, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import Loading from '../../components/common/Loading';
import BlogCard from '../../components/blog/BlogCard';
import { blogService } from '../../services/blog.service';
import type { BlogPost } from '../../types';
import toast from 'react-hot-toast';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const data = await blogService.getPostBySlug(slug);
      setPost(data);

      // Load related posts from the same category
      if (data.category) {
        const relatedData = await blogService.getPostsByCategory(data.category_slug || '', { page: 1 });
        // Filter out the current post and limit to 3
        const filtered = relatedData.results.filter((p) => p.id !== data.id).slice(0, 3);
        setRelatedPosts(filtered);
      }
    } catch (error: any) {
      console.error('Error loading post:', error);
      toast.error('Article introuvable');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = post?.title || 'Article Soutrali';

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        toast.success('Partagé avec succès');
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Lien copié dans le presse-papiers');
      } catch (error) {
        toast.error('Impossible de copier le lien');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Retour au blog
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category */}
          {post.category_name && (
            <Link
              to={`/blog?category=${post.category}`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
            >
              <FiTag className="w-4 h-4" />
              {post.category_name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

          {/* Meta */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <FiClock className="w-5 h-5" />
                {post.read_time} min de lecture
              </span>
              <span className="flex items-center gap-2">
                <FiEye className="w-5 h-5" />
                {post.views_count} vues
              </span>
            </div>
            <button onClick={handleShare} className="btn-outline flex items-center gap-2">
              <FiShare2 className="w-4 h-4" />
              Partager
            </button>
          </div>

          {/* Author */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-vibrant flex items-center justify-center text-white font-bold text-lg">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author_name}</p>
              <p className="text-sm text-gray-600">Auteur</p>
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Share Again */}
          <div className="bg-gray-100 rounded-xl p-6 text-center mb-12">
            <p className="text-gray-700 mb-4 font-semibold">Cet article vous a plu ?</p>
            <button onClick={handleShare} className="btn-primary">
              <FiShare2 className="w-5 h-5" />
              Partager l'article
            </button>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
