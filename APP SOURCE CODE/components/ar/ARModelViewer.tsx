// SAARTHI — AR 3D Model Unified Entry
// Automatically delegates to ARModelViewer.web on Web browsers (Three.js WebGL)
// and ARModelViewer.native on Android / iOS (Google Model-Viewer WebView)

import { Platform } from 'react-native';
import { ARModelViewer as WebModelViewer, ARModelViewerRef } from './ARModelViewer.web';
import { ARModelViewer as NativeModelViewer } from './ARModelViewer.native';

export type { ARModelViewerRef };

export const ARModelViewer = Platform.OS === 'web' ? WebModelViewer : NativeModelViewer;
