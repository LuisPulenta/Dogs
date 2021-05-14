import React, { useEffect, useState} from 'react'
import { Alert,Dimensions,StyleSheet, Text,View,ScrollView } from 'react-native'
import { Avatar,Input,Button,Icon,Image } from 'react-native-elements'
import { map, size, filter, isEmpty } from 'lodash' 
import CountryPicker from 'react-native-country-picker-modal'
import MapView from 'react-native-maps'

import {getCurrentLocation, loadImageFromGallery,validateEmail } from '../../utils/helpers'
import Modal from '../../components/Modal'


const widthScreen = Dimensions.get("window").width

export default function AddDogForm({toastRef,setLoading,navigation}) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationDog, setLocationDog] = useState(null)

    const addDog=()=>{
        if (!validForm()) {
            return
        }
        console.log("Fuck Yeah!!")
    }   

    const validForm = () => {
        clearErrors()
        let isValid = true

        if (isEmpty(formData.name)) {
            setErrorName("Debes ingresar el nombre de la raza canina.")
            isValid = false
        }

        if (isEmpty(formData.address)) {
            setErrorAddress("Debes ingresar la dirección de la raza canina.")
            isValid = false
        }

        if (!validateEmail(formData.email)) {
            setErrorEmail("Debes ingresar un email de raza canina válido.")
            isValid = false
        }

        if (size(formData.phone) < 10) {
            setErrorPhone("Debes ingresar un teléfono de raza canina válido.")
            isValid = false
        }

        if (isEmpty(formData.description)) {
            setErrorDescription("Debes ingresar una descripción de la raza canina.")
            isValid = false
        }

        if (!locationDog) {
            toastRef.current.show("Debes de localizar la raza canina en el mapa.", 3000)
            isValid = false
        } else if(size(imagesSelected) === 0) {
            toastRef.current.show("Debes de agregar al menos una imagen de la raza canina.", 3000)
            isValid = false
        }

        return isValid
    }

    const clearErrors = () => {
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorName(null)
        setErrorPhone(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageDog
                imageDog={imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                setIsVisibleMap={setIsVisibleMap}
                locationDog={locationDog}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Raza de Perro"
                onPress={addDog}
                buttonStyle={styles.btnAddDog}
            />
            <MapDog
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationDog={setLocationDog}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapDog({ isVisibleMap, setIsVisibleMap, setLocationDog, toastRef }) {
    const [newRegion, setNewRegion] = useState(null)
    useEffect(() => {
        (async() => {
            const response = await getCurrentLocation()
            if (response.status) {
                setNewRegion(response.location)
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationDog(newRegion)
        toastRef.current.show("Localización guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }
        return (
            <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
                <View>
                    {
                        newRegion && (
                            <MapView
                                style={styles.mapStyle}
                                initialRegion={newRegion}
                                showsUserLocation={true}
                                onRegionChange={(region) => setNewRegion(region)}
                            >
                                <MapView.Marker
                                coordinate={{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable
                            />
                            </MapView>
                        )
                    }
                    <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
                </View>

            </Modal>
        )
}

function ImageDog({ imageDog }) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{ width: widthScreen, height: 200}}
                source={
                    imageDog
                        ? { uri: imageDog}
                        : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage({toastRef,imagesSelected,setImagesSelected}) {
    const imageSelect = async() => {
        const response = await loadImageFromGallery([4, 3])
        if (!response.status) {
            toastRef.current.show("No has seleccionado ninguna imagen.", 3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel"                    
                },
                {
                    text: "Sí",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <ScrollView
            horizontal
            style={styles.viewImages}
        >
            {   
                size(imagesSelected) < 10 && (
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    />
                )
            }     
            {
                map(imagesSelected, (imageDog, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: imageDog }}
                        onPress={() => removeImage(imageDog)}
                    />
                ))
            }     
        </ScrollView>
    )
}

function FormAdd({
    formData, 
    setFormData, 
    errorName, 
    errorDescription, 
    errorEmail, 
    errorAddress, 
    errorPhone,
    setIsVisibleMap,
    locationDog
}) {
    const [country, setCountry] = useState("AR")
    const [callingCode, setCallingCode] = useState("54")
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre de la raza de perro..."
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder="Dirección..."
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationDog ? "#a42424" : "#747474",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                keyboardType="email-address"
                placeholder="Email..."
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        setFormData({ 
                            ...formData, 
                            "country": country.cca2, 
                            "callingCode": country.callingCode[0]
                        })
                    }}
                            
                />
                <Input
                    placeholder="WhatsApp..."
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                />
            </View>
            <Input
                placeholder="Descripción de la raza..."
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={errorDescription}
            />
        </View>
    )


 }

 const defaultFormValues = () => {
    return {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        country: "AR",
        callingCode: "54"
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%"
    },
    viewForm: {
        marginHorizontal: 10,
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    inputPhone: {
        width: "80%"
    },
    btnAddDog: {
        margin: 20,
        backgroundColor: "#a42424"
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 79,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#c27c5d"
    },
    viewMapBtnSave: {
        backgroundColor: "#a42424"
    }
})