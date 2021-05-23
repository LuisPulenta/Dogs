import React,{useState,useCallback} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {useFocusEffect} from '@react-navigation/native'

import Loading  from '../components/Loading'
import { getTopDogs } from '../utils/actions'
import ListTopDogs from '../components/ranking/ListTopDogs'

export default function TopDogs ({navigation}) {
    const [dogs, setDogs] = useState(null)
    const [loading, setLoading] = useState(false)

    console.log(dogs)

    useFocusEffect(
        useCallback(() =>{
           async function getData(){
               setLoading(true)
               const response = await getTopDogs(10)
               if(response.statusResponse){
                setDogs(response.dogs)
               }
               setLoading(false)
           } 
           getData()
        },[]

        )
    )

    return (
        <View>
            <ListTopDogs
             dogs={dogs}
             navigation={navigation}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </View>
    )
}
const styles = StyleSheet.create({})