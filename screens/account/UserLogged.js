import React from 'react'
import { Button } from 'react-native-elements'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { closeSession } from '../../utils/actions'

export default function UserLogged() {
    const navigation = useNavigation()

    return (
        <View>
            <Text>UserLogged...</Text>
            <Button
                title="Cerrar Sesión"
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionTitle}
                onPress={() => {
                    closeSession()
                    navigation.navigate("dogs")
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: "100%",
        backgroundColor: "#f9f9f9"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#a42424",
        borderBottomWidth: 1,
        borderBottomColor: "#a42424",
        paddingVertical: 10
    },
    btnCloseSessionTitle: {
        color: "#a42424"
    }
})
