import { Subject, SubjectConfig } from './types';

export const APP_NAME = "StudyBuddy";
export const GEMINI_MODEL = "gemini-2.5-flash"; // Fast and capable for tutoring

export const SUBJECTS: SubjectConfig[] = [
  {
    id: Subject.GENERAL,
    name: 'General',
    icon: '🎓',
    color: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    systemPromptAddon: 'Answer general knowledge questions clearly.'
  },
  {
    id: Subject.MATH,
    name: 'Math',
    icon: '➗',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    systemPromptAddon: 'You are a math tutor. Solve equations step-by-step. Show all your work logically. Use clear LaTeX formatting where possible, or clear text representation.'
  },
  {
    id: Subject.SCIENCE,
    name: 'Science',
    icon: '🧬',
    color: 'bg-green-100 text-green-700 hover:bg-green-200',
    systemPromptAddon: 'You are a science tutor. Explain scientific concepts simply. Use analogies where helpful.'
  },
  {
    id: Subject.HISTORY,
    name: 'History',
    icon: '🏛️',
    color: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    systemPromptAddon: 'You are a history tutor. Provide historical context, dates, and significance of events.'
  },
  {
    id: Subject.LOGIC,
    name: 'Logic',
    icon: '🧩',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    systemPromptAddon: 'You are a logic tutor. Help the user improve their reasoning. Break down problems into premises and conclusions.'
  }
];

export const INITIAL_SYSTEM_INSTRUCTION = `You are StudyBuddy, a friendly, patient, and encouraging AI tutor. 
Your goal is to help students learn.
1. Answer definitions clearly and concisely.
2. Provide explanations in simple language suitable for a student.
3. If the user asks a question, guide them to the answer rather than just giving it if appropriate (scaffolding).
4. Be polite and use emojis occasionally to keep the mood light.
5. Format your response using Markdown (bold for key terms, lists for steps).
`;
