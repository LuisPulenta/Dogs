import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import DogsStack from './DogsStack'
import FavoritesStack from './FavoritesStack'
import TopDogsStack from './TopDogsStack'
import SearchStack from './SearchStack'
import AccountStack from './AccountStack'

const Tab = createBottomTabNavigator()

export default function Navigation() {
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "dogs":
                iconName = "dog"
                break;
            case "favorites":
                iconName = "heart-outline"
                break;
            case "top-dogs":
                iconName = "star-outline"
                break;
            case "search":
                iconName = "magnify"
                break;
            case "account":
                iconName = "home-outline"
                break;
        }

        return (
            <Icon
                type="material-community"
                name={iconName}
                size={32}
                color={color}
            />
        )
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="dogs"
                tabBarOptions={{
                    inactiveTintColor: "#978e89",
                    activeTintColor: "#a42424" 
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color)
                })}
            >
                <Tab.Screen
                    name="dogs"
                    component={DogsStack}
                    options={{ title: "Perros" }}
                />
                <Tab.Screen
                    name="favorites"
                    component={FavoritesStack}
                    options={{ title: "Favoritos" }}
                />
                <Tab.Screen
                    name="top-dogs"
                    component={TopDogsStack}
                    options={{ title: "Top 10" }}
                />
                <Tab.Screen
                    name="search"
                    component={SearchStack}
                    options={{ title: "Buscar" }}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{ title: "Cuenta" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}