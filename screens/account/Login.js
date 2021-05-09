import React from 'react'
import { ScrollView, StyleSheet, Text, View, Image} from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import LoginForm from '../../components/account/LoginForm'

export default function Login() {
    return (
        <KeyboardAwareScrollView>
            <Image
                source={require("../../assets/Dogs-logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <View style={styles.container}>
                <LoginForm/>
                <CreateAccount/>
            </View>
            <Divider style={styles.divider}/>
        </KeyboardAwareScrollView>
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
