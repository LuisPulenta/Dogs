import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { size } from 'lodash'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import ListDogs from '../../components/dogs/ListDogs'
import { getMoreDogs,getDogs } from '../../utils/actions'

export default function Dogs({navigation}) {
const [user, setUser] = useState(null)
const [startDog, setStartDog] = useState(null)
    const [dogs, setDogs] = useState([])
    const [loading, setLoading] = useState(false)

    const limitDogs = 7

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        })
    }, [])

    useFocusEffect(
        useCallback(async() => {
            async function getData(){
                setLoading(true)
                const response = await getDogs(limitDogs)
                if (response.statusResponse) {
                    setStartDog(response.startDog)
                    setDogs(response.dogs)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    const handleLoadMore = async() => {
        if (!startDog) {
            return
        }

        setLoading(true)
        const response = await getMoreDogs(limitDogs, startDog)
        if (response.statusResponse) {
            setStartDog(response.startDog)
            setDogs([...dogs, ...response.dogs])
        }
        setLoading(false)
    }

    if (user === null){
        return<Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}>
            {
                size(dogs) > 0 ? (
                    <ListDogs
                        dogs={dogs}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay razas caninas registradas.</Text>
                    </View>
                )
            }
            {
                user && (
                <Icon
                type="material-community"
                name="plus"
                color="#a42424"
                reverse
                containerStyle={styles.btnContainer}
                onPress={() => navigation.navigate("add-dog")}
            />
                )
            }
            <Loading isVisible={loading} text="Cargando razas caninas..."/>
        </View>
    )
}
const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    },
    notFoundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "bold"
    }
})