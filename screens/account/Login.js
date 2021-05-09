import React from 'react'
import { ScrollView, StyleSheet, Text, View, Image} from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

export default function Login() {
    return (
        <ScrollView>
            <Image
                source={require("../../assets/Dogs-logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <View style={styles.container}>
                <Text>Login Form...</Text>
                <CreateAccount/>
            </View>
            <Divider style={styles.divider}/>
        </ScrollView>
    )
}

function CreateAccount(props) {
    const navigation = useNavigation()

    return (
        <Text 
            style={styles.register}
             onPress={() => navigation.navigate("register")}
        >
            ¿Aún no tienes una cuenta?.{" "}
            <Text style={styles.btnRegister}>
                Regístrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image : {
        height: 200,
        width: "100%",
        marginVertical: 20
    },
    container: {
        marginHorizontal: 40
    },
    divider: {
        backgroundColor: "#a42424",
        margin: 40
    },
    register: {
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },
    btnRegister: {
        color: "#a42424",
        fontWeight: "bold"
    }
})
