
import { supabase } from '@/integrations/supabase/client';

export interface Program {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  duration: string;
  level: string;
  students: string;
  price: string;
  features: string[];
  rating: number;
  type: string;
  icon: string;
}

export interface ProgramsSection {
  title: string;
  subtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
}

// Type definitions for the programs tables
interface ProgramsTable {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  duration: string;
  level: string;
  students: string;
  price: string;
  features: string;
  rating: number;
  type: string;
  icon: string;
}

interface ProgramsSectionTable {
  id: string;
  title: string;
  subtitle: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button_text: string;
}

const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 'A',
    name: '12 Days Online Group Session',
    subtitle: 'Kundalini Shakti Yoga & Introduction to Yogic Theory and Indic Theology',
    description: 'Transform your understanding of yoga with our comprehensive online group sessions covering Kundalini Shakti practices and deep yogic philosophy.',
    duration: '12 Days',
    level: 'All Levels',
    students: '15-20',
    price: '₹8,500',
    features: ['Kundalini Shakti', 'Yogic Theory', 'Indic Theology', 'Group Learning'],
    rating: 4.9,
    type: 'Online Group',
    icon: 'Users'
  },
  {
    id: 'B',
    name: '3-Month Personal Yoga Journey',
    subtitle: 'Weekly 2-day class - A commitment to your highest self',
    description: 'Embark on a 24-day transformational path tailored just for you. One-on-one guidance. Deep spiritual discipline. Visible physical and inner growth.',
    duration: '3 Months',
    level: 'Personalized',
    students: '1-on-1',
    price: '₹45,000',
    features: ['Personal Guidance', 'Spiritual Discipline', 'Physical Growth', 'Inner Transformation'],
    rating: 5.0,
    type: 'Personal Journey',
    icon: 'TrendingUp'
  },
  {
    id: 'C',
    name: '21 Days of Living Yoga',
    subtitle: 'A Soulful Residential Sadhana with Teacher Certification',
    description: 'Upon completion, you will be certified as a Yoga Teacher, empowered to share and guide others on the path. Intensive residential program for deep transformation.',
    duration: '21 Days',
    level: 'Advanced',
    students: '8-12',
    price: '₹75,000',
    features: ['Residential Program', 'Teacher Certification', 'Sadhana Practice', 'Guide Others'],
    rating: 5.0,
    type: 'Residential Certification',
    icon: 'Award'
  },
  {
    id: 'D',
    name: 'Stretch-Fit Yoga Trousers',
    subtitle: 'Premium comfort for your yoga practice',
    description: 'High-quality, comfortable yoga trousers designed for optimal flexibility and breathability during your practice sessions.',
    duration: 'Product',
    level: 'All Sizes',
    students: 'Individual',
    price: '₹2,500',
    features: ['Premium Fabric', 'Stretch-Fit', 'Breathable', 'Durable'],
    rating: 4.8,
    type: 'Yoga Apparel',
    icon: 'Home'
  }
];

const DEFAULT_SECTION: ProgramsSection = {
  title: 'Our Transformational Programs',
  subtitle: 'Choose from our carefully crafted programs designed to meet you wherever you are in your spiritual journey. Each offering provides a unique path to transformation and growth.',
  ctaTitle: 'Ready to Begin Your Transformation?',
  ctaSubtitle: 'Connect with our experienced guides to find the perfect program for your spiritual journey.',
  ctaButtonText: 'Schedule Free Consultation'
};

export class ProgramsService {
  private static instance: ProgramsService;
  private dbAvailable = false;
  private storageKey = 'programs_data';
  private sectionStorageKey = 'programs_section_data';
  private timestampKey = 'programs_timestamp';
  private isInitialized = false;

  constructor() {
    this.initializeService();
  }

  static getInstance() {
    if (!ProgramsService.instance) {
      ProgramsService.instance = new ProgramsService();
    }
    return ProgramsService.instance;
  }

  private initializeService() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    console.log('ProgramsService: Initializing...');
    
    // Initialize with defaults if no data exists
    if (!this.getFromStorage(this.storageKey)) {
      this.saveToStorage(this.storageKey, DEFAULT_PROGRAMS);
      console.log('ProgramsService: Initialized with default programs');
    }
    
