// SAARTHI — Deekshabhoomi 360° Virtual Tour Configuration
// High-resolution local monument asset & verified historical information

import { VirtualTourSiteConfig } from '../../types/virtualTour';

export const deekshabhoomiTourConfig: VirtualTourSiteConfig = {
  siteId: 'deekshabhoomi',
  siteName: {
    en: 'Deekshabhoomi Stupa Complex',
    hi: 'दीक्षाभूमि स्तूप परिसर',
  },
  city: {
    en: 'Nagpur',
    hi: 'नागपुर',
  },
  state: {
    en: 'Maharashtra',
    hi: 'महाराष्ट्र',
  },
  country: {
    en: 'India',
    hi: 'भारत',
  },
  historicalPeriod: {
    en: '20th Century (Dhammachakra Pravartan 1956)',
    hi: '20वीं सदी (धम्मचक्र प्रवर्तन 1956)',
  },
  architecturalStyle: {
    en: 'Greco-Buddhist & Sanchi-Inspired Dholpur Marble Stupa',
    hi: 'सांची-प्रेरित धौलपुर संगमरमर स्तूप वास्तुकला',
  },
  significance: {
    en: 'Sacred Buddhist Pilgrimage & Site of Historic 1956 Mass Conversion',
    hi: 'पवित्र बौद्ध तीर्थ स्थल एवं ऐतिहासिक 1956 धर्मदीक्षा भूमि',
  },
  unesco: false,
  classification: {
    en: 'National Monument of Equality and Peace',
    hi: 'समानता और शांति का राष्ट्रीय स्मारक',
  },

  // Centralized Panorama Source using Local Nagpur Asset
  panorama: {
    enabled: true,
    type: 'equirectangular',
    isDemo: false,
    assetSource: require('../../assets/images/heritage/nagpur/deekshabhoomi-stupa-nagpur.png'),
    fallbackUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1600&q=85',
    initialView: {
      yaw: 0,
      pitch: 12,
      fov: 75,
    },
  },

  audioGuide: {
    narratorName: 'Saarthi Heritage Narrator',
    title: {
      en: 'Deekshabhoomi Stupa Architectural Walkthrough',
      hi: 'दीक्षाभूमि स्तूप वास्तुकला परिचय',
    },
    overviewAudio: {
      en: 'Welcome to Deekshabhoomi in Nagpur, the sacred ground where Dr. Babasaheb Ambedkar embraced Buddhism with over 600,000 followers on October 14, 1956.',
      hi: 'नागपुर के पवित्र दीक्षाभूमि स्तूप में आपका स्वागत है, जहाँ 14 अक्टूबर 1956 को डॉ. बाबासाहेब आम्बेडकर ने लाखों अनुयायियों के साथ बौद्ध धर्म की दीक्षा ली थी।',
    },
  },

  provenance: {
    source: 'Dr. Babasaheb Ambedkar Smarak Samiti & State Archaeology',
    verified: true,
    lastUpdated: '2024-02-01',
  },

  hotspots: [
    {
      id: 'hs-db-spire',
      title: {
        en: 'Harmika & Chhatra Spire',
        hi: 'हर्मिका एवं छत्र शिखर',
      },
      subtitle: {
        en: '120-Foot Dome Pinnacle',
        hi: '120 फीट गुंबद का सर्वोच्च शिखर',
      },
      description: {
        en: 'The crowning harmika and tiered umbrella spire symbolize the Three Jewels of Buddhism: the Buddha, the Dhamma, and the Sangha.',
        hi: 'स्तूप के शीर्ष पर स्थित हर्मिका और छत्र बौद्ध धर्म के त्रिरत्न—बुद्ध, धम्म और संघ का प्रतीक हैं।',
      },
      architecturalInfo: {
        en: 'Constructed of solid granite and adorned with Rajasthani Dholpur marble tiles with traditional Buddhist decorative reliefs.',
        hi: 'ठोस ग्रेनाइट से निर्मित और पारंपरिक बौद्ध नक्काशी से सुसज्जित धौलपुर संगमरमर की टाइलों से आच्छादित।',
      },
      interestingFact: {
        en: 'At 120 feet in height, it represents the largest hollow dome stupa structure in Asia.',
        hi: '120 फीट की ऊंचाई के साथ यह एशिया का सबसे बड़ा खोखला स्तूप गुंबद है।',
      },
      category: 'Architecture',
      coords: {
        yaw: 0,
        pitch: 38,
      },
      provenance: 'Dr. Ambedkar Smarak Samiti Records',
    },
    {
      id: 'hs-db-torana',
      title: {
        en: 'Carved Sanchi-Style Torana',
        hi: 'उत्कीर्ण सांची-शैली तोरण द्वार',
      },
      subtitle: {
        en: 'Ornate Stone Portal',
        hi: 'भव्य पाषाण प्रवेश द्वार',
      },
      description: {
        en: 'Faithfully modeled on the ancient Great Stupa of Sanchi, featuring dharma wheels, elephant guardians, and Ashokan emblems of non-violence.',
        hi: 'सांची के महान स्तूप की शैली में निर्मित, जिसमें धम्मचक्र, गज प्रतीक और अहिंसा के अशोकन रूपांकन उत्कीर्ण हैं।',
      },
      architecturalInfo: {
        en: 'Designed by chief architect Sheo Dan Mal in 1968, utilizing hand-chiseled red sandstone matching ancient Mauryan standards.',
        hi: '1968 में मुख्य वास्तुकार शेओ दान मल द्वारा मौर्यकालीन शैली के लाल बलुआ पत्थर पर हाथ से तराशी गई शिल्पकला।',
      },
      interestingFact: {
        en: 'The torana portals align precisely with cardinal solar paths, welcoming morning sunlight into the sanctum.',
        hi: 'तोरण द्वार मुख्य दिशाओं के साथ संरेखित हैं, जिससे प्रातःकालीन सूर्यकिरणें गर्भगृह में प्रवेश करती हैं।',
      },
      category: 'Sculpture',
      coords: {
        yaw: -48,
        pitch: -8,
      },
      provenance: 'Architect Sheo Dan Mal Architectural Plans (1968)',
    },
    {
      id: 'hs-db-grounds',
      title: {
        en: 'Dhammachakra Pravartan Grounds',
        hi: 'धम्मचक्र प्रवर्तन भूमि',
      },
      subtitle: {
        en: 'Historic Gathering Esplanade',
        hi: 'ऐतिहासिक महासम्मेलन स्थल',
      },
      description: {
        en: 'The sprawling open grounds where more than half a million citizens gathered on Vijayadashami 1956 for the greatest peaceful social revolution in modern history.',
        hi: 'विशाल खुला प्रांगण जहाँ 1956 के विजयादशमी पर्व पर लाखों नागरिकों ने शांतिपूर्ण सामाजिक क्रांति का सूत्रपात किया था।',
      },
      architecturalInfo: {
        en: 'Spanning multiple acres paved with eco-friendly pavers and flanked by sacred Bodhi trees planted from Anuradhapura saplings.',
        hi: 'अनुराधापुरा से लाए गए पवित्र बोधि वृक्षों से घिरा और लाखों श्रद्धालुओं को समाहित करने वाला खुला प्रांगण।',
      },
      interestingFact: {
        en: 'Over 600,000 people embraced the 22 vows here in a single afternoon without a single incident of violence.',
        hi: 'एक ही दोपहर में 6 लाख से अधिक लोगों ने बिना किसी हिंसा के शांतिपूर्वक 22 प्रतिज्ञाएं ली थीं।',
      },
      category: 'History',
      coords: {
        yaw: 58,
        pitch: -18,
      },
      provenance: 'State Archaeological Archives & Gazettes',
    },
    {
      id: 'hs-db-relic',
      title: {
        en: 'Babasaheb Memorial & Asthi Kalash',
        hi: 'बाबासाहेब स्मारक एवं अस्थि कलश',
      },
      subtitle: {
        en: 'Inner Sacred Sanctum',
        hi: 'भीतरी पवित्र गर्भगृह',
      },
      description: {
        en: 'Preserved inside the hollow dome is the sacred Asthi Kalash (relic urn) of Bharat Ratna Dr. B.R. Ambedkar, revered by millions of pilgrims annually.',
        hi: 'खोखले गुंबद के गर्भगृह में भारत रत्न डॉ. बी.आर. आम्बेडकर का पवित्र अस्थि कलश सुरक्षित है, जिसके दर्शन हेतु प्रतिवर्ष लाखों श्रद्धालु आते हैं।',
      },
      architecturalInfo: {
        en: 'Housed within a bulletproof glass vitrine resting on a pedestal carved from white Makrana marble.',
        hi: 'सफेद मकराना संगमरमर के चबूतरे पर रखे बुलेटप्रूफ कांच के सुरक्षा पेटी में सुरक्षित।',
      },
      interestingFact: {
        en: 'The acoustics inside the circular hall allow quiet chanting to resonate clearly throughout the 4,000-person capacity chamber.',
        hi: 'भीतरी गोलाकार हॉल की विशेष ध्वनिकी के कारण यहां मंत्रोच्चार 4,000 लोगों के बैठने वाले पूरे हॉल में गूंजता है।',
      },
      category: 'Relic',
      coords: {
        yaw: 135,
        pitch: -6,
      },
      provenance: 'Deekshabhoomi Smarak Trust',
    },
  ],
};
