import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, FileText, Wand as Wand2, Import, Cloud } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_800ExtraBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const RECENT_DOCS = [
  {
    id: '1',
    name: 'Invoice_2024.pdf',
    timestamp: '2 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1706001151251-69122630c2e7?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Contract.pdf',
    timestamp: '5 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1705753723902-10429cfb2597?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Receipt.pdf',
    timestamp: 'Yesterday',
    thumbnail: 'https://images.unsplash.com/photo-1705882001828-08cc4da04571?q=80&w=200&auto=format&fit=crop'
  }
];

const QuickActionButton = ({ icon: Icon, label, description, onPress }) => (
  <Pressable 
    style={styles.quickActionButton}
    onPress={onPress}
  >
    <View style={styles.quickActionIcon}>
      <Icon size={24} color="#007AFF" />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
    <Text style={styles.quickActionDescription}>{description}</Text>
  </Pressable>
);

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_800ExtraBold,
    Poppins_400Regular
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['rgba(0,122,255,0.1)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.push('/settings')}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }}
                style={styles.avatar}
              />
            </Pressable>
          </View>
          
          <Animated.View entering={FadeInUp.delay(100).duration(700)}>
            <Text style={styles.title}>DocSwift</Text>
            <Text style={styles.subtitle}>Smart Scanner & Converter</Text>
          </Animated.View>
        </LinearGradient>

        {/* Quick Actions Grid */}
        <View style={styles.quickActions}>
          <QuickActionButton
            icon={Camera}
            label="Scan Document"
            description="Scan with auto-edge detection"
            onPress={() => router.push('/scanscreen')}
          />
          <QuickActionButton
            icon={Import}
            label="Import File"
            description="From gallery or files"
            onPress={() => router.push('/import')}
          />
          <QuickActionButton
            icon={FileText}
            label="Extract Text"
            description="Convert image to text"
            onPress={() => router.push('/extract')}
          />
          <QuickActionButton
            icon={Wand2}
            label="Enhance PDF"
            description="Improve readability"
            onPress={() => router.push('/enhance')}
          />
        </View>

        {/* Recent Documents */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Documents</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentDocsContainer}
          >
            {RECENT_DOCS.map((doc, index) => (
              <Animated.View 
                key={doc.id}
                entering={FadeInRight.delay(300 + index * 100).duration(700)}
              >
                <Pressable 
                  style={styles.recentDocCard}
                  onPress={() => router.push({
                    pathname: '/document/[id]',
                    params: { id: doc.id }
                  })}
                >
                  <Image
                    source={{ uri: doc.thumbnail }}
                    style={styles.docThumbnail}
                  />
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docTimestamp}>{doc.timestamp}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Premium Banner */}
        <Pressable style={styles.premiumBanner}>
          <Wand2 size={20} color="#007AFF" />
          <Text style={styles.premiumText}>Upgrade to Premium for batch processing & cloud sync!</Text>
        </Pressable>
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
  headerGradient: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#666666',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#666666',
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  recentDocsContainer: {
    paddingRight: 20,
  },
  recentDocCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    width: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  docThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  docName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  docTimestamp: {
    fontSize: 12,
    color: '#666666',
  },
  premiumBanner: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumText: {
    fontSize: 14,
    color: '#007AFF',
    flex: 1,
  },
});