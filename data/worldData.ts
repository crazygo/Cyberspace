import { WorldLocation } from "../types";

export const WORLD_LOCATIONS: WorldLocation[] = [
  // Center: The Capital
  { id: "citadel_0", name: "The White Citadel", type: "citadel", q: 0, r: 0, description: "A massive multi-tiered city of white stone carved into a mountain edge, a withered white tree in the topmost courtyard, flags waving." },
  
  // West: The Green Lands (Shire-like)
  { id: "shire_1", name: "Halfling Hills", type: "plain", q: -1, r: 0, description: "Rolling green hills with round wooden doors built into the earth, smoke rising from chimneys, vibrant gardens." },
  { id: "shire_2", name: "Westfarthing Market", type: "plain", q: -2, r: 0, description: "A bustling country market with colorful tents, fresh vegetables, barrels of ale, and rustic wooden carts." },
  { id: "forest_1", name: "Old Took's Woods", type: "forest", q: -1, r: 1, description: "Ancient oak trees with thick roots, dappled sunlight filtering through leaves, peaceful and secluded." },
  
  // North: Snowy/Mountainous
  { id: "snow_1", name: "Frost Peak Outpost", type: "mountain", q: 0, r: -1, description: "A stone watchtower covered in snow, jagged mountain peaks in the background, cold blue atmosphere." },
  { id: "snow_2", name: "Ice Wind Pass", type: "mountain", q: 1, r: -2, description: "A narrow treacherous path between sheer cliffs of ice and dark rock, blizzard conditions." },
  { id: "snow_3", name: "Frozen Lake", type: "coast", q: -1, r: -1, description: "A vast frozen lake reflecting the pale sky, cracked ice patterns, silence." },

  // East: The Ash Lands (Mordor-like)
  { id: "ash_1", name: "The Black Gate", type: "ashland", q: 1, r: 0, description: "Gigantic black iron gates blocking a mountain pass, dark jagged architecture, red volcanic glow in distance." },
  { id: "ash_2", name: "Mount Doom Approach", type: "ashland", q: 2, r: 0, description: "Barren rocky wasteland, ash falling like snow, lava fissures glowing red in the ground." },
  { id: "ash_3", name: "Barad Tower Base", type: "ashland", q: 2, r: -1, description: "The base of an impossibly tall dark tower, obsidion stone, green magical energy swirling." },

  // South: Desert/Coast (Harad/Gondor coast)
  { id: "coast_1", name: "Bay of Belfalas", type: "coast", q: 0, r: 1, description: "A rocky coastline with crashing grey waves, ancient white ruins on the cliff edge." },
  { id: "desert_1", name: "Sands of Harad", type: "desert", q: 1, r: 1, description: "Endless golden sand dunes, hot sun, a caravan of travelers in the distance." },
  { id: "desert_2", name: "Oasis City", type: "desert", q: 2, r: 1, description: "A city of clay bricks and palm trees surrounding a blue water pool, exotic spices and fabrics." },

  // Other fillers to make ~30 and round shape
  { id: "forest_2", name: "Elven Sanctuary", type: "forest", q: -2, r: 1, description: "Golden trees with silver bark, elegant art nouveau architecture, magical lights." },
  { id: "swamp_1", name: "Dead Marshes", type: "swamp", q: 1, r: -1, description: "Stagnant pools of water, dead grasses, mist covering the ground, eerie pale lights." },
  { id: "plain_1", name: "Fields of Rohan", type: "plain", q: -1, r: 2, description: "Vast golden grasslands blowing in the wind, horses grazing in the distance, rocky outcrops." },
  { id: "plain_2", name: "The Great River", type: "coast", q: 0, r: 2, description: "A wide rushing river flowing through a canyon, two massive statues of kings standing guard." },
  { id: "mountain_2", name: "Mines Entrance", type: "mountain", q: -2, r: -1, description: "A hidden stone door in a cliff face, calm dark water lake in front, moonlight." },
  
  // Outer Ring
  { id: "outer_1", name: "Northern Wastes", type: "mountain", q: 0, r: -2, description: "Desolate tundra, rocky ground, aurora borealis in the sky." },
  { id: "outer_2", name: "Eastern Shadow", type: "ashland", q: 3, r: -1, description: "Dark clouds permanently overhead, jagged rocks, industrial forges smoke." },
  { id: "outer_3", name: "Southern Coast", type: "coast", q: 1, r: 2, description: "Tropical beach with dark rocks, corsair ships with black sails on the horizon." },
  { id: "outer_4", name: "Western Edge", type: "plain", q: -3, r: 1, description: "Peaceful farmland edge, looking out towards the distant sea." },
  { id: "outer_5", name: "Misty Valley", type: "forest", q: -2, r: 2, description: "Deep valley filled with fog, tree tops poking through, mysterious atmosphere." },
  { id: "outer_6", name: "Iron Hills", type: "mountain", q: 2, r: -2, description: "Red-hued mountains, dwarven mining structures, industrial but stony." },
  { id: "outer_7", name: "Fangorn Edge", type: "forest", q: -1, r: -2, description: "Old twisted trees, dark and foreboding, looks like the trees are watching." },
  { id: "outer_8", name: "Gap of Rohan", type: "plain", q: -2, r: -2, description: "Windy gap between mountains, grassy plains." },
  { id: "outer_9", name: "Emyn Muil", type: "mountain", q: 3, r: -2, description: "Sharp razor-like rocks, labyrinth of stone, foggy." },
  { id: "outer_10", name: "Ithilien", type: "forest", q: 3, r: 0, description: "Wild garden country, waterfalls, ruins overgrown with ivy." },
];