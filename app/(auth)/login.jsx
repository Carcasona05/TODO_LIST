import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'; 
import { supabase } from '../../lib/supabase'; 

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    return (
        <View style={{ padding: 20, paddingTop: 60 }}>
            <TextInput
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize="none"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
            />
            <TextInput
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
                autoCapitalize="none"
                style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
            />
            <TouchableOpacity 
                disabled={loading}
                onPress={signInWithEmail}
                style={{ backgroundColor: '#007AFF', padding: 15, alignItems: 'center', borderRadius: 5 }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>SIGN IN</Text>
            </TouchableOpacity>

            <Link href="/(auth)/register" style={{ marginTop: 20, textAlign: 'center' }}>
                <Text style={{ color: '#007AFF' }}>Don&apos;t have an account? Sign up</Text>
            </Link>
        </View>
    );
}
