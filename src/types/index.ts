export type UserRole = 'admin' | 'coach' | 'player' | 'parent' | 'scout';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  playerId?: string;
  parentOf?: string[];
  createdAt: string;
}

export interface Player {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  nationality: string;
  photo?: string;
  ageGroup: 'U-8' | 'U-10' | 'U-12' | 'U-14' | 'U-15' | 'U-17';
  position: string;
  preferredFoot: 'Right' | 'Left' | 'Both';
  jerseyNumber: number;
  phone?: string;
  status: 'Active' | 'Inactive' | 'Injured' | 'Trial';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentRelation: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  school: string;
  className: string;
  academicPerformance: string;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  address: string;
  city: string;
  region: string;
  dateJoined: string;
  overallRating: number;
  attendanceRate: number;
  goals: number;
  assists: number;
  technical: number;
  physical: number;
  tactical: number;
  mental: number;
  createdAt: string;
  updatedAt: string;
}

export interface Coach {
  id: string;
  fullName: string;
  photo?: string;
  phone: string;
  email: string;
  license: string;
  specialization: string;
  experience: string;
  status: 'Active' | 'Inactive';
  assignedPlayers: string[];
  createdAt: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  coachId: string;
  ageGroup: string;
  trainingType: 'Technical' | 'Tactical' | 'Physical' | 'Fitness' | 'Recovery' | 'Goalkeeping' | 'Match Preparation';
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  playerId: string;
  sessionId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  createdAt: string;
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  homeAway: 'Home' | 'Away';
  result: 'Win' | 'Loss' | 'Draw' | 'Upcoming';
  score: string;
  notes: string;
  ageGroup: string;
  createdAt: string;
}

export interface MatchPlayer {
  id: string;
  matchId: string;
  playerId: string;
  goals: number;
  assists: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
  rating: number;
}

export interface PerformanceRecord {
  id: string;
  playerId: string;
  date: string;
  coachId: string;
  technical: { passing: number; dribbling: number; shooting: number; ballControl: number; crossing: number };
  tactical: { positioning: number; decisionMaking: number; gameAwareness: number; defensiveUnderstanding: number };
  physical: { speed: number; strength: number; stamina: number; agility: number };
  mental: { discipline: number; confidence: number; teamwork: number; leadership: number; focus: number };
  comments: string;
  createdAt: string;
}

export interface ScoutingProspect {
  id: string;
  fullName: string;
  age: number;
  position: string;
  currentClub: string;
  photo?: string;
  status: 'New Prospect' | 'Under Review' | 'Trial' | 'Accepted' | 'Rejected';
  technical: number;
  tactical: number;
  physical: number;
  mental: number;
  potential: number;
  overall: number;
  scoutNotes: string;
  videoUrl?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  playerId: string;
  amount: number;
  paymentType: 'Registration' | 'Training' | 'Monthly' | 'Tournament' | 'Equipment' | 'Other';
  paymentDate: string;
  paymentMethod: 'Mobile Money' | 'MTN MoMo' | 'Telecel' | 'AirtelTigo' | 'Bank Transfer' | 'Cash';
  reference: string;
  status: 'Paid' | 'Pending' | 'Partial' | 'Overdue';
  notes: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  details: string;
  createdAt: string;
}
