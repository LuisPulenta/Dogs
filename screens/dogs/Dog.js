import React, { useState, useCallback, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { ListItem, Rating, Icon, Input, Button } from 'react-native-elements'
import { isEmpty, map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import MapDog from '../../components/dogs/MapDog'
import ListReviews from '../../components/dogs/ListReviews'
import { 
    addDocumentWithoutId, 
    getCurrentUser, 
    getDocumentById, 
    getIsFavorite, 
    deleteFavorite,
    sendPushNotification, 
    getUsersFavorite,
    setNotificationMessage
} from '../../utils/actions'
import { callNumber, formatPhone, sendEmail, sendWhatsApp } from '../../utils/helpers'
import Modal from '../../components/Modal'

const widthScreen = Dimensions.get("window").width

export default function Dog({ navigation, route }) {
    const { id, name } = route.params
    const toastRef = useRef()

    const [dog, setDog] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [modalNotification, setModalNotification] = useState(false)
    
    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)
    })

    navigation.setOptions({ title: name })

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getDocumentById("dogs", id)
                if (response.statusResponse) {
                    setDog(response.document)
                } else {
                    setDog({})
                    Alert.alert("Ocurrió un problema cargando la raza canina, intente más tarde.")
                }
            })()
        }, [])
    )

     useEffect(() => {
         (async() => {
             if (userLogged && dog) {
                 const response = await getIsFavorite(dog.id)
                 response.statusResponse && setIsFavorite(response.isFavorite)
             }
         })()
     }, [userLogged, dog])

    if (!dog) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    const addFavorite = async() => {
        if (!userLogged) {
            toastRef.current.show("Para agregar la raza canina a favoritos debes estar logueado.", 3000)
            return
        }

        setLoading(true)
        const response = await addDocumentWithoutId("favorites", {
            idUser: getCurrentUser().uid,
            idDog: dog.id
        })
        setLoading(false)
        if (response.statusResponse) {
            setIsFavorite(true)
            toastRef.current.show("Raza canina añadida a favoritas.", 3000)
        } else {
            toastRef.current.show("No se pudo adicionar la raza canina a favoritas. Por favor intenta más tarde.", 3000)
        }
    }

    const removeFavorite = async() => {
        setLoading(true)
        const response = await deleteFavorite(dog.id)
        setLoading(false)

        if (response.statusResponse) {
            setIsFavorite(false)
            toastRef.current.show("Raza canina eliminada de favoritas.", 3000)
        } else {
            toastRef.current.show("No se pudo eliminar la raza caninca de favoritas. Por favor intenta más tarde.", 3000)
        }
    }


    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages
                images={dog.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={ isFavorite ? "heart" : "heart-outline" }
                    onPress={ isFavorite ? removeFavorite : addFavorite }
                    color="#a42424"
                    size={40}
                    underlayColor="tranparent"
                />
            </View>
            <TitleDog
                name={dog.name}
                description={dog.description}
                rating={dog.rating}
            />
            <DogInfo
                name={dog.name}
                location={dog.location}
                address={dog.address}
                email={dog.email}
                phone={formatPhone(dog.callingCode, dog.phone)}
                currentUser={currentUser}
                callingCode={dog.callingCode}
                phoneNoFormat={dog.phone}
                setLoading={setLoading}
                setModalNotification={setModalNotification}
            />
            <ListReviews
             navigation={navigation}
             idDog={dog.id}
            />
             <SendMessage
                modalNotification={modalNotification}
                setModalNotification={setModalNotification}
                setLoading={setLoading}
                dog={dog}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </ScrollView>
    )
}

