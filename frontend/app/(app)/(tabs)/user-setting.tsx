import TopBar from '@/components/TopBar';
import React from 'react';
import { Text, View, TouchableOpacity, Switch,StyleSheet,StatusBar, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ThemeContext } from '@react-navigation/native';


const UserSetting = () => {
  const {currentTheme , toggleTheme} = useTheme();
   const [darkMode, setDarkMode] = React.useState(false);
  const {logout , user } = useAuth();
  
   const handleLogout = () =>{
      logout();
      router.push('/');
  }
  
  

  const renderItem = (icon: any, label: string, onPress?: () => void, rightComponent?: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      {rightComponent ? rightComponent : <Ionicons name="chevron-forward" size={18} color="#999" />}
    </TouchableOpacity>
  );

  return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>
           <StatusBar barStyle="light-content" />
          <LinearGradient  colors={['#2b0a0a', '#000000']} 
                    style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{flexGrow: 1}} style={{backgroundColor:"transparent"}}>
          <TopBar title='User-Settings' />
          <View style={{ height: 20 }} />
          <TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
          <View style={styles.profileText}>
            {
              user && user.fullName && (
                <Text style={styles.name}>{user.fullName}</Text>
              )
            }
            </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <Text style={styles.section}>Other settings</Text>

        <View className='bg-[#5f291683]' style={styles.card}>
          
            {renderItem(<Feather name="user" size={18} color="#f2ecec" />, "Profile details" , () => router.push('/profile-details'))}
               {renderItem(<Feather name="lock" size={18} color="#f2ecec" />, "Password" )}
          {renderItem(<Ionicons name="notifications-outline" size={18} color="#f2ecec" />, "Notifications" )}
          {renderItem(
            <Ionicons name="moon-outline" size={18} color="#f2ecec" />,
            "Dark mode",
            undefined,
            <Switch value={currentTheme === 'dark'} onValueChange={() =>toggleTheme(currentTheme==='light' ? 'dark' : 'light')} />
          )}
        </View>
        <View style={styles.card} className='bg-[#5f291683]'>
          {renderItem(<Feather name="info" size={18} color="#f2ecec" />, "About application" , () => router.push('/about-app'))}
          {renderItem(<Feather name="help-circle" size={18} color="#f2ecec" />, "Help/FAQ" , () => router.push('/help-faq'))}
        </View>

        <TouchableOpacity style={styles.logout} activeOpacity={0.7} onPress={handleLogout}>
          <MaterialIcons name="logout" size={18} color="red" />
          <Text style={styles.logoutText} >Log out</Text>
        </TouchableOpacity>
        </ScrollView>
        </LinearGradient>
        </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  // backgroundColor: "#3b0000",
   justifyContent: 'center',
   alignContent : 'center',
   alignItems: 'center',

  },
  scroll: {
    paddingTop: 20, 
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 16,
  },
  profileCard: {
    backgroundColor: "#5f291683",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileText: {
    flexDirection: "column",
     },
  name: {
    fontSize: 16,
    color: '#fff',
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    color: "#9d9797",
    marginTop: 4,
  },
  section: {
    
    marginLeft: 16,
    marginBottom: 8,
    color: "#ccc",
  },
  card:{
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 16,
 
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
   },
  label: {
    fontSize: 14,
    marginLeft: 10,
    color: '#f7efef'
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    gap: 10,
  },
  logoutText: {
    color: "red",
    fontSize: 14,
  },
});
export default UserSetting
