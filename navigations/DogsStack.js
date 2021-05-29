import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Dogs from '../screens/dogs/Dogs'
import AddDog from '../screens/dogs/AddDog'
import Dog from '../screens/dogs/Dog'
import AddReviewDog from '../screens/dogs/AddReviewDog'

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
                options={{title:"Crear Raza Canina"}}
            />

            <Stack.Screen
                name="dog"
                component={Dog}
            />

            <Stack.Screen
                name="add-review-dog"
                component={AddReviewDog}
                options={{title:"Nuevo Comentario"}}
            />
        </Stack.Navigator>
    )
}