import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FolderOpen, Cloud, X, Image as ImageIcon, FileText, Save, Share } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { shareAsync } from 'expo-sharing';

export default function EnhanceScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImportFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.type === 'success') {
        setSelectedFile(result);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleImportFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const enhancePDF = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const enhanced = await manipulateAsync(
        selectedFile.uri,
        [{ sharpen: 1.5 }, { contrast: 1.2 }],
        { compress: 0.9, format: SaveFormat.PDF }
      );
      setSelectedFile({ ...selectedFile, uri: enhanced.uri });
    } catch (error) {
      console.error('Error enhancing PDF:', error);
    }
    setIsProcessing(false);
  };

  const handleSavePDF = async () => {
    if (selectedFile) {
      await shareAsync(selectedFile.uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X color="#000000" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Enhance PDF</Text>
      </View>

      <View style={styles.content}>
        {!selectedFile ? (
          <>
            <Pressable style={styles.importOption} onPress={handleImportFromFiles}>
              <View style={styles.iconContainer}>
                <FolderOpen size={32} color="#007AFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.optionTitle}>Choose PDF</Text>
                <Text style={styles.optionDescription}>Select PDF from your files</Text>
              </View>
            </Pressable>

            <Pressable style={styles.importOption} onPress={handleImportFromGallery}>
              <View style={styles.iconContainer}>
                <ImageIcon size={32} color="#007AFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.optionTitle}>Import from Gallery</Text>
                <Text style={styles.optionDescription}>Convert image to enhanced PDF</Text>
              </View>
            </Pressable>

            {Platform.OS !== 'web' && (
              <Pressable style={styles.importOption} onPress={() => {}}>
                <View style={styles.iconContainer}>
                  <Cloud size={32} color="#007AFF" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>Import from Cloud</Text>
                  <Text style={styles.optionDescription}>Choose from connected services</Text>
                </View>
              </Pressable>
            )}
          </>
        ) : (
          <View style={styles.enhanceSection}>
            <Text style={styles.fileName}>{selectedFile.name || 'Selected PDF'}</Text>
            <Pressable style={styles.enhanceButton} onPress={enhancePDF} disabled={isProcessing}>
              {isProcessing ? <ActivityIndicator color="#FFFFFF" /> : <FileText size={20} color="#FFFFFF" />}
              <Text style={styles.enhanceButtonText}>Enhance PDF</Text>
            </Pressable>

            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton} onPress={handleSavePDF}>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Save</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.shareButton]} onPress={handleSavePDF}>
                <Share size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Share</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
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
    padding: 20,
  },
  importOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  enhanceSection: {
    alignItems: 'center',
    padding: 20,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  enhanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  enhanceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
