// SAARTHI — Immersive Heritage Experience Service
// Manages multi-scene VR-style panoramic views, interactive architectural hotspots, and site narratives

import type { HeritageExperience, HeritageScene, ExperienceHotspot } from '../../types/experience';
import { getSiteById, heritageSites } from '../../data/sites';

export class HeritageExperienceService {
  private experiences: Record<string, HeritageExperience> = {
    // 1. DEEKSHABHOOMI — Nagpur, Maharashtra
    deekshabhoomi: {
      siteId: 'deekshabhoomi',
      siteName: 'Deekshabhoomi Stupa',
      city: 'Nagpur',
      state: 'Maharashtra',
      classification: 'Sacred Buddhist Monument & Stupa',
      coverImage: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1600&q=85',
      historicalPeriod: '20th Century (Dhammachakra Pravartan 1956)',
      architecturalStyle: 'Greco-Buddhist & Sanchi-Inspired Modern Hemispherical Dome',
      provenance: {
        source: 'Dr. Babasaheb Ambedkar Smarak Samiti & State Archaeology',
        verified: true,
        lastUpdated: '2024-02-01',
      },
      scenes: [
        {
          id: 'scene-db-dome',
          siteId: 'deekshabhoomi',
          title: 'Great Hemispherical Stupa',
          subtitle: 'Panoramic Outer Plaza & 120ft Marble Dome',
          imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1600&q=85',
          description: 'The massive 120-foot dome of Dholpur marble and granite, modeled faithfully after the Great Stupa of Sanchi. It is the largest hollow stupa in Asia.',
          viewpointType: 'Panoramic',
          audioNarrative: 'Welcome to Deekshabhoomi, the hallowed ground where Dr. B.R. Ambedkar led the historic Buddhist revival in 1956.',
          hotspots: [
            {
              id: 'hs-db-dome-top',
              sceneId: 'scene-db-dome',
              title: 'Harmika & Chhatra Spire',
              subtitle: 'Symbol of Three Jewels (Triratna)',
              description: 'The pinnacle of the stupa crowns the hemispherical Anda with a square railing (Harmika) and umbrellas representing the Buddha, Dhamma, and Sangha.',
              category: 'Architecture',
              position: { x: 50, y: 22 },
              provenance: 'ASI Sanchi Architectural Survey & Smarak Samiti Records',
            },
            {
              id: 'hs-db-torana',
              sceneId: 'scene-db-dome',
              title: 'Carved Torana Gateway',
              subtitle: 'Ornamented Arch of Peace',
              description: 'Intricately sculpted gateways depict Ashokan motifs, lotus medallions, and scenes commemorating the 22 vows administered by Babasaheb Ambedkar.',
              category: 'Sculpture',
              position: { x: 26, y: 64 },
              provenance: 'Architect Sheo Dan Mal Blueprints (1968)',
            },
            {
              id: 'hs-db-dhammachakra',
              sceneId: 'scene-db-dome',
              title: 'Dhammachakra Pravartan Grounds',
              subtitle: 'Site of Mass Conversion (Oct 14, 1956)',
              description: 'The vast sacred open grounds where over 600,000 citizens embraced Buddhism on Ashoka Vijayadashami in a peaceful revolution for human dignity.',
              category: 'History',
              position: { x: 74, y: 72 },
              provenance: 'Government of India Historical Archives',
            },
          ],
        },
        {
          id: 'scene-db-inner',
          siteId: 'deekshabhoomi',
          title: 'Inner Stupa Sanctum',
          subtitle: 'Hollow Circular Hall & Golden Buddha',
          imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
          description: 'A grand circular hall inside the hollow stupa capable of seating thousands of meditating devotees under acoustic dome resonance.',
          viewpointType: 'Interior',
          audioNarrative: 'Inside the sanctum stands the bronze statue of Gautama Buddha, bathed in natural diffused light from the dome clerestory.',
          hotspots: [
            {
              id: 'hs-db-buddha-statue',
              sceneId: 'scene-db-inner',
              title: 'Bronze Gautama Buddha',
              subtitle: 'Bhumisparsha Mudra',
              description: 'The central deity statue depicts Lord Buddha touching the earth to bear witness to his enlightenment under the Bodhi tree.',
              category: 'Spiritual',
              position: { x: 49, y: 48 },
              provenance: 'Presented by Thai Royal Buddhist Delegation',
            },
            {
              id: 'hs-db-relic-urn',
              sceneId: 'scene-db-inner',
              title: 'Sacred Relic Urn (Asthi Kalash)',
              subtitle: 'Memorial of Dr. Babasaheb Ambedkar',
              description: 'Encased in pure marble and glass, this sanctum preserves sacred relics honoring Babasaheb’s lifelong struggle for equality.',
              category: 'Relic',
              position: { x: 78, y: 62 },
              provenance: 'Dr. Ambedkar Smarak Samiti Trust',
            },
          ],
        },
      ],
    },

    // 2. QUTUB MINAR — Delhi
    'qutub-minar': {
      siteId: 'qutub-minar',
      siteName: 'Qutub Minar Complex',
      city: 'Delhi',
      state: 'Delhi',
      classification: 'UNESCO World Heritage Monument',
      coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
      historicalPeriod: '12th–14th Century CE (Mamluk / Delhi Sultanate)',
      architecturalStyle: 'Indo-Islamic Sandstone & Marble Fluting',
      provenance: {
        source: 'Archaeological Survey of India (ASI) & UNESCO World Heritage Centre',
        verified: true,
        lastUpdated: '2024-01-15',
      },
      scenes: [
        {
          id: 'scene-qm-minar',
          siteId: 'qutub-minar',
          title: 'Qutub Minar Tower & Balconies',
          subtitle: '72.5-Metre Victory Minaret',
          imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
          description: 'Constructed from 1192 CE by Qutb-ud-din Aibak and Iltutmish. Five distinct storeys featuring angular and rounded fluting and intricate stalactite corbeling.',
          viewpointType: 'Panoramic',
          audioNarrative: 'Standing before the 72.5-metre Qutub Minar, admire the alternating red sandstone flutings and Quranic calligraphy bands.',
          hotspots: [
            {
              id: 'hs-qm-base-fluting',
              sceneId: 'scene-qm-minar',
              title: 'Alternating Angular & Round Flutes',
              subtitle: 'First Storey Sandstone Masonry',
              description: 'The lowest storey features alternating semicircular and triangular flutings with ornate epigraphic bands of Naskh calligraphy.',
              category: 'Architecture',
              position: { x: 48, y: 68 },
              provenance: 'ASI Monument Inscription Records No. 12',
            },
            {
              id: 'hs-qm-balcony',
              sceneId: 'scene-qm-minar',
              title: 'Stalactite Balcony Brackets',
              subtitle: 'Projecting Balcony Support',
              description: 'Miniature arches and geometric brackets create a honeycomb muqarnas effect supporting the overhanging spectator balconies.',
              category: 'Architecture',
              position: { x: 50, y: 38 },
              provenance: 'Percy Brown: Indian Architecture (Islamic Period)',
            },
            {
              id: 'hs-qm-iron-pillar',
              sceneId: 'scene-qm-minar',
              title: '4th-Century Iron Pillar',
              subtitle: 'Rustless Gupta Metallurgy (c. 400 CE)',
              description: 'A 7.2-metre pillar of 98% pure wrought iron dedicated to Lord Vishnu by King Chandra (Chandragupta II Vikramaditya). It has withstood 1,600 years of rain without corroding.',
              category: 'Inscription',
              position: { x: 80, y: 76 },
              provenance: 'Metallurgical Society of India & ASI Inscription Records',
            },
          ],
        },
        {
          id: 'scene-qm-courtyard',
          siteId: 'qutub-minar',
          title: 'Quwwat-ul-Islam Colonnade',
          subtitle: 'Cloistered Courtyard with Reused Pillars',
          imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85',
          description: 'The ancient mosque courtyard surrounded by stone colonnades featuring intricate Hindu and Jain stone carvings integrated into early sultanate arcades.',
          viewpointType: 'Interior',
          audioNarrative: 'Observe the rich decorative carvings on these colonnade pillars, testifying to the layered architectural transitions of 12th-century Delhi.',
          hotspots: [
            {
              id: 'hs-qm-pillar-carvings',
              sceneId: 'scene-qm-courtyard',
              title: 'Carved Floral Kalasha Motifs',
              subtitle: 'Pre-Sultanate Temple Columns',
              description: 'Richly carved pots of plenty (Purna-ghata), bells suspended from chains, and floral garlands adorning the salvaged sandstone pillars.',
              category: 'Sculpture',
              position: { x: 32, y: 55 },
              provenance: 'Alexander Cunningham: Archaeological Reports (1862)',
            },
            {
              id: 'hs-qm-alai-darwaza',
              sceneId: 'scene-qm-courtyard',
              title: 'Alai Darwaza Gateway',
              subtitle: 'First True Dome of India (1311 CE)',
              description: 'Built by Sultan Alauddin Khalji, featuring horseshoe arches, red sandstone with white marble fretwork, and the earliest true dome in Delhi.',
              category: 'Architecture',
              position: { x: 70, y: 44 },
              provenance: 'ASI Central Circle Monograph',
            },
          ],
        },
      ],
    },

    // 3. TAJ MAHAL — Agra, Uttar Pradesh
    'taj-mahal': {
      siteId: 'taj-mahal',
      siteName: 'Taj Mahal',
      city: 'Agra',
      state: 'Uttar Pradesh',
      classification: 'UNESCO World Heritage Monument',
      coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85',
      historicalPeriod: '17th Century CE (1631–1648 CE)',
      architecturalStyle: 'Peak Mughal White Makrana Marble Symmetry',
      provenance: {
        source: 'Archaeological Survey of India & UNESCO World Heritage Centre',
        verified: true,
        lastUpdated: '2024-01-15',
      },
      scenes: [
        {
          id: 'scene-tm-vista',
          siteId: 'taj-mahal',
          title: 'Charbagh Garden Reflecting Pool',
          subtitle: 'The Vista of Absolute Symmetry',
          imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85',
          description: 'The monumental perspective from the lotus pool (al-Hawd al-Kawthar), reflecting the pure white dome and four framing minarets across the Yamuna riverfront.',
          viewpointType: 'Panoramic',
          audioNarrative: 'The Taj Mahal was commissioned by Emperor Shah Jahan in memory of his beloved empress Mumtaz Mahal.',
          hotspots: [
            {
              id: 'hs-tm-main-dome',
              sceneId: 'scene-tm-vista',
              title: 'Double Onion Dome (Amrud)',
              subtitle: '35m Makrana Marble Cupola',
              description: 'The soaring bulbous double-dome sits atop a 7-metre cylindrical drum, crowned by a gilded lotus finial combining Islamic crescent and Hindu trident elements.',
              category: 'Architecture',
              position: { x: 50, y: 28 },
              provenance: 'Ustad Ahmad Lahori Architectural Archive',
            },
            {
              id: 'hs-tm-minaret',
              sceneId: 'scene-tm-vista',
              title: 'Framing Outward-Tilted Minaret',
              subtitle: '40m Freestanding Tower',
              description: 'Each of the four minarets is deliberately inclined slightly outward by a few degrees so that in the event of an earthquake, they fall away from the central tomb.',
              category: 'Architecture',
              position: { x: 22, y: 44 },
              provenance: 'ASI Structural Engineering Survey',
            },
            {
              id: 'hs-tm-pietra-dura',
              sceneId: 'scene-tm-vista',
              title: 'Parchin Kari (Pietra Dura)',
              subtitle: 'Semiprecious Gemstone Inlay',
              description: 'Thousands of carnelian, lapis lazuli, jade, turquoise, and jasper stones inlaid into flawless marble depicting paradise flowers that never wither.',
              category: 'Sculpture',
              position: { x: 50, y: 62 },
              provenance: 'Ebba Koch: The Complete Taj Mahal',
            },
          ],
        },
      ],
    },

    // 4. HAMPI — Karnataka
    hampi: {
      siteId: 'hampi',
      siteName: 'Hampi Monuments',
      city: 'Bellary',
      state: 'Karnataka',
      classification: 'UNESCO World Heritage Complex',
      coverImage: 'https://images.unsplash.com/photo-1600100397608-f010f443b71e?auto=format&fit=crop&w=1600&q=85',
      historicalPeriod: '14th–16th Century CE (Vijayanagara Empire)',
      architecturalStyle: 'Dravidian Monolithic Granite Architecture',
      provenance: {
        source: 'Archaeological Survey of India & UNESCO World Heritage Centre',
        verified: true,
        lastUpdated: '2024-01-15',
      },
      scenes: [
        {
          id: 'scene-hampi-chariot',
          siteId: 'hampi',
          title: 'Vittala Stone Chariot',
          subtitle: 'Monolithic Shrine of Garuda',
          imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b71e?auto=format&fit=crop&w=1600&q=85',
          description: 'One of the three great stone chariots of India. Built in the 16th century under King Krishnadevaraya, the chariot is an elaborate shrine dedicated to Garuda with revolving stone wheels.',
          viewpointType: 'Panoramic',
          audioNarrative: 'You stand inside the sacred precinct of the Vijaya Vittala Temple, facing the iconic stone chariot of Hampi.',
          hotspots: [
            {
              id: 'hs-hampi-wheels',
              sceneId: 'scene-hampi-chariot',
              title: 'Carved Granite Wheels',
              subtitle: 'Spoked Concentric Reliefs',
              description: 'These stone wheels feature lotus hubs and axle caps, historically engineered to rotate on granite pins during imperial festivals.',
              category: 'Sculpture',
              position: { x: 38, y: 72 },
              provenance: 'ASI Hampi Excavation Records',
            },
            {
              id: 'hs-hampi-musical-pillars',
              sceneId: 'scene-hampi-chariot',
              title: 'Ranga Mandapa Musical Pillars',
              subtitle: 'Acoustic Resonant Granite Shafts',
              description: 'Cluster of 56 slender granite pillars that emit distinct musical notes (Sa-Re-Ga-Ma) and the sounds of Indian percussion when gently tapped.',
              category: 'Architecture',
              position: { x: 80, y: 48 },
              provenance: 'National Institute of Design Acoustical Study (Hampi)',
            },
          ],
        },
      ],
    },

    // 5. AJANTA CAVES — Maharashtra
    'ajanta-caves': {
      siteId: 'ajanta-caves',
      siteName: 'Ajanta Caves',
      city: 'Chhatrapati Sambhajinagar',
      state: 'Maharashtra',
      classification: 'UNESCO World Heritage Site',
      coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85',
      historicalPeriod: '2nd Century BCE – 5th Century CE',
      architecturalStyle: 'Rock-Cut Basalt Buddhist Monasteries & Frescoes',
      provenance: {
        source: 'Archaeological Survey of India & UNESCO World Heritage Centre',
        verified: true,
        lastUpdated: '2024-01-15',
      },
      scenes: [
        {
          id: 'scene-ajanta-cave1',
          siteId: 'ajanta-caves',
          title: 'Cave 1 Monastery & Murals',
          subtitle: 'The Masterpiece of Indian Classical Painting',
          imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85',
          description: 'A grand rock-cut Vihara carved into a crescent-shaped basalt cliff overlooking the Waghur river gorge, containing the famous murals of Padmapani and Vajrapani.',
          viewpointType: 'Interior',
          audioNarrative: 'Step inside Cave 1, where ancient Buddhist monk artists painted the eternal compassion of the Bodhisattva.',
          hotspots: [
            {
              id: 'hs-ajanta-padmapani',
              sceneId: 'scene-ajanta-cave1',
              title: 'Bodhisattva Padmapani Fresco',
              subtitle: 'The Lotus-Bearer of Compassion',
              description: 'Crowned in jewels and holding a blue lotus, the Bodhisattva looks downward with infinite grace and serenity, painted with natural mineral pigments.',
              category: 'Sculpture',
              position: { x: 42, y: 45 },
              provenance: 'ASI Ajanta Conservation Monograph Vol. 1',
            },
            {
              id: 'hs-ajanta-columns',
              sceneId: 'scene-ajanta-cave1',
              title: 'Fluted Rock-Cut Pillars',
              subtitle: 'Monolithic Basalt Hall',
              description: 'Twenty intricately carved stone pillars support the painted ceiling, depicting heavenly musicians (Gandharvas) and Jataka story episodes.',
              category: 'Architecture',
              position: { x: 75, y: 65 },
              provenance: 'Walter Spink: Ajanta - History and Development',
            },
          ],
        },
      ],
    },
  };

