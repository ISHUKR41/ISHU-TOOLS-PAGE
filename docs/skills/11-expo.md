# Expo Skill

## What It Does
Provides comprehensive guidelines for building mobile applications using Expo (React Native). Covers UI design patterns, animations, state management, React context, and native device feature permissions.

## When to Use
- Building iOS/Android mobile apps
- Working with React Native + Expo framework
- Implementing camera, location, file upload permissions
- Mobile-specific animations and gestures
- App Store / Play Store deployment considerations

## Key Topics Covered

### UI Design for Mobile
- Mobile-first layouts using `SafeAreaView`, `ScrollView`
- Platform-specific styling (iOS vs Android differences)
- Touch target sizes (minimum 44x44 points)
- Keyboard-aware layouts
- Status bar management

### Animations
- `react-native-reanimated` for high-performance animations
- Gesture handling with `react-native-gesture-handler`
- Shared transitions between screens
- `Animated` API for basic animations
- Lottie for complex animations

### React Context Patterns
- Global state with Context + useReducer
- Avoiding unnecessary re-renders
- Theme and locale contexts
- Authentication state management

### Native Device Features
| Feature | Expo Module | Permission Required |
|---|---|---|
| Camera | `expo-camera` | `CAMERA` |
| Location | `expo-location` | `LOCATION` |
| File uploads | `expo-document-picker` | None (picker UI) |
| Media library | `expo-media-library` | `MEDIA_LIBRARY` |
| Notifications | `expo-notifications` | `NOTIFICATIONS` |

### Permissions Pattern
```javascript
const { status } = await Camera.requestCameraPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Camera access is required');
  return;
}
```

## Related Skills
- `vercel-react-native-skills` — Advanced React Native best practices
- `delegation` — DESIGN subagent for mobile UI
