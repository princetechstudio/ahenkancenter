import { Player, Coach, TrainingSession, AttendanceRecord, Match, Payment, Announcement, User, ScoutingProspect, Notification, ActivityLog, PerformanceRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  users: 'afa_users',
  players: 'afa_players',
  coaches: 'afa_coaches',
  training: 'afa_training',
  attendance: 'afa_attendance',
  matches: 'afa_matches',
  payments: 'afa_payments',
  announcements: 'afa_announcements',
  prospects: 'afa_prospects',
  notifications: 'afa_notifications',
  activityLogs: 'afa_activity_logs',
  performance: 'afa_performance',
  currentUser: 'afa_current_user',
  initialized: 'afa_initialized',
};

function get<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getOne<T>(key: string, id: string): T | undefined {
  const data = get<T>(key);
  return data.find((item: any) => item.id === id);
}

function add<T extends { id: string; createdAt: string }>(key: string, item: T): T {
  const data = get<T>(key);
  data.push(item);
  set(key, data);
  return item;
}

function update<T extends { id: string; updatedAt?: string }>(key: string, id: string, updates: Partial<T>): T | undefined {
  const data = get<T>(key);
  const index = data.findIndex((item: any) => item.id === id);
  if (index === -1) return undefined;
  data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() } as T;
  set(key, data);
  return data[index];
}

function remove<T extends { id: string }>(key: string, id: string): boolean {
  const data = get<T>(key);
  const filtered = data.filter((item: any) => item.id !== id);
  if (filtered.length === data.length) return false;
  set(key, filtered);
  return true;
}

