// Content configuration for ByteSteps - Ready for CMS integration
// This structure allows content to be managed externally while maintaining type safety

export interface ContentConfig {
  site: SiteContent;
  learning: LearningContent;
  assessment: AssessmentContent;
  resources: ResourceContent;
}

export interface SiteContent {
  title: string;
  tagline: string;
  welcomeMessage: string;
  features: FeatureContent[];
  channels: ChannelContent[];
  legal: LegalContent;
}

export interface FeatureContent {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ChannelContent {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface LegalContent {
  organisationName: string;
  contactHours: string;
  responseTime: string;
  dataRetentionPeriod: string;
  complianceFrameworks: string[];
}

export interface LearningContent {
  modules: LearningModuleContent[];
  glossary: GlossaryEntry[];
}

export interface LearningModuleContent {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedTime: number;
  steps: LearningStepContent[];
  tags: string[];
}

export interface LearningStepContent {
  id: string;
  title: string;
  content: string;
  type: 'instruction' | 'practice' | 'quiz';
  media?: MediaContent;
  quiz?: QuizContent;
  glossaryTerms?: string[];
}

export interface MediaContent {
  type: 'image' | 'audio' | 'video';
  url: string;
  alt?: string;
  description?: string;
}

export interface QuizContent {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  relatedTerms?: string[];
  category: 'basic' | 'intermediate' | 'advanced';
}

export interface AssessmentContent {
  questions: AssessmentQuestionContent[];
  maxQuestions: number;
  version: string;
}

export interface AssessmentQuestionContent {
  id: string;
  question: string;
  type: 'radio' | 'text' | 'checkbox';
  note?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: ValidationRule;
  category: 'priority' | 'accessibility' | 'contact' | 'location';
}

export interface ValidationRule {
  required: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  errorMessage: string;
}

export interface ResourceContent {
  categories: ResourceCategory[];
  searchPlaceholder: string;
  noResultsMessage: string;
  tips: string[];
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Default content configuration - can be replaced by CMS
export const defaultContent: ContentConfig = {
  site: {
    title: "Byte Steps",
    tagline: "Learning digital skills, one manageable step at a time",
    welcomeMessage: "We're here to help you build confidence with technology. Whether you're starting fresh or want to learn something new, we'll take it one small step at a time—no pressure, just support.",
    features: [
      {
        id: "learn-pace",
        icon: "Computer",
        title: "Learn at Your Pace",
        description: "Short, easy lessons designed for beginners. Practice as many times as you need."
      },
      {
        id: "stay-safe",
        icon: "Shield", 
        title: "Stay Safe Online",
        description: "Learn how to protect yourself from scams and use the internet safely."
      },
      {
        id: "local-help",
        icon: "Users",
        title: "Find Local Help", 
        description: "Connect with friendly volunteers and classes in your area."
      }
    ],
    channels: [
      {
        id: "website",
        icon: "Computer",
        title: "This Website",
        description: "Learn through your computer, tablet, or mobile phone (a phone you can carry around)"
      },
      {
        id: "sms",
        icon: "MessageSquare", 
        title: "Text Messages",
        description: "Get tips and lessons sent to your phone"
      },
      {
        id: "voice",
        icon: "Phone",
        title: "Phone Calls", 
        description: "Listen to lessons over the phone at your own pace"
      }
    ],
    legal: {
      organisationName: "ByteSteps Digital Inclusion Initiative",
      contactHours: "Monday - Friday: 9am - 5pm",
      responseTime: "Within 24 hours", 
      dataRetentionPeriod: "2 years from last activity",
      complianceFrameworks: ["GDPR", "UK Data Protection Act", "Essential Digital Skills Framework"]
    }
  },
  
  learning: {
    modules: [
      {
        id: "basic-phone-setup",
        title: "Getting Started with Your Mobile Phone",
        description: "Learn the basics of using a mobile phone (a phone you can carry around), from turning it on to making your first call.",
        difficulty: "beginner",
        category: "basic-skills", 
        estimatedTime: 15,
        tags: ["phone", "calls", "beginner"],
        steps: [
          {
            id: "step-1",
            title: "Turning on your phone",
            content: "Look for the power button on the side of your phone. It's usually a long, thin button. Press and hold it for 3 seconds until you see the screen light up.",
            type: "instruction",
            media: {
              type: "image",
              url: "/placeholder.svg",
              alt: "Power button location on mobile phone",
              description: "Shows where to find the power button on a typical mobile phone"
            },
            glossaryTerms: ["power-button", "screen"]
          }
        ]
      }
    ],
    glossary: [
      {
        term: "app",
        definition: "Short for application. Apps are like tools or programs on your phone that do different things - like making calls, sending messages, or checking the weather.",
        category: "basic",
        relatedTerms: ["smartphone", "program"]
      },
      {
        term: "smartphone", 
        definition: "A mobile phone that can do more than just calls and texts. It can connect to the internet, take photos, and run apps (programs).",
        category: "basic",
        relatedTerms: ["app", "internet", "mobile-phone"]
      },
      {
        term: "internet",
        definition: "The network that connects computers and phones around the world, allowing you to visit websites, send emails, and access online services.",
        category: "basic", 
        relatedTerms: ["website", "email", "online"]
      },
      {
        term: "email",
        definition: "Electronic mail - like sending a letter, but it arrives instantly through the internet instead of by post.",
        category: "basic",
        relatedTerms: ["internet", "message"]
      }
    ]
  },

  assessment: {
    maxQuestions: 3,
    version: "1.0",
    questions: [
      {
        id: "priority",
        question: "What would you most like to learn first?",
        type: "radio",
        note: "This helps us recommend the best starting point for your learning journey.",
        category: "priority",
        options: [
          { value: "basic-phone", label: "Basic phone skills (making calls, sending texts, turning device on/off)" },
          { value: "internet", label: "Using the internet safely (browsing websites, avoiding scams)" },
          { value: "communication", label: "Email (electronic mail) and staying in touch with family" },
          { value: "services", label: "Accessing online services (NHS, banking, shopping)" },
          { value: "safety", label: "Staying safe online and avoiding scams" }
        ]
      }
    ]
  },

  resources: {
    searchPlaceholder: "Enter your postcode or area to find support",
    noResultsMessage: "No support centres found. Try adjusting your search or selecting a different type.",
    categories: [
      { id: "all", name: "All Resources", description: "All types of support", icon: "MapPin" },
      { id: "library", name: "Libraries", description: "Local libraries with computer access", icon: "Book" },
      { id: "community", name: "Community Centres", description: "Local community support", icon: "Users" }
    ],
    tips: [
      "Call ahead to check availability and book a session",
      "Bring your own device if you have one - volunteers can help you learn on your own equipment", 
      "Don't worry about your skill level - everyone starts somewhere!",
      "Many services are completely free and run by friendly volunteers"
    ]
  }
};

// Content manager class for runtime content switching
export class ContentManager {
  private static instance: ContentManager;
  private content: ContentConfig;

