import React from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'

export default function Loading({ isVisible, text }) {
    return (
        <Overlay
        isVisible={isVisible}
        windowBackgoundColor="rgba(0,0,0,0.5)"
        overlayBackgroundColor="transparent"
        overlayStyle={styles.overlay}
    >
            <View style={styles.view}>
                <ActivityIndicator
                    size="large"
                    color="#a42424"
                />
                {
                    text && <Text style={styles.text}>{text}</Text>
                }
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay : {
        height: 100,
        width: 200,
        backgroundColor: "#fff",
        borderColor: "#a42424",
        borderWidth: 2,
        borderRadius: 10
    },
    view: {
       flex: 1,
       alignItems: "center",
       justifyContent: "center" 
    },
    text: {
        color: "#a42424",
        marginTop: 10
    }
})
