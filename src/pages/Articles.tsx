
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  created_at: string;
  image_url?: string;
  category: string;
}

const Articles = () => {
  useScrollToTop();
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const articlesPerPage = 6;

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Articles: Loaded from database:', data);
      setArticles(data || []);
    } catch (error) {
      console.error('Articles: Error loading from database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and surrounding pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yoga-cream">
        <Header />
        <main className="container mx-auto px-4 py-12 pt-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-yoga-forest mb-4">Yoga Articles & Insights</h1>
            <p className="text-lg text-yoga-forest/70 max-w-2xl mx-auto">
              Explore our collection of articles on yoga, meditation, and wellness to deepen your practice and understanding.
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yoga-sage mx-auto mb-4"></div>
            <p className="text-yoga-forest">Loading articles...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yoga-cream">
      <Header />
      
      {/* Articles Content */}
      <main className="container mx-auto px-4 py-12 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yoga-forest mb-4">Yoga Articles & Insights</h1>
          <p className="text-lg text-yoga-forest/70 max-w-2xl mx-auto">
            Explore our collection of articles on yoga, meditation, and wellness to deepen your practice and understanding.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-yoga-forest mb-2">No Articles Yet</h3>
            <p className="text-yoga-forest/70">Check back soon for new articles and insights.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {article.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-yoga-forest mb-3">{article.title}</h3>
                    <p className="text-yoga-forest/70 mb-4 line-clamp-3">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-yoga-sage mb-4">
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Link to={`/articles/${article.id}`}>
                      <Button className="w-full bg-yoga-sage hover:bg-yoga-forest">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-yoga-sage/10'}
                      />
                    </PaginationItem>
                    
                    {renderPaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-yoga-sage/10'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Articles;
