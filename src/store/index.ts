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

const generateId = (prefix: string) => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
};

const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
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
  addCleaningRecord: (
    enclosureId: string,
    record: { date: string; staff: string; method: string }
  ) => void;
  addEnclosureCleaningRecord: (
    enclosureId: string,
    record: { date: string; staff: string; method: string }
  ) => void;
  addEnclosureSafetyCheck: (
    enclosureId: string,
    record: { date: string; inspector: string; issues: string[]; status: string }
  ) => void;

  addBehaviorRecord: (record: Omit<BehaviorRecord, 'id'>) => void;
  addEnrichmentActivity: (activity: Omit<EnrichmentActivity, 'id'>) => void;

  addEducationSchedule: (schedule: Omit<EducationSchedule, 'id'>) => void;
  updateEducationSchedule: (id: string, data: Partial<EducationSchedule>) => void;
  deleteEducationSchedule: (id: string) => void;
  addVisitorInteraction: (interaction: Omit<VisitorInteraction, 'id'>) => void;
  updateVisitorInteraction: (id: string, data: Partial<VisitorInteraction>) => void;
  deleteVisitorInteraction: (id: string) => void;

  getWarnings: () => Warning[];
}

export const useAppStore = create<AppState>((set, get) => ({
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

  addAnimal: (animalData) => {
    const id = generateId('a');
    const age = calculateAge(animalData.birthDate);
    const newAnimal: Animal = {
      ...animalData,
      id,
      age,
      pedigree: animalData.pedigree || { childrenIds: [] },
    } as Animal;
    set((state) => ({ animals: [...state.animals, newAnimal] }));
  },

  updateAnimal: (id, data) => {
    set((state) => {
      const old = state.animals.find((a) => a.id === id);
      if (!old) return state;
      const nameChanged = data.name !== undefined && data.name !== old.name;
      const healthChanged = data.healthStatus !== undefined && data.healthStatus !== old.healthStatus;
      const enclosureChanged = data.enclosureId !== undefined && data.enclosureName !== undefined && (data.enclosureId !== old.enclosureId || data.enclosureName !== old.enclosureName);

      const updatedAnimals = state.animals.map((a) => {
        if (a.id !== id) return a;
        const updated = { ...a, ...data };
        if (data.birthDate) {
          updated.age = calculateAge(data.birthDate);
        }
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
        ? state.feedingRecords.map((r) =>
            r.animalId === id ? { ...r, animalName: newName } : r
          )
        : state.feedingRecords;

      const updatedHealthRecords = nameChanged
        ? state.healthRecords.map((r) =>
            r.animalId === id ? { ...r, animalName: newName } : r
          )
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
        ? state.behaviorRecords.map((r) =>
            r.animalId === id ? { ...r, animalName: newName } : r
          )
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
        const newStatus = data.healthStatus!;
        const attentionNote = `[${new Date().toISOString().slice(0, 10)}] 动物健康状态变更为${newStatus}，需特别关注饲喂情况`;
        result.feedingPlans = result.feedingPlans.map((p: FeedingPlan) => {
          if (p.animalId !== id) return p;
          const newNotes = [p.notes, attentionNote].filter(Boolean).join('；');
          return { ...p, notes: newNotes };
        });
      }

      return result;
    });
  },

  deleteAnimal: (id) => {
    set((state) => ({
      animals: state.animals.filter((a) => a.id !== id),
      feedingPlans: state.feedingPlans.filter((p) => p.animalId !== id),
      feedingRecords: state.feedingRecords.filter((r) => r.animalId !== id),
      healthRecords: state.healthRecords.filter((r) => r.animalId !== id),
      behaviorRecords: state.behaviorRecords.filter((r) => r.animalId !== id),
      breedingRecords: state.breedingRecords.filter(
        (r) => r.animalId !== id && r.partnerId !== id
      ),
    }));
  },

  addFeedingRecord: (recordData) => {
    const id = generateId('fr');
    const newRecord: FeedingRecord = { ...recordData, id } as FeedingRecord;
    set((state) => {
      const plan = state.feedingPlans.find((p) => p.id === recordData.planId);
      let updatedPlans = state.feedingPlans;
      if (plan) {
        const completionRatio = recordData.actualQuantity / plan.quantity;
        updatedPlans = state.feedingPlans.map((p) => {
          if (p.id !== plan.id) return p;
          const newNotes = [
            p.notes,
            completionRatio >= 1
              ? '已完成本次饲喂'
              : completionRatio >= 0.5
              ? '部分完成，需关注'
              : '饲喂量不足，需关注',
          ]
            .filter(Boolean)
            .join('；');
          return { ...p, notes: newNotes };
        });
      }
      return {
        feedingRecords: [...state.feedingRecords, newRecord],
        feedingPlans: updatedPlans,
      };
    });
  },

  addFeedingPlan: (planData) => {
    const id = generateId('fp');
    const newPlan: FeedingPlan = { ...planData, id } as FeedingPlan;
    set((state) => ({ feedingPlans: [...state.feedingPlans, newPlan] }));
  },

  updateFeedingPlan: (id, data) => {
    set((state) => ({
      feedingPlans: state.feedingPlans.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    }));
  },

  deleteFeedingPlan: (id) => {
    set((state) => ({
      feedingPlans: state.feedingPlans.filter((p) => p.id !== id),
    }));
  },

  addHealthRecord: (recordData) => {
    const id = generateId('h');
    const newRecord: HealthRecord = { ...recordData, id } as HealthRecord;
    set((state) => {
      let updatedAnimals = state.animals;
      let updatedFeedingPlans = state.feedingPlans;

      const statusMap: Record<string, HealthStatus> = {
        '健康': 'healthy',
        '恢复中': 'recovering',
        '治疗中': 'sick',
        '患病': 'sick',
        '隔离中': 'quarantine',
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
            const newNotes = [p.notes, attentionNote].filter(Boolean).join('；');
            return { ...p, notes: newNotes };
          });
        }
      }

      return {
        healthRecords: [...state.healthRecords, newRecord],
        animals: updatedAnimals,
        feedingPlans: updatedFeedingPlans,
      };
    });
  },

  updateAnimalHealthStatus: (animalId, status) => {
    set((state) => ({
      animals: state.animals.map((a) =>
        a.id === animalId ? { ...a, healthStatus: status } : a
      ),
      feedingPlans: state.feedingPlans.map((p) => {
        if (p.animalId !== animalId) return p;
        const attentionNote = `[${new Date().toISOString().slice(0, 10)}] 动物健康状态变更为${status}，需特别关注饲喂情况`;
        const newNotes = [p.notes, attentionNote].filter(Boolean).join('；');
        return { ...p, notes: newNotes };
      }),
    }));
  },

  addBreedingRecord: (recordData) => {
    const id = generateId('b');
    const newRecord: BreedingRecord = { ...recordData, id } as BreedingRecord;
    set((state) => {
      let updatedAnimals = state.animals;

      if (recordData.offspring && recordData.offspring.length > 0) {
        const mother = state.animals.find((a) => a.id === recordData.animalId);
        const father = recordData.partnerId
          ? state.animals.find((a) => a.id === recordData.partnerId)
          : undefined;

        const newAnimalEntries: Animal[] = recordData.offspring.map((off) => ({
          id: off.id,
          name: off.name,
          speciesId: mother?.speciesId || '',
          speciesName: mother?.speciesName || '',
          scientificName: mother?.scientificName || '',
          gender: off.gender as Gender,
          birthDate: off.birthDate,
          age: calculateAge(off.birthDate),
          weight: 0,
          entryDate: off.birthDate,
          healthStatus: 'healthy' as HealthStatus,
          enclosureId: mother?.enclosureId || '',
          enclosureName: mother?.enclosureName || '',
          imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20baby%20${encodeURIComponent(mother?.speciesName || 'animal')}%20newborn%20zoo&image_size=square`,
          conservationStatus: mother?.conservationStatus || '',
          dietType: mother?.dietType || '',
          pedigree: {
            fatherId: father?.id,
            fatherName: father?.name,
            motherId: mother?.id,
            motherName: mother?.name,
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
          if (a.id === recordData.animalId) {
            const existingChildren = a.pedigree?.childrenIds || [];
            const newChildrenIds = [
              ...existingChildren,
              ...recordData.offspring!.map((o) => o.id),
            ];
            return {
              ...a,
              pedigree: { ...a.pedigree, childrenIds: newChildrenIds },
            };
          }
          if (recordData.partnerId && a.id === recordData.partnerId) {
            const existingChildren = a.pedigree?.childrenIds || [];
            const newChildrenIds = [
              ...existingChildren,
              ...recordData.offspring!.map((o) => o.id),
            ];
            return {
              ...a,
              pedigree: { ...a.pedigree, childrenIds: newChildrenIds },
            };
          }
          return a;
        });
      }
      return {
        breedingRecords: [...state.breedingRecords, newRecord],
        animals: updatedAnimals,
      };
    });
  },

  updateBreedingRecord: (id, data) => {
    set((state) => ({
      breedingRecords: state.breedingRecords.map((r) =>
        r.id === id ? { ...r, ...data } : r
      ),
    }));
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
    const children =
      animal?.pedigree?.childrenIds
        ?.map((cid) => state.animals.find((a) => a.id === cid))
        .filter(Boolean) as Animal[] || [];

    const allChildrenOfParents = new Set<string>();
    if (father?.pedigree?.childrenIds) {
      father.pedigree.childrenIds.forEach((cid) => allChildrenOfParents.add(cid));
    }
    if (mother?.pedigree?.childrenIds) {
      mother.pedigree.childrenIds.forEach((cid) => allChildrenOfParents.add(cid));
    }
    allChildrenOfParents.delete(animalId);
    const siblings = Array.from(allChildrenOfParents)
      .map((sid) => state.animals.find((a) => a.id === sid))
      .filter(Boolean) as Animal[];

    return { animal, father, mother, children, siblings };
  },

  updateEnclosureConditions: (id, temp, humidity) => {
    set((state) => ({
      enclosures: state.enclosures.map((e) => {
        if (e.id !== id) return e;
        let status: 'normal' | 'warning' | 'alert' = 'normal';
        const tempOutOfRange = temp < e.tempRange.min || temp > e.tempRange.max;
        const humidityOutOfRange =
          humidity < e.humidityRange.min || humidity > e.humidityRange.max;
        const tempNearRange =
          (temp >= e.tempRange.min && temp <= e.tempRange.min + 2) ||
          (temp <= e.tempRange.max && temp >= e.tempRange.max - 2);
        const humidityNearRange =
          (humidity >= e.humidityRange.min && humidity <= e.humidityRange.min + 5) ||
          (humidity <= e.humidityRange.max && humidity >= e.humidityRange.max - 5);

        if (tempOutOfRange || humidityOutOfRange) {
          status = 'alert';
        } else if (tempNearRange || humidityNearRange) {
          status = 'warning';
        }
        return { ...e, temperature: temp, humidity, status };
      }),
    }));
  },

  updateEnclosureEnvironment: (id, temp, humidity) => {
    set((state) => ({
      enclosures: state.enclosures.map((e) => {
        if (e.id !== id) return e;
        let status: 'normal' | 'warning' | 'alert' = 'normal';
        const tempOutOfRange = temp < e.tempRange.min || temp > e.tempRange.max;
        const humidityOutOfRange = humidity < e.humidityRange.min || humidity > e.humidityRange.max;
        const tempNearRange = (temp >= e.tempRange.min && temp <= e.tempRange.min + 2) || (temp <= e.tempRange.max && temp >= e.tempRange.max - 2);
        const humidityNearRange = (humidity >= e.humidityRange.min && humidity <= e.humidityRange.min + 5) || (humidity <= e.humidityRange.max && humidity >= e.humidityRange.max - 5);
        if (tempOutOfRange || humidityOutOfRange) status = 'alert';
        else if (tempNearRange || humidityNearRange) status = 'warning';
        return { ...e, temperature: temp, humidity, status };
      }),
    }));
  },

  addCleaningRecord: (enclosureId, record) => {
    set((state) => ({
      enclosures: state.enclosures.map((e) => {
        if (e.id !== enclosureId) return e;
        return { ...e, lastCleaned: record.date, cleaningRecords: [record, ...e.cleaningRecords].slice(0, 50) };
      }),
    }));
  },

  addEnclosureCleaningRecord: (enclosureId, record) => {
    set((state) => ({
      enclosures: state.enclosures.map((e) => {
        if (e.id !== enclosureId) return e;
        return { ...e, lastCleaned: record.date, cleaningRecords: [record, ...e.cleaningRecords].slice(0, 50) };
      }),
    }));
  },

  addEnclosureSafetyCheck: (enclosureId, record) => {
    set((state) => ({
      enclosures: state.enclosures.map((e) => {
        if (e.id !== enclosureId) return e;
        return { ...e, safetyChecks: [record, ...e.safetyChecks].slice(0, 50) };
      }),
    }));
  },

  addBehaviorRecord: (recordData) => {
    const id = generateId('bh');
    const newRecord: BehaviorRecord = { ...recordData, id } as BehaviorRecord;
    set((state) => ({
      behaviorRecords: [...state.behaviorRecords, newRecord],
    }));
  },

  addEnrichmentActivity: (activityData) => {
    const id = generateId('en');
    const newActivity: EnrichmentActivity = { ...activityData, id } as EnrichmentActivity;
    set((state) => ({
      enrichmentActivities: [...state.enrichmentActivities, newActivity],
    }));
  },

  addEducationSchedule: (scheduleData) => {
    const id = generateId('es');
    const newSchedule: EducationSchedule = { ...scheduleData, id } as EducationSchedule;
    set((state) => ({
      educationSchedules: [...state.educationSchedules, newSchedule],
    }));
  },

  updateEducationSchedule: (id, data) => {
    set((state) => ({
      educationSchedules: state.educationSchedules.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    }));
  },

  deleteEducationSchedule: (id) => {
    set((state) => ({
      educationSchedules: state.educationSchedules.filter((s) => s.id !== id),
    }));
  },

  addVisitorInteraction: (interactionData) => {
    const id = generateId('vi');
    const newInteraction: VisitorInteraction = {
      ...interactionData,
      id,
    } as VisitorInteraction;
    set((state) => ({
      visitorInteractions: [...state.visitorInteractions, newInteraction],
    }));
  },

  updateVisitorInteraction: (id, data) => {
    set((state) => ({
      visitorInteractions: state.visitorInteractions.map((i) =>
        i.id === id ? { ...i, ...data } : i
      ),
    }));
  },

  deleteVisitorInteraction: (id) => {
    set((state) => ({
      visitorInteractions: state.visitorInteractions.filter((i) => i.id !== id),
    }));
  },

  getWarnings: () => {
    const state = get();
    const warnings: Warning[] = [];
    const now = new Date();

    state.enclosures.forEach((e) => {
      if (e.temperature < e.tempRange.min || e.temperature > e.tempRange.max) {
        warnings.push({
          type: 'temperature',
          id: `temp-${e.id}`,
          title: `温度异常 - ${e.name}`,
          message: `当前温度 ${e.temperature}°C，正常范围 ${e.tempRange.min}-${e.tempRange.max}°C`,
          severity: e.status === 'alert' ? 'alert' : 'warning',
          relatedId: e.id,
          relatedName: e.name,
        });
      }
      if (e.humidity < e.humidityRange.min || e.humidity > e.humidityRange.max) {
        warnings.push({
          type: 'humidity',
          id: `hum-${e.id}`,
          title: `湿度异常 - ${e.name}`,
          message: `当前湿度 ${e.humidity}%，正常范围 ${e.humidityRange.min}-${e.humidityRange.max}%`,
          severity: e.status === 'alert' ? 'alert' : 'warning',
          relatedId: e.id,
          relatedName: e.name,
        });
      }

      const lastCleaned = new Date(e.lastCleaned);
      const hoursSinceCleaned = (now.getTime() - lastCleaned.getTime()) / (1000 * 60 * 60);
      if (hoursSinceCleaned > 24) {
        warnings.push({
          type: 'cleaning_overdue',
          id: `clean-${e.id}`,
          title: `清洁超时 - ${e.name}`,
          message: `已超过 ${Math.floor(hoursSinceCleaned)} 小时未清洁，上次清洁时间：${e.lastCleaned}`,
          severity: 'warning',
          relatedId: e.id,
          relatedName: e.name,
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
          type: 'stereotypic_high',
          id: `stereo-${animalId}`,
          title: `刻板行为频发 - ${animal?.name || animalId}`,
          message: `最近7天刻板行为累计 ${count} 次，建议增加丰容活动`,
          severity: 'warning',
          relatedId: animalId,
          relatedName: animal?.name,
        });
      }
    });

    state.animals.forEach((a) => {
      if (['sick', 'quarantine', 'recovering'].includes(a.healthStatus)) {
        const plans = state.feedingPlans.filter((p) => p.animalId === a.id);
        const statusLabels: Record<string, string> = {
          sick: '患病',
          quarantine: '隔离中',
          recovering: '康复中',
        };
        warnings.push({
          type: 'animal_abnormal',
          id: `animal-${a.id}`,
          title: `动物状态异常 - ${a.name}`,
          message: `${a.speciesName} ${a.name} 当前状态：${statusLabels[a.healthStatus]}${
            plans.length > 0 ? `，关联 ${plans.length} 个饲喂计划需关注` : ''
          }`,
          severity: a.healthStatus === 'sick' ? 'alert' : 'warning',
          relatedId: a.id,
          relatedName: a.name,
        });
      }
    });

    return warnings;
  },
}));
