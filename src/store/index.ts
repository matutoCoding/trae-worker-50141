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
  Animal,
  FeedFormula,
  FeedingPlan,
  FeedingRecord,
  HealthRecord,
  BreedingRecord,
  Enclosure,
  BehaviorRecord,
  EnrichmentActivity,
  EducationSchedule,
  VisitorInteraction,
  Species,
  HealthStatus,
  Gender,
} from '@/types';

export interface TimelineItem {
  id: string;
  type: 'feeding' | 'health' | 'breeding' | 'behavior';
  date: string;
  title: string;
  description: string;
  relatedId: string;
  pagePath: string;
}

const STORAGE_PREFIX = 'zoo_management_';

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (stored) return JSON.parse(stored) as T;
  } catch {}
  return fallback;
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {}
};

export type WarningType =
  | 'temperature'
  | 'humidity'
  | 'cleaning_overdue'
  | 'stereotypic_high'
  | 'animal_abnormal';

export interface Warning {
  type: WarningType;
  id: string;
  title: string;
  message: string;
  severity: 'warning' | 'alert';
  relatedId?: string;
  relatedName?: string;
}

export interface FamilyTree {
  animal: Animal | undefined;
  father: Animal | undefined;
  mother: Animal | undefined;
  children: Animal[];
  siblings: Animal[];
}

const generateId = (prefix: string) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
};

const breedingTypeLabels: Record<string, string> = {
  estrus: '发情', mating: '交配', pregnancy: '怀孕', birth: '出生',
};

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
  addAnimal: (animal: Omit<Animal, 'id' | 'age'>) => void;
  updateAnimal: (id: string, data: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  addFeedingRecord: (record: Omit<FeedingRecord, 'id'>) => void;
  addFeedingPlan: (plan: Omit<FeedingPlan, 'id'>) => void;
  updateFeedingPlan: (id: string, data: Partial<FeedingPlan>) => void;
  deleteFeedingPlan: (id: string) => void;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  updateAnimalHealthStatus: (animalId: string, status: HealthStatus) => void;
  addBreedingRecord: (record: Omit<BreedingRecord, 'id'>) => void;
  updateBreedingRecord: (id: string, data: Partial<BreedingRecord>) => void;
  getAnimalFamilyTree: (animalId: string) => FamilyTree;
  updateEnclosureConditions: (id: string, temp: number, humidity: number) => void;
  updateEnclosureEnvironment: (id: string, temp: number, humidity: number) => void;
  addCleaningRecord: (enclosureId: string, record: { date: string; staff: string; method: string }) => void;
  addEnclosureCleaningRecord: (enclosureId: string, record: { date: string; staff: string; method: string }) => void;
  addEnclosureSafetyCheck: (enclosureId: string, record: { date: string; inspector: string; issues: string[]; status: string }) => void;
  addBehaviorRecord: (record: Omit<BehaviorRecord, 'id'>) => void;
  addEnrichmentActivity: (activity: Omit<EnrichmentActivity, 'id'>) => void;
  addEducationSchedule: (schedule: Omit<EducationSchedule, 'id'>) => void;
  updateEducationSchedule: (id: string, data: Partial<EducationSchedule>) => void;
  deleteEducationSchedule: (id: string) => void;
  addVisitorInteraction: (interaction: Omit<VisitorInteraction, 'id'>) => void;
  updateVisitorInteraction: (id: string, data: Partial<VisitorInteraction>) => void;
  deleteVisitorInteraction: (id: string) => void;
  getWarnings: () => Warning[];
  getAnimalTimeline: (animalId: string) => TimelineItem[];
}

