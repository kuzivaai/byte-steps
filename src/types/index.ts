// Types for Digital Skills Coach prototype

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  deviceType: 'smartphone' | 'basic-phone' | 'tablet' | 'computer' | 'none';
  digitalConfidence: 'none' | 'basic' | 'some' | 'confident';
  preferredChannel: 'web' | 'sms' | 'voice';
  accessibilityNeeds?: string[];
  language: string;
  createdAt: Date;
}

export interface Assessment {
  id: string;
  userId: string;
  responses: Record<string, any>;
  recommendedPath: string;
  completedAt: Date;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'basic-skills' | 'safety' | 'communication' | 'services';
  estimatedTime: number; // minutes
  steps: LearningStep[];
  prerequisites?: string[];
}

export interface LearningStep {
  id: string;
  title: string;
  content: string;
  type: 'instruction' | 'practice' | 'quiz';
  media?: {
    type: 'image' | 'audio';
    url: string;
    alt?: string;
  };
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  stepId?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  completedSteps: string[];
  lastAccessedAt: Date;
  completedAt?: Date;
}

export interface LocalResource {
  id: string;
  name: string;
  type: 'library' | 'community-centre' | 'adult-education' | 'charity' | 'council';
  description: string;
  address: string;
  postcode: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours: string;
  services: string[];
  accessibility: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  channel: 'web' | 'sms' | 'voice';
  messages: ChatMessage[];
  status: 'active' | 'escalated' | 'completed';
  startedAt: Date;
  endedAt?: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Escalation {
  id: string;
  userId: string;
  sessionId: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'resolved';
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  notes?: string;
}