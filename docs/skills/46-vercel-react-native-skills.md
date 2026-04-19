# Vercel React Native Skills (User-Provided) — Ultra-Detailed Reference

## What It Does
React Native and Expo performance optimization best practices. Covers FlatList optimization for large tool lists, reanimated animations at 60fps, image optimization with expo-image, navigation architecture, native module integration, and platform-specific patterns for iOS and Android. Essential for the ISHU TOOLS mobile app.

---

## When to Use
- Building the ISHU TOOLS React Native / Expo mobile app
- Optimizing performance for 700+ tool lists on mobile
- Implementing smooth 60fps animations with Reanimated
- Adding native features (camera for scanner tool, file picker, notifications)
- App Store / Play Store deployment

---

## Performance Pattern 1: FlatList Optimization for 700+ Tools

```typescript
import { FlatList, Dimensions } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const TOOL_CARD_HEIGHT = 88  // Measured height of ToolCard

function ToolsList({ tools }: { tools: Tool[] }) {
  return (
    <FlatList
      data={tools}
      
      // Required for jump-to-item (otherwise O(n) calculation)
      getItemLayout={(_, index) => ({
        length: TOOL_CARD_HEIGHT,
        offset: TOOL_CARD_HEIGHT * index,
        index,
      })}
      
      // Stable key extraction
      keyExtractor={(item) => item.slug}
      
      // Unmount items outside visible area (Android only — iOS uses own system)
      removeClippedSubviews={true}
      
      // How many items to render per batch scroll update
      maxToRenderPerBatch={12}
      
      // How many "screens" of content to keep in memory
      windowSize={8}  // 8 * screen height before/after viewport
      
      // Initial render — show first N immediately
      initialNumToRender={10}
      
      // Memoized render function (critical for 700+ items)
      renderItem={({ item }) => <MemoizedToolCard tool={item} />}
    />
  )
}
```

---

## Pattern 2: React Native Reanimated for 60fps

Reanimated runs animations on the **UI thread** — completely bypassing the JS bridge. This is essential for smooth animations when the JS thread is busy processing tool results.

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

function ToolCard({ tool }: { tool: Tool }) {
  const scale = useSharedValue(1)
  const pressed = useSharedValue(0)
  
  // Animated style — computes on UI thread
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.8]),
  }))
  
  const tap = Gesture.Tap()
    .onBegin(() => {
      // UI thread — instant response
      scale.value = withSpring(0.96, { stiffness: 500, damping: 30 })
      pressed.value = withTiming(1, { duration: 100 })
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { stiffness: 400, damping: 25 })
      pressed.value = withTiming(0, { duration: 100 })
    })
  
  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.title}>{tool.title}</Text>
      </Animated.View>
    </GestureDetector>
  )
}

// MUST memoize — 700+ items in list
const MemoizedToolCard = React.memo(ToolCard, (prev, next) => 
  prev.tool.slug === next.tool.slug  // Custom comparison function
)
```

---

## Pattern 3: expo-image for Zero-Flash Image Loading

```typescript
import { Image } from 'expo-image'

// expo-image is faster than React Native's built-in Image:
// - Blurhash placeholder (no blank flash)
// - Memory + disk caching
// - Smooth transitions
// - WebP/AVIF support

function ToolCategoryIcon({ category }: { category: string }) {
  return (
    <Image
      source={`https://ishutools.com/icons/${category}.png`}
      style={{ width: 48, height: 48, borderRadius: 12 }}
      contentFit="contain"
      transition={150}                  // 150ms fade from blurhash to image
      placeholder={CATEGORY_BLURHASH[category]}  // Pre-computed blurhash
      cachePolicy="memory-disk"         // Cache forever
      priority="high"                   // Preload (for above-fold images)
    />
  )
}

// Generate blurhash for category icons:
// npx blurhash-tool frontend/public/icons/pdf-core.png
const CATEGORY_BLURHASH = {
  "pdf-core": "LEHLk~WB2yk8pyo0adR*.7kCMdnj",
  "science-tools": "L5H2EC=PM+yV0g-mq.wG9c010J}I",
}
```

---

## Navigation Architecture

```typescript
// For ISHU TOOLS mobile — React Navigation (Stack + Tabs)
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

type RootStackParams = {
  Main: undefined           // Bottom tabs
  Tool: { slug: string }    // Individual tool page
  Premium: undefined        // Paywall
}

type TabParams = {
  Home: undefined           // All categories
  Search: undefined         // Search all 700+ tools
  Favorites: undefined      // Saved tools
  Settings: undefined
}

const Stack = createNativeStackNavigator<RootStackParams>()
const Tab = createBottomTabNavigator<TabParams>()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#040813', borderTopColor: 'rgba(255,255,255,0.1)' },
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Tool" component={ToolScreen} />
    </Stack.Navigator>
  )
}
```

---

## Platform-Specific Patterns

```typescript
import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    
    // iOS shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      // Android elevation
      android: {
        elevation: 6,
      }
    }),
  }
})
```

---

## App.json Configuration for ISHU TOOLS Mobile

```json
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
      "buildNumber": "1",
      "supportsTablet": true
    },
    "android": {
      "package": "com.ishutools.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      }
    },
    "plugins": [
      "expo-image",
      "react-native-reanimated",
      ["expo-camera", { "cameraPermission": "Needed for document scanner" }]
    ]
  }
}
```

---

## Related Skills
- `expo` — Expo API reference (permissions, device features)
- `revenuecat` — In-app purchase integration for ISHU TOOLS Pro
- `design` — DESIGN subagent for mobile UI components
- `better-auth-best-practices` — User accounts for the mobile app
