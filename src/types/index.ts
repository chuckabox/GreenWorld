export interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  impact_points: number;
  award_progress: number;
  rank: number;
}

export interface Activity {
  id: number;
  category: string;
  hours: number;
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}
