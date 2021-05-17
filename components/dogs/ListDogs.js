import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { formatPhone } from '../../utils/helpers'

export default function ListDogs({ dogs, navigation,handleLoadMore}) {
    return (
        <View>
            <FlatList
                data={dogs}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(dog) => (
                    <Dog dog={dog} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Dog({ dog, navigation,handleLoadMore }) {
    const { id, images, name, address, description, phone, callingCode } = dog.item
    const imageDog = images[0]

    const goDog = () => {
        navigation.navigate("dog", { id, name })
    } 

    return (
        <TouchableOpacity onPress={goDog}>
            <View style={styles.viewDog}>
                <View style={styles.viewDogImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imageDog }}
                        style={styles.imageDog}
                    />
                </View>
                <View>
                    <Text style={styles.dogTitle}>{name}</Text>
                    <Text style={styles.dogInformation}>{address}</Text>
                    <Text style={styles.dogInformation}>{formatPhone(callingCode, phone)}</Text>
                    <Text style={styles.dogDescription}>
                        {
                            size(description) > 0
                                ? `${description.substr(0, 60)}...`
                                : description
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewDog: {
        flexDirection: "row",
        margin: 10
    },
    viewDogImage: {
        marginRight: 15
    },
    imageDog: {
        width: 90,
        height: 90
    },
    dogTitle: {
        fontWeight: "bold"
    },
    dogInformation: {
        paddingTop: 2,
        color: "grey"
    },
    dogDescription: {
        paddingTop: 2,
        color: "grey",
        width: "75%"
    }
})