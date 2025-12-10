
import { WorldView } from "../types";

export const WORLD_VIEWS: Record<string, WorldView> = {
  lotr: {
    id: "lotr",
    name: "Middle Earth",
    description: "A high-fantasy world of elves, orcs, and magic rings.",
    era: "Third Age",
    themeColor: "#F59E0B", // Amber/Gold
    systemPersona: "You are the Chronicler of Middle Earth. Speak in a Tolkien-esque, archaic, and epic tone. Focus on the struggle between light and shadow.",
    regions: [
      { name: "ERIADOR", center: { q: -6, r: 0 }, radius: 5, biome: 'plain', color: '#4ADE80' },
      { name: "MORDOR", center: { q: 8, r: 2 }, radius: 4, biome: 'ashland', color: '#ef4444' },
      { name: "GONDOR", center: { q: 2, r: 6 }, radius: 4, biome: 'plain', color: '#3b82f6' },
      { name: "RHOVANION", center: { q: 3, r: -5 }, radius: 5, biome: 'forest', color: '#166534' },
      { name: "IRON HILLS", center: { q: 9, r: -7 }, radius: 3, biome: 'mountain', color: '#94a3b8' },
    ],
    locations: [
      { id: "citadel_0", name: "Minas Tirith", type: "citadel", q: 2, r: 5, description: "The White City of Kings, multi-tiered stone city carved into a mountain." },
      { id: "shire_1", name: "The Shire", type: "plain", q: -8, r: 1, description: "Green rolling hills with hobbit holes, peaceful and agrarian." },
      { id: "mordor_1", name: "Barad-dûr", type: "ashland", q: 9, r: 2, description: "The Dark Tower, surrounded by ash and lava, an eye of fire at the top." },
      { id: "rivendell_1", name: "Rivendell", type: "forest", q: -3, r: -2, description: "Elven sanctuary hidden in a valley of waterfalls and autumn trees." },
      { id: "rohan_1", name: "Edoras", type: "plain", q: -1, r: 3, description: "A wooden hall atop a hill surrounded by golden grassy plains." },
      { id: "moria_1", name: "Moria Gate", type: "mountain", q: -2, r: 0, description: "Dark stone doors reflected in a still lake, ominous mountains above." },
      { id: "isengard_1", name: "Isengard", type: "citadel", q: -4, r: 3, description: "A black obsidian tower surrounded by industrial pits and machinery." },
      { id: "gondor_coast", name: "Pelargir", type: "coast", q: 1, r: 8, description: "A port city with ancient stone quays and great ships." },
      { id: "lothlorien", name: "Lothlórien", type: "forest", q: 0, r: -1, description: "Golden wood with massive mallorn trees and silver platforms." },
      { id: "mount_doom", name: "Mount Doom", type: "ashland", q: 8, r: 3, description: "A continuously erupting volcano in a desolate wasteland." }
    ]
  },
  three_kingdoms: {
    id: "three_kingdoms",
    name: "Three Kingdoms",
    description: "Ancient China during an era of warlords, strategy, and legendary heroes.",
    era: "Han Dynasty (Late)",
    themeColor: "#EF4444", // Red
    systemPersona: "You are a Historian of the Three Kingdoms. Speak in a dignified, strategic tone. Focus on strategy, loyalty, and ambition.",
    regions: [
      { name: "KINGDOM OF WEI", center: { q: 2, r: -6 }, radius: 6, biome: 'plain', color: '#3b82f6' },
      { name: "KINGDOM OF SHU", center: { q: -6, r: 4 }, radius: 5, biome: 'mountain', color: '#22c55e' },
      { name: "KINGDOM OF WU", center: { q: 6, r: 4 }, radius: 5, biome: 'river', color: '#ef4444' },
      { name: "CENTRAL PLAINS", center: { q: 0, r: 0 }, radius: 3, biome: 'battlefield', color: '#fbbf24' },
    ],
    locations: [
      { id: "luoyang", name: "Luoyang", type: "palace", q: 0, r: -1, description: "Grand imperial palace with red pillars and gold roofs, currently in turmoil." },
      { id: "hulao", name: "Hulao Gate", type: "battlefield", q: 2, r: -2, description: "A massive stone fortification pass, banners waving, armies gathered in front." },
      { id: "red_cliffs", name: "Red Cliffs", type: "river", q: 4, r: 2, description: "A wide river scene with connected warships burning, dramatic cliffs nearby." },
      { id: "changban", name: "Changban", type: "battlefield", q: -2, r: 1, description: "A chaotic battlefield on open ground, solitary hero fighting through." },
      { id: "jing_province", name: "Jingzhou", type: "village", q: -1, r: 3, description: "Fertile strategic lands with walled cities and rice paddies." },
      { id: "chengdu", name: "Chengdu", type: "palace", q: -7, r: 5, description: "A city in the mountains, misty and prosperous." },
      { id: "wuzhang", name: "Wuzhang Plains", type: "plain", q: -4, r: 2, description: "Windy plains with military encampments arranged in Bagua formation." },
      { id: "peach_garden", name: "Peach Garden", type: "temple", q: -3, r: -5, description: "A peaceful garden with blooming peach trees, an altar for oaths." },
      { id: "south_lands", name: "Jianye", type: "river", q: 7, r: 5, description: "Mist-covered river lands, naval yards, prosperous ports." },
      { id: "xuchang", name: "Xuchang", type: "citadel", q: 3, r: -4, description: "Strict military city, headquarters of the Prime Minister." }
    ]
  },
  journey_west: {
    id: "journey_west",
    name: "Journey to West",
    description: "A world of Chinese mythology, gods, demons, and the road to enlightenment.",
    era: "Tang Dynasty (Myth)",
    themeColor: "#8B5CF6", // Purple
    systemPersona: "You are a Storyteller of Celestial Legends. Speak in a whimsical, mystical tone. Mention karma, magic powers, and the hierarchy of gods and demons.",
    regions: [
      { name: "EASTERN TANG", center: { q: 7, r: 2 }, radius: 4, biome: 'village', color: '#f59e0b' },
      { name: "WESTERN HEAVEN", center: { q: -8, r: 0 }, radius: 4, biome: 'temple', color: '#fbbf24' },
      { name: "HEAVENLY COURT", center: { q: 0, r: -8 }, radius: 4, biome: 'palace', color: '#ffffff' },
      { name: "WILDERNESS", center: { q: 0, r: 2 }, radius: 5, biome: 'mountain', color: '#a8a29e' },
      { name: "EASTERN SEA", center: { q: 8, r: -4 }, radius: 4, biome: 'ocean', color: '#3b82f6' },
    ],
    locations: [
      { id: "flower_fruit", name: "Flower-Fruit Mtn", type: "mountain", q: 9, r: -3, description: "A paradise mountain with waterfalls, monkeys playing, and a stone egg." },
      { id: "heaven_palace", name: "Celestial Palace", type: "palace", q: 1, r: -9, description: "Floating palace in the clouds, jade gates, golden light, divine guards." },
      { id: "dragon_palace", name: "Dragon Palace", type: "coast", q: 9, r: -5, description: "Underwater crystal palace, glowing corals, crab soldiers guarding." },
      { id: "flaming_mtn", name: "Flaming Mountains", type: "ashland", q: -3, r: 2, description: "Endless mountains on fire, extreme heat, red sky." },
      { id: "white_bone", name: "White Bone Cave", type: "mountain", q: -1, r: 1, description: "Eerie dark cave with skeletal remains, spooky mist." },
      { id: "thunder_monastery", name: "Thunder Monastery", type: "temple", q: -9, r: 1, description: "A grand buddhist temple glowing with holy light at the end of the road." },
      { id: "gao_village", name: "Gao Village", type: "village", q: 3, r: 3, description: "A normal looking village but with a strange wind, wedding decorations." },
      { id: "river_sands", name: "River of Sands", type: "river", q: -5, r: 4, description: "A massive rushing river of quicksand, impossible to cross." },
      { id: "pansi_cave", name: "Spider Cave", type: "swamp", q: 0, r: 5, description: "Dark forest covered in thick webs, mysterious alluring lights." },
      { id: "chechi", name: "Chechi Kingdom", type: "citadel", q: -2, r: -2, description: "A desert kingdom ruled by three animal sorcerers." }
    ]
  },
  three_body: {
    id: "three_body",
    name: "Three Body",
    description: "Hard Sci-Fi universe involving aliens, physics, and cosmic sociology.",
    era: "Crisis Era",
    themeColor: "#0EA5E9", // Cyan
    systemPersona: "You are the sophon-blocked System Monitor. Speak in a cold, scientific, and slightly ominous tone. Focus on physics, sociology, and existential threats.",
    regions: [
      { name: "SOLAR SYSTEM", center: { q: -6, r: 2 }, radius: 5, biome: 'deep_space', color: '#38bdf8' },
      { name: "ALPHA CENTAURI", center: { q: 6, r: -2 }, radius: 4, biome: 'nebula', color: '#f472b6' },
      { name: "DEEP SPACE", center: { q: 0, r: 0 }, radius: 15, biome: 'deep_space', color: '#1e293b' },
    ],
    locations: [
      { id: "red_coast", name: "Red Coast Base", type: "base", q: -7, r: 3, description: "A radar dish atop a foggy cliff, communist era architecture, snow." },
      { id: "trisolaris", name: "Trisolaris", type: "planet", q: 7, r: -2, description: "A desolate planet with three suns in the sky, chaotic gravity, dehydrated bodies." },
      { id: "judgment_day", name: "Judgment Day Ship", type: "base", q: -5, r: 1, description: "A massive oil tanker being sliced by invisible nanofibers in a canal." },
      { id: "eto_meet", name: "ETO Assembly", type: "ruins", q: -4, r: 4, description: "An abandoned cafeteria filled with intellectuals playing a VR game." },
      { id: "droplet", name: "The Droplet", type: "station", q: 0, r: 0, description: "A perfectly smooth teardrop shaped probe reflecting the galaxy." },
      { id: "bunker_era", name: "Bunker World", type: "city", q: -8, r: 0, description: "Underground cities behind Jupiter, artificial lights, tree buildings." },
      { id: "pluto_museum", name: "Pluto Museum", type: "planet", q: -9, r: 5, description: "A lonely museum on ice, artifacts of human civilization." },
      { id: "dx3906", name: "Star DX3906", type: "planet", q: 2, r: -6, description: "A blue planet with purple plants, peaceful and untouched." },
      { id: "4th_dim", name: "4D Fragment", type: "nebula", q: 4, r: 3, description: "Abstract geometric space, seeing inside objects, kaleidoscopic." },
      { id: "australia_res", name: "Resettlement", type: "plain", q: -6, r: 4, description: "Crowded dusty plains, refugee camps, lack of power." }
    ]
  },
  harry_potter: {
    id: "harry_potter",
    name: "Wizarding World",
    description: "A secret world of magic hidden within the modern world.",
    era: "1990s",
    themeColor: "#EAB308", // Yellow
    systemPersona: "You are a reporter for the Daily Prophet. Speak in a witty, magical, and slightly sensationalist tone. Use British spellings and wizarding slang.",
    regions: [
      { name: "SCOTLAND", center: { q: -5, r: -3 }, radius: 4, biome: 'mountain', color: '#166534' },
      { name: "LONDON", center: { q: 5, r: 3 }, radius: 3, biome: 'city', color: '#64748b' },
      { name: "WILDERNESS", center: { q: 0, r: 0 }, radius: 10, biome: 'plain', color: '#a8a29e' },
      { name: "NORTH SEA", center: { q: 8, r: -8 }, radius: 4, biome: 'ocean', color: '#1e40af' },
    ],
    locations: [
      { id: "hogwarts", name: "Hogwarts", type: "citadel", q: -6, r: -4, description: "A massive gothic castle with many towers, sitting on a cliff over a lake." },
      { id: "diagon", name: "Diagon Alley", type: "city", q: 5, r: 3, description: "A cobblestone wizarding street, crooked shops, magical items in windows." },
      { id: "ministry", name: "Ministry of Magic", type: "palace", q: 6, r: 2, description: "Underground atrium with dark tiles, golden statues, fireplaces connecting to floo network." },
      { id: "forbidden_forest", name: "Forbidden Forest", type: "forest", q: -5, r: -2, description: "Dark dense ancient forest, webs, centaurs in shadows." },
      { id: "hogsmeade", name: "Hogsmeade", type: "village", q: -7, r: -3, description: "Snow-covered thatched cottages, warm butterbeer shops." },
      { id: "azkaban", name: "Azkaban", type: "citadel", q: 9, r: -9, description: "A triangular fortress in the middle of a stormy sea, dementors flying." },
      { id: "burrow", name: "The Burrow", type: "village", q: 0, r: 5, description: "A crooked towering house held up by magic, chickens, garden gnomes." },
      { id: "platform_934", name: "Platform 9 3/4", type: "station", q: 4, r: 4, description: "A steam train station with a red express train, steam billowing." },
      { id: "godric_hollow", name: "Godric's Hollow", type: "village", q: -2, r: 2, description: "Quiet village with a graveyard, war memorial, ruins of a house." },
      { id: "quidditch", name: "Quidditch Cup", type: "plain", q: -4, r: 6, description: "A massive tent city and stadium, vibrant colors, fireworks." }
    ]
  }
};
