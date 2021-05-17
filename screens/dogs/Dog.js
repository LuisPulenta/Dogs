import React, { useState, useEffect } from 'react'
import { Alert,StyleSheet, Text, View } from 'react-native'
import { getDocumentById} from '../../utils/actions'

import Loading from '../../components/Loading'

export default function Dog({ navigation, route }) {
    const { id, name } = route.params
    const [dog, setDog] = useState(null)

    navigation.setOptions({ title: name })

    useEffect(() => {
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

    if (!dog) {
        return <Loading isVisible={true} text="Cargando..."/>
    }
    

    return (
        <View>
            <Text>{dog.name}</Text>
            <Text>{dog.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})