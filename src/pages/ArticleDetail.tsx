
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Eye, Share2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/Header';
import { useScrollToTop } from '@/hooks/useScrollToTop';
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
  views?: number;
}

const ArticleDetail = () => {
  useScrollToTop();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      setIsLoading(true);
      
      // First fetch the article
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error loading article:', error);
        setArticle(null);
        return;
      }

      console.log('ArticleDetail: Loaded article from database:', data);
      
      // Create our article object with our interface to handle the views property
      const articleData: Article = {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        author: data.author,
        created_at: data.created_at,
        image_url: data.image_url || undefined,
        category: data.category,
        views: (data as any).views || 0
      };
      
      setArticle(articleData);

      // Then increment the view count using a type assertion
      const currentViews = (data as any).views || 0;
      
      // Update the views in the database
      const { error: updateError } = await supabase
        .from('articles')
        .update({ 
          // Use a type assertion to bypass the type check
          ...(data as any),
          views: currentViews + 1
        } as any)
        .eq('id', articleId);
      
      if (updateError) {
        console.warn('Could not increment views:', updateError);
      } else {
        // Update local state with new view count
        setArticle(prev => prev ? { ...prev, views: currentViews + 1 } : null);
      }
    } catch (error) {
      console.error('ArticleDetail: Error loading article:', error);
      setArticle(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || 'Check out this article';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yoga-cream">
        <Header />
        <div className="container mx-auto px-4 py-12 pt-32">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yoga-sage mx-auto mb-4"></div>
            <p className="text-yoga-forest">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-yoga-cream">
        <Header />
        <div className="container mx-auto px-4 py-12 pt-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yoga-forest mb-4">Article Not Found</h1>
            <Link to="/articles">
              <Button className="bg-yoga-sage hover:bg-yoga-forest">
                <ArrowLeft size={16} className="mr-2" />
                Back to Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yoga-cream">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-32">
        <div className="max-w-4xl mx-auto">
          <Link to="/articles" className="inline-flex items-center text-yoga-sage hover:text-yoga-forest mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Articles
          </Link>
          
          <Card className="overflow-hidden">
            {article.image_url && (
              <div className="h-64 md:h-80 overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-yoga-forest mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center justify-between text-sm text-yoga-sage mb-6 pb-6 border-b border-yoga-sage/20">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {article.views !== undefined && (
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{article.views} views</span>
                  </div>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none text-yoga-forest">
                {article.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share Section */}
              <div className="mt-8 pt-6 border-t border-yoga-sage/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-yoga-forest">Share this article</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="border-yoga-sage text-yoga-sage hover:bg-yoga-sage hover:text-white">
                        <Share2 size={16} className="mr-2" />
                        Share
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <h4 className="font-medium text-yoga-forest">Share on social media</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => handleShare('facebook')}
                            className="text-sm"
                          >
                            Facebook
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleShare('twitter')}
                            className="text-sm"
                          >
                            Twitter
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleShare('linkedin')}
                            className="text-sm"
                          >
                            LinkedIn
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleShare('whatsapp')}
                            className="text-sm"
                          >
                            WhatsApp
                          </Button>
                        </div>
                        <div className="pt-2 border-t">
                          <Button 
                            variant="secondary" 
                            onClick={handleCopyLink}
                            className="w-full"
                          >
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ArticleDetail;