// Seed Data
function seedData() {
  if (localStorage.getItem(STORAGE_KEYS.initialized)) return;

  const users: User[] = [
    { id: '1', email: 'admin@ahenkan.com', name: 'Admin User', role: 'admin', createdAt: '2025-01-01T00:00:00Z' },
    { id: '2', email: 'coach@ahenkan.com', name: 'Coach Kwesi', role: 'coach', createdAt: '2025-01-01T00:00:00Z' },
    { id: '3', email: 'player@ahenkan.com', name: 'Kwame Mensah', role: 'player', playerId: 'p1', createdAt: '2025-01-01T00:00:00Z' },
    { id: '4', email: 'parent@ahenkan.com', name: 'Mr. Mensah', role: 'parent', parentOf: ['p1'], createdAt: '2025-01-01T00:00:00Z' },
    { id: '5', email: 'scout@ahenkan.com', name: 'Scout Asante', role: 'scout', createdAt: '2025-01-01T00:00:00Z' },
  ];

  const coaches: Coach[] = [
    { id: 'c1', fullName: 'Kwesi Appiah', phone: '+233 24 123 4567', email: 'kwesi@ahenkan.com', license: 'CAF License B', specialization: 'Youth Development', experience: '10 years', status: 'Active', assignedPlayers: ['p1','p2','p3','p4','p5'], createdAt: '2025-01-15T00:00:00Z' },
    { id: 'c2', fullName: 'Ama Serwaa', phone: '+233 20 234 5678', email: 'ama@ahenkan.com', license: 'CAF License A', specialization: 'Goalkeeping', experience: '8 years', status: 'Active', assignedPlayers: ['p6','p7','p8'], createdAt: '2025-01-15T00:00:00Z' },
    { id: 'c3', fullName: 'Yaw Boateng', phone: '+233 27 345 6789', email: 'yaw@ahenkan.com', license: 'CAF License C', specialization: 'Fitness & Conditioning', experience: '5 years', status: 'Active', assignedPlayers: ['p9','p10','p11'], createdAt: '2025-02-01T00:00:00Z' },
    { id: 'c4', fullName: 'Abena Osei', phone: '+233 55 456 7890', email: 'abena@ahenkan.com', license: 'CAF License B', specialization: 'Tactical Analysis', experience: '7 years', status: 'Active', assignedPlayers: ['p12','p13','p14'], createdAt: '2025-02-01T00:00:00Z' },
  ];

  const players: Player[] = [
    { id: 'p1', fullName: 'Kwame Mensah', dateOfBirth: '2008-03-15', gender: 'Male', nationality: 'Ghanaian', ageGroup: 'U-17', position: 'Forward', preferredFoot: 'Right', jerseyNumber: 17, phone: '+233 24 000 0001', status: 'Active', parentName: 'Mr. Mensah', parentPhone: '+233 24 111 2222', parentEmail: 'mensah.parent@gmail.com', parentRelation: 'Father', emergencyName: 'Mrs. Mensah', emergencyPhone: '+233 20 333 4444', emergencyRelation: 'Mother', school: 'Adeiso D/A JHS', className: 'JHS 2', academicPerformance: 'Excellent', bloodGroup: 'O+', allergies: 'None', medicalConditions: 'None', address: 'House 12, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-01-20', overallRating: 8.7, attendanceRate: 94, goals: 12, assists: 8, technical: 8.8, physical: 8.1, tactical: 7.9, mental: 8.5, createdAt: '2025-01-20T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p2', fullName: 'Kofi Asante', dateOfBirth: '2009-07-22', gender: 'Male', nationality: 'Ghanaian', ageGroup: 'U-15', position: 'Midfielder', preferredFoot: 'Left', jerseyNumber: 8, phone: '+233 24 000 0002', status: 'Active', parentName: 'Mrs. Asante', parentPhone: '+233 24 222 3333', parentEmail: 'asante.parent@gmail.com', parentRelation: 'Mother', emergencyName: 'Mr. Asante', emergencyPhone: '+233 20 444 5555', emergencyRelation: 'Father', school: 'Adeiso MA JHS', className: 'JHS 1', academicPerformance: 'Very Good', bloodGroup: 'A+', allergies: 'None', medicalConditions: 'None', address: 'House 5, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-01-22', overallRating: 8.2, attendanceRate: 91, goals: 5, assists: 14, technical: 8.5, physical: 7.8, tactical: 8.3, mental: 8.0, createdAt: '2025-01-22T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p3', fullName: 'Yaw Darko', dateOfBirth: '2010-11-03', gender: 'Male', nationality: 'Ghanaian', ageGroup: 'U-14', position: 'Defender', preferredFoot: 'Right', jerseyNumber: 4, phone: '+233 24 000 0003', status: 'Active', parentName: 'Mr. Darko', parentPhone: '+233 24 555 6666', parentEmail: 'darko.parent@gmail.com', parentRelation: 'Father', emergencyName: 'Mrs. Darko', emergencyPhone: '+233 20 666 7777', emergencyRelation: 'Mother', school: 'Adeiso D/A JHS', className: 'JHS 1', academicPerformance: 'Good', bloodGroup: 'B+', allergies: 'Peanuts', medicalConditions: 'None', address: 'House 8, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-02-01', overallRating: 7.9, attendanceRate: 88, goals: 1, assists: 3, technical: 7.5, physical: 8.4, tactical: 8.1, mental: 7.6, createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p4', fullName: 'Ama Adjei', dateOfBirth: '2011-05-18', gender: 'Female', nationality: 'Ghanaian', ageGroup: 'U-14', position: 'Midfielder', preferredFoot: 'Both', jerseyNumber: 10, phone: '+233 24 000 0004', status: 'Active', parentName: 'Mrs. Adjei', parentPhone: '+233 24 777 8888', parentEmail: 'adjei.parent@gmail.com', parentRelation: 'Mother', emergencyName: 'Mr. Adjei', emergencyPhone: '+233 20 888 9999', emergencyRelation: 'Father', school: 'Adeiso D/A JHS', className: 'JHS 1', academicPerformance: 'Excellent', bloodGroup: 'O-', allergies: 'None', medicalConditions: 'Asthma (managed)', address: 'House 15, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-02-05', overallRating: 8.4, attendanceRate: 96, goals: 7, assists: 11, technical: 8.6, physical: 7.9, tactical: 8.2, mental: 8.8, createdAt: '2025-02-05T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p5', fullName: 'Kwesi Bonsu', dateOfBirth: '2012-09-10', gender: 'Male', nationality: 'Ghanaian', ageGroup: 'U-12', position: 'Forward', preferredFoot: 'Right', jerseyNumber: 9, phone: '', status: 'Active', parentName: 'Mr. Bonsu', parentPhone: '+233 24 999 0000', parentEmail: 'bonsu.parent@gmail.com', parentRelation: 'Father', emergencyName: 'Mrs. Bonsu', emergencyPhone: '+233 20 111 0000', emergencyRelation: 'Mother', school: 'Adeiso D/A Primary', className: 'Primary 6', academicPerformance: 'Good', bloodGroup: 'A-', allergies: 'None', medicalConditions: 'None', address: 'House 3, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-02-10', overallRating: 7.6, attendanceRate: 85, goals: 9, assists: 4, technical: 7.8, physical: 7.5, tactical: 7.2, mental: 7.9, createdAt: '2025-02-10T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p6', fullName: 'Ebo Hammond', dateOfBirth: '2008-01-25', gender: 'Male', nationality: 'Ghanaian', ageGroup: 'U-17', position: 'Goalkeeper', preferredFoot: 'Right', jerseyNumber: 1, phone: '+233 24 000 0006', status: 'Active', parentName: 'Mr. Hammond', parentPhone: '+233 24 333 4444', parentEmail: 'hammond.parent@gmail.com', parentRelation: 'Father', emergencyName: 'Mrs. Hammond', emergencyPhone: '+233 20 555 6666', emergencyRelation: 'Mother', school: 'Upper West Akyem SHS', className: 'SHS 2', academicPerformance: 'Very Good', bloodGroup: 'B-', allergies: 'None', medicalConditions: 'None', address: 'House 20, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-01-18', overallRating: 8.1, attendanceRate: 92, goals: 0, assists: 1, technical: 7.9, physical: 8.3, tactical: 8.0, mental: 8.2, createdAt: '2025-01-18T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p7', fullName: 'Nana Akua', dateOfBirth: '2010-04-12', gender: 'Female', nationality: 'Ghanaian', ageGroup: 'U-15', position: 'Defender', preferredFoot: 'Left', jerseyNumber: 3, phone: '+233 24 000 0007', status: 'Active', parentName: 'Mrs. Akua', parentPhone: '+233 24 666 7777', parentEmail: 'akua.parent@gmail.com', parentRelation: 'Mother', emergencyName: 'Mr. Akua', emergencyPhone: '+233 20 888 9999', emergencyRelation: 'Father', school: 'Adeiso MA JHS', className: 'JHS 2', academicPerformance: 'Excellent', bloodGroup: 'O+', allergies: 'None', medicalConditions: 'None', address: 'House 7, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-02-15', overallRating: 7.8, attendanceRate: 90, goals: 2, assists: 5, technical: 7.6, physical: 8.0, tactical: 7.9, mental: 7.7, createdAt: '2025-02-15T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p8', fullName: 'Kojo Frimpong', dateOfBirth: '2013-08-20', gender: 'Male', nationality: 'Ghanaian', ageGroup: 'U-12', position: 'Midfielder', preferredFoot: 'Right', jerseyNumber: 6, phone: '', status: 'Active', parentName: 'Mr. Frimpong', parentPhone: '+233 24 222 1111', parentEmail: 'frimpong.parent@gmail.com', parentRelation: 'Father', emergencyName: 'Mrs. Frimpong', emergencyPhone: '+233 20 333 2222', emergencyRelation: 'Mother', school: 'Adeiso D/A Primary', className: 'Primary 5', academicPerformance: 'Good', bloodGroup: 'A+', allergies: 'None', medicalConditions: 'None', address: 'House 11, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-03-01', overallRating: 7.3, attendanceRate: 82, goals: 3, assists: 6, technical: 7.4, physical: 7.1, tactical: 7.0, mental: 7.5, createdAt: '2025-03-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p9', fullName: 'Abena Pokua', dateOfBirth: '2014-12-05', gender: 'Female', nationality: 'Ghanaian', ageGroup: 'U-10', position: 'Forward', preferredFoot: 'Both', jerseyNumber: 11, phone: '', status: 'Active', parentName: 'Mrs. Pokua', parentPhone: '+233 24 444 3333', parentEmail: 'pokua.parent@gmail.com', parentRelation: 'Mother', emergencyName: 'Mr. Pokua', emergencyPhone: '+233 20 555 4444', emergencyRelation: 'Father', school: 'Adeiso D/A Primary', className: 'Primary 4', academicPerformance: 'Very Good', bloodGroup: 'O+', allergies: 'None', medicalConditions: 'None', address: 'House 18, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-03-10', overallRating: 7.1, attendanceRate: 88, goals: 6, assists: 3, technical: 7.2, physical: 6.8, tactical: 6.9, mental: 7.4, createdAt: '2025-03-10T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
    { id: 'p10', fullName: 'Kwabena Oduro', dateOfBirth: '2015-06-30', gender: 'Male', nationality: 'Ghanaian', ageGroup: 'U-10', position: 'Defender', preferredFoot: 'Right', jerseyNumber: 5, phone: '', status: 'Active', parentName: 'Mr. Oduro', parentPhone: '+233 24 777 6666', parentEmail: 'oduro.parent@gmail.com', parentRelation: 'Father', emergencyName: 'Mrs. Oduro', emergencyPhone: '+233 20 888 7777', emergencyRelation: 'Mother', school: 'Adeiso D/A Primary', className: 'Primary 3', academicPerformance: 'Good', bloodGroup: 'B+', allergies: 'None', medicalConditions: 'None', address: 'House 22, Adeiso', city: 'Adeiso', region: 'Eastern', dateJoined: '2025-03-15', overallRating: 6.9, attendanceRate: 80, goals: 1, assists: 2, technical: 6.8, physical: 7.0, tactical: 6.7, mental: 7.1, createdAt: '2025-03-15T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
  ];

  const training: TrainingSession[] = [
    { id: 't1', title: 'Technical Skills - U17', date: '2025-06-16', startTime: '16:00', endTime: '17:30', location: 'Adeiso Community Field', coachId: 'c1', ageGroup: 'U-17', trainingType: 'Technical', notes: 'Focus on first touch and passing accuracy', status: 'Scheduled', createdAt: '2025-06-10T00:00:00Z' },
    { id: 't2', title: 'Tactical Session - U15', date: '2025-06-16', startTime: '14:00', endTime: '15:30', location: 'Adeiso Community Field', coachId: 'c4', ageGroup: 'U-15', trainingType: 'Tactical', notes: 'Formation drills and pressing', status: 'Scheduled', createdAt: '2025-06-10T00:00:00Z' },
    { id: 't3', title: 'Fitness Training', date: '2025-06-17', startTime: '06:00', endTime: '07:00', location: 'Adeiso Sports Ground', coachId: 'c3', ageGroup: 'U-17', trainingType: 'Fitness', notes: 'Endurance and speed work', status: 'Scheduled', createdAt: '2025-06-10T00:00:00Z' },
    { id: 't4', title: 'Goalkeeping Session', date: '2025-06-17', startTime: '15:00', endTime: '16:30', location: 'Adeiso Community Field', coachId: 'c2', ageGroup: 'U-14', trainingType: 'Goalkeeping', notes: 'Shot stopping and distribution', status: 'Scheduled', createdAt: '2025-06-10T00:00:00Z' },
    { id: 't5', title: 'Match Preparation', date: '2025-06-18', startTime: '16:00', endTime: '17:30', location: 'Adeiso Community Field', coachId: 'c1', ageGroup: 'U-17', trainingType: 'Match Preparation', notes: 'Set pieces and team shape', status: 'Scheduled', createdAt: '2025-06-10T00:00:00Z' },
    { id: 't6', title: 'Recovery Session', date: '2025-06-14', startTime: '08:00', endTime: '09:00', location: 'Adeiso Sports Ground', coachId: 'c3', ageGroup: 'U-15', trainingType: 'Recovery', notes: 'Light stretching and cool down', status: 'Completed', createdAt: '2025-06-10T00:00:00Z' },
  ];

  const attendance: AttendanceRecord[] = [
    { id: 'a1', playerId: 'p1', sessionId: 't6', date: '2025-06-14', status: 'Present', createdAt: '2025-06-14T00:00:00Z' },
    { id: 'a2', playerId: 'p2', sessionId: 't6', date: '2025-06-14', status: 'Present', createdAt: '2025-06-14T00:00:00Z' },
    { id: 'a3', playerId: 'p3', sessionId: 't6', date: '2025-06-14', status: 'Late', createdAt: '2025-06-14T00:00:00Z' },
    { id: 'a4', playerId: 'p4', sessionId: 't6', date: '2025-06-14', status: 'Present', createdAt: '2025-06-14T00:00:00Z' },
    { id: 'a5', playerId: 'p5', sessionId: 't6', date: '2025-06-14', status: 'Absent', createdAt: '2025-06-14T00:00:00Z' },
    { id: 'a6', playerId: 'p6', sessionId: 't6', date: '2025-06-14', status: 'Present', createdAt: '2025-06-14T00:00:00Z' },
    { id: 'a7', playerId: 'p7', sessionId: 't6', date: '2025-06-14', status: 'Present', createdAt: '2025-06-14T00:00:00Z' },
    { id: 'a8', playerId: 'p8', sessionId: 't6', date: '2025-06-14', status: 'Excused', createdAt: '2025-06-14T00:00:00Z' },
  ];

  const matches: Match[] = [
    { id: 'm1', opponent: 'Koforidua Stars FC', date: '2025-06-20', time: '15:00', location: 'Adeiso Community Field', competition: 'Eastern Regional Youth League', homeAway: 'Home', result: 'Upcoming', score: '', notes: 'Important league match', ageGroup: 'U-17', createdAt: '2025-06-10T00:00:00Z' },
    { id: 'm2', opponent: 'Akim Oda United', date: '2025-06-22', time: '14:00', location: 'Akim Oda Stadium', competition: 'Eastern Regional Youth League', homeAway: 'Away', result: 'Upcoming', score: '', notes: '', ageGroup: 'U-15', createdAt: '2025-06-10T00:00:00Z' },
    { id: 'm3', opponent: 'Suhum Youth Academy', date: '2025-06-10', time: '15:00', location: 'Adeiso Community Field', competition: 'Eastern Regional Youth League', homeAway: 'Home', result: 'Win', score: '3-1', notes: 'Great team performance', ageGroup: 'U-17', createdAt: '2025-06-05T00:00:00Z' },
    { id: 'm4', opponent: 'Asamankese FC', date: '2025-06-08', time: '14:00', location: 'Asamankese', competition: 'Friendly', homeAway: 'Away', result: 'Draw', score: '2-2', notes: '', ageGroup: 'U-14', createdAt: '2025-06-03T00:00:00Z' },
    { id: 'm5', opponent: 'Begoro Rising Stars', date: '2025-06-05', time: '15:00', location: 'Adeiso Community Field', competition: 'Eastern Regional Youth League', homeAway: 'Home', result: 'Win', score: '4-0', notes: 'Dominant performance', ageGroup: 'U-15', createdAt: '2025-06-01T00:00:00Z' },
    { id: 'm6', opponent: 'Nkawkaw FC', date: '2025-06-25', time: '15:00', location: 'Adeiso Community Field', competition: 'Eastern Regional Youth League', homeAway: 'Home', result: 'Upcoming', score: '', notes: '', ageGroup: 'U-17', createdAt: '2025-06-10T00:00:00Z' },
  ];

  const payments: Payment[] = [
    { id: 'pay1', playerId: 'p1', amount: 500, paymentType: 'Monthly', paymentDate: '2025-06-01', paymentMethod: 'MTN MoMo', reference: 'MOMO-001', status: 'Paid', notes: 'June 2025 training fee', createdAt: '2025-06-01T00:00:00Z' },
    { id: 'pay2', playerId: 'p2', amount: 500, paymentType: 'Monthly', paymentDate: '2025-06-01', paymentMethod: 'Cash', reference: 'CASH-001', status: 'Paid', notes: 'June 2025 training fee', createdAt: '2025-06-01T00:00:00Z' },
    { id: 'pay3', playerId: 'p3', amount: 500, paymentType: 'Monthly', paymentDate: '', paymentMethod: 'Cash', reference: '', status: 'Pending', notes: 'June 2025 - awaiting payment', createdAt: '2025-06-01T00:00:00Z' },
    { id: 'pay4', playerId: 'p4', amount: 500, paymentType: 'Monthly', paymentDate: '2025-06-03', paymentMethod: 'Mobile Money', reference: 'MOMO-002', status: 'Paid', notes: 'June 2025 training fee', createdAt: '2025-06-03T00:00:00Z' },
    { id: 'pay5', playerId: 'p5', amount: 300, paymentType: 'Monthly', paymentDate: '', paymentMethod: 'Cash', reference: '', status: 'Overdue', notes: 'May & June 2025 - overdue', createdAt: '2025-05-01T00:00:00Z' },
    { id: 'pay6', playerId: 'p1', amount: 200, paymentType: 'Registration', paymentDate: '2025-01-20', paymentMethod: 'Cash', reference: 'REG-001', status: 'Paid', notes: 'Annual registration', createdAt: '2025-01-20T00:00:00Z' },
    { id: 'pay7', playerId: 'p6', amount: 500, paymentType: 'Monthly', paymentDate: '2025-06-02', paymentMethod: 'Bank Transfer', reference: 'BT-001', status: 'Paid', notes: 'June 2025 training fee', createdAt: '2025-06-02T00:00:00Z' },
    { id: 'pay8', playerId: 'p7', amount: 500, paymentType: 'Monthly', paymentDate: '', paymentMethod: 'Cash', reference: '', status: 'Pending', notes: 'June 2025 - awaiting', createdAt: '2025-06-01T00:00:00Z' },
  ];

  const announcements: Announcement[] = [
    { id: 'ann1', title: 'Pre-Season Training Begins', message: 'All players are expected to report for pre-season training on Monday, June 16th. Please bring your full kit and water bottle.', audience: 'Everyone', date: '2025-06-10', priority: 'High', createdBy: 'Admin', createdAt: '2025-06-10T00:00:00Z' },
    { id: 'ann2', title: 'League Match This Saturday', message: 'U-17 team will face Koforidua Stars FC at home this Saturday. All players must attend the pre-match training on Friday.', audience: 'U-17', date: '2025-06-12', priority: 'High', createdBy: 'Coach Kwesi', createdAt: '2025-06-12T00:00:00Z' },
    { id: 'ann3', title: 'Fee Payment Reminder', message: 'Parents are reminded to pay June training fees by the 15th. Late payments will incur a penalty.', audience: 'Parents', date: '2025-06-08', priority: 'Medium', createdBy: 'Admin', createdAt: '2025-06-08T00:00:00Z' },
    { id: 'ann4', title: 'New Training Schedule', message: 'The new training schedule for July has been posted. Please check the training section for details.', audience: 'Everyone', date: '2025-06-15', priority: 'Low', createdBy: 'Admin', createdAt: '2025-06-15T00:00:00Z' },
  ];

  const prospects: ScoutingProspect[] = [
    { id: 'sp1', fullName: 'Samuel Tetteh', age: 14, position: 'Winger', currentClub: 'Tema Youth U-15', status: 'Under Review', technical: 8.2, tactical: 7.5, physical: 8.0, mental: 7.8, potential: 8.5, overall: 8.0, scoutNotes: 'Very promising winger with excellent pace and dribbling ability. Needs to improve defensive work.', createdAt: '2025-05-20T00:00:00Z' },
    { id: 'sp2', fullName: 'Daniel Owusu', age: 16, position: 'Centre Back', currentClub: 'Nsawam Academy', status: 'Trial', technical: 7.8, tactical: 8.3, physical: 8.5, mental: 7.9, potential: 8.2, overall: 8.1, scoutNotes: 'Strong, commanding defender. Good reading of the game. Trial scheduled for next week.', createdAt: '2025-05-25T00:00:00Z' },
    { id: 'sp3', fullName: 'Ibrahim Suleiman', age: 13, position: 'Striker', currentClub: 'Independent', status: 'New Prospect', technical: 7.5, tactical: 7.0, physical: 7.8, mental: 7.2, potential: 8.8, overall: 7.6, scoutNotes: 'Raw talent with natural finishing ability. High ceiling for development.', createdAt: '2025-06-01T00:00:00Z' },
  ];

  const notifications: Notification[] = [
    { id: 'n1', userId: '1', title: 'New Player Registered', message: 'Kwabena Oduro has been registered to U-10 squad.', read: false, createdAt: '2025-06-15T10:00:00Z' },
    { id: 'n2', userId: '1', title: 'Payment Received', message: 'Monthly fee payment received from Kwame Mensah.', read: false, createdAt: '2025-06-01T09:00:00Z' },
    { id: 'n3', userId: '2', title: 'Training Reminder', message: 'Technical Skills session starts tomorrow at 4:00 PM.', read: true, createdAt: '2025-06-15T16:00:00Z' },
  ];

  const activityLogs: ActivityLog[] = [
    { id: 'al1', action: 'created', entityType: 'Player', entityId: 'p10', userId: '1', userName: 'Admin User', details: 'Registered Kwabena Oduro to U-10 squad', createdAt: '2025-06-15T10:00:00Z' },
    { id: 'al2', action: 'recorded', entityType: 'Payment', entityId: 'pay1', userId: '1', userName: 'Admin User', details: 'Payment of GHS 500 received from Kwame Mensah', createdAt: '2025-06-01T09:00:00Z' },
    { id: 'al3', action: 'created', entityType: 'Announcement', entityId: 'ann1', userId: '1', userName: 'Admin User', details: 'Published announcement: Pre-Season Training Begins', createdAt: '2025-06-10T08:00:00Z' },
    { id: 'al4', action: 'recorded', entityType: 'Attendance', entityId: 'a1', userId: '2', userName: 'Coach Kwesi', details: 'Attendance recorded for recovery session', createdAt: '2025-06-14T09:00:00Z' },
  ];

  const performance: PerformanceRecord[] = [
    { id: 'perf1', playerId: 'p1', date: '2025-05-01', coachId: 'c1', technical: { passing: 8.5, dribbling: 9.0, shooting: 8.8, ballControl: 8.5, crossing: 7.5 }, tactical: { positioning: 8.0, decisionMaking: 7.5, gameAwareness: 8.0, defensiveUnderstanding: 7.0 }, physical: { speed: 8.5, strength: 7.5, stamina: 8.0, agility: 8.5 }, mental: { discipline: 8.0, confidence: 9.0, teamwork: 8.5, leadership: 8.0, focus: 8.5 }, comments: 'Excellent progress in shooting accuracy. Needs to work on defensive positioning.', createdAt: '2025-05-01T00:00:00Z' },
    { id: 'perf2', playerId: 'p1', date: '2025-06-01', coachId: 'c1', technical: { passing: 8.8, dribbling: 9.2, shooting: 9.0, ballControl: 8.8, crossing: 7.8 }, tactical: { positioning: 8.2, decisionMaking: 7.8, gameAwareness: 8.2, defensiveUnderstanding: 7.2 }, physical: { speed: 8.6, strength: 7.8, stamina: 8.2, agility: 8.6 }, mental: { discipline: 8.2, confidence: 9.2, teamwork: 8.6, leadership: 8.2, focus: 8.6 }, comments: 'Outstanding improvement this month. Ready for higher level competition.', createdAt: '2025-06-01T00:00:00Z' },
  ];

  set(STORAGE_KEYS.users, users);
  set(STORAGE_KEYS.players, players);
  set(STORAGE_KEYS.coaches, coaches);
  set(STORAGE_KEYS.training, training);
  set(STORAGE_KEYS.attendance, attendance);
  set(STORAGE_KEYS.matches, matches);
  set(STORAGE_KEYS.payments, payments);
  set(STORAGE_KEYS.announcements, announcements);
  set(STORAGE_KEYS.prospects, prospects);
  set(STORAGE_KEYS.notifications, notifications);
  set(STORAGE_KEYS.activityLogs, activityLogs);
  set(STORAGE_KEYS.performance, performance);
  localStorage.setItem(STORAGE_KEYS.initialized, 'true');
}

// Initialize
seedData();

// Auth
export const auth = {
  login(email: string, password: string): User | null {
    const users = get<User>(STORAGE_KEYS.users);
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
      return user;
    }
    return null;
  },
  logout() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  },
  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.currentUser);
    return data ? JSON.parse(data) : null;
  },
};

