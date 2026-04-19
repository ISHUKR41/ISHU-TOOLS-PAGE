# Expo Skill — Ultra-Detailed Reference

## What It Does
Provides comprehensive guidelines for building mobile applications using Expo (React Native). Covers UI design patterns for iOS and Android, high-performance animations, React context state management, and native device feature permissions (Camera, Location, File access, Notifications).

**Note for ISHU TOOLS:** This project is currently a web app, not a mobile app. This skill becomes relevant if the team decides to build a native ISHU TOOLS mobile app for iOS/Android. The React 19 frontend can potentially share component logic but not UI code with an Expo app.

---

## When to Use (for ISHU TOOLS context)
- Building a dedicated "ISHU TOOLS" mobile app
- Creating a React Native companion to the web platform
- User requests "make a mobile app version"
- Testing PWA behavior on mobile (related but use browser tools)

---

## Core Mobile Concepts

### Safe Area Handling
```typescript
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// Wrap the root component
function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Content avoids notch, status bar, home indicator */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

### Platform Differences
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  card: {
    // iOS: shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Android: elevation
    elevation: 4,
    // Cross-platform
    borderRadius: 16,
    backgroundColor: Platform.OS === 'ios' ? '#1C1C1E' : '#121212',
  }
});
```

### Touch Targets (CRITICAL for mobile UX)
```typescript
// Minimum touch target: 44x44 points (Apple HIG)
// Never create buttons smaller than this

const TouchableCard = () => (
  <TouchableOpacity
    style={{
      minHeight: 44,
      minWidth: 44,
      paddingHorizontal: 16,
      paddingVertical: 12,
    }}
  >
    <Text>Tap me</Text>
  </TouchableOpacity>
);
```

---

## High-Performance Animations

### React Native Reanimated (preferred)
```typescript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';

// Runs on UI thread — no JS bridge lag
function AnimatedToolCard() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View
      style={animatedStyle}
      onTouchStart={() => { scale.value = withSpring(0.97); }}
      onTouchEnd={() => { scale.value = withSpring(1); }}
    >
      <ToolCard />
    </Animated.View>
  );
}
```

### List Performance
```typescript
// FlatList with performance optimizations
<FlatList
  data={tools}
  keyExtractor={(item) => item.slug}
  getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}
  windowSize={10}           // Render 10 screens worth
  initialNumToRender={15}   // First 15 items immediately
  maxToRenderPerBatch={20}  // Batch size for additional renders
  removeClippedSubviews     // Unmount off-screen items (Android)
  renderItem={({ item }) => <ToolRow tool={item} />}
/>
```

---

## Native Device Features

### Camera
```typescript
import { Camera, CameraType } from 'expo-camera';

function ScannerScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  
  if (!permission?.granted) {
    return (
      <View>
        <Text>Camera access needed to scan documents</Text>
        <Button title="Grant Access" onPress={requestPermission} />
      </View>
    );
  }
  
  return <Camera type={CameraType.back} />;
}
```

### File Picker (for PDF/image tools)
```typescript
import * as DocumentPicker from 'expo-document-picker';

async function pickPDF() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    copyToCacheDirectory: true,
  });
  
  if (!result.canceled) {
    const { uri, name, size } = result.assets[0];
    // Upload to ISHU TOOLS backend
    await uploadToBackend(uri, name);
  }
}
```

### Location (for distance calculator)
```typescript
import * as Location from 'expo-location';

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Location needed', 'Enable location to use the distance calculator');
    return;
  }
  
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  
  return {
    lat: location.coords.latitude,
    lon: location.coords.longitude,
  };
}
```

### Push Notifications
```typescript
import * as Notifications from 'expo-notifications';

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  
  const token = await Notifications.getExpoPushTokenAsync();
  // Save token to backend for push delivery
}
```

---

## Navigation (Expo Router)

```typescript
// app/(tabs)/index.tsx — tab-based navigation
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Tools' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
    </Tabs>
  );
}

// app/tools/[slug].tsx — dynamic tool page
import { useLocalSearchParams } from 'expo-router';

export default function ToolScreen() {
  const { slug } = useLocalSearchParams();
  return <ToolPageContent slug={slug} />;
}
```

---

## App Store Considerations

```json
// app.json
{
  "expo": {
    "name": "ISHU TOOLS",
    "slug": "ishu-tools",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#000000"
    },
    "ios": {
      "bundleIdentifier": "com.ishutools.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.ishutools.app",
      "versionCode": 1,
      "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE"]
    }
  }
}
```

---

## Permissions Reference

| Feature | Expo Module | iOS Permission Key | Android Permission |
|---|---|---|---|
| Camera | `expo-camera` | `NSCameraUsageDescription` | `CAMERA` |
| Photos | `expo-media-library` | `NSPhotoLibraryUsageDescription` | `READ_MEDIA_IMAGES` |
| Location | `expo-location` | `NSLocationWhenInUseUsageDescription` | `ACCESS_FINE_LOCATION` |
| Files | `expo-document-picker` | No permission needed | No permission needed |
| Notifications | `expo-notifications` | `NSUserNotificationUsageDescription` | Default |
| Microphone | `expo-av` | `NSMicrophoneUsageDescription` | `RECORD_AUDIO` |

---

## Related Skills
- `vercel-react-native-skills` — Advanced React Native performance patterns
- `delegation` — DESIGN subagent for mobile UI components
- `revenuecat` — In-app purchases for mobile premium features
- `deployment` — App Store / Play Store publishing via Expo EAS
