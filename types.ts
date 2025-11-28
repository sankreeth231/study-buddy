export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export enum Subject {
  GENERAL = 'General',
  MATH = 'Math',
  SCIENCE = 'Science',
  HISTORY = 'History',
  LOGIC = 'Logic'
}

export interface SubjectConfig {
  id: Subject;
  name: string;
  icon: string;
  color: string;
  systemPromptAddon: string;
}
