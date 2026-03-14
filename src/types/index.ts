export interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  impact_points: number;
  award_progress: number;
  rank: number;
  suburb?: string;
  team?: string;
}

export interface Activity {
  id: number;
  user_id?: number;
  category: string;
  hours: number;
  date: string;
  description: string;
  evidenceUrl?: string;
  aiConfidence?: number;
  aiRecommendation?: "approve" | "manual_review" | "reject";
  estimatedCo2Kg?: number;
  estimatedPlasticItemsReduced?: number;
  estimatedWaterLitersSaved?: number;
  status: 'pending' | 'approved' | 'rejected';
  taskId?: string;
  taskTitle?: string;
  pointsEarned?: number;
}

export interface StoredUser extends UserData {
  password?: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  minPoints: number;
  colorClass: string;
}
