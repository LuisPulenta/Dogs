import React, {useState, useRef, useEffect} from 'react'
import { Button } from 'react-native-elements'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'

import { closeSession,getCurrentUser } from '../../utils/actions'
import Loading from '../../components/Loading'
import InfoUser from '../../components/account/InfoUser'

export default function UserLogged() {
    const toastRef=useRef()
    const navigation = useNavigation()

    const [loading,setLoading] =useState(false)
    const [loadingText,setLoadingText] =useState("")
    const [user,setUser] =useState(null)
    const [reloadUser,setReloadUser] =useState(false)

    useEffect(() => {
        setUser(getCurrentUser())
        setReloadUser(false)
       }, [reloadUser])

    return (
        <View style={styles.container}>
            {
                user && (
                    <View>
                        <InfoUser 
                            user={user} 
                            setLoading={setLoading} 
                            setLoadingText={setLoadingText}
                        />
                    </View>
                )
            }
            <Text>Account Options...</Text>
            <Button
                title="Cerrar Sesión"
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionTitle}
                onPress={() => {
                    closeSession()
                    navigation.navigate("dogs")
                }}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text={loadingText}/>
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
