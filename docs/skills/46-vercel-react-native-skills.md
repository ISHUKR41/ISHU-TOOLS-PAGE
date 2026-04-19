# Vercel React Native Skills (User-Provided)

## What It Does
React Native and Expo best practices for building performant mobile apps. Covers list performance, animations, navigation, native module integration, and platform-specific patterns.

## Activation Triggers
- React Native, Expo, mobile app development
- Mobile performance optimization
- Native platform APIs (Camera, Location, etc.)
- App Store deployment

## Key Performance Patterns

### 1. FlatList Optimization
```typescript
// Critical for tool lists with 600+ items
<FlatList
  data={tools}
  keyExtractor={(item) => item.slug}
  getItemLayout={(data, index) => ({
    length: TOOL_CARD_HEIGHT,
    offset: TOOL_CARD_HEIGHT * index,
    index
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={8}
  renderItem={({ item }) => <ToolCard tool={item} />}
/>
```

### 2. Memoized Components
```typescript
const ToolCard = React.memo(({ tool }: { tool: Tool }) => {
  return <Pressable style={styles.card}>...</Pressable>
}, (prev, next) => prev.tool.slug === next.tool.slug)
```

### 3. Reanimated for 60fps Animations
```typescript
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'

const scale = useSharedValue(1)
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }]
}))

// Runs on UI thread — no JS bridge overhead
onPress={() => { scale.value = withSpring(0.95) }
```

### 4. Image Optimization
```typescript
import { Image } from 'expo-image'

<Image
  source={imageUrl}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  placeholder={blurhash}
/>
```

## Navigation Pattern
```typescript
// React Navigation for ISHU TOOLS Mobile
const Stack = createNativeStackNavigator<RootStackParams>()

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tool" component={ToolScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
    </Stack.Navigator>
  )
}
```

## Related Skills
- `expo` — Expo-specific APIs and permissions
- `revenuecat` — Mobile payments
- `design` — DESIGN subagent for mobile UI
