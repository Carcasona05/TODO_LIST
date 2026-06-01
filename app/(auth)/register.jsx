import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'; 
import { supabase } from '../../lib/supabase'; 

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name } 
            }
        });
        if (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    return (
        <View style={{ padding: 20, paddingTop: 60 }}>
            <TextInput
                onChangeText={(text) => setName(text)}
                value={name}
                placeholder="Full Name"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
            />
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
                onPress={signUpWithEmail}
                style={{ backgroundColor: '#34C759', padding: 15, alignItems: 'center', borderRadius: 5 }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>SIGN UP</Text>
            </TouchableOpacity>

            <Link href="/(auth)/login" style={{ marginTop: 20, textAlign: 'center' }}>
                <Text style={{ color: '#34C759' }}>Already have an account? Sign in</Text>
            </Link>
        </View>
    );
}
