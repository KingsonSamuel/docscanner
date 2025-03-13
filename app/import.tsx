import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ImageIcon, FolderOpen, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function ImportScreen() {
  const router = useRouter();
  const [importedFile, setImportedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImportFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImportedFile(result.assets[0].uri);
        setModalVisible(true); // Show action selection modal
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleImportFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
      });

      if (result.type === 'success') {
        setImportedFile(result.uri);
        setModalVisible(true); // Show action selection modal
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleAction = (action) => {
    setModalVisible(false);
    router.push(`/tools?action=${action}&file=${importedFile}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X color="#000000" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Import File</Text>
      </View>

      <View style={styles.content}>
        <Pressable style={styles.importOption} onPress={handleImportFromGallery}>
          <View style={styles.iconContainer}>
            <ImageIcon size={32} color="#007AFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Import from Gallery</Text>
            <Text style={styles.optionDescription}>Choose photos or screenshots</Text>
          </View>
        </Pressable>

        <Pressable style={styles.importOption} onPress={handleImportFromFiles}>
          <View style={styles.iconContainer}>
            <FolderOpen size={32} color="#007AFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Import from Files</Text>
            <Text style={styles.optionDescription}>Choose PDFs or documents</Text>
          </View>
        </Pressable>
      </View>

      {/* Modal for selecting actions after importing */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an action</Text>
            <Pressable style={styles.actionButton} onPress={() => handleAction('extract-text')}>
              <Text style={styles.actionText}>Extract Text (OCR)</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => handleAction('enhance-pdf')}>
              <Text style={styles.actionText}>Enhance PDF</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => handleAction('compress-pdf')}>
              <Text style={styles.actionText}>Compress PDF</Text>
            </Pressable>
            <Pressable style={styles.closeModal} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
  },
  closeModal: {
    marginTop: 10,
  },
  closeModalText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