  /**
   * Retrieves or dynamically generates a rich interactive experience for a site
   */
  async getExperienceBySiteId(siteId: string): Promise<HeritageExperience | null> {
    const existing = this.experiences[siteId];
    if (existing) {
      return existing;
    }

    // Dynamic fallback generation from standard site catalog
    const site = getSiteById(siteId);
    if (!site) return null;

    const fallbackExperience: HeritageExperience = {
      siteId: site.id,
      siteName: site.name,
      city: site.city,
      state: site.state,
      classification: `${site.heritageType} (${site.unesco ? 'UNESCO World Heritage' : 'ASI Protected'})`,
      coverImage: site.images[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
      historicalPeriod: site.timeline[0]?.year || 'Historic Era',
      architecturalStyle: `${site.state} Heritage Architecture`,
      provenance: {
        source: site.provenance.source || 'Archaeological Survey of India',
        verified: site.provenance.verified,
        lastUpdated: site.provenance.lastUpdated || '2024-01-15',
      },
      scenes: [
        {
          id: `scene-${site.id}-main`,
          siteId: site.id,
          title: `${site.name} Panoramic View`,
          subtitle: `Exploring ${site.city}, ${site.state}`,
          imageUrl: site.images[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
          description: site.description,
          viewpointType: 'Panoramic',
          audioNarrative: site.shortDescription,
          hotspots: (site.highlights || []).slice(0, 3).map((highlight, idx) => ({
            id: `hs-${site.id}-${idx}`,
            sceneId: `scene-${site.id}-main`,
            title: highlight,
            subtitle: `Historic Feature #${idx + 1}`,
            description: `${site.name} is celebrated for its ${highlight.toLowerCase()} showcasing master craftsmanship.`,
            category: 'Architecture' as const,
            position: {
              x: 25 + idx * 25,
              y: 40 + (idx % 2) * 15,
            },
            provenance: site.provenance.source,
          })),
        },
      ],
    };

    return fallbackExperience;
  }

  /**
   * Returns all available sites with curated experiences
   */
  getAvailableExperienceSiteIds(): string[] {
    return Object.keys(this.experiences);
  }
}

export const heritageExperienceService = new HeritageExperienceService();
