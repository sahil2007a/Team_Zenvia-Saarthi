// SAARTHI — Qutub Minar 360° Virtual Tour Configuration
// Verified historical information referenced from Archaeological Survey of India (ASI) & UNESCO World Heritage Centre
// DEMO DATA: Centralized panorama source and hotspots designed to be easily swappable with custom assets.

import { VirtualTourSiteConfig } from '../../types/virtualTour';

export const qutubMinarTourConfig: VirtualTourSiteConfig = {
  siteId: 'qutub-minar',
  siteName: {
    en: 'Qutub Minar Complex',
    hi: 'कुतुब मीनार परिसर',
  },
  city: {
    en: 'Delhi',
    hi: 'दिल्ली',
  },
  state: {
    en: 'Delhi',
    hi: 'दिल्ली',
  },
  country: {
    en: 'India',
    hi: 'भारत',
  },
  historicalPeriod: {
    en: 'Delhi Sultanate (1192–1368 CE)',
    hi: 'दिल्ली सल्तनत (1192-1368 ई.)',
  },
  architecturalStyle: {
    en: 'Indo-Islamic Sandstone & Marble Architecture',
    hi: 'भारत-इस्लामी बलुआ पत्थर और संगमरमर वास्तुकला',
  },
  significance: {
    en: 'UNESCO World Heritage Site (Inscribed 1993)',
    hi: 'यूनेस्को विश्व धरोहर स्थल (1993 में सूचीबद्ध)',
  },
  unesco: true,
  unescoYear: 1993,
  classification: {
    en: 'UNESCO World Heritage Monument',
    hi: 'यूनेस्को विश्व धरोहर स्मारक',
  },

  // Centralized Panorama Source
  panorama: {
    enabled: true,
    type: 'equirectangular',
    isDemo: true, // Marked clearly as DEMO DATA per requirements
    // Local equirectangular asset
    assetSource: require('../../assets/images/heritage/qutub-minar/qutub-minar-360-equirectangular.jpg'),
    fallbackUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85',
    initialView: {
      yaw: 22,
      pitch: 8,
      fov: 75,
    },
  },

  audioGuide: {
    narratorName: 'Saarthi Cultural Audio Guide',
    title: {
      en: 'Qutub Minar Architectural Walkthrough',
      hi: 'कुतुब मीनार वास्तुकला गाइड',
    },
    overviewAudio: {
      en: 'Welcome to the Qutub Minar complex, a triumph of 12th-century Indo-Islamic engineering. Look around to explore the soaring 72.5-metre minaret, the rust-resistant 4th-century Iron Pillar, and the monumental gateways.',
      hi: 'कुतुब मीनार परिसर में आपका स्वागत है, जो 12वीं शताब्दी की भारत-इस्लामी वास्तुकला का अनुपम उदाहरण है। 72.5 मीटर ऊंची मीनार, चौथी शताब्दी के लौह स्तंभ और ऐतिहासिक प्रवेश द्वारों का 360 डिग्री में अवलोकन करें।',
    },
  },

  hotspots: [
    {
      id: 'hotspot-minar-tower',
      category: 'Architecture',
      title: {
        en: 'Qutub Minar Victory Tower',
        hi: 'कुतुब मीनार विजय स्तंभ',
      },
      subtitle: {
        en: '72.5m Monumental Minaret (1192–1220 CE)',
        hi: '72.5 मीटर भव्य मीनार (1192-1220 ई.)',
      },
      description: {
        en: 'Standing at 72.5 metres with 379 spiral steps, Qutub Minar is the tallest brick minaret in the world. Commenced by Qutb-ud-din Aibak in 1192 CE and completed by Sultan Iltutmish, it consists of five distinct tapering storeys with ornate projecting balconies supported by stalactite corbels.',
        hi: '72.5 मीटर ऊंची और 379 घुमावदार सीढ़ियों वाली कुतुब मीनार दुनिया की सबसे ऊंची ईंट निर्मित मीनार है। इसका निर्माण 1192 ईस्वी में कुतुब-उद-दीन ऐबक ने शुरू किया और सुल्तान इल्तुतमिश ने पूरा कराया।',
      },
      architecturalInfo: {
        en: 'The lowest three storeys are constructed of red fluted sandstone (alternating angular and circular flutes on the first storey, circular on the second, and angular on the third). The fourth and fifth storeys incorporate white Makrana marble and sandstone, rebuilt by Firoz Shah Tughlaq in 1368 CE after lightning damage.',
        hi: 'निचली तीन मंजिलें लाल बलुआ पत्थर से बनी हैं जिनमें कोणीय और गोलाकार बांसुरीनुमा नक्काशी है। चौथी और पांचवीं मंजिल में सफेद संगमरमर और बलुआ पत्थर का उपयोग किया गया है।',
      },
      interestingFact: {
        en: 'The minaret has a delicate 65 cm tilt off vertical center due to seismic activity and historical ground settling, carefully monitored by the Archaeological Survey of India.',
        hi: 'भूकंप और जमीन के प्रभाव के कारण यह मीनार केंद्र से लगभग 65 सेमी झुकी हुई है, जिसकी भारतीय पुरातत्व सर्वेक्षण द्वारा निरंतर निगरानी की जाती है।',
      },
      coords: {
        yaw: 24,
        pitch: 22,
      },
      provenance: 'Archaeological Survey of India (ASI) Monument Records No. 12',
    },
    {
      id: 'hotspot-iron-pillar',
      category: 'Inscription',
      title: {
        en: 'The Ancient Iron Pillar',
        hi: 'प्राचीन लौह स्तंभ',
      },
      subtitle: {
        en: 'Rustless Gupta Metallurgy (c. 400 CE)',
        hi: 'गुप्तकालीन जंग-रोधी धातु विज्ञान (लगभग 400 ई.)',
      },
      description: {
        en: 'A 7.21-metre tall column forged from 98% pure wrought iron weighing over 6,000 kilograms. It was originally erected by King Chandra (identified as Chandragupta II Vikramaditya of the Gupta dynasty) as a standard dedicated to Lord Vishnu (Vishnudhvaja) on the Vishnupada hill.',
        hi: '7.21 मीटर ऊंचा और 6,000 किलोग्राम से अधिक वजनी यह स्तंभ 98% शुद्ध गढ़ा लोहे से बना है। इसे गुप्त सम्राट चंद्रगुप्त द्वितीय विक्रमादित्य ने भगवान विष्णु के सम्मान में विष्णुध्वज के रूप में स्थापित किया था।',
      },
      architecturalInfo: {
        en: 'Features a six-line Sanskrit inscription in ancient Gupta Brahmi script. Its miraculous rust resistance in Delhi’s outdoor monsoon climate is due to the formation of an ultra-thin passive protective layer of iron hydrogen phosphate hydrate (misawite), testifying to ancient India’s advanced metallurgy.',
        hi: 'इस पर गुप्त ब्राह्मी लिपि में छह पंक्तियों का संस्कृत शिलालेख है। 1,600 से अधिक वर्षों तक खुले आसमान के नीचे बिना जंग लगे रहना प्राचीन भारतीय धातु विज्ञान का एक अद्भुत प्रमाण है।',
      },
      interestingFact: {
        en: 'Despite over 1,600 years of rain and environmental exposure, modern metallurgical spectroscopy confirms virtually no corrosion depth on its main shaft.',
        hi: '1,600 वर्षों से अधिक की बारिश और मौसमी बदलावों के बावजूद, आधुनिक स्पेक्ट्रोस्कोपी पुष्टि करती है कि इसके मुख्य स्तंभ पर जंग का कोई प्रभाव नहीं पड़ा है।',
      },
      coords: {
        yaw: 4,
        pitch: -12,
      },
      provenance: 'Indian Institute of Technology (IIT) Kanpur Metallurgical Survey & ASI Epigraphia Indica',
    },
    {
      id: 'hotspot-quwwat-mosque',
      category: 'Architecture',
      title: {
        en: 'Quwwat-ul-Islam Colonnade',
        hi: 'कुव्वत-उल-इस्लाम दालान',
      },
      subtitle: {
        en: 'First Sultanate Mosque Cloister (1192–1198 CE)',
        hi: 'प्रथम सल्तनत कालीन मस्जिद दालान (1192-1198 ई.)',
      },
      description: {
        en: 'The earliest extant congregational mosque in northern India. The expansive courtyard is bordered by cloistered stone arcades featuring salvaged carved stone pillars from pre-existing regional temple architectures of Delhi.',
        hi: 'उत्तरी भारत की सबसे पुरानी जीवित जामा मस्जिद। इसका विशाल प्रांगण नक्काशीदार पत्थर के खंभों वाले दालानों से घिरा हुआ है।',
      },
      architecturalInfo: {
        en: 'The columns exhibit intricate Kalasha (urn of abundance) motifs, stylized lotus blossoms, bell-and-chain carvings, and ornate corbelled brackets skillfully integrated into the Islamic hypostyle mosque layout.',
        hi: 'खंभों पर कलश, कमल पुष्प, घंटी-जंजीर की नक्काशी और जटिल ब्रैकेट मौजूद हैं जिन्हें इस्लामी वास्तुकला शैली के साथ समन्वित किया गया है।',
      },
      interestingFact: {
        en: 'The Great Screen of arches added in 1199 CE showcases the early experiment of local Indian stonemasons carving Islamic arabesques and Quranic calligraphic verses using indigenous trabeated corbel techniques rather than true voussoir arches.',
        hi: '1199 ई. में बनाए गए मेहराबों पर स्थानीय कारीगरों ने पारंपरिक भारतीय तराशी तकनीक से कुरान की आयतें और ज्यामितीय पैटर्न उकेरे थे।',
      },
      coords: {
        yaw: 68,
        pitch: -4,
      },
      provenance: 'Alexander Cunningham: Archaeological Survey of India Reports (1862–1865)',
    },
    {
      id: 'hotspot-alai-darwaza',
      category: 'Architecture',
      title: {
        en: 'Alai Darwaza Gateway',
        hi: 'अलाई दरवाजा',
      },
      subtitle: {
        en: 'First True Dome of India (1311 CE)',
        hi: 'भारत का पहला वास्तविक गुंबद (1311 ई.)',
      },
      description: {
        en: 'The monumental southern entrance gateway to the Qutub precinct built by Sultan Alauddin Khalji in 1311 CE. It represents the pinnacle of Khalji architecture and marks the formal adoption of true voussoir arch and dome engineering in Delhi.',
        hi: '1311 ईस्वी में सुल्तान अलाउद्दीन खिलजी द्वारा निर्मित यह स्मारक दक्षिणी प्रवेश द्वार है। यह दिल्ली में वास्तविक गुंबद और मेहराब तकनीक के प्रयोग का ऐतिहासिक मील का पत्थर है।',
      },
      architecturalInfo: {
        en: 'Constructed of deep red sandstone inlaid with white marble bands, featuring pointed horseshoe arches, delicate jali (fretwork) screens, and a low hemispherical dome resting on squinch transitions.',
        hi: 'सफेद संगमरमर की पट्टियों से सुसज्जित गहरा लाल बलुआ पत्थर, घोड़े की नाल के आकार के मेहराब और बारीक जालीदार खिड़कियां इसकी मुख्य विशेषताएं हैं।',
      },
      interestingFact: {
        en: 'World-renowned architectural historian Percy Brown described Alai Darwaza as one of the most symmetrical and exquisitely proportioned buildings in the entire history of Islamic architecture.',
        hi: 'प्रसिद्ध इतिहासकार पर्सी ब्राउन ने अलाई दरवाजे को भारत-इस्लामी वास्तुकला की सबसे उत्कृष्ट और संतुलित कृतियों में से एक बताया है।',
      },
      coords: {
        yaw: -72,
        pitch: -2,
      },
      provenance: 'Percy Brown: Indian Architecture (Islamic Period) & ASI Architectural Monograph',
    },
    {
      id: 'hotspot-qutub-complex',
      category: 'Complex',
      title: {
        en: 'Qutub Complex & Alai Minar',
        hi: 'कुतुब परिसर और अलाई मीनार',
      },
      subtitle: {
        en: 'UNESCO World Heritage Precinct & Unfinished Tower',
        hi: 'यूनेस्को विश्व धरोहर क्षेत्र और अधूरी मीनार',
      },
      description: {
        en: 'The sprawling archeological park encompassing the Tomb of Iltutmish, Alauddin Khalji’s Madrasa, and the massive circular rubble core of the Alai Minar—an ambitious project conceived by Alauddin to build a minaret twice as high as Qutub Minar (145 metres), abandoned at 24.5 metres after his death in 1316 CE.',
        hi: 'यह विशाल पुरातात्विक परिसर इल्तुतमिश के मकबरे, अलाउद्दीन खिलजी के मदरसे और अलाई मीनार से युक्त है। अलाउद्दीन ने कुतुब मीनार से दोगुनी (145 मीटर) ऊंची मीनार बनाने का संकल्प लिया था, जो उनकी मृत्यु के बाद 24.5 मीटर पर रुक गई।',
      },
      architecturalInfo: {
        en: 'The complex spans over seven centuries of Delhi Sultanate building activity, demonstrating the evolution of structural masonry from sandstone post-and-lintel to sophisticated mortar-bonded true arches and vaults.',
        hi: 'यह परिसर सात शताब्दियों से अधिक के निर्माण इतिहास को दर्शाता है, जो भारतीय पाषाण कला से लेकर उन्नत मेहराबदार निर्माण तकनीक तक के विकास को प्रदर्शित करता है।',
      },
      interestingFact: {
        en: 'Over 27 historic temple complexes previously located in the 11th-century citadel of Lal Kot were incorporated into the foundation layers and courtyards of the Qutub precinct.',
        hi: '11वीं शताब्दी के लाल कोट किले के प्राचीन पत्थरों और स्थापत्य तत्वों को इस ऐतिहासिक परिसर के निर्माण में संरक्षित किया गया था।',
      },
      coords: {
        yaw: -135,
        pitch: 2,
      },
      provenance: 'UNESCO World Heritage List Dossier No. 233 & Archaeological Survey of India',
    },
  ],

  provenance: {
    source: 'Archaeological Survey of India (ASI) & UNESCO World Heritage Centre',
    verified: true,
    lastUpdated: '2024-03-01',
  },
};
