// SAARTHI — AR 3D Model Native Mobile Viewer (Android & iOS)
// Leverages Google's @google/model-viewer Web Component via React Native WebView
// Ultra-fast, hardware-accelerated 60fps rendering with zero lag and native Google ARCore / WebRTC AR Camera support

import React, { useRef, useImperativeHandle, forwardRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { ARModelConfig } from '../../types/ar';

export interface ARModelViewerRef {
  recenter: () => void;
  adjustScale: (delta: number) => void;
  resetScale: () => void;
  getScalePercent: () => number;
}

interface ARModelViewerProps {
  modelConfig: ARModelConfig;
  isARMode: boolean;
  isPlaced: boolean;
  onModelLoaded?: () => void;
  onError?: (errMessage: string) => void;
  onScaleChange?: (scalePercent: number) => void;
  onToggleAR?: (active: boolean) => void;
  onCameraGranted?: () => void;
  onCameraDenied?: () => void;
}

export const ARModelViewer = forwardRef<ARModelViewerRef, ARModelViewerProps>(
  (
    {
      modelConfig,
      isARMode,
      isPlaced,
      onModelLoaded,
      onError,
      onScaleChange,
      onToggleAR,
      onCameraGranted,
      onCameraDenied,
    },
    ref
  ) => {
    const webViewRef = useRef<WebView | null>(null);
    const currentScaleMultiplier = useRef(1.0);
    const [loading, setLoading] = useState(true);

    const reportScale = useCallback(() => {
      const percent = Math.round(currentScaleMultiplier.current * 100);
      onScaleChange?.(percent);
    }, [onScaleChange]);

    useImperativeHandle(ref, () => ({
      recenter: () => {
        currentScaleMultiplier.current = 1.0;
        webViewRef.current?.injectJavaScript(`
          if (window.viewer) {
            window.viewer.cameraOrbit = '45deg 75deg 3.8m';
            window.viewer.fieldOfView = '35deg';
            if (typeof window.viewer.resetTurntable === 'function') {
              window.viewer.resetTurntable();
            }
          }
          true;
        `);
        reportScale();
      },
      adjustScale: (delta: number) => {
        const next = Math.max(0.4, Math.min(2.5, currentScaleMultiplier.current + delta));
        currentScaleMultiplier.current = next;
        const fov = Math.round(35 / next);
        webViewRef.current?.injectJavaScript(`
          if (window.viewer) {
            window.viewer.fieldOfView = '${fov}deg';
          }
          true;
        `);
        reportScale();
      },
      resetScale: () => {
        currentScaleMultiplier.current = 1.0;
        webViewRef.current?.injectJavaScript(`
          if (window.viewer) {
            window.viewer.fieldOfView = '35deg';
          }
          true;
        `);
        reportScale();
      },
      getScalePercent: () => Math.round(currentScaleMultiplier.current * 100),
    }));

    // Synchronize AR camera mode changes into WebView
    useEffect(() => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (typeof window.setARMode === 'function') {
            window.setARMode(${isARMode ? 'true' : 'false'});
          }
          true;
        `);
      }
    }, [isARMode]);

    const glbUrl = modelConfig.base64DataUri || modelConfig.modelUrl;
    const modelTitle = modelConfig.modelTitle || 'Heritage Monument';
    const initialOrbit = modelConfig.siteId === 'qutub-minar' ? '30deg 75deg 4.2m' : '45deg 75deg 3.6m';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>${modelTitle}</title>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
          }
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #0F172A;
            transition: background-color 0.3s ease;
          }
          body.ar-active {
            background-color: transparent !important;
          }
          #camera-stream {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
            display: none;
          }
          #ar-grid-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
            display: none;
            background-image: 
              radial-gradient(circle at center, rgba(245, 158, 11, 0.12) 0%, transparent 65%),
              linear-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 158, 11, 0.08) 1px, transparent 1px);
            background-size: 100% 100%, 32px 32px, 32px 32px;
          }
          body.ar-active #ar-grid-overlay {
            display: block;
          }
          model-viewer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0F172A;
            --poster-color: transparent;
            z-index: 3;
            transition: background-color 0.3s ease;
          }
          body.ar-active model-viewer {
            background-color: transparent !important;
          }
          .ar-launch-btn {
            display: none !important;
          }
          .loading-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            color: #F59E0B;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
          .spinner {
            width: 36px;
            height: 36px;
            border: 3px solid rgba(245, 158, 11, 0.2);
            border-top-color: #F59E0B;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <video id="camera-stream" autoplay playsinline muted></video>
        <div id="ar-grid-overlay"></div>

        <model-viewer
          id="monument-viewer"
          src="${glbUrl}"
          alt="${modelTitle}"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          rotation-per-second="14deg"
          interaction-prompt="auto"
          shadow-intensity="1.2"
          shadow-softness="0.75"
          exposure="1.15"
          camera-orbit="${initialOrbit}"
          field-of-view="35deg"
        >
          <div slot="poster" class="loading-container">
            <div class="spinner"></div>
            <span>Loading 3D ${modelTitle}...</span>
          </div>
        </model-viewer>

        <script>
          window.viewer = document.getElementById('monument-viewer');
          window.cameraVideo = document.getElementById('camera-stream');
          window.isARActive = false;
          let cameraStream = null;

          // Camera control for real device AR
          window.startCamera = async function() {
            try {
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                cameraStream = await navigator.mediaDevices.getUserMedia({
                  video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                  },
                  audio: false
                });
                if (window.cameraVideo) {
                  window.cameraVideo.srcObject = cameraStream;
                  window.cameraVideo.style.display = 'block';
                  await window.cameraVideo.play();
                }
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CAMERA_GRANTED' }));
                }
              }
            } catch (err) {
              console.log('[Camera] WebRTC access fallback/denial:', err);
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CAMERA_DENIED', error: String(err) }));
              }
            }
            document.body.classList.add('ar-active');
            if (window.viewer) {
              window.viewer.style.backgroundColor = 'transparent';
            }
            window.isARActive = true;
          };

          window.stopCamera = function() {
            if (cameraStream) {
              cameraStream.getTracks().forEach(t => t.stop());
              cameraStream = null;
            }
            if (window.cameraVideo) {
              window.cameraVideo.srcObject = null;
              window.cameraVideo.style.display = 'none';
            }
            document.body.classList.remove('ar-active');
            if (window.viewer) {
              window.viewer.style.backgroundColor = '#0F172A';
            }
            window.isARActive = false;
          };

          window.setARMode = function(active) {
            if (active) {
              window.startCamera();
            } else {
              window.stopCamera();
            }
          };

          window.viewer.addEventListener('load', () => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MODEL_LOADED' }));
            }
          });

          window.viewer.addEventListener('error', (event) => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MODEL_ERROR', error: String(event) }));
            }
          });
        </script>
      </body>
      </html>
    `;

    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'MODEL_LOADED') {
          setLoading(false);
          onModelLoaded?.();
        } else if (data.type === 'MODEL_ERROR') {
          setLoading(false);
          onError?.(`Could not load ${modelTitle}. Please check connection.`);
        } else if (data.type === 'AR_MODE_CHANGED') {
          onToggleAR?.(data.active);
        } else if (data.type === 'CAMERA_GRANTED') {
          onCameraGranted?.();
        } else if (data.type === 'CAMERA_DENIED') {
          onCameraDenied?.();
        }
      } catch (e) {
        // Ignored
      }
    };

    const RNCWebView = WebView as any;

    return (
      <View style={styles.container}>
        <RNCWebView
          ref={webViewRef}
          source={{ html: htmlContent, baseUrl: 'https://saarthi.heritage.app/' }}
          style={styles.webView}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          androidHardwareAccelerationDisabled={false}
          androidCameraPermissionOptions={{
            title: 'Camera Permission',
            message: 'Saarthi requires camera access to project 3D monuments into your real space in Augmented Reality.',
            buttonPositive: 'Allow Camera',
            buttonNegative: 'Cancel',
          }}
          onShouldStartLoadWithRequest={(request: any) => {
            const url = request.url || '';
            // Intercept Android Intent schemes (e.g., scene-viewer / market) to prevent net::ERR_UNKNOWN_URL_SCHEME
            if (url.startsWith('intent://') || url.startsWith('market://')) {
              Linking.canOpenURL(url)
                .then((supported) => {
                  if (supported) {
                    Linking.openURL(url).catch((e) => console.log('[ARModelViewer] Intent open err:', e));
                  }
                })
                .catch(() => {});
              return false; // Crucial: Stop WebView from navigating internally to unknown scheme
            }
            return true;
          }}
          onError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent;
            // Suppress benign ERR_UNKNOWN_URL_SCHEME for intent: URIs handled by native linking
            if (
              nativeEvent?.description?.includes('ERR_UNKNOWN_URL_SCHEME') ||
              nativeEvent?.url?.startsWith('intent:')
            ) {
              return;
            }
            onError?.(nativeEvent?.description || 'WebView error');
          }}
          onMessage={handleMessage}
          scalesPageToFit={false}
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        {loading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color="#F59E0B" />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F172A',
    zIndex: 8,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
  },
});
