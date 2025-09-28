
import { supabase } from '@/integrations/supabase/client';

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  date: string;
  views?: number;
}

// Gallery Service
class GalleryService {
  async getAll(): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.warn('Database query failed for gallery_images:', error);
        const cached = localStorage.getItem('gallery_imagesData');
        return cached ? JSON.parse(cached) : [];
      }

      if (data) {
        localStorage.setItem('gallery_imagesData', JSON.stringify(data));
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching gallery_images:', error);
      const cached = localStorage.getItem('gallery_imagesData');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async create(item: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };

    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.warn('Database insert failed for gallery_images:', error);
        await this.saveToCache(newItem);
        return newItem;
      }

      await this.updateCache();
      return data;
    } catch (error) {
      console.error('Error creating in gallery_images:', error);
      await this.saveToCache(newItem);
      return newItem;
    }
  }

  async update(id: string, updates: Partial<GalleryImage>): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.warn('Database update failed for gallery_images:', error);
        await this.updateCacheItem(id, updates);
        return;
      }

      await this.updateCache();
    } catch (error) {
      console.error('Error updating in gallery_images:', error);
      await this.updateCacheItem(id, updates);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Database delete failed for gallery_images:', error);
        await this.deleteCacheItem(id);
        return;
      }

      await this.updateCache();
    } catch (error) {
      console.error('Error deleting from gallery_images:', error);
      await this.deleteCacheItem(id);
    }
  }

  private async saveToCache(item: GalleryImage): Promise<void> {
    const cached = localStorage.getItem('gallery_imagesData');
    const items = cached ? JSON.parse(cached) : [];
    items.push(item);
    localStorage.setItem('gallery_imagesData', JSON.stringify(items));
  }

  private async updateCacheItem(id: string, updates: Partial<GalleryImage>): Promise<void> {
    const cached = localStorage.getItem('gallery_imagesData');
    if (cached) {
      const items = JSON.parse(cached);
      const index = items.findIndex((item: GalleryImage) => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        localStorage.setItem('gallery_imagesData', JSON.stringify(items));
      }
    }
  }

  private async deleteCacheItem(id: string): Promise<void> {
    const cached = localStorage.getItem('gallery_imagesData');
    if (cached) {
      const items = JSON.parse(cached);
      const filtered = items.filter((item: GalleryImage) => item.id !== id);
      localStorage.setItem('gallery_imagesData', JSON.stringify(filtered));
    }
  }

  private async updateCache(): Promise<void> {
    try {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .order('date', { ascending: false });

      if (data) {
        localStorage.setItem('gallery_imagesData', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error updating cache for gallery_images:', error);
    }
  }
}

// About Service
class AboutService {
  async get() {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single();

      if (error) {
        console.warn('Database query failed for about_content:', error);
        const cached = localStorage.getItem('aboutContent');
        return cached ? JSON.parse(cached) : this.getDefaultContent();
      }

      if (data) {
        const content = {
          heroTitle: data.hero_title,
          heroSubtitle: data.hero_subtitle,
          heroImage: data.hero_image,
          sectionImage: data.section_image,
          mission: data.mission,
          vision: data.vision,
          values: data.values,
          story: data.story,
          founder: {
            name: data.founder_name,
            title: data.founder_title,
            bio: data.founder_bio,
            image: data.founder_image
          }
        };
        localStorage.setItem('aboutContent', JSON.stringify(content));
        return content;
      }

      return this.getDefaultContent();
    } catch (error) {
      console.error('Error fetching about content:', error);
      const cached = localStorage.getItem('aboutContent');
      return cached ? JSON.parse(cached) : this.getDefaultContent();
    }
  }

  async save(content: any) {
    try {
      const dbData = {
        hero_title: content.heroTitle,
        hero_subtitle: content.heroSubtitle,
        hero_image: content.heroImage,
        section_image: content.sectionImage,
        mission: content.mission,
        vision: content.vision,
        values: content.values,
        story: content.story,
        founder_name: content.founder.name,
        founder_title: content.founder.title,
        founder_bio: content.founder.bio,
        founder_image: content.founder.image
      };

      const { error } = await supabase
        .from('about_content')
        .upsert(dbData);

      if (error) {
        console.warn('Database save failed for about_content:', error);
      }

      localStorage.setItem('aboutContent', JSON.stringify(content));
    } catch (error) {
      console.error('Error saving about content:', error);
      localStorage.setItem('aboutContent', JSON.stringify(content));
    }
  }

  private getDefaultContent() {
    return {
      heroTitle: "About Shakti Yoga Raai",
      heroSubtitle: "Transforming lives through authentic yoga practices and spiritual guidance",
      heroImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      sectionImage: "https://i.postimg.cc/ZnnS7KY3/Whats-App-Image-2025-06-06-at-11-19-59-PM.jpg",
      mission: "To provide authentic, transformative yoga experiences that nurture the mind, body, and spirit, helping individuals discover their inner strength and achieve holistic wellness.",
      vision: "To create a global community of conscious individuals who embrace yoga as a way of life, spreading peace, healing, and spiritual awakening.",
      values: [
        "Authenticity in traditional yoga practices",
        "Compassionate guidance for all levels",
        "Holistic approach to wellness",
        "Community and connection",
        "Continuous learning and growth"
      ],
      story: "Shakti Yoga Raai was born from a deep passion for sharing the transformative power of yoga. Founded with the vision of creating a sacred space where ancient wisdom meets modern life, we have been guiding students on their journey of self-discovery for over a decade.",
      founder: {
        name: "Sushmita Debnath",
        title: "Founder & Lead Instructor",
        bio: "With over 15 years of dedicated practice and teaching, Sushmita brings authentic yoga wisdom to modern practitioners. Her gentle yet powerful approach has transformed hundreds of lives.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    };
  }
}

// Booking Service
class BookingService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Database query failed for bookings:', error);
        const cached = localStorage.getItem('bookingsData');
        return cached ? JSON.parse(cached) : [];
      }

      if (data) {
        localStorage.setItem('bookingsData', JSON.stringify(data));
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const cached = localStorage.getItem('bookingsData');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async create(formData: any) {
    const newBooking = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          class_type: formData.classType,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          experience: formData.experience,
          special_requests: formData.specialRequests,
          status: 'pending'
        }]);

      if (error) {
        console.warn('Database insert failed for bookings:', error);
      }

      const cached = localStorage.getItem('bookingsData');
      const bookings = cached ? JSON.parse(cached) : [];
      bookings.unshift(newBooking);
      localStorage.setItem('bookingsData', JSON.stringify(bookings));

      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      const cached = localStorage.getItem('bookingsData');
      const bookings = cached ? JSON.parse(cached) : [];
      bookings.unshift(newBooking);
      localStorage.setItem('bookingsData', JSON.stringify(bookings));
      return newBooking;
    }
  }

  async updateStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.warn('Database update failed for bookings:', error);
      }

      const cached = localStorage.getItem('bookingsData');
      if (cached) {
        const bookings = JSON.parse(cached);
        const index = bookings.findIndex((booking: any) => booking.id === id);
        if (index !== -1) {
          bookings[index].status = status;
          localStorage.setItem('bookingsData', JSON.stringify(bookings));
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      const cached = localStorage.getItem('bookingsData');
      if (cached) {
        const bookings = JSON.parse(cached);
        const index = bookings.findIndex((booking: any) => booking.id === id);
        if (index !== -1) {
          bookings[index].status = status;
          localStorage.setItem('bookingsData', JSON.stringify(bookings));
        }
      }
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Database delete failed for bookings:', error);
      }

      const cached = localStorage.getItem('bookingsData');
      if (cached) {
        const bookings = JSON.parse(cached);
        const filtered = bookings.filter((booking: any) => booking.id !== id);
        localStorage.setItem('bookingsData', JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      const cached = localStorage.getItem('bookingsData');
      if (cached) {
        const bookings = JSON.parse(cached);
        const filtered = bookings.filter((booking: any) => booking.id !== id);
        localStorage.setItem('bookingsData', JSON.stringify(filtered));
      }
    }
  }
}

