import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View ,FlatList,TouchableOpacity,ActivityIndicator} from 'react-native'
import { Card,Rating,  Icon,  Image } from 'react-native-elements'

export default function ListTopDogs({dogs,navigation}) {
    console.log(dogs)
    return (
        <FlatList 
            data={dogs} 
            keyExtractor={(item,index)=>index.toString()}
            renderItem={(dog)=>(
                <Dog dog={dog} navigation={navigation}/>
            )}
        />
    )
}

function Dog({dog,navigation}){
    const{name,rating,images,id,description}=dog.item
    const [iconColor, setIconColor] = useState("#000")

    useEffect(() => {
        if(dog.index === 0){
            setIconColor("#efb819")
        } else if (dog.index === 1){
            setIconColor("#e3e4e5")
        } else if (dog.index === 2){
            setIconColor("#cd7f32")
        }
    }, [])
    return (
        <TouchableOpacity
            onPress={()=>navigation.navigate("dogs",{
                screen:"dog",
                params:{id,name}
            })}
        >
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                    />
                <Image
                    style={styles.dogImage}
                    resizeMode="cover"
                    PlaceholderContent={<ActivityIndicator size="large" color="#FFF"/>}
                    source={{uri:images[0]}}
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating
                        imageSize={20}
                        startingValue={rating}
                        readonly
                    />
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerStyle:{
        marginBottom:30,
        borderWidth:0
    },
    containerIcon:{
        position:"absolute",
        top:-30,
        left:-30,
        zIndex:1
    },
    dogImage:{
        width:"100%",
        height:200
    },
    title:{
        fontSize:20,
        fontWeight:"bold"
    },
    description:{
        color:"grey",
        marginTop:0,
        textAlign:"justify"
    },
    titleRating:{
        flexDirection:"row",
        marginVertical:10,
        justifyContent:"space-between"
    }
})