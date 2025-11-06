import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiTag, FiEye } from 'react-icons/fi';
import type { BlogPost } from '../../types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <article className="card group hover:shadow-2xl transition-all duration-300">
      {/* Featured Image */}
      {post.featured_image ? (
        <div className="relative h-56 overflow-hidden rounded-t-xl">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {post.is_featured && (
            <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
              À la une
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-56 overflow-hidden rounded-t-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
          <div className="text-white text-6xl opacity-20">
            <FiTag />
          </div>
          {post.is_featured && (
            <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
              À la une
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {post.category_name && (
          <Link
            to={`/blog/category/${post.category_slug}`}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm mb-3"
          >
            <FiTag className="w-4 h-4" />
            {post.category_name}
          </Link>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              {post.read_time} min
            </span>
          </div>
          <span className="flex items-center gap-1">
            <FiEye className="w-4 h-4" />
            {post.views_count}
          </span>
        </div>

        {/* Author */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Par <span className="font-semibold text-gray-900">{post.author_name}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
