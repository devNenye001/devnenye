import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Zap } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';

const GoogleIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <Path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <Path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <Path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </Svg>
);

const AppleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 170 170">
    <Path
      fill={color}
      d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.72-11.66-14.04-6.32-9.9-11.23-21.43-14.73-34.59-3.5-13.16-5.25-25.26-5.25-36.3 0-14.58 3.65-26.68 10.95-36.3 7.3-9.62 16.71-14.53 28.23-14.75 5.23 0 10.96 1.41 17.18 4.23 6.22 2.83 10.02 4.29 11.4 4.39 1.8 0 5.86-1.57 12.18-4.72 6.32-3.15 11.83-4.62 16.54-4.41 12.98.63 23.33 5.43 31.06 14.42-11.41 6.85-17.01 16.27-16.8 28.27.21 9.47 3.86 17.51 10.95 24.13 7.09 6.62 15.42 10.36 24.99 11.22-2.18 6.53-4.69 13.06-7.53 19.59zM119.22 31.85c0-7.29 2.65-14.28 7.95-20.97 5.3-6.69 11.85-10.87 19.65-12.54.43 1.05.65 2.18.65 3.39 0 7.29-2.76 14.28-8.28 20.97-5.52 6.69-12.22 10.74-20.1 12.14-.14-1.05-.22-2.05-.22-2.99z"
    />
  </Svg>
);

export const LoginScreen: React.FC = () => {
  const { setCurrentScreen } = useSocketContext();
  const [email, setEmail] = useState('Emma@gmail.com');
  const [password, setPassword] = useState('••••••••••');

  const handleAuthAction = () => {
    setCurrentScreen('home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#090E17" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <Zap size={32} color="#FF6A00" fill="#FF6A00" strokeWidth={1} style={styles.icon} />
          <Text style={styles.brandTitle}>VoltPass</Text>
        </View>

        {/* Auth Form */}
        <View style={styles.form}>
          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Emma@gmail.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#64748B"
              secureTextEntry
            />
          </View>

          {/* Primary Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleAuthAction}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Secondary Sign Up Outline Button */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleAuthAction}
            activeOpacity={0.85}
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>

          {/* Or Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign in with Google */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAuthAction}
            activeOpacity={0.85}
          >
            <View style={styles.socialIconBox}>
              <GoogleIcon size={18} />
            </View>
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* Sign in with Apple */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleAuthAction}
            activeOpacity={0.85}
          >
            <View style={styles.socialIconBox}>
              <AppleIcon size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.socialButtonText}>Sign in with apple</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#090E17',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },
  icon: {
    marginRight: 8,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111726',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    color: '#FFFFFF',
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 14,
    elevation: 2,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1E3A8A',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signUpButtonText: {
    color: '#93C5FD',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E293B',
  },
  orText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  socialButton: {
    backgroundColor: '#111726',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  socialIconBox: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '500',
  },
});