// Contact Service
class ContactService {
  async get() {
    try {
      const { data, error } = await supabase
        .from('contact_content')
        .select('*')
        .single();

      if (error) {
        console.warn('Database query failed for contact_content:', error);
        const cached = localStorage.getItem('contactContent');
        return cached ? JSON.parse(cached) : this.getDefaultContent();
      }

      if (data) {
        localStorage.setItem('contactContent', JSON.stringify(data));
        return data;
      }

      return this.getDefaultContent();
    } catch (error) {
      console.error('Error fetching contact content:', error);
      const cached = localStorage.getItem('contactContent');
      return cached ? JSON.parse(cached) : this.getDefaultContent();
    }
  }

  async save(content: any) {
    try {
      const { error } = await supabase
        .from('contact_content')
        .upsert(content);

      if (error) {
        console.warn('Database save failed for contact_content:', error);
      }

      localStorage.setItem('contactContent', JSON.stringify(content));
    } catch (error) {
      console.error('Error saving contact content:', error);
      localStorage.setItem('contactContent', JSON.stringify(content));
    }
  }

  private getDefaultContent() {
    return {
      heroTitle: "Get In Touch",
      heroSubtitle: "Ready to begin your yoga journey? We're here to support you every step of the way.",
      address: {
        street: "123 Wellness Street",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400001",
        country: "India"
      },
      phone: {
        primary: "+91 87778 16410",
        secondary: "+91 87778 16410",
        whatsapp: "WhatsApp Available"
      },
      email: {
        info: "info@shaktiyogaraai.com",
        classes: "classes@shaktiyogaraai.com",
        support: "support@shaktiyogaraai.com"
      },
      hours: {
        weekdays: "Monday - Friday: 6:00 AM - 9:00 PM",
        saturday: "Saturday: 7:00 AM - 8:00 PM",
        sunday: "Sunday: 8:00 AM - 6:00 PM"
      }
    };
  }
}

