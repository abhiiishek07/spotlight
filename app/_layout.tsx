import InitialLayout from "@/components/initial-layout";
import ClerkAndConvexProvider from "@/providers/clerk-convex-provider";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider style={{ backgroundColor: "black" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
