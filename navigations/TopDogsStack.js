import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import TopDogs from '../screens/TopDogs'

const Stack=createStackNavigator()

export default function TopDogsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="top-dogs"
                component={TopDogs}
                options={{title:"Los mejores Perros"}}
            />
        </Stack.Navigator>
    )
}