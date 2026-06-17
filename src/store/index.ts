import { create } from 'zustand';
import {
  animals as mockAnimals,
  feedFormulas as mockFeedFormulas,
  feedingPlans as mockFeedingPlans,
  feedingRecords as mockFeedingRecords,
  healthRecords as mockHealthRecords,
  breedingRecords as mockBreedingRecords,
  enclosures as mockEnclosures,
  behaviorRecords as mockBehaviorRecords,
  enrichmentActivities as mockEnrichmentActivities,
  educationSchedules as mockEducationSchedules,
  visitorInteractions as mockVisitorInteractions,
  dashboardStats as mockDashboardStats,
  speciesList as mockSpeciesList,
} from '@/data/mockData';
import type {
  Animal, FeedFormula, FeedingPlan, FeedingRecord, HealthRecord, BreedingRecord, Enclosure, BehaviorRecord, EnrichmentActivity, EducationSchedule, VisitorInteraction, Species
} from '@/types';

interface AppState {
  animals: Animal[];
  feedFormulas: FeedFormula[];
  feedingPlans: FeedingPlan[];
  feedingRecords: FeedingRecord[];
  healthRecords: HealthRecord[];
  breedingRecords: BreedingRecord[];
  enclosures: Enclosure[];
  behaviorRecords: BehaviorRecord[];
  enrichmentActivities: EnrichmentActivity[];
  educationSchedules: EducationSchedule[];
  visitorInteractions: VisitorInteraction[];
  speciesList: Species[];
  dashboardStats: typeof mockDashboardStats;
  selectedAnimalId: string | null;
  setSelectedAnimalId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  animals: mockAnimals,
  feedFormulas: mockFeedFormulas,
  feedingPlans: mockFeedingPlans,
  feedingRecords: mockFeedingRecords,
  healthRecords: mockHealthRecords,
  breedingRecords: mockBreedingRecords,
  enclosures: mockEnclosures,
  behaviorRecords: mockBehaviorRecords,
  enrichmentActivities: mockEnrichmentActivities,
  educationSchedules: mockEducationSchedules,
  visitorInteractions: mockVisitorInteractions,
  speciesList: mockSpeciesList,
  dashboardStats: mockDashboardStats,
  selectedAnimalId: null,
  setSelectedAnimalId: (id) => set({ selectedAnimalId: id }),
}));
