import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements'
import { isEmpty, size } from 'lodash'

import { searchDogs } from '../utils/actions'

export default function Search ({ navigation }) {
    const [search, setSearch] = useState("")
    const [dogs, setDogs] = useState([])
   
    useEffect(() => {
        if (isEmpty(search)) {
            return
        }

        async function getData() {
            const response = await searchDogs(search)
            if (response.statusResponse) {
                setDogs(response.dogs)
            }
        }
        getData();
    }, [search])

    return (
        <View>
             <SearchBar
                placeholder="Ingresa nombre de la raza canina..."
                onChangeText={(e) => setSearch(e)}
                containerStyle={styles.searchBar}
                value={search}
            />
            {
                size(dogs) > 0 ? (
                    <FlatList
                        data={dogs}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(dog) => 
                            <Dog
                            dog={dog}
                                navigation={navigation}
                            />
                        }
                    />
                ) : (
                    isEmpty(search) ? (
                        <Text style={styles.noFound}>
                            Ingrese las primeras letras del nombre de la raza canina.
                        </Text>
                    ) : (
                        <Text style={styles.noFound}>
                            No hay restaurantes que coincidan con el criterio de búsqueda.
                        </Text>
                    )
                )
            }
        </View>
    )
}

function Dog ({ dog, navigation }) {
    const { id, name, images } = dog.item

    return (
        <ListItem
            style={styles.menuItem}
            onPress={() => navigation.navigate("dogs", {
                screen: "dog",
                params: { id, name }
            })}
        >
            <Image
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="#fff"/>}
                source={{ uri: images[0] }}
                style={styles.imageDog}
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <Icon
                type="material-community"
                name="chevron-right"
            />
        </ListItem>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
        backgroundColor: "#fff"
    },
    imageDog: {
        width: 90,
        height: 90
    },
    noFound: {
        alignSelf: "center",
        width: "90%"
    },
    menuItem: {
        margin: 10
    }
})