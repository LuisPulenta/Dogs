import React,{useState}  from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Icon } from 'react-native-elements';
import { map } from 'lodash';
import Modal from '../Modal';

import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function AccountOptions({user, toastRef,setReloadUser}) {

    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const generateOptions = () => {
        return [
            {
                title : "Cambiar Nombre y Apellido",
                iconNameLeft: "account-circle",
                iconColorLeft: "#c27c5d",
                iconNameRight: "chevron-right",
                iconColorRight: "#c27c5d",
                onPress: () => selectedComponent("displayName")
            },
            {
                title : "Cambiar Domicilio",
                iconNameLeft: "map-marker-outline",
                iconColorLeft: "#c27c5d",
                iconNameRight: "chevron-right",
                iconColorRight: "#c27c5d",
                onPress: () => selectedComponent("displayAddress")
            },
            {
                title : "Cambiar Documento",
                iconNameLeft: "file-document-outline",
                iconColorLeft: "#c27c5d",
                iconNameRight: "chevron-right",
                iconColorRight: "#c27c5d",
                onPress: () => selectedComponent("displayDocument")
            },
            {
                title : "Cambiar Teléfono",
                iconNameLeft: "cellphone",
                iconColorLeft: "#c27c5d",
                iconNameRight: "chevron-right",
                iconColorRight: "#c27c5d",
                onPress: () => selectedComponent("displayPhone")
            },
            {
                title : "Cambiar Email",
                iconNameLeft: "at",
                iconColorLeft: "#c27c5d",
                iconNameRight: "chevron-right",
                iconColorRight: "#c27c5d",
                onPress: () => selectedComponent("email")
            },
            {
                title : "Cambiar Contraseña",
                iconNameLeft: "lock-reset",
                iconColorLeft: "#c27c5d",
                iconNameRight: "chevron-right",
                iconColorRight: "#c27c5d",
                onPress: () => selectedComponent("password")
            },
        ]
    }

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                    displayName={user.displayName}
                    setShowModal={setShowModal}
                    toastRef={toastRef}
                    setReloadUser={setReloadUser}
                    />
                )
                break;
                case "displayAddress":
                setRenderComponent(
                    <Text>displayAddress</Text>
                )
                break;
                case "displayDocument":
                setRenderComponent(
                    <Text>displayDocument</Text>
                )
                break;
                case "displayPhone":
                    setRenderComponent(
                        <Text>displayPhone</Text>
                    )
                    break;
                    case "email":
                        setRenderComponent(
                            <ChangeEmailForm
                            email={user.email}
                            setShowModal={setShowModal}
                            toastRef={toastRef}
                            setReloadUser={setReloadUser}/>
                        )
                        break;
                case "password":
                    setRenderComponent(
                        <ChangePasswordForm
                            email={user.email}
                            setShowModal={setShowModal}
                            toastRef={toastRef}
                            setReloadUser={setReloadUser}/>
                    )
                    break;
        }
        setShowModal(true)
    }

    const menuOptions=generateOptions();    
    
    return (
        <View>
            {
                map(menuOptions,(menu,index)=>(
                    <ListItem
                    key={index}
                    style={styles.menuItem}
                    onPress={menu.onPress}
                >
                    <Icon
                        type="material-community"
                        name={menu.iconNameLeft}
                        color={menu.iconColorLeft}
                    />
                    <ListItem.Content>
                        <ListItem.Title>{menu.title}</ListItem.Title>
                    </ListItem.Content>
                    <Icon
                        type="material-community"
                        name={menu.iconNameRight}
                        color={menu.iconColorRight}
                    />
                </ListItem>
                ))
            }
            <Modal isVisible={showModal} setVisible={setShowModal}>
                {
                    renderComponent
                }
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#c27c5d"
    }
})
