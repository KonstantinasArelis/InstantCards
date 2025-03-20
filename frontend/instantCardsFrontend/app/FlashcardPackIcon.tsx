import { Link } from "expo-router";
import { Dimensions, Pressable, TouchableHighlight, View, StyleSheet, Text, useColorScheme } from "react-native";
import {useEffect, useState} from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FlashcardPackIcon = (props) => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? 'black' : 'white';
    const [isNewFlashcardButton, setIsNewFlashcardButton]  = useState(false);

    useEffect(() => {
        props.item.name === "Add new pack" ? setIsNewFlashcardButton(true) : setIsNewFlashcardButton(false);
    }, []);

    if(isNewFlashcardButton !== true){
        return (
            <View style={styles.IconBox}>
                <View style={{alignItems: 'center'}}>
                    <Text style={[styles.item, {color: color}]}>{props.item.name}</Text>
                </View>
                {/*
            <TouchableHighlight
            onPress={() => props.handleDeleteFlashcardPack(props.item.GUID)}
            >
                <Text style={{color: 'white'}}>Delete</Text>
            </TouchableHighlight>
             */}
                <View style={{justifyContent: 'flex-end'}}>
                    <View style={styles.bottomButtonRow}>
                        <Link href={{
                            pathname: "/flashcardPlay",
                            params: { id: props.item.id},
                        }}
                              style={styles.playButton}
                              asChild>
                            <Pressable>
                                <Text style={[styles.item, {color: color}]}>Play</Text>
                            </Pressable>
                        </Link>

                        <Link href={{
                            pathname: "/editFlashcardPack",
                            params: { id: props.item.id},
                        }}
                              style={styles.editButton}
                              asChild>
                            <Pressable>
                                <Text style={[styles.item, {color: color}]}>Edit</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.IconBox}>
                <View style={{alignItems: 'center'}}>
                    <TouchableHighlight onPress={props.handleAddFlashcardPack}>
                        <Text style={[styles.item, {color: color}]}>{props.item.name}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 33,
        height: 44,
    },
    IconBox: {
        width: screenWidth * 0.95,
        height: screenHeight * 0.15,
        borderRadius: screenHeight * 0.01,
        marginTop: screenHeight * 0.01,
        backgroundColor: 'orange',
        justifyContent: 'space-between',
        
    },
    bottomButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    playButton: {
        backgroundColor: 'green'
    },
    editButton: {
        backgroundColor: 'blue'
    }
})

export default FlashcardPackIcon;