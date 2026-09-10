export interface DecisionPreset {
  id: string;
  tag: string;
  iconName: string;
  accentColor: string;
  imageUrl: string;
  question: string;
  options: string[];
}

export interface DecisionRecord {
  id: string;
  question: string;
  options: string[];
  verdict: string;
  timestamp: number;
  shareCode: string;
  coinCount: number;
}
