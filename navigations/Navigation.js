import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import DogsStack from './DogsStack'
import FavoritesStack from './FavoritesStack'
import TopDogsStack from './TopDogsStack'
import SearchStack from './SearchStack'
import AccountStack from './AccountStack'


const Tab = createBottomTabNavigator()

export default function Navigation() {
    return (
       <NavigationContainer>

           <Tab.Navigator>
               
               <Tab.Screen
               name="dogs"
               component={DogsStack}
               options={{title:"Perros"}}
               />
                     
               <Tab.Screen
               name="favorites"
               component={FavoritesStack}
               options={{title:"Favoritos"}}
               />
           
               <Tab.Screen
               name="top-dogs"
               component={TopDogsStack}
               options={{title:"Top 10"}}
               />
           
               <Tab.Screen
               name="search"
               component={SearchStack}
               options={{title:"Buscar"}}
               />
           
               <Tab.Screen
               name="account"
               component={AccountStack}
               options={{title:"Perros"}}
               />


           </Tab.Navigator>

       </NavigationContainer>
    )
}