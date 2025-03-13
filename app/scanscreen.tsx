import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Image as ImageIcon, X, Camera as CameraIcon, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';

export default function ScanScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedImages, setScannedImages] = useState([]); // Multiple images
  const cameraRef = useRef(null);

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        const mediaStatus = await MediaLibrary.requestPermissionsAsync();
        setHasPermission(status === 'granted' && mediaStatus.status === 'granted');
      }
    })();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
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

  const processImage = async (uri) => {
    try {
      const enhanced = await ImageManipulator.manipulateAsync(
        uri,
        [
          { resize: { width: 2000 } },
          { contrast: 1.1 },
          { brightness: 0.1 },
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      if (Platform.OS !== 'web') {
        await MediaLibrary.saveToLibraryAsync(enhanced.uri);
      }

      setScannedImages([...scannedImages, enhanced.uri]);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <Pressable style={styles.permissionButton} onPress={() => router.back()}>
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.webText}>Camera not available on web</Text>
        <Pressable style={styles.uploadButton} onPress={handlePickImage}>
          <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X color="#000000" size={24} />
        </Pressable>
      </View>

      {scannedImages.length > 0 ? (
        <View style={styles.previewContainer}>
          {scannedImages.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.preview} resizeMode="contain" />
          ))}
          <View style={styles.actionButtons}>
            <Pressable style={styles.actionButton} onPress={() => setScannedImages([])}>
              <Text style={styles.actionButtonText}>Retake</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => router.push('/documents')}
            >
              <CheckCircle color="#FFF" size={24} />
              <Text style={styles.actionButtonTextPrimary}>Save & Use</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.back}>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.galleryButton} onPress={handlePickImage}>
                <ImageIcon color="#FFFFFF" size={24} />
              </Pressable>
              <Pressable style={styles.captureButton} onPress={takePicture}>
                <CameraIcon color="#000000" size={32} />
              </Pressable>
            </View>
          </Camera>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  galleryButton: {
    position: 'absolute',
    left: 30,
    bottom: 10,
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
