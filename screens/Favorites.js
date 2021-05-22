import React, { useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Button, Icon, Image } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'

import Loading from '../components/Loading'
import { deleteFavorite, getFavorites } from '../utils/actions'

export default function Favorites({ navigation }) {
    const toastRef = useRef()
    const [dogs, setDogs] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            if (userLogged) {
                async function getData() {
                    setLoading(true)
                    const response = await getFavorites()
                    setDogs(response.favorites)
                    setLoading(false)
                }
                getData()
            }
            setReloadData(false)
        }, [userLogged, reloadData])
    )

    if (!userLogged) {
        return <UserNoLogged navigation={navigation}/>
    }

    if (!dogs) {
        return <Loading isVisible={true} text="Cargando razas caninas..."/>
    } else if(dogs?.length === 0){
        return <NotFoundDogs/>
    }

    return (
        <View  style={styles.viewBody}>
            {
                dogs ? (
                    <FlatList
                        data={dogs}
                        keyExtractor={(item, index) => index.toString() }
                        renderItem={(dog) => (
                            <Dog
                                dog={dog}
                                setLoading={setLoading}
                                toastRef={toastRef}
                                navigation={navigation}
                                setReloadData={setReloadData}
                            />
                        )}
                    />
                ) : (
                    <View style={styles.loaderDog}>
                        <ActivityIndicator size="large"/>
                        <Text style={{ textAlign: "center"}}>
                            Cargando Razas caninas...
                        </Text>
                    </View>
                )
            } 
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </View>
    )
}

function Dog({ dog, setLoading, toastRef, navigation }) {
    const { id, name, images } = dog.item
    return(
        <View>
            <Text>{name}</Text>
        </View>
    )
}

function NotFoundDogs() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Aún no tienes razas caninas favoritas.
            </Text>
        </View>
    )
}

function UserNoLogged({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Necesitas estar logueado para ver los favoritos.
            </Text>
            <Button
                title="Ir al Login"
                containerStyle={{ marginTop: 20, width: "80%" }}
                buttonStyle={{ backgroundColor: "#a42424" }}
                onPress={() => navigation.navigate("account", { screen: "login" })}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#c7c7c7"
    },
    loaderDog: {
        marginVertical: 10
    } 
})