import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, ShoppingBag, Heart, Settings, CircleHelp as HelpCircle, Star, ChevronRight, Gift, CreditCard, LogOut } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleFeaturePress = (feature: string) => {
    Alert.alert(feature, `${feature} feature coming soon!`);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const menuItems = [
    {
      icon: ShoppingBag,
      title: 'My Orders',
      subtitle: 'View your order history',
      onPress: () => handleFeaturePress('My Orders'),
    },
    {
      icon: Heart,
      title: 'Wishlist',
      subtitle: 'Your saved items',
      onPress: () => handleFeaturePress('Wishlist'),
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage your cards and wallets',
      onPress: () => handleFeaturePress('Payment Methods'),
    },
    {
      icon: Gift,
      title: 'Coupons & Offers',
      subtitle: 'Available discounts',
      onPress: () => handleFeaturePress('Coupons & Offers'),
    },
    {
      icon: Star,
      title: 'Reviews & Ratings',
      subtitle: 'Your product reviews',
      onPress: () => handleFeaturePress('Reviews & Ratings'),
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'Account and app settings',
      onPress: () => handleFeaturePress('Settings'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      onPress: () => handleFeaturePress('Help & Support'),
    },
  ];

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Guest Header */}
          <View style={styles.guestHeader}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.avatar}
            />
            <Text style={styles.guestTitle}>Welcome to Myntra</Text>
            <Text style={styles.guestSubtitle}>Sign in to access your profile and orders</Text>
            
            <View style={styles.authButtons}>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.signupButton} 
                onPress={() => router.push('/(auth)/signup')}
              >
                <Text style={styles.signupButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Limited Menu for Guests */}
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleFeaturePress('Help & Support')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <HelpCircle size={20} color="#E91E63" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Help & Support</Text>
                  <Text style={styles.menuItemSubtitle}>Get help and contact us</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Promotional Banner */}
          <View style={styles.promoContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg' }}
              style={styles.promoBanner}
            />
            <View style={styles.promoOverlay}>
              <Text style={styles.promoTitle}>Join Myntra</Text>
              <Text style={styles.promoSubtitle}>Get exclusive offers and early access</Text>
              <TouchableOpacity 
                style={styles.promoButton}
                onPress={() => router.push('/(auth)/signup')}
              >
                <Text style={styles.promoButtonText}>Sign Up Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹25,000</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <item.icon size={20} color="#E91E63" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          ))}
          
          {/* Logout Button */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <LogOut size={20} color="#EF4444" />
              </View>
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemTitle, { color: '#EF4444' }]}>Logout</Text>
                <Text style={styles.menuItemSubtitle}>Sign out of your account</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg' }}
            style={styles.promoBanner}
          />
          <View style={styles.promoOverlay}>
            <Text style={styles.promoTitle}>Become a Member</Text>
            <Text style={styles.promoSubtitle}>Get exclusive offers and early access</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Join Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Myntra Clone v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ using React Native</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  guestHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  signupButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  signupButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#E91E63',
  },
  editProfileButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
  },
  menu: {
    padding: 16,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  promoContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  promoBanner: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  promoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  promoButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  promoButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 4,
  },
});