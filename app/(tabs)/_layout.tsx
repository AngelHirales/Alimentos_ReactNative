import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";

export default function _Layout() {
  interface TabBarIconInterface {
    title: string;
    icon: any;
    focused: boolean;
  }

  const TabBarIcon = ({ title, icon, focused }: TabBarIconInterface) => {
    if (!focused) {
      return (
        <View className="flex flex-row flex-1 min-w-[112px] 
        min-h-16 mt-4 justify-center items-center rounded-full
        overflow-hidden">
          <Ionicons name={icon} size={30} color="black" />
        </View>
      );
    }

    return (
      <View className="flex flex-row min-w-[112px] justify-center 
      items-center bg-blue-400 mt-4 min-h-16 rounded-full 
      overflow-hidden">
        <Ionicons name={icon} size={30} color={"#3267d8"} />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "white",
          borderRadius: 40,
          paddingTop: 2.5,
          marginHorizontal: 20,
          marginBottom: 20,
          height: 50,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 2,
          borderColor: "white",
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: TabBarIconInterface) => (
            <TabBarIcon
              title=""
              icon="home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ focused }: TabBarIconInterface) => (
            <TabBarIcon
              title=""
              icon="search"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }: TabBarIconInterface) => (
            <TabBarIcon
              title=""
              icon="heart"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
