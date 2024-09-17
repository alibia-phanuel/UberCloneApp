import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Layout = () => {
  const [isFirstLaunch, setIsFistLauch] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("alreadyLauched").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("alreadyLauched", "true");
        setIsFistLauch(true);
      } else {
        setIsFistLauch(false);
      }
    });
  }, []);
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
};
export default Layout;