// Popup Service
class PopupService {
  async get() {
    try {
      const { data, error } = await supabase
        .from('popup_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Database query failed for popup_settings:', error);
        const cached = localStorage.getItem('popupSettings');
        return cached ? JSON.parse(cached) : this.getDefaultSettings();
      }

      if (data && data.length > 0) {
        const settings = data[0];
        localStorage.setItem('popupSettings', JSON.stringify(settings));
        return settings;
      }

      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error fetching popup settings:', error);
      const cached = localStorage.getItem('popupSettings');
      return cached ? JSON.parse(cached) : this.getDefaultSettings();
    }
  }

  async save(settings: any) {
    try {
      // First, delete all existing records to ensure only one exists
      await supabase.from('popup_settings').delete().gt('id', '0');
      
      const dbData = {
        enabled: settings.enabled,
        title: settings.title,
        message: settings.message,
        button_text: settings.buttonText,
        button_url: settings.buttonUrl,
        image: settings.image,
        delay: settings.delay
      };

      const { error } = await supabase
        .from('popup_settings')
        .insert(dbData);

      if (error) {
        console.warn('Database save failed for popup_settings:', error);
      }

      localStorage.setItem('popupSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving popup settings:', error);
      localStorage.setItem('popupSettings', JSON.stringify(settings));
    }
  }

  private getDefaultSettings() {
    return {
      enabled: true,
      title: "INTERNATIONAL YOGA DAY",
      message: "NATIONAL YOGASANA CHAMPIONSHIP, INDIAN YOGA FEDERATION - 4TH RANK\n\nMind-Body Harmony\n\n• Yoga builds strength and calms the mind, reducing stress.\n\n• Flexibility & Strength\n- Enhances mobility, posture, and prevents injuries.\n\n• Breathe Better, Live Better\n- Boosts lung capacity and heart health through pranayama.\n\n• Detox & Immunity\n- Aids digestion, flushes toxins, and strengthens immunity.\n\n• Sharper Focus & Better Sleep\n- Improves concentration, sleep, and daily energy.",
      button_text: "Join us",
      button_url: "https://wa.me/919840382848?text=Hi! I would like to join NATIONAL YOGASANA CHAMPIONSHIP",
      image: "https://i.postimg.cc/vBRYzYK8/popup1.webp",
      delay: 5000
    };
  }
}

export const galleryService = new GalleryService();
export const aboutService = new AboutService();
export const bookingService = new BookingService();
export const contactService = new ContactService();
export const popupService = new PopupService();