// Players
export const playersDB = {
  getAll: () => get<Player>(STORAGE_KEYS.players),
  getById: (id: string) => getOne<Player>(STORAGE_KEYS.players, id),
  create: (player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlayer = { ...player, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Player;
    add(STORAGE_KEYS.players, newPlayer);
    addLog('created', 'Player', newPlayer.id, `Registered ${newPlayer.fullName}`);
    return newPlayer;
  },
  update: (id: string, updates: Partial<Player>) => {
    const result = update<Player>(STORAGE_KEYS.players, id, updates);
    if (result) addLog('updated', 'Player', id, `Updated ${result.fullName}`);
    return result;
  },
  delete: (id: string) => {
    const player = getOne<Player>(STORAGE_KEYS.players, id);
    if (player) addLog('deleted', 'Player', id, `Deleted ${player.fullName}`);
    return remove<Player>(STORAGE_KEYS.players, id);
  },
  search: (query: string) => {
    const players = get<Player>(STORAGE_KEYS.players);
    const q = query.toLowerCase();
    return players.filter(p => p.fullName.toLowerCase().includes(q) || p.position.toLowerCase().includes(q) || p.ageGroup.toLowerCase().includes(q));
  },
};

// Coaches
export const coachesDB = {
  getAll: () => get<Coach>(STORAGE_KEYS.coaches),
  getById: (id: string) => getOne<Coach>(STORAGE_KEYS.coaches, id),
  create: (coach: Omit<Coach, 'id' | 'createdAt'>) => {
    const newCoach = { ...coach, id: uuidv4(), createdAt: new Date().toISOString() } as Coach;
    add(STORAGE_KEYS.coaches, newCoach);
    addLog('created', 'Coach', newCoach.id, `Added coach ${newCoach.fullName}`);
    return newCoach;
  },
  update: (id: string, updates: Partial<Coach>) => update<Coach>(STORAGE_KEYS.coaches, id, updates),
  delete: (id: string) => remove<Coach>(STORAGE_KEYS.coaches, id),
};

// Training
export const trainingDB = {
  getAll: () => get<TrainingSession>(STORAGE_KEYS.training),
  getById: (id: string) => getOne<TrainingSession>(STORAGE_KEYS.training, id),
  create: (session: Omit<TrainingSession, 'id' | 'createdAt'>) => {
    const newSession = { ...session, id: uuidv4(), createdAt: new Date().toISOString() } as TrainingSession;
    add(STORAGE_KEYS.training, newSession);
    addLog('created', 'Training', newSession.id, `Created training: ${newSession.title}`);
    return newSession;
  },
  update: (id: string, updates: Partial<TrainingSession>) => update<TrainingSession>(STORAGE_KEYS.training, id, updates),
  delete: (id: string) => remove<TrainingSession>(STORAGE_KEYS.training, id),
};

// Attendance
export const attendanceDB = {
  getAll: () => get<AttendanceRecord>(STORAGE_KEYS.attendance),
  getByDate: (date: string) => get<AttendanceRecord>(STORAGE_KEYS.attendance).filter(a => a.date === date),
  getByPlayer: (playerId: string) => get<AttendanceRecord>(STORAGE_KEYS.attendance).filter(a => a.playerId === playerId),
  record: (records: Omit<AttendanceRecord, 'id' | 'createdAt'>[]) => {
    const all = get<AttendanceRecord>(STORAGE_KEYS.attendance);
    records.forEach(r => {
      const existing = all.findIndex(a => a.playerId === r.playerId && a.date === r.date);
      if (existing >= 0) {
        all[existing] = { ...all[existing], ...r };
      } else {
        all.push({ ...r, id: uuidv4(), createdAt: new Date().toISOString() });
      }
    });
    set(STORAGE_KEYS.attendance, all);
    addLog('recorded', 'Attendance', records[0]?.sessionId || '', `Attendance recorded for ${records.length} players`);
  },
};

// Matches
export const matchesDB = {
  getAll: () => get<Match>(STORAGE_KEYS.matches),
  getById: (id: string) => getOne<Match>(STORAGE_KEYS.matches, id),
  create: (match: Omit<Match, 'id' | 'createdAt'>) => {
    const newMatch = { ...match, id: uuidv4(), createdAt: new Date().toISOString() } as Match;
    add(STORAGE_KEYS.matches, newMatch);
    addLog('created', 'Match', newMatch.id, `Created match vs ${newMatch.opponent}`);
    return newMatch;
  },
  update: (id: string, updates: Partial<Match>) => update<Match>(STORAGE_KEYS.matches, id, updates),
  delete: (id: string) => remove<Match>(STORAGE_KEYS.matches, id),
};

// Payments
export const paymentsDB = {
  getAll: () => get<Payment>(STORAGE_KEYS.payments),
  getByPlayer: (playerId: string) => get<Payment>(STORAGE_KEYS.payments).filter(p => p.playerId === playerId),
  create: (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment = { ...payment, id: uuidv4(), createdAt: new Date().toISOString() } as Payment;
    add(STORAGE_KEYS.payments, newPayment);
    addLog('recorded', 'Payment', newPayment.id, `Payment of GHS ${newPayment.amount} recorded`);
    return newPayment;
  },
  update: (id: string, updates: Partial<Payment>) => update<Payment>(STORAGE_KEYS.payments, id, updates),
  delete: (id: string) => remove<Payment>(STORAGE_KEYS.payments, id),
};

// Announcements
export const announcementsDB = {
  getAll: () => get<Announcement>(STORAGE_KEYS.announcements),
  create: (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn = { ...ann, id: uuidv4(), createdAt: new Date().toISOString() } as Announcement;
    add(STORAGE_KEYS.announcements, newAnn);
    addLog('created', 'Announcement', newAnn.id, `Published: ${newAnn.title}`);
    return newAnn;
  },
  update: (id: string, updates: Partial<Announcement>) => update<Announcement>(STORAGE_KEYS.announcements, id, updates),
  delete: (id: string) => remove<Announcement>(STORAGE_KEYS.announcements, id),
};

// Scouting
export const scoutingDB = {
  getAll: () => get<ScoutingProspect>(STORAGE_KEYS.prospects),
  getById: (id: string) => getOne<ScoutingProspect>(STORAGE_KEYS.prospects, id),
  create: (prospect: Omit<ScoutingProspect, 'id' | 'createdAt'>) => {
    const newProspect = { ...prospect, id: uuidv4(), createdAt: new Date().toISOString() } as ScoutingProspect;
    add(STORAGE_KEYS.prospects, newProspect);
    return newProspect;
  },
  update: (id: string, updates: Partial<ScoutingProspect>) => update<ScoutingProspect>(STORAGE_KEYS.prospects, id, updates),
  delete: (id: string) => remove<ScoutingProspect>(STORAGE_KEYS.prospects, id),
};

// Notifications
export const notificationsDB = {
  getAll: (userId: string) => get<Notification>(STORAGE_KEYS.notifications).filter(n => n.userId === userId),
  getUnread: (userId: string) => get<Notification>(STORAGE_KEYS.notifications).filter(n => n.userId === userId && !n.read),
  markRead: (id: string) => update<Notification>(STORAGE_KEYS.notifications, id, { read: true } as any),
  create: (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotif = { ...notification, id: uuidv4(), createdAt: new Date().toISOString() } as Notification;
    add(STORAGE_KEYS.notifications, newNotif);
    return newNotif;
  },
};

// Activity Logs
function addLog(action: string, entityType: string, entityId: string, details: string) {
  const user = auth.getCurrentUser();
  const log: ActivityLog = {
    id: uuidv4(),
    action,
    entityType,
    entityId,
    userId: user?.id || 'system',
    userName: user?.name || 'System',
    details,
    createdAt: new Date().toISOString(),
  };
  add(STORAGE_KEYS.activityLogs, log);
}

export const activityLogsDB = {
  getAll: () => get<ActivityLog>(STORAGE_KEYS.activityLogs),
  getRecent: (limit = 20) => get<ActivityLog>(STORAGE_KEYS.activityLogs).slice(-limit).reverse(),
};

// Performance
export const performanceDB = {
  getAll: () => get<PerformanceRecord>(STORAGE_KEYS.performance),
  getByPlayer: (playerId: string) => get<PerformanceRecord>(STORAGE_KEYS.performance).filter(p => p.playerId === playerId),
  create: (record: Omit<PerformanceRecord, 'id' | 'createdAt'>) => {
    const newRecord = { ...record, id: uuidv4(), createdAt: new Date().toISOString() } as PerformanceRecord;
    add(STORAGE_KEYS.performance, newRecord);
    return newRecord;
  },
};

// Global Search
export const globalSearch = (query: string) => {
  const q = query.toLowerCase();
  const results: { category: string; items: any[] }[] = [];
  
  const players = playersDB.getAll().filter(p => p.fullName.toLowerCase().includes(q) || p.position.toLowerCase().includes(q));
  if (players.length) results.push({ category: 'Players', items: players });
  
  const coaches = coachesDB.getAll().filter(c => c.fullName.toLowerCase().includes(q));
  if (coaches.length) results.push({ category: 'Coaches', items: coaches });
  
  const matches = matchesDB.getAll().filter(m => m.opponent.toLowerCase().includes(q) || m.competition.toLowerCase().includes(q));
  if (matches.length) results.push({ category: 'Matches', items: matches });
  
  const announcements = announcementsDB.getAll().filter(a => a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q));
  if (announcements.length) results.push({ category: 'Announcements', items: announcements });
  
  return results;
};
