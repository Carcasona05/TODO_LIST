import { Stack } from 'expo-router'
import React from 'react'
import { useAuthContext } from '../hooks/use-auth-context'
import AuthProvider from '../providers/auth-provider';

function RootNavigator () {
    const {isLoggedIn} = useAuthContext();

    return (
        <Stack>
            <Stack.Protected guard = {isLoggedIn}>
                <Stack.Screen name="(main)/index" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard = {!isLoggedIn}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>
            
        </Stack>
    )
}
export default function RootLayout() {
  return (
    <AuthProvider>
        <RootNavigator />
    </AuthProvider>
  )
}
