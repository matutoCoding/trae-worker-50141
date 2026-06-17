export type HealthStatus = 'healthy' | 'sick' | 'quarantine' | 'recovering';
export type Gender = 'male' | 'female';
export type BehaviorType = 'normal' | 'stereotypic' | 'aggressive' | 'social';
export type Severity = 'mild' | 'moderate' | 'severe';
export type BreedingType = 'estrus' | 'mating' | 'pregnancy' | 'birth';
export type HealthTodoType = 'assign_vet' | 'first_checkup' | 'weigh_in' | 'vaccinate';
export type TodoStatus = 'pending' | 'completed';
export type CareLogType = 'feeding' | 'weighing' | 'temperature' | 'observation';

export interface Animal {
  id: string;
  name: string;
  speciesId: string;
  speciesName: string;
  scientificName: string;
  gender: Gender;
  birthDate: string;
  age: number;
  weight: number;
  entryDate: string;
  healthStatus: HealthStatus;
  enclosureId: string;
  enclosureName: string;
  imageUrl: string;
  conservationStatus: string;
  dietType: string;
  pedigree?: {
    fatherId?: string;
    fatherName?: string;
    motherId?: string;
    motherName?: string;
    childrenIds: string[];
  };
  quarantine?: {
    startDate: string;
    endDate?: string;
    status: 'active' | 'completed';
    notes: string;
  };
  isNewborn?: boolean;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  conservationStatus: string;
  habitat: string;
  dietType: string;
  description: string;
}

export interface FeedFormula {
  id: string;
  name: string;
  ingredients: Array<{ name: string; percentage: number }>;
  nutritionInfo: {
    protein: number;
    fat: number;
    carbohydrate: number;
    fiber: number;
  };
  applicableSpecies: string[];
  isFavorite: boolean;
}

export interface FeedingPlan {
  id: string;
  animalId: string;
  animalName: string;
  formulaId: string;
  formulaName: string;
  feedingTime: string;
  quantity: number;
  unit: string;
  frequency: string;
  notes?: string;
}

export interface FeedingRecord {
  id: string;
  planId: string;
  animalId: string;
  animalName: string;
  formulaName: string;
  feedingDateTime: string;
  plannedQuantity: number;
  actualQuantity: number;
  remainingAmount: number;
  feeder: string;
  notes: string;
  status: 'completed' | 'partial' | 'missed';
}

export interface HealthRecord {
  id: string;
  animalId: string;
  animalName: string;
  checkupDate: string;
  veterinarian: string;
  weight: number;
  temperature: number;
  heartRate: number;
  bloodPressure: string;
  diagnoses: Array<{
    condition: string;
    treatment: string;
    medication: string;
    followUpDate?: string;
  }>;
  vaccinations: Array<{
    vaccineName: string;
    date: string;
    nextDue: string;
  }>;
  overallStatus: string;
}

export interface BreedingRecord {
  id: string;
  animalId: string;
  animalName: string;
  partnerId?: string;
  partnerName?: string;
  breedingType: BreedingType;
  eventDate: string;
  status: string;
  notes: string;
  offspring?: Array<{
    id: string;
    name: string;
    birthDate: string;
    gender: Gender;
    status: string;
  }>;
}

export interface Enclosure {
  id: string;
  name: string;
  area: string;
  capacity: number;
  currentOccupancy: number;
  temperature: number;
  humidity: number;
  tempRange: { min: number; max: number };
  humidityRange: { min: number; max: number };
  lastCleaned: string;
  status: 'normal' | 'warning' | 'alert';
  cleaningRecords: Array<{
    date: string;
    staff: string;
    method: string;
  }>;
  safetyChecks: Array<{
    date: string;
    inspector: string;
    issues: string[];
    status: string;
  }>;
}

export interface EnvironmentLog {
  id: string;
  enclosureId: string;
  enclosureName: string;
  logTime: string;
  temperature: number;
  humidity: number;
  status: 'normal' | 'warning' | 'alert';
}

export interface BehaviorRecord {
  id: string;
  animalId: string;
  animalName: string;
  observationDate: string;
  observer: string;
  behaviorType: BehaviorType;
  behaviorName: string;
  frequency: number;
  durationMinutes: number;
  severity?: Severity;
  enrichmentActivity?: string;
  notes: string;
}

export interface EnrichmentActivity {
  id: string;
  name: string;
  type: string;
  targetSpecies: string[];
  description: string;
  lastUsed: string;
  effectiveness: number;
}

export interface EducationSchedule {
  id: string;
  date: string;
  guideName: string;
  guideAvatar: string;
  topic: string;
  animalExhibit: string;
  startTime: string;
  endTime: string;
  expectedVisitors: number;
  actualVisitors?: number;
  feedback?: string;
  category: string;
}

export interface VisitorInteraction {
  id: string;
  date: string;
  activityName: string;
  animalExhibit: string;
  participantCount: number;
  duration: number;
  feedbackScore: number;
  notes: string;
}

export interface HealthTodo {
  id: string;
  animalId: string;
  animalName: string;
  type: HealthTodoType;
  title: string;
  description: string;
  dueDate: string;
  status: TodoStatus;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
}

export interface CareLog {
  id: string;
  animalId: string;
  animalName: string;
  date: string;
  feedingAmount: number;
  feedingFrequency: number;
  weight: number;
  temperature?: number;
  notes: string;
  recordedBy: string;
}