function SendMessage ({ modalNotification, setModalNotification, setLoading, dog }) {
    const [title, setTitle] = useState(null)
    const [errorTitle, setErrorTitle] = useState(null)
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const sendNotification = async() => {
        if (!validForm()) {
            return
        }

        setLoading(true)
        const userName = getCurrentUser().displayName ? getCurrentUser().displayName : "Anónimo"
        const theMessage = `${message}, de la raza canina: ${dog.name}`

        const usersFavorite = await getUsersFavorite(dog.id)
        if (!usersFavorite.statusResponse) {
            setLoading(false)
            Alert.alert("Error al obtener los usuarios que aman la raza canina.")
            return
        }
     
        await Promise.all (
            map(usersFavorite.users, async(user) => {
                const messageNotification = setNotificationMessage(
                    user.token,
                    `${userName}, dijo: ${title}`,
                    theMessage,
                    { data: theMessage}
                )
        
                await sendPushNotification(messageNotification)
            })
        )

        setLoading(false)
        setTitle(null)
        setMessage(null)
        setModalNotification(false)
        }
    

    const validForm = () => {
        let isValid = true;

        if (isEmpty(title)) {
            setErrorTitle("Debes ingresar un título a tu mensaje.")
            isValid = false
        }

        if (isEmpty(message)) {
            setErrorMessage("Debes ingresar un mensaje.")
            isValid = false
        }

        return isValid
    }

    return (
        <Modal
            isVisible={modalNotification}
            setVisible={setModalNotification}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.textModal}>
                    Envíale un mensaje a los amantes de la raza canina {dog.name}
                </Text>
                <Input
                    placeholder="Título del mensaje..."
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    errorMessage={errorTitle}
                />
                <Input
                    placeholder="Mensaje..."
                    multiline
                    inputStyle={styles.textArea}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    errorMessage={errorMessage}
                />
                <Button
                    title="Enviar Mensaje"
                    buttonStyle={styles.btnSend}
                    containerStyle={styles.btnSendContainer}
                    onPress={sendNotification}
                />
            </View>
        </Modal>
    )
}

function TitleDog({ name, description, rating }) {
    return (
        <View style={styles.viewDogTitle}>
            <View style={styles.viewDogContainer}>
                <Text style={styles.nameDog}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionDog}>{description}</Text>
        </View>
    )
}

function DogInfo({ 
    name, 
    location, 
    address, 
    email, 
    phone,
    currentUser,
    callingCode,
    phoneNoFormat,
    setLoading,
    setModalNotification 
}) {
    const listInfo = [
        { type: "addres", text: address, iconLeft: "map-marker", iconRight: "message-text-outline" },
        { type: "phone", text: phone, iconLeft: "phone", iconRight: "whatsapp" },
        { type: "email", text: email, iconLeft: "at" },
    ]

    const actionLeft = (type) => {
        if (type == "phone") {
            callNumber(phone)
        } else if (type == "email") {
            if (currentUser) {
                sendEmail(email, "Interesado", `Soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            } else {
                sendEmail(email, "Interesado", `Estoy interesado en sus servicios`)
            }
        }
    }

    const actionRight = (type) => {
        if (type == "phone") {
            if (currentUser) {
                sendWhatsApp(`${callingCode} ${phoneNoFormat}`, `Soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            } else {
                sendWhatsApp(`${callingCode} ${phoneNoFormat}`, `Estoy interesado en sus servicios`)
            }
        } else if (type == "addres") {
            setModalNotification(true)
        }
    }

    

    return (
        <View style={styles.viewDogInfo}>
            <Text style={styles.dogInfoTitle}>
                Información sobre la raza canina
            </Text>
            <MapDog
                location={location}
                name={name}
                height={150}
            />
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                         <Icon
                            type="material-community"
                            name={item.iconLeft}
                            color="#a42424"
                            onPress={() => actionLeft(item.type)}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                        {
                            item.iconRight && (
                                <Icon
                                    type="material-community"
                                    name={item.iconRight}
                                    color="#a42424"
                                    onPress={() => actionRight(item.type)}
                                />
                            )
                        }
                    </ListItem>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewDogTitle: {
        padding: 15,
    },
    viewDogContainer: {
        flexDirection: "row"
    },
    descriptionDog: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    nameDog: {
        fontWeight: "bold",
        color: "blue"
    },
    viewDogInfo: {
        margin: 15,
        marginTop: 25
    },
    dogInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#c27c5d",
        borderBottomWidth: 1
    }
    ,
    viewFavorite: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 34,
        borderBottomRightRadius: 34,
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
        padding: 5,
        paddingLeft: 5
    },
    textArea: {
        height: 50,
        paddingHorizontal: 10
    },
    btnSend: {
        backgroundColor: "#a42424"
    },
    btnSendContainer: {
        width: "95%"
    },
    textModal: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold"
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
})