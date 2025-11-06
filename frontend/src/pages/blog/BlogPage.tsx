import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import BlogCard from '../../components/blog/BlogCard';
import Loading from '../../components/common/Loading';
import { blogService } from '../../services/blog.service';
import type { BlogPost, BlogCategory, PaginatedResponse } from '../../types';
import toast from 'react-hot-toast';

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<{ count: number; next?: string; previous?: string }>({
    count: 0,
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [currentPage, selectedCategory, searchParams]);

  const loadCategories = async () => {
    try {
      const data = await blogService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
      };

      const search = searchParams.get('search');
      if (search) {
        params.search = search;
      }

      const category = searchParams.get('category');
      if (category) {
        params.category = category;
      }

      const data: PaginatedResponse<BlogPost> = await blogService.getAllPosts(params);
      setPosts(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (error: any) {
      console.error('Error loading posts:', error);
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params: any = { category: categoryId };
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params: any = { page: page.toString() };
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchParams({});
  };

  const totalPages = Math.ceil(pagination.count / 20);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-vibrant text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Blog Soutrali</h1>
          <p className="text-xl text-center max-w-3xl mx-auto opacity-90">
            Découvrez nos articles sur la solidarité, l'impact social et les histoires inspirantes de notre communauté
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rechercher
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un article..."
                    className="input-field pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Catégories</h3>
                <div className="space-y-2">
                  <button
                    onClick={clearFilters}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      !selectedCategory
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Tous les articles
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.name}
                      <span className="text-sm text-gray-500 ml-2">({category.post_count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory) && (
                <button onClick={clearFilters} className="btn-outline w-full">
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {loading ? (
              <Loading />
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Aucun article trouvé</p>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    {pagination.count} article{pagination.count > 1 ? 's' : ''} trouvé{pagination.count > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.previous}
                      className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-gray-700 font-medium px-4">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.next}
                      className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
