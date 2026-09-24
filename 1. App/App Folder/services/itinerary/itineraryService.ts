// Itinerary Generator Service — TRD §20, §21, PRD §15
// Generates tailored stop-by-stop itineraries based on duration, mobility, and visitor interests

import type {
  ItineraryPreferences,
  GeneratedItinerary,
  ItineraryStop,
} from '../../types/itinerary';
import { getSiteById, heritageSites } from '../../data/sites';
import { getStoriesBySiteId } from '../../data/stories';
import { AvailabilityStatus } from '../../types/heritage';

class SarthiItineraryService {
  async generateItinerary(
    prefs: ItineraryPreferences
  ): Promise<GeneratedItinerary> {
    // Artificial computation delay
    await new Promise((res) => setTimeout(res, 800));

    const site = getSiteById(prefs.siteId) || heritageSites[0];
    const stories = getStoriesBySiteId(site.id);

    const isWheelchair = prefs.mobility === 'wheelchair';
    const isShortTime =
      prefs.duration === '30-45 min' || prefs.duration === '1-2 hours';

    // Build intelligent stops
    const stops: ItineraryStop[] = [
      {
        order: 1,
        title: `Arrival & Welcome Gate at ${site.name}`,
        description: `Begin at the primary monumental threshold. Inspect architectural inscriptions and structural orientation.`,
        durationMinutes: isShortTime ? 10 : 15,
        wheelchairAccessible: true,
        recommendedStoryId: stories[0]?.id,
        coordinates: site.coordinates,
      },
      {
        order: 2,
        title: `Central Heritage Sanctuary & Highlights`,
        description: `Explore the core architectural masterpiece, decorative motifs, and primary historical epigraphs.`,
        durationMinutes: isShortTime ? 20 : 35,
        wheelchairAccessible: !isWheelchair ? true : site.accessibility.ramp !== AvailabilityStatus.NOT_AVAILABLE,
        recommendedStoryId: stories[1]?.id,
        coordinates: {
          latitude: site.coordinates.latitude + 0.0005,
          longitude: site.coordinates.longitude + 0.0005,
        },
      },
      {
        order: 3,
        title: `Curated Heritage In-Depth Observation`,
        description: `Discover less-frequented carvings, ancient masonry craftsmanship, and preservation milestones.`,
        durationMinutes: isShortTime ? 15 : 30,
        wheelchairAccessible: !isWheelchair ? true : site.accessibility.ramp !== AvailabilityStatus.NOT_AVAILABLE,
        recommendedStoryId: stories[2]?.id,
        coordinates: {
          latitude: site.coordinates.latitude - 0.0004,
          longitude: site.coordinates.longitude + 0.0003,
        },
      },
    ];

    if (!isShortTime) {
      stops.push({
        order: 4,
        title: `Peripheral Courtyard & Archaeological Museum`,
        description: `View recovered stone fragments, detailed scale models, and archival photographs documenting restorations.`,
        durationMinutes: 30,
        wheelchairAccessible: site.accessibility.accessibleEntrance === AvailabilityStatus.AVAILABLE,
        recommendedStoryId: stories[3]?.id,
        coordinates: {
          latitude: site.coordinates.latitude + 0.0008,
          longitude: site.coordinates.longitude - 0.0004,
        },
      });
    }

    const totalDurationMinutes = stops.reduce(
      (acc, s) => acc + s.durationMinutes,
      0
    );

    return {
      id: `itin-${Date.now()}`,
      title: `${site.name} — Curated ${prefs.duration} Exploration`,
      siteId: site.id,
      siteName: site.name,
      totalDurationMinutes,
      walkingDistanceMeters: stops.length * 280,
      stops,
      createdAt: new Date().toISOString(),
      preferences: prefs,
      isCustom: true,
    };
  }
}

export const itineraryService = new SarthiItineraryService();
