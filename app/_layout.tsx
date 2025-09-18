import {SplashScreen, Stack} from "expo-router";
import "./global.css";
import {useFonts} from 'expo-font'
import {useEffect} from "react";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://00db6723912c1a9b636f9640a37ee4d9@o4510030633697280.ingest.us.sentry.io/4510042647363584',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
        "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
        "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
        "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
        "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
    });

    useEffect(() => {
        if(error) throw error
        if(fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded,error]);
  return <Stack  screenOptions={{headerShown:false}}/>;
});