import React, { useState, useCallback } from 'react'
import { Alert,Dimensions,StyleSheet, Text, ScrollView,View } from 'react-native'
import { getDocumentById} from '../../utils/actions'
import { Icon,ListItem,Rating } from 'react-native-elements'
import { map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import MapDog from '../../components/dogs/MapDog'
import { formatPhone } from '../../utils/helpers'
import ListReviews from '../../components/dogs/ListReviews'

const widthScreen = Dimensions.get("window").width

export default function Dog({ navigation, route }) {
    const { id, name } = route.params
    const [dog, setDog] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
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
   

    if (!dog) {
        return <Loading isVisible={true} text="Cargando..."/>
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
            />
            <ListReviews
             navigation={navigation}
             idDog={dog.id}
            />
        </ScrollView>
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
    phone
}) {
    const listInfo = [
        { type: "addres", text: address, iconName: "map-marker" },
        { type: "phone", text: phone, iconName: "phone"},
        { type: "email", text: email, iconName: "at" },
    ]

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
})