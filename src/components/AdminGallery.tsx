import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, Upload, Eye, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { galleryService } from '@/services/database';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  date: string;
  views?: number;
  size?: string;
  dimensions?: string;
}

const AdminGallery = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    views: '0'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const data = await galleryService.getAll();
      console.log('AdminGallery: Loaded images from database:', data);
      setImages(data);
    } catch (error) {
      console.error('AdminGallery: Error loading images from database:', error);
      toast({
        variant: "destructive",
        title: "Load Error",
        description: "Failed to load images from database.",
      });
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please select an image file.",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create object URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      // Get image dimensions and size
      const img = new Image();
      img.onload = () => {
        const dimensions = `${img.width} x ${img.height}`;
        const size = formatFileSize(file.size);
        
        setFormData(prev => ({
          ...prev,
          url: imageUrl
        }));

        // Store file info for later use
        const fileInfo = { dimensions, size };
        setFormData(prev => ({ ...prev, ...fileInfo }));
      };
      img.src = imageUrl;

      toast({
        title: "Image Uploaded",
        description: "Image has been uploaded successfully. Please fill in the details.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageDimensions = (url: string): Promise<{width: number, height: number, size: string}> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // For existing images, we can't get file size, so we estimate based on dimensions
        const estimatedSize = Math.round((img.width * img.height * 3) / 1024); // Rough estimation
        resolve({
          width: img.width,
          height: img.height,
          size: estimatedSize > 1024 ? `~${(estimatedSize/1024).toFixed(1)} MB` : `~${estimatedSize} KB`
        });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0, size: 'Unknown' });
      };
      img.src = url;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url || !formData.title) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in the required fields (URL/Image and Title).",
      });
      return;
    }

    try {
      const image = {
        title: formData.title,
        description: formData.description || '',
        url: formData.url,
        date: editingImage?.date || new Date().toISOString().split('T')[0],
        views: parseInt(formData.views) || 0
      };

      if (editingImage) {
        await galleryService.update(editingImage.id, image);
        console.log('AdminGallery: Updated image:', image);
        toast({
          title: "Image Updated",
          description: "The gallery image has been updated successfully.",
        });
      } else {
        await galleryService.create(image);
        console.log('AdminGallery: Created new image:', image);
        toast({
          title: "Image Added",
          description: "New image has been added to the gallery successfully.",
        });
      }

      await loadImages(); // Reload images from database
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('AdminGallery: Error saving image:', error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Failed to save image. Please try again.",
      });
    }
  };

  const handleEdit = (image: GalleryImage) => {
    console.log('AdminGallery: Editing image:', image);
    setEditingImage(image);
    setFormData({
      url: image.url,
      title: image.title,
      description: image.description || '',
      views: (image.views || 0).toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('AdminGallery: Deleting image with id:', id);
      await galleryService.delete(id);
      await loadImages(); // Reload images from database
      toast({
        title: "Image Deleted",
        description: "The image has been removed from the gallery.",
      });
    } catch (error) {
      console.error('AdminGallery: Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Delete Error",
        description: "Failed to delete image. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      url: '',
      title: '',
      description: '',
      views: '0'
    });
    setEditingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-yoga-forest">Manage Gallery</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yoga-sage mx-auto mb-4"></div>
          <p className="text-yoga-forest">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-yoga-forest">Manage Gallery</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-yoga-sage hover:bg-yoga-forest"
            >
              <Plus size={16} className="mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Section */}
              <div>
                <Label>Upload Image</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    <Upload size={16} className="mr-2" />
                    {isUploading ? 'Uploading...' : 'Choose Image File'}
                  </Button>
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* URL Input */}
              <div>
                <Label htmlFor="url">Image URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter image title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter image description (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="views">View Count</Label>
                <Input
                  id="views"
                  type="number"
                  min="0"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  placeholder="Enter view count"
                />
              </div>

              {formData.url && (
                <div>
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <img 
                      src={formData.url} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-yoga-sage hover:bg-yoga-forest"
                  disabled={isUploading}
                >
                  <Save size={16} className="mr-2" />
                  {editingImage ? 'Update' : 'Add'} Image
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-yoga-forest mb-1">{image.title}</h3>
              {image.description && (
                <p className="text-sm text-yoga-forest/70 mb-2 line-clamp-2">{image.description}</p>
              )}
              
              {/* Image Info */}
              <div className="space-y-1 mb-3">
                {image.dimensions && (
                  <div className="flex items-center space-x-1 text-xs text-yoga-sage">
                    <ImageIcon size={12} />
                    <span>{image.dimensions}</span>
                  </div>
                )}
                {image.size && (
                  <div className="text-xs text-yoga-sage">
                    Size: {image.size}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-yoga-sage">
                  {new Date(image.date).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-1 text-xs text-yoga-sage">
                  <Eye size={12} />
                  <span>{image.views || 0} views</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(image)}
                  className="text-yoga-forest border-yoga-sage hover:bg-yoga-sage hover:text-white"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(image.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {images.length === 0 && (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <Upload className="mx-auto mb-4 text-yoga-sage" size={48} />
              <h3 className="text-lg font-semibold text-yoga-forest mb-2">No Images Yet</h3>
              <p className="text-yoga-forest/70">Add your first image to get started.</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
