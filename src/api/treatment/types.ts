export interface GetTreatmentsPayload {
  patientId: number;
}

export interface ModifyTreatmentPayload {
  treatmentId: number;
  modifyText: string;
}

export interface RemoveAddonPayload {
  treatmentId: number;
  addonRef: string;
}

export interface ReactivateTreatmentPayload {
  treatmentId: number;
  subscriptionItemIdsToRemove?: number[];
}

export interface RetentionKey {
  key: string;
  subscriptionRef: string;
}
