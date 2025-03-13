import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { Image as ImageIcon, X, Copy, Camera as CameraIcon, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { createWorker } from 'tesseract.js';

export default function ExtractScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const cameraRef = useRef(null);

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  const processImage = async (uri) => {
    setIsProcessing(true);
    setError('');
    try {
      const worker = await createWorker({
        logger: (m) => console.log(m), // Logs OCR progress
      });

      await worker.load();
      await worker.loadLanguage('eng'); // Add other languages if needed
      await worker.initialize('eng');

      const { data: { text } } = await worker.recognize(uri);
      await worker.terminate();
      
      setExtractedText(text.trim() || 'No readable text found.');
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error extracting text. Please try again.');
    }
    setIsProcessing(false);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      processImage(photo.uri);
    }
  };

  const copyToClipboard = async () => {
    if (extractedText) {
      await Clipboard.setStringAsync(extractedText);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X color="#000000" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Extract Text</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={handlePickImage}>
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : extractedText ? (
        <View style={styles.content}>
          <TextInput
            style={styles.textInput}
            multiline
            value={extractedText}
            onChangeText={setExtractedText}
          />
          <Pressable style={styles.copyButton} onPress={copyToClipboard}>
            <Copy size={20} color="#FFFFFF" />
            <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.back}>
            <View style={styles.cameraOverlay}>
              <Pressable style={styles.galleryButton} onPress={handlePickImage}>
                <ImageIcon color="#FFFFFF" size={24} />
              </Pressable>
              <Pressable style={styles.captureButton} onPress={takePicture} disabled={isProcessing}>
                {isProcessing ? <Text style={styles.processingText}>Processing...</Text> : <CameraIcon color="#FFFFFF" size={32} />}
              </Pressable>
            </View>
          </Camera>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    textAlignVertical: 'top',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  copyButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  galleryButton: {
    position: 'absolute',
    left: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
