import { Tabs } from 'expo-router';
import { Chrome as Home, FolderOpen, Settings, Scan as ScanIcon, PenTool as Tool } from 'lucide-react-native';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#007AFF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color, size }) => <FolderOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanscreen" // ✅ Updated to match scanscreen.tsx
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <ScanIcon size={size} color={color} />,
          tabBarButton: (props) => (
            <Pressable
              {...props}
              style={styles.scanButton}
              onPress={() => router.push('/scanscreen')} // ✅ Updated route
            >
              <View style={styles.scanButtonInner}>
                <ScanIcon size={28} color="#FFFFFF" />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size }) => <Tool size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E5E5',
    height: 60,
    paddingBottom: 8,
  },
  scanButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",  // ✅ Fixed shadowColor issue
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
