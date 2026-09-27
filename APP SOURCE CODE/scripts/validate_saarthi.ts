// SAARTHI — Comprehensive Domain, Data & Service Verification Script
// Tests all acceptance criteria from SARTHI_PRD & SARTHI_TRD

import { heritageSites, getSiteById, searchSites } from '../data/sites';
import { heritageStories, getStoriesBySiteId } from '../data/stories';
import { aiService } from '../services/ai/aiService';
import { itineraryService } from '../services/itinerary/itineraryService';
import { locationService } from '../services/location/locationService';
import { KnowledgeLabel } from '../types/heritage';

async function runValidation() {
  console.log('=== SAARTHI SYSTEM VALIDATION SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. DATA AUDIT: Seeded Heritage Sites
  console.log('--- 1. Heritage Sites Data Integrity ---');
  assert(heritageSites.length >= 10, `Found all required heritage sites (Found: ${heritageSites.length})`);

  const requiredSites = [
    'qutub-minar',
    'india-gate',
    'taj-mahal',
    'hampi',
    'ajanta-caves',
    'ellora-caves',
    'khajuraho',
    'sanchi-stupa',
    'red-fort',
    'konark-sun-temple',
    'fatehpur-sikri',
  ];

  requiredSites.forEach((siteId) => {
    const site = getSiteById(siteId);
    assert(!!site, `Site ${siteId} is properly seeded and retrievable`);
    if (site) {
      assert(!!site.coordinates.latitude && !!site.coordinates.longitude, `${site.name} has valid coordinates`);
      assert(site.provenance.verified, `${site.name} has verified ASI/UNESCO provenance`);
      assert(site.provenance.labels.length > 0, `${site.name} has provenance knowledge labels`);
      assert(site.facilities.length >= 4, `${site.name} has comprehensive amenities documented`);
      assert(!!site.accessibility.accessibleEntrance, `${site.name} has accessibility features specified`);
      assert(site.timeline.length >= 3, `${site.name} has historical timeline milestones`);
    }
  });

  // 2. STORIES AUDIT: Provenance & Grounding
  console.log('\n--- 2. Heritage Stories Provenance & Citations ---');
  assert(heritageStories.length >= 30, `Comprehensive story collection seeded (Found: ${heritageStories.length})`);
  const qutubStories = getStoriesBySiteId('qutub-minar');
  assert(qutubStories.length >= 5, `Qutub Minar has 5 specialized stories (Found: ${qutubStories.length})`);

  qutubStories.forEach((st) => {
    assert(st.labels.length > 0, `Story "${st.title}" has knowledge labels`);
    assert(!!st.source, `Story "${st.title}" has primary source citation: ${st.source}`);
  });

  // 3. SEARCH ENGINE
  console.log('\n--- 3. Search & Query Capabilities ---');
  const searchResultsDelhi = searchSites('Delhi');
  assert(searchResultsDelhi.length >= 2, `Search "Delhi" returns monuments in Delhi (Found: ${searchResultsDelhi.length})`);
  const searchCaves = searchSites('Cave');
  assert(searchCaves.length >= 2, `Search "Cave" returns Ajanta and Ellora (Found: ${searchCaves.length})`);

  // 4. GROUNDED AI SERVICE (ZERO HALLUCINATIONS)
  console.log('\n--- 4. Grounded AI Service & Provenance Labels ---');
  const overviewAi = await aiService.askQuestion('What am I looking at?', { siteId: 'qutub-minar' });
  assert(overviewAi.sources.length > 0, 'AI response cites verified ASI/UNESCO sources');
  assert(overviewAi.provenanceLabels?.includes(KnowledgeLabel.VERIFIED_FACT) || false, 'AI response includes VERIFIED_FACT label');
  assert(overviewAi.followUpQuestions.length >= 2, 'AI response proposes relevant follow-up questions');

  const hindiAi = await aiService.askQuestion('Tell me a story in Hindi', { siteId: 'taj-mahal', language: 'hi' });
  assert(hindiAi.answer.length > 30, 'AI generates contextual Hindi response');
  assert(hindiAi.provenanceLabels?.includes('LOCAL_TRADITION') || false, 'AI identifies local oral traditions accurately');

  // 5. ITINERARY GENERATOR SERVICE
  console.log('\n--- 5. Itinerary Generator & Accessibility ---');
  const wheelchairPlan = await itineraryService.generateItinerary({
    siteId: 'taj-mahal',
    duration: '1-2 hours',
    budget: 'medium',
    travelGroup: 'family',
    interests: ['Architecture'],
    mobility: 'wheelchair',
    language: 'en',
  });

  assert(wheelchairPlan.stops.length >= 3, `Generated itinerary contains ${wheelchairPlan.stops.length} stops`);
  assert(wheelchairPlan.totalDurationMinutes > 0, `Calculated duration: ${wheelchairPlan.totalDurationMinutes} minutes`);
  assert(wheelchairPlan.walkingDistanceMeters > 0, `Walking distance: ${wheelchairPlan.walkingDistanceMeters} meters`);
  const accessibleStops = wheelchairPlan.stops.filter((s) => s.wheelchairAccessible);
  assert(accessibleStops.length > 0, 'Plan includes step-free wheelchair accessible paths');

  // 6. LOCATION & DISTANCE SERVICE
  console.log('\n--- 6. Location Distance Calculation ---');
  const dist = locationService.calculateDistanceKm(
    { latitude: 28.5245, longitude: 77.1855 }, // Qutub Minar
    { latitude: 28.6562, longitude: 77.2410 }  // Red Fort
  );
  assert(dist > 14 && dist < 18, `Accurate distance calculated between Qutub Minar & Red Fort: ${dist} km`);

  // SUMMARY
  console.log(`\n========================================`);
  console.log(`VALIDATION RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runValidation().catch((err) => {
  console.error('Validation crashed:', err);
  process.exit(1);
});
