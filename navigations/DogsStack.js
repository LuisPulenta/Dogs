import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Dogs from '../screens/dogs/Dogs'
import AddDog from '../screens/dogs/AddDog'

const Stack=createStackNavigator()

export default function DogsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="dogs"
                component={Dogs}
                options={{title:"Perros"}}
            />

            <Stack.Screen
                name="add-dog"
                component={AddDog}
                options={{title:"Crear Raza de Perro"}}
            />
        </Stack.Navigator>
    )
}