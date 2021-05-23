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

function Dog({ dog, setLoading, toastRef, navigation,setReloadData }) {
    const { id, name, images } = dog.item

    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar raza canina de favoritas",
            "¿Está seguro de querer borrar la raza canina de favoritas?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Sí",
                    onPress: removeFavorite
                }
            ],
            { cancelable: false }
        )
    }

    const removeFavorite = async() => {
        setLoading(true)
        const response = await deleteFavorite(id)
        setLoading(false)
        if (response.statusResponse) {
            setReloadData(true)
            toastRef.current.show("Raza canina eliminada de favoritas.", 3000)
        } else {
            toastRef.current.show("Error al eliminar la raza canina de favoritas.", 3000)
        }
    }

    return(
        <View style={styles.dog}>
            <TouchableOpacity
                onPress={() => navigation.navigate("dogs", {
                    screen: "dog",
                    params: { id, name }
                })}
            >
                <Image
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff"/>}
                    source={{ uri: images[0] }}
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favorite}
                        underlayColor="transparent"
                        onPress={confirmRemoveFavorite}
                    />
                </View>
            </TouchableOpacity>
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
    } ,
    dog: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 180
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: -30,
        backgroundColor: "#fff"
    },
    name: {
        fontWeight: "bold",
        fontSize: 20
    },
    favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100
    } 
})