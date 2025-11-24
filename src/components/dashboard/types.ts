export type Subject = {
  id: string;
  name: string;
  color: string;
  icon: string;
  totalTime: number; // in seconds
  goalTime?: number; // optional daily goal in seconds
};

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: "1", name: "Deep Work", color: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)", icon: "brain", totalTime: 0 },
  { id: "2", name: "Reading", color: "linear-gradient(135deg, #4ECDC4 0%, #6EE7E0 100%)", icon: "book", totalTime: 0 },
  { id: "3", name: "Coding", color: "linear-gradient(135deg, #45B7D1 0%, #68D2EB 100%)", icon: "code", totalTime: 0 },
];

export const GRADIENTS = [
  "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)", // Red
  "linear-gradient(135deg, #4ECDC4 0%, #6EE7E0 100%)", // Teal
  "linear-gradient(135deg, #45B7D1 0%, #68D2EB 100%)", // Blue
  "linear-gradient(135deg, #96CEB4 0%, #B8E6D0 100%)", // Green
  "linear-gradient(135deg, #FFEEAD 0%, #FFF2C9 100%)", // Yellow
  "linear-gradient(135deg, #D4A5A5 0%, #EBC4C4 100%)", // Pink
  "linear-gradient(135deg, #9B59B6 0%, #B57EDC 100%)", // Purple
  "linear-gradient(135deg, #34495E 0%, #4E6A85 100%)", // Navy
  "linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)", // Orange-Red
  "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)", // Purple-Blue
];

export const COLORS = GRADIENTS; // Backward compatibility alias if needed temporarily