export const useAppStore = create<AppState>((set, get) => ({
  animals: loadFromStorage('animals', mockAnimals),
  feedFormulas: mockFeedFormulas,
  feedingPlans: loadFromStorage('feedingPlans', mockFeedingPlans),
  feedingRecords: loadFromStorage('feedingRecords', mockFeedingRecords),
  healthRecords: loadFromStorage('healthRecords', mockHealthRecords),
  breedingRecords: loadFromStorage('breedingRecords', mockBreedingRecords),
  enclosures: loadFromStorage('enclosures', mockEnclosures),
  behaviorRecords: loadFromStorage('behaviorRecords', mockBehaviorRecords),
  enrichmentActivities: loadFromStorage('enrichmentActivities', mockEnrichmentActivities),
  educationSchedules: loadFromStorage('educationSchedules', mockEducationSchedules),
  visitorInteractions: loadFromStorage('visitorInteractions', mockVisitorInteractions),
  speciesList: mockSpeciesList,
  dashboardStats: mockDashboardStats,
  selectedAnimalId: null,
  setSelectedAnimalId: (id) => set({ selectedAnimalId: id }),

  addAnimal: (animalData) => {
    const id = generateId('a');
    const age = calculateAge(animalData.birthDate);
    const newAnimal: Animal = {
      ...animalData, id, age,
      pedigree: animalData.pedigree || { childrenIds: [] },
    } as Animal;
    set((state) => {
      const animals = [...state.animals, newAnimal];
      saveToStorage('animals', animals);
      return { animals };
    });
  },

  updateAnimal: (id, data) => {
    set((state) => {
      const old = state.animals.find((a) => a.id === id);
      if (!old) return state;
      const nameChanged = data.name !== undefined && data.name !== old.name;
      const healthChanged = data.healthStatus !== undefined && data.healthStatus !== old.healthStatus;
      const enclosureChanged = data.enclosureId !== undefined && data.enclosureName !== undefined
        && (data.enclosureId !== old.enclosureId || data.enclosureName !== old.enclosureName);

      const updatedAnimals = state.animals.map((a) => {
        if (a.id !== id) return a;
        const updated = { ...a, ...data };
        if (data.birthDate) updated.age = calculateAge(data.birthDate);
        return updated;
      });

      const newName = data.name || old.name;
      const newEnclosureName = data.enclosureName || old.enclosureName;

      const updatedFeedingPlans = nameChanged || healthChanged || enclosureChanged
        ? state.feedingPlans.map((p) => {
            if (p.animalId !== id) return p;
            const u: any = { ...p };
            if (nameChanged) u.animalName = newName;
            if (enclosureChanged) u.animalEnclosureName = newEnclosureName;
            return u;
          })
        : state.feedingPlans;

      const updatedFeedingRecords = nameChanged
        ? state.feedingRecords.map((r) => r.animalId === id ? { ...r, animalName: newName } : r)
        : state.feedingRecords;

      const updatedHealthRecords = nameChanged
        ? state.healthRecords.map((r) => r.animalId === id ? { ...r, animalName: newName } : r)
        : state.healthRecords;

      const updatedBreedingRecords = nameChanged
        ? state.breedingRecords.map((r) => {
            let updated = { ...r };
            if (r.animalId === id) updated.animalName = newName;
            if (r.partnerId === id && r.partnerName) updated.partnerName = newName;
            return updated;
          })
        : state.breedingRecords;

      const updatedBehaviorRecords = nameChanged
        ? state.behaviorRecords.map((r) => r.animalId === id ? { ...r, animalName: newName } : r)
        : state.behaviorRecords;

      let result: any = {
        animals: updatedAnimals,
        feedingPlans: updatedFeedingPlans,
        feedingRecords: updatedFeedingRecords,
        healthRecords: updatedHealthRecords,
        breedingRecords: updatedBreedingRecords,
        behaviorRecords: updatedBehaviorRecords,
      };

      if (healthChanged) {
        const attentionNote = `[${new Date().toISOString().slice(0, 10)}] 动物健康状态变更为${data.healthStatus}，需特别关注饲喂情况`;
        result.feedingPlans = result.feedingPlans.map((p: FeedingPlan) => {
          if (p.animalId !== id) return p;
          return { ...p, notes: [p.notes, attentionNote].filter(Boolean).join('；') };
        });
      }

      saveToStorage('animals', result.animals);
      saveToStorage('feedingPlans', result.feedingPlans);
      saveToStorage('feedingRecords', result.feedingRecords);
      saveToStorage('healthRecords', result.healthRecords);
      saveToStorage('breedingRecords', result.breedingRecords);
      saveToStorage('behaviorRecords', result.behaviorRecords);
      return result;
    });
  },

  deleteAnimal: (id) => {
    set((state) => {
      const result = {
        animals: state.animals.filter((a) => a.id !== id),
        feedingPlans: state.feedingPlans.filter((p) => p.animalId !== id),
        feedingRecords: state.feedingRecords.filter((r) => r.animalId !== id),
        healthRecords: state.healthRecords.filter((r) => r.animalId !== id),
        behaviorRecords: state.behaviorRecords.filter((r) => r.animalId !== id),
        breedingRecords: state.breedingRecords.filter((r) => r.animalId !== id && r.partnerId !== id),
      };
      saveToStorage('animals', result.animals);
      saveToStorage('feedingPlans', result.feedingPlans);
      saveToStorage('feedingRecords', result.feedingRecords);
      saveToStorage('healthRecords', result.healthRecords);
      saveToStorage('behaviorRecords', result.behaviorRecords);
      saveToStorage('breedingRecords', result.breedingRecords);
      return result;
    });
  },

  addFeedingRecord: (recordData) => {
    const id = generateId('fr');
    const newRecord: FeedingRecord = { ...recordData, id } as FeedingRecord;
    set((state) => {
      const plan = state.feedingPlans.find((p) => p.id === recordData.planId);
      let updatedPlans = state.feedingPlans;
      if (plan) {
        const ratio = recordData.actualQuantity / plan.quantity;
        updatedPlans = state.feedingPlans.map((p) => {
          if (p.id !== plan.id) return p;
          const note = ratio >= 1 ? '已完成本次饲喂' : ratio >= 0.5 ? '部分完成，需关注' : '饲喂量不足，需关注';
          return { ...p, notes: [p.notes, note].filter(Boolean).join('；') };
        });
      }
      const feedingRecords = [...state.feedingRecords, newRecord];
      saveToStorage('feedingRecords', feedingRecords);
      saveToStorage('feedingPlans', updatedPlans);
      return { feedingRecords, feedingPlans: updatedPlans };
    });
  },

  addFeedingPlan: (planData) => {
    const id = generateId('fp');
    const newPlan: FeedingPlan = { ...planData, id } as FeedingPlan;
    set((state) => {
      const feedingPlans = [...state.feedingPlans, newPlan];
      saveToStorage('feedingPlans', feedingPlans);
      return { feedingPlans };
    });
  },

  updateFeedingPlan: (id, data) => {
    set((state) => {
      const feedingPlans = state.feedingPlans.map((p) => p.id === id ? { ...p, ...data } : p);
      saveToStorage('feedingPlans', feedingPlans);
      return { feedingPlans };
    });
  },

  deleteFeedingPlan: (id) => {
    set((state) => {
      const feedingPlans = state.feedingPlans.filter((p) => p.id !== id);
      saveToStorage('feedingPlans', feedingPlans);
      return { feedingPlans };
    });
  },

  addHealthRecord: (recordData) => {
    const id = generateId('h');
    const newRecord: HealthRecord = { ...recordData, id } as HealthRecord;
    set((state) => {
      let updatedAnimals = state.animals;
      let updatedFeedingPlans = state.feedingPlans;
      const statusMap: Record<string, HealthStatus> = {
        '健康': 'healthy', '恢复中': 'recovering', '治疗中': 'sick', '患病': 'sick', '隔离中': 'quarantine',
      };
      const newHealthStatus = statusMap[recordData.overallStatus];
      if (newHealthStatus) {
        const animal = state.animals.find((a) => a.id === recordData.animalId);
        if (animal && animal.healthStatus !== newHealthStatus) {
          updatedAnimals = state.animals.map((a) =>
            a.id === recordData.animalId ? { ...a, healthStatus: newHealthStatus } : a
          );
          const attentionNote = `[${new Date().toISOString().slice(0, 10)}] 诊疗记录：${recordData.overallStatus}，需特别关注饲喂情况`;
          updatedFeedingPlans = state.feedingPlans.map((p) => {
            if (p.animalId !== recordData.animalId) return p;
            return { ...p, notes: [p.notes, attentionNote].filter(Boolean).join('；') };
          });
        }
      }
      const healthRecords = [...state.healthRecords, newRecord];
      saveToStorage('healthRecords', healthRecords);
      saveToStorage('animals', updatedAnimals);
      saveToStorage('feedingPlans', updatedFeedingPlans);
      return { healthRecords, animals: updatedAnimals, feedingPlans: updatedFeedingPlans };
    });
  },

  updateAnimalHealthStatus: (animalId, status) => {
    set((state) => {
      const animals = state.animals.map((a) => a.id === animalId ? { ...a, healthStatus: status } : a);
      const feedingPlans = state.feedingPlans.map((p) => {
        if (p.animalId !== animalId) return p;
        const note = `[${new Date().toISOString().slice(0, 10)}] 动物健康状态变更为${status}，需特别关注饲喂情况`;
        return { ...p, notes: [p.notes, note].filter(Boolean).join('；') };
      });
      saveToStorage('animals', animals);
      saveToStorage('feedingPlans', feedingPlans);
      return { animals, feedingPlans };
    });
  },

  addBreedingRecord: (recordData) => {
    const id = generateId('b');
    const newRecord: BreedingRecord = { ...recordData, id } as BreedingRecord;
    set((state) => {
      let updatedAnimals = state.animals;
      let updatedFeedingPlans = state.feedingPlans;
      let updatedHealthRecords = state.healthRecords;

      if (recordData.offspring && recordData.offspring.length > 0) {
        const mother = state.animals.find((a) => a.id === recordData.animalId);
        const father = recordData.partnerId
          ? state.animals.find((a) => a.id === recordData.partnerId)
          : undefined;

        const newAnimalEntries: Animal[] = recordData.offspring.map((off) => ({
          id: off.id, name: off.name,
          speciesId: mother?.speciesId || '',
          speciesName: mother?.speciesName || '',
          scientificName: mother?.scientificName || '',
          gender: off.gender as Gender,
          birthDate: off.birthDate,
          age: calculateAge(off.birthDate),
          weight: 0, entryDate: off.birthDate,
          healthStatus: 'healthy' as HealthStatus,
          enclosureId: mother?.enclosureId || '',
          enclosureName: mother?.enclosureName || '',
          imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20baby%20${encodeURIComponent(mother?.speciesName || 'animal')}%20newborn%20zoo&image_size=square`,
          conservationStatus: mother?.conservationStatus || '',
          dietType: mother?.dietType || '',
          pedigree: {
            fatherId: father?.id, fatherName: father?.name,
            motherId: mother?.id, motherName: mother?.name,
            childrenIds: [],
          },
        }));

        updatedAnimals = [...state.animals];
        for (const newEntry of newAnimalEntries) {
          if (!updatedAnimals.find((a) => a.id === newEntry.id)) {
            updatedAnimals = [...updatedAnimals, newEntry];
          }
        }

        updatedAnimals = updatedAnimals.map((a) => {
          if (a.id === recordData.animalId || (recordData.partnerId && a.id === recordData.partnerId)) {
            const existingChildren = a.pedigree?.childrenIds || [];
            const newChildrenIds = [...existingChildren, ...recordData.offspring!.map((o) => o.id)];
            return { ...a, pedigree: { ...a.pedigree, childrenIds: newChildrenIds } };
          }
          return a;
        });

        if (recordData.breedingType === 'birth') {
          const birthDate = recordData.eventDate;
          const newPlans: FeedingPlan[] = [];
          const newHealthRecs: HealthRecord[] = [];
          for (const off of recordData.offspring) {
            newPlans.push({
              id: generateId('fp'),
              animalId: off.id, animalName: off.name,
              formulaId: '', formulaName: '幼崽专用哺育配方（待配置）',
              feedingTime: '按需', quantity: 0, unit: 'kg',
              frequency: '按需喂养',
              notes: '新生幼崽，需每日关注哺乳情况，定期称重',
            });
            newHealthRecs.push({
              id: generateId('h'),
              animalId: off.id, animalName: off.name,
              checkupDate: birthDate, veterinarian: '待分配',
              weight: 0, temperature: 0, heartRate: 0,
              bloodPressure: '待检测', diagnoses: [],
              vaccinations: [], overallStatus: '新生幼崽观察中',
            });
          }
          updatedFeedingPlans = [...state.feedingPlans, ...newPlans];
          updatedHealthRecords = [...state.healthRecords, ...newHealthRecs];
        }
      }

      const breedingRecords = [...state.breedingRecords, newRecord];
      saveToStorage('breedingRecords', breedingRecords);
      saveToStorage('animals', updatedAnimals);
      if (recordData.breedingType === 'birth' && recordData.offspring) {
        saveToStorage('feedingPlans', updatedFeedingPlans);
        saveToStorage('healthRecords', updatedHealthRecords);
      }
      return { breedingRecords, animals: updatedAnimals, feedingPlans: updatedFeedingPlans, healthRecords: updatedHealthRecords };
    });
  },

  updateBreedingRecord: (id, data) => {
    set((state) => {
      const breedingRecords = state.breedingRecords.map((r) => r.id === id ? { ...r, ...data } : r);
      saveToStorage('breedingRecords', breedingRecords);
      return { breedingRecords };
    });
  },

  getAnimalFamilyTree: (animalId) => {
    const state = get();
    const animal = state.animals.find((a) => a.id === animalId);
    const father = animal?.pedigree?.fatherId
      ? state.animals.find((a) => a.id === animal.pedigree!.fatherId)
      : undefined;
    const mother = animal?.pedigree?.motherId
      ? state.animals.find((a) => a.id === animal.pedigree!.motherId)
      : undefined;
    const children = animal?.pedigree?.childrenIds
      ?.map((cid) => state.animals.find((a) => a.id === cid))
      .filter(Boolean) as Animal[] || [];

    const allChildrenOfParents = new Set<string>();
    father?.pedigree?.childrenIds?.forEach((cid) => allChildrenOfParents.add(cid));
    mother?.pedigree?.childrenIds?.forEach((cid) => allChildrenOfParents.add(cid));
    allChildrenOfParents.delete(animalId);
    const siblings = Array.from(allChildrenOfParents)
      .map((sid) => state.animals.find((a) => a.id === sid))
      .filter(Boolean) as Animal[];

    return { animal, father, mother, children, siblings };
  },

  updateEnclosureConditions: (id, temp, humidity) => {
    set((state) => {
      const enclosures = state.enclosures.map((e) => {
        if (e.id !== id) return e;
        let status: 'normal' | 'warning' | 'alert' = 'normal';
        const tempOut = temp < e.tempRange.min || temp > e.tempRange.max;
        const humOut = humidity < e.humidityRange.min || humidity > e.humidityRange.max;
        const tempNear = (temp >= e.tempRange.min && temp <= e.tempRange.min + 2)
          || (temp <= e.tempRange.max && temp >= e.tempRange.max - 2);
        const humNear = (humidity >= e.humidityRange.min && humidity <= e.humidityRange.min + 5)
          || (humidity <= e.humidityRange.max && humidity >= e.humidityRange.max - 5);
        if (tempOut || humOut) status = 'alert';
        else if (tempNear || humNear) status = 'warning';
        return { ...e, temperature: temp, humidity, status };
      });
      saveToStorage('enclosures', enclosures);
      return { enclosures };
    });
  },

  updateEnclosureEnvironment: (id, temp, humidity) => {
    set((state) => {
      const enclosures = state.enclosures.map((e) => {
        if (e.id !== id) return e;
        let status: 'normal' | 'warning' | 'alert' = 'normal';
        const tempOut = temp < e.tempRange.min || temp > e.tempRange.max;
        const humOut = humidity < e.humidityRange.min || humidity > e.humidityRange.max;
        const tempNear = (temp >= e.tempRange.min && temp <= e.tempRange.min + 2)
          || (temp <= e.tempRange.max && temp >= e.tempRange.max - 2);
        const humNear = (humidity >= e.humidityRange.min && humidity <= e.humidityRange.min + 5)
          || (humidity <= e.humidityRange.max && humidity >= e.humidityRange.max - 5);
        if (tempOut || humOut) status = 'alert';
        else if (tempNear || humNear) status = 'warning';
        return { ...e, temperature: temp, humidity, status };
      });
      saveToStorage('enclosures', enclosures);
      return { enclosures };
    });
  },

  addCleaningRecord: (enclosureId, record) => {
    set((state) => {
      const enclosures = state.enclosures.map((e) =>
        e.id !== enclosureId ? e : { ...e, lastCleaned: record.date, cleaningRecords: [record, ...e.cleaningRecords].slice(0, 50) }
      );
      saveToStorage('enclosures', enclosures);
      return { enclosures };
    });
  },

  addEnclosureCleaningRecord: (enclosureId, record) => {
    set((state) => {
      const enclosures = state.enclosures.map((e) =>
        e.id !== enclosureId ? e : { ...e, lastCleaned: record.date, cleaningRecords: [record, ...e.cleaningRecords].slice(0, 50) }
      );
      saveToStorage('enclosures', enclosures);
      return { enclosures };
    });
  },

  addEnclosureSafetyCheck: (enclosureId, record) => {
    set((state) => {
      const enclosures = state.enclosures.map((e) =>
        e.id !== enclosureId ? e : { ...e, safetyChecks: [record, ...e.safetyChecks].slice(0, 50) }
      );
      saveToStorage('enclosures', enclosures);
      return { enclosures };
    });
  },

  addBehaviorRecord: (recordData) => {
    const id = generateId('bh');
    const newRecord: BehaviorRecord = { ...recordData, id } as BehaviorRecord;
    set((state) => {
      const behaviorRecords = [...state.behaviorRecords, newRecord];
      saveToStorage('behaviorRecords', behaviorRecords);
      return { behaviorRecords };
    });
  },

  addEnrichmentActivity: (activityData) => {
    const id = generateId('en');
    const newActivity: EnrichmentActivity = { ...activityData, id } as EnrichmentActivity;
    set((state) => {
      const enrichmentActivities = [...state.enrichmentActivities, newActivity];
      saveToStorage('enrichmentActivities', enrichmentActivities);
      return { enrichmentActivities };
    });
  },

  addEducationSchedule: (scheduleData) => {
    const id = generateId('es');
    const newSchedule: EducationSchedule = { ...scheduleData, id } as EducationSchedule;
    set((state) => {
      const educationSchedules = [...state.educationSchedules, newSchedule];
      saveToStorage('educationSchedules', educationSchedules);
      return { educationSchedules };
    });
  },

  updateEducationSchedule: (id, data) => {
    set((state) => {
      const educationSchedules = state.educationSchedules.map((s) => s.id === id ? { ...s, ...data } : s);
      saveToStorage('educationSchedules', educationSchedules);
      return { educationSchedules };
    });
  },

  deleteEducationSchedule: (id) => {
    set((state) => {
      const educationSchedules = state.educationSchedules.filter((s) => s.id !== id);
      saveToStorage('educationSchedules', educationSchedules);
      return { educationSchedules };
    });
  },

  addVisitorInteraction: (interactionData) => {
    const id = generateId('vi');
    const newInteraction: VisitorInteraction = { ...interactionData, id } as VisitorInteraction;
    set((state) => {
      const visitorInteractions = [...state.visitorInteractions, newInteraction];
      saveToStorage('visitorInteractions', visitorInteractions);
      return { visitorInteractions };
    });
  },

  updateVisitorInteraction: (id, data) => {
    set((state) => {
      const visitorInteractions = state.visitorInteractions.map((i) => i.id === id ? { ...i, ...data } : i);
      saveToStorage('visitorInteractions', visitorInteractions);
      return { visitorInteractions };
    });
  },

  deleteVisitorInteraction: (id) => {
    set((state) => {
      const visitorInteractions = state.visitorInteractions.filter((i) => i.id !== id);
      saveToStorage('visitorInteractions', visitorInteractions);
      return { visitorInteractions };
    });
  },

  getWarnings: () => {
    const state = get();
    const warnings: Warning[] = [];
    const now = new Date();

    state.enclosures.forEach((e) => {
      if (e.temperature < e.tempRange.min || e.temperature > e.tempRange.max) {
        warnings.push({
          type: 'temperature', id: `temp-${e.id}`,
          title: `温度异常 - ${e.name}`,
          message: `当前温度 ${e.temperature}°C，正常范围 ${e.tempRange.min}-${e.tempRange.max}°C`,
          severity: e.status === 'alert' ? 'alert' : 'warning',
          relatedId: e.id, relatedName: e.name,
        });
      }
      if (e.humidity < e.humidityRange.min || e.humidity > e.humidityRange.max) {
        warnings.push({
          type: 'humidity', id: `hum-${e.id}`,
          title: `湿度异常 - ${e.name}`,
          message: `当前湿度 ${e.humidity}%，正常范围 ${e.humidityRange.min}-${e.humidityRange.max}%`,
          severity: e.status === 'alert' ? 'alert' : 'warning',
          relatedId: e.id, relatedName: e.name,
        });
      }
      const lastCleaned = new Date(e.lastCleaned);
      const hoursSinceCleaned = (now.getTime() - lastCleaned.getTime()) / (1000 * 60 * 60);
      if (hoursSinceCleaned > 24) {
        warnings.push({
          type: 'cleaning_overdue', id: `clean-${e.id}`,
          title: `清洁超时 - ${e.name}`,
          message: `已超过 ${Math.floor(hoursSinceCleaned)} 小时未清洁，上次清洁时间：${e.lastCleaned}`,
          severity: 'warning', relatedId: e.id, relatedName: e.name,
        });
      }
    });

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const stereotypicCountByAnimal = new Map<string, number>();
    state.behaviorRecords.forEach((r) => {
      if (r.behaviorType === 'stereotypic') {
        const recordDate = new Date(r.observationDate);
        if (recordDate >= sevenDaysAgo) {
          const current = stereotypicCountByAnimal.get(r.animalId) || 0;
          stereotypicCountByAnimal.set(r.animalId, current + r.frequency);
        }
      }
    });
    stereotypicCountByAnimal.forEach((count, animalId) => {
      if (count >= 5) {
        const animal = state.animals.find((a) => a.id === animalId);
        warnings.push({
          type: 'stereotypic_high', id: `stereo-${animalId}`,
          title: `刻板行为频发 - ${animal?.name || animalId}`,
          message: `最近7天刻板行为累计 ${count} 次，建议增加丰容活动`,
          severity: 'warning', relatedId: animalId, relatedName: animal?.name,
        });
      }
    });

    state.animals.forEach((a) => {
      if (['sick', 'quarantine', 'recovering'].includes(a.healthStatus)) {
        const plans = state.feedingPlans.filter((p) => p.animalId === a.id);
        const statusLabels: Record<string, string> = {
          sick: '患病', quarantine: '隔离中', recovering: '康复中',
        };
        warnings.push({
          type: 'animal_abnormal', id: `animal-${a.id}`,
          title: `动物状态异常 - ${a.name}`,
          message: `${a.speciesName} ${a.name} 当前状态：${statusLabels[a.healthStatus]}${
            plans.length > 0 ? `，关联 ${plans.length} 个饲喂计划需关注` : ''
          }`,
          severity: a.healthStatus === 'sick' ? 'alert' : 'warning',
          relatedId: a.id, relatedName: a.name,
        });
      }
    });

    return warnings;
  },

  getAnimalTimeline: (animalId) => {
    const state = get();
    const items: TimelineItem[] = [];

    state.feedingRecords.filter((r) => r.animalId === animalId).forEach((r) => {
      items.push({
        id: `feeding-${r.id}`, type: 'feeding', date: r.feedingDateTime,
        title: `投喂记录 - ${r.formulaName}`,
        description: `投喂${r.actualQuantity}kg，剩余${r.remainingAmount}kg`,
        relatedId: r.id, pagePath: '/feeding',
      });
    });

    state.healthRecords.filter((r) => r.animalId === animalId).forEach((r) => {
      items.push({
        id: `health-${r.id}`, type: 'health', date: r.checkupDate,
        title: `体检/诊疗 - ${r.overallStatus}`,
        description: `兽医：${r.veterinarian}，体重：${r.weight}kg`,
        relatedId: r.id, pagePath: '/health',
      });
    });

    state.breedingRecords.filter((r) => r.animalId === animalId || r.partnerId === animalId).forEach((r) => {
      items.push({
        id: `breeding-${r.id}`, type: 'breeding', date: r.eventDate,
        title: `繁育记录 - ${breedingTypeLabels[r.breedingType] || r.breedingType}`,
        description: `状态：${r.status}`,
        relatedId: r.id, pagePath: '/breeding',
      });
    });

    state.behaviorRecords.filter((r) => r.animalId === animalId).forEach((r) => {
      items.push({
        id: `behavior-${r.id}`, type: 'behavior', date: r.observationDate,
        title: `行为观察 - ${r.behaviorName}`,
        description: `频率${r.frequency}次，持续${r.durationMinutes}分钟`,
        relatedId: r.id, pagePath: '/behavior',
      });
    });

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return items;
  },
}));