    if (!this.getFromStorage(this.sectionStorageKey)) {
      this.saveToStorage(this.sectionStorageKey, DEFAULT_SECTION);
      console.log('ProgramsService: Initialized with default section');
    }

    // Set up event listeners for cross-browser sync
    this.setupStorageSync();
    this.isInitialized = true;
  }

  private setupStorageSync() {
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey || e.key === this.sectionStorageKey || e.key === this.timestampKey) {
        console.log('ProgramsService: Storage change detected from another tab:', e.key);
        this.notifyComponents();
      }
    });

    // Listen for focus events to refresh data
    window.addEventListener('focus', () => {
      console.log('ProgramsService: Window focused, checking for updates');
      this.notifyComponents();
    });

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('ProgramsService: Page visible, checking for updates');
        this.notifyComponents();
      }
    });
  }

  private async checkDatabaseAvailability(): Promise<boolean> {
    try {
      const { error: programsError } = await (supabase as any)
        .from('programs')
        .select('id')
        .limit(1);
      
      const { error: sectionError } = await (supabase as any)
        .from('programs_section')
        .select('id')
        .limit(1);
      
      this.dbAvailable = !programsError && !sectionError;
      
      if (!this.dbAvailable) {
        console.warn('ProgramsService: Database tables not available. Using localStorage only.');
      }
      
      return this.dbAvailable;
    } catch (error) {
      console.error('ProgramsService: Error checking database:', error);
      this.dbAvailable = false;
      return false;
    }
  }

  async getPrograms(): Promise<Program[]> {
    try {
      console.log('ProgramsService: Getting programs...');
      
      const cached = this.getFromStorage(this.storageKey);
      const programs = cached || DEFAULT_PROGRAMS;
      
      // Try to sync with database in background
      this.syncFromDatabase().catch(() => {
        // Silent fail for background sync
      });
      
      return programs;
    } catch (error) {
      console.error('ProgramsService: Error getting programs:', error);
      return DEFAULT_PROGRAMS;
    }
  }

  async getProgramsSection(): Promise<ProgramsSection> {
    try {
      console.log('ProgramsService: Getting programs section...');
      
      const cached = this.getFromStorage(this.sectionStorageKey);
      const section = cached || DEFAULT_SECTION;
      
      // Try to sync section in background
      this.syncSectionFromDatabase().catch(() => {
        // Silent fail for background sync
      });
      
      return section;
    } catch (error) {
      console.error('ProgramsService: Error getting programs section:', error);
      return DEFAULT_SECTION;
    }
  }

  async savePrograms(programs: Program[]): Promise<void> {
    try {
      console.log('ProgramsService: Saving programs...', programs.length);
      
      // Save to localStorage with timestamp
      this.saveToStorage(this.storageKey, programs);
      this.updateTimestamp();
      
      // Notify all components immediately
      this.notifyComponents();
      
      // Try to save to database in background
      if (await this.checkDatabaseAvailability()) {
        try {
          await (supabase as any).from('programs').delete().neq('id', '');
          
          const programsData = programs.map(program => ({
            id: program.id,
            name: program.name,
            subtitle: program.subtitle,
            description: program.description,
            duration: program.duration,
            level: program.level,
            students: program.students,
            price: program.price,
            features: JSON.stringify(program.features),
            rating: program.rating,
            type: program.type,
            icon: program.icon
          }));

          const { error } = await (supabase as any)
            .from('programs')
            .insert(programsData);
          
          if (!error) {
            console.log('ProgramsService: Successfully saved to database');
          }
        } catch (dbError) {
          console.warn('ProgramsService: Database save failed:', dbError);
        }
      }
    } catch (error) {
      console.error('ProgramsService: Error saving programs:', error);
      throw error;
    }
  }

  async saveProgramsSection(section: ProgramsSection): Promise<void> {
    try {
      console.log('ProgramsService: Saving programs section...');
      
      // Save to localStorage with timestamp
      this.saveToStorage(this.sectionStorageKey, section);
      this.updateTimestamp();
      
      // Notify all components immediately
      this.notifyComponents();
      
      // Try to save to database in background
      if (await this.checkDatabaseAvailability()) {
        try {
          const { error } = await (supabase as any)
            .from('programs_section')
            .upsert({
              id: 'default',
              title: section.title,
              subtitle: section.subtitle,
              cta_title: section.ctaTitle,
              cta_subtitle: section.ctaSubtitle,
              cta_button_text: section.ctaButtonText
            });
          
          if (!error) {
            console.log('ProgramsService: Section successfully saved to database');
          }
        } catch (dbError) {
          console.warn('ProgramsService: Database section save failed:', dbError);
        }
      }
    } catch (error) {
      console.error('ProgramsService: Error saving programs section:', error);
      throw error;
    }
  }

  private saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log('ProgramsService: Saved to localStorage:', key);
    } catch (error) {
      console.error('ProgramsService: Error saving to localStorage:', error);
    }
  }

  private getFromStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('ProgramsService: Error reading from localStorage:', error);
      return null;
    }
  }

  private updateTimestamp(): void {
    try {
      localStorage.setItem(this.timestampKey, Date.now().toString());
    } catch (error) {
      console.error('ProgramsService: Error updating timestamp:', error);
    }
  }

  private notifyComponents(): void {
    console.log('ProgramsService: Notifying components of data change');
    
    // Dispatch multiple events for maximum compatibility
    const events = [
      'storage',
      'programsUpdated',
      'programsChanged',
      'programsDataChanged'
    ];
    
    events.forEach(eventType => {
      // Dispatch regular event
      window.dispatchEvent(new Event(eventType));
      
      // Dispatch custom event with data
      window.dispatchEvent(new CustomEvent(eventType, { 
        detail: { 
          timestamp: Date.now(),
          source: 'programsService'
        }
      }));
    });

    // Additional delayed notification for async components
    setTimeout(() => {
      events.forEach(eventType => {
        window.dispatchEvent(new CustomEvent(eventType, { 
          detail: { 
            timestamp: Date.now(),
            source: 'programsService',
            delayed: true
          }
        }));
      });
    }, 100);
  }

  private async syncFromDatabase(): Promise<void> {
    if (!(await this.checkDatabaseAvailability())) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('programs')
        .select('*')
        .order('id');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const programs = data.map((item: ProgramsTable) => ({
          ...item,
          features: typeof item.features === 'string' ? JSON.parse(item.features) : item.features
        }));
        
        this.saveToStorage(this.storageKey, programs);
        this.updateTimestamp();
        this.notifyComponents();
        console.log('ProgramsService: Synced programs from database');
      }
    } catch (error) {
      console.error('ProgramsService: Error syncing from database:', error);
    }
  }

  private async syncSectionFromDatabase(): Promise<void> {
    if (!(await this.checkDatabaseAvailability())) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('programs_section')
        .select('*')
        .eq('id', 'default')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const section = {
          title: data.title || DEFAULT_SECTION.title,
          subtitle: data.subtitle || DEFAULT_SECTION.subtitle,
          ctaTitle: data.cta_title || DEFAULT_SECTION.ctaTitle,
          ctaSubtitle: data.cta_subtitle || DEFAULT_SECTION.ctaSubtitle,
          ctaButtonText: data.cta_button_text || DEFAULT_SECTION.ctaButtonText
        };
        
        this.saveToStorage(this.sectionStorageKey, section);
        this.updateTimestamp();
        this.notifyComponents();
        console.log('ProgramsService: Synced section from database');
      }
    } catch (error) {
      console.error('ProgramsService: Error syncing section from database:', error);
    }
  }

  async forceSync(): Promise<void> {
    console.log('ProgramsService: Force sync requested...');
    
    if (!(await this.checkDatabaseAvailability())) {
      throw new Error('Database tables not available. Please apply the Supabase migration to create the programs and programs_section tables.');
    }
    
    try {
      await Promise.all([
        this.syncFromDatabase(),
        this.syncSectionFromDatabase()
      ]);
      console.log('ProgramsService: Force sync completed successfully');
    } catch (error) {
      console.error('ProgramsService: Force sync failed:', error);
      throw error;
    }
  }
}

export const programsService = ProgramsService.getInstance();
