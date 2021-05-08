import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Dogs from '../screens/dogs/Dogs'

const Stack=createStackNavigator()

export default function DogsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="dogs"
                component={Dogs}
                options={{title:"Perros"}}
            />
        </Stack.Navigator>
    )
}