  private constructor() {
    this.content = defaultContent;
  }

  static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  getContent(): ContentConfig {
    return this.content;
  }

  updateContent(newContent: Partial<ContentConfig>): void {
    this.content = { ...this.content, ...newContent };
  }

  // Future: Load content from CMS/API
  async loadFromCMS(endpoint: string): Promise<void> {
    try {
      const response = await fetch(endpoint);
      const cmsContent = await response.json();
      this.updateContent(cmsContent);
    } catch (error) {
      console.warn('Failed to load content from CMS, using default content:', error);
    }
  }

  // Get content with fallbacks
  getSiteContent(): SiteContent {
    return this.content.site;
  }

  getLearningContent(): LearningContent {
    return this.content.learning;
  }

  getAssessmentContent(): AssessmentContent {
    return this.content.assessment;
  }

  getResourceContent(): ResourceContent {
    return this.content.resources;
  }

  // Glossary helper methods
  getGlossaryTerm(term: string): GlossaryEntry | undefined {
    return this.content.learning.glossary.find(entry => 
      entry.term.toLowerCase() === term.toLowerCase()
    );
  }

  enrichContentWithGlossary(text: string): string {
    let enrichedText = text;
    
    this.content.learning.glossary.forEach(entry => {
      const regex = new RegExp(`\\b${entry.term}\\b`, 'gi');
      enrichedText = enrichedText.replace(regex, `<span class="glossary-term" title="${entry.definition}">${entry.term}</span>`);
    });
    
    return enrichedText;
  }
}

export const useContentManager = () => {
  return ContentManager.getInstance();
};