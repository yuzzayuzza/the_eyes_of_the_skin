export type ActId =
  | 'prologue'
  | 'act1_eye'
  | 'act2_blindness'
  | 'act3_ear'
  | 'act4_skin'
  | 'act5_shadow'
  | 'act6_memory'
  | 'act7_body';

export interface ActInfo {
  id: ActId;
  actNumber: number;
  roman: string;
  titleEn: string;
  titleZh: string;
  subtitle: string;
  pallasmaaQuoteZh: string;
  pallasmaaQuoteEn: string;
}

export interface MaterialZone {
  id: string;
  nameZh: string;
  nameEn: string;
  type: 'stone' | 'wood' | 'water' | 'fabric' | 'clay' | 'bronze';
  description: string;
  friction: number; // 0 (slippery) to 1 (heavy drag)
  roughness: number; // 0 to 1
  coldness: number; // 0 to 1
}

export interface TracePoint {
  x: number;
  y: number;
  type: 'step' | 'touch' | 'pause';
  timestamp: number;
  intensity: number;
  color?: string;
}
