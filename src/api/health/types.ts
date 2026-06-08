import type { BiomarkersCategory, BiomarkersSummary, HealthInsightCondition } from '@/types/health';

export interface HealthInsightResponse {
  id: string;
  patientId: number;
  conditions: HealthInsightCondition[];
  updatedAt: string;
}

export interface BiomarkersResponse {
  summary: BiomarkersSummary;
  categories: BiomarkersCategory[];
}
