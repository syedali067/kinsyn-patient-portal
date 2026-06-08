export interface AiSetting {
  name: string;
  slug: string;
  value: number;
}

export interface AiSettings {
  settings: AiSetting[];
}

export interface AiSettingsResponse {
  settings: {
    enable_ai_companion: AiSetting;
  };
}
