// SAARTHI — Safe Image Source Resolver
// Prevents Android RCTImageView crash: "Value for uri cannot be cast from Double to String"
// Safely supports both local require(...) assets and remote string URLs across Android, iOS & Web.

const LOCAL_HERITAGE_ASSETS: Record<string, any> = {
  '/images/heritage/india-gate/india-gate.jpg': require('../assets/images/heritage/india-gate/india-gate.jpg'),
  '/images/heritage/india-gate/india-gate.png': require('../assets/images/heritage/india-gate/india-gate.png'),
  '/images/heritage/ellora-caves/ellora-caves.jpg': require('../assets/images/heritage/ellora-caves/ellora-caves.jpg'),
  '/images/heritage/ajanta-caves/ajanta-caves.jpg': require('../assets/images/heritage/ajanta-caves/ajanta-caves.jpg'),
  '/images/heritage/hampi/hampi.jpg': require('../assets/images/heritage/hampi/hampi.jpg'),
  '/images/heritage/nagpur/deekshabhoomi-stupa-nagpur.png': require('../assets/images/heritage/nagpur/deekshabhoomi-stupa-nagpur.png'),
  '/images/heritage/khajuraho group.png': require('../assets/images/heritage/khajuraho group.png'),
  '/images/heritage/buddhist sanchi.png': require('../assets/images/heritage/buddhist sanchi.png'),
};

export function resolveImageSource(source: any): any {
  if (!source) return undefined;

  // Local asset ID from require(...) is a number
  if (typeof source === 'number') {
    return source;
  }

  // Remote string URL or local static path
  if (typeof source === 'string') {
    if (LOCAL_HERITAGE_ASSETS[source]) {
      return LOCAL_HERITAGE_ASSETS[source];
    }
    return { uri: source };
  }

  // Object structure
  if (typeof source === 'object' && source !== null) {
    if ('uri' in source) {
      if (typeof source.uri === 'number') {
        return source.uri;
      }
      if (typeof source.uri === 'string' && LOCAL_HERITAGE_ASSETS[source.uri]) {
        return LOCAL_HERITAGE_ASSETS[source.uri];
      }
      return source;
    }
    if (source.default) {
      return resolveImageSource(source.default);
    }
  }

  return source;
}

