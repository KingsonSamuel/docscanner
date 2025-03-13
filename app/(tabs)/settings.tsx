import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Cloud, Star, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Lock size={20} color="#666666" />
              <Text style={styles.settingText}>App Lock</Text>
            </View>
            <Switch value={false} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cloud Sync</Text>
          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Cloud size={20} color="#666666" />
              <Text style={styles.settingText}>Enable Cloud Backup</Text>
            </View>
            <Switch value={false} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Star size={20} color="#666666" />
              <Text style={styles.settingText}>Upgrade to Premium</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Info size={20} color="#666666" />
              <Text style={styles.settingText}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#1A1A1A',
  },
  versionText: {
    fontSize: 14,
    color: '#666666',
  },
});