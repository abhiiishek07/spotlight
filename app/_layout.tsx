import InitialLayout from "@/components/initial-layout";
import ClerkAndConvexProvider from "@/providers/clerk-convex-provider";
import { SplashScreen } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useCallback } from "react";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) SplashScreen.hideAsync();
  }, [fontLoaded]);

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider style={{ backgroundColor: "black" }}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#000" }}
          onLayout={onLayoutRootView}
        >
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
