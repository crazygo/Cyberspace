
export enum Sender {
  User = 'User',
  Diplomat = 'Diplomat',
  System = 'System'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export enum ImageSize {
  Size1K = '1K',
  Size2K = '2K',
  Size4K = '4K'
}

export enum AspectRatio {
  Landscape = '16:9',
  Portrait = '9:16'
}

export interface UniverseStats {
  water: number;
  oxygen: number;
  biomass: number;
}

export interface UniverseNode {
  id: string;
  parentId: string | null;
  type: 'root' | 'splitter' | 'branch';
  title: string;
  description: string;
  stats: UniverseStats;
  x: number;
  y: number;
  level: number;
}

// Extended Terrain Types for Multiverse
export type TerrainType = 
  // Fantasy / Earth
  | 'citadel' | 'plain' | 'forest' | 'mountain' | 'swamp' | 'desert' | 'ashland' | 'coast' | 'ocean'
  // Historical / Eastern
  | 'palace' | 'temple' | 'village' | 'battlefield' | 'river'
  // Sci-Fi
  | 'base' | 'station' | 'planet' | 'nebula' | 'ruins' | 'city' | 'deep_space';

export interface WorldLocation {
  id: string;
  name: string;
  type: TerrainType;
  description: string; // The blueprint for image generation
  q: number; // Axial Coordinate Q
  r: number; // Axial Coordinate R
}

export interface WorldRegion {
  name: string;
  center: { q: number, r: number };
  radius: number;
  biome: TerrainType; // Dominant terrain
  color: string; // Text/Border color
}

export interface WorldView {
  id: string;
  name: string;
  description: string;
  era: string;
  themeColor: string; // Hex for UI accents
  systemPersona: string; // The system instruction for the AI Diplomat
  locations: WorldLocation[];
  regions: WorldRegion[]; // Spheres of influence
}

export interface WorldEvent {
  locationId: string;
  narrative: string;
  imagePrompt: string;
}

// Augment window for AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  
  interface Window {
    aistudio?: AIStudio;
  }
}
