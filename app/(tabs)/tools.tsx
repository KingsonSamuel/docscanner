import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, FilePlus2, FileOutput, Lock } from 'lucide-react-native';

export default function ToolsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>PDF Tools</Text>
          <Text style={styles.subtitle}>Convert, merge, and protect your documents</Text>
        </View>
        
        <View style={styles.toolsGrid}>
          <Pressable style={styles.toolCard}>
            <View style={styles.toolIcon}>
              <FileText size={24} color="#007AFF" />
            </View>
            <Text style={styles.toolName}>Convert</Text>
            <Text style={styles.toolDescription}>JPG ↔ PDF, Word → PDF</Text>
          </Pressable>

          <Pressable style={styles.toolCard}>
            <View style={styles.toolIcon}>
              <FilePlus2 size={24} color="#007AFF" />
            </View>
            <Text style={styles.toolName}>Merge PDFs</Text>
            <Text style={styles.toolDescription}>Combine multiple files</Text>
          </Pressable>

          <Pressable style={styles.toolCard}>
            <View style={styles.toolIcon}>
              <FileOutput size={24} color="#007AFF" />
            </View>
            <Text style={styles.toolName}>Split PDF</Text>
            <Text style={styles.toolDescription}>Extract pages</Text>
          </Pressable>

          <Pressable style={styles.toolCard}>
            <View style={styles.toolIcon}>
              <Lock size={24} color="#007AFF" />
            </View>
            <Text style={styles.toolName}>Protect PDF</Text>
            <Text style={styles.toolDescription}>Add password</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '48%',
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
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 12,
    color: '#666666',
  },
});