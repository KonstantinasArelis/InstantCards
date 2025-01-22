import { View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import { flashcardPack, flashcardPack2, flashcardPack3 } from '@/constants/sampleData';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';

const flashcards = () => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? 'black' : 'white';

    const [myData, setMyData] = useState(null);
    const [flashcardPackGUIDList, setFlashcardPackGUIDList] = useState(null);

    const flashcardPackGUIDListJson = 
        [
            {
                "GUID": "4549f3bb-5133-4d6f-aeee-b38c2f9eaf74",
                "name" : "Basic flashcards"
            },
            {
                "GUID": "e089bd7a-629f-498c-b41f-904f85b13993",
                "name": "Math flashcards"
            },
            {
                "GUID": "89a7f486-c847-433d-a094-49f60919111f",
                "name": "Coding flashcards"
            },
        ]

    const storeData = async (key : any, value : any) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            // saving error
        }
    };
    //storeData("flashcardPackGUIDList", flashcardPackGUIDListJson);

    const getFlashcardGUIDList = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem("flashcardPackGUIDList");
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
          // error reading value
        }
    };

    useEffect(() => {
        //storeData("testdata");
        getFlashcardGUIDList().then(list => {
            setFlashcardPackGUIDList(list);
        })
    }, [])

    useEffect(() => {
        console.log('myData: ');
        console.dir(myData);
    }, [myData])


    if (!flashcardPackGUIDList) { 
        return <Text>Loading...</Text>;
    }

    return (
            <View style={styles.container}>
            <FlatList
            data={flashcardPackGUIDListJson}
            renderItem={
                ({item}) => 

                <Link href={{
                    pathname: "/flashcardPlay",
                    params: { item: item.GUID }
                }}
                style={{marginHorizontal: 'auto'}}
                asChild>
                    <Pressable>
                        <Text style={[styles.item, {color: color}]}>{item.name}</Text>
                    </Pressable>
                </Link>
            }
            >
            </FlatList>
        </View>  
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 33,
        height: 44,
    }
})

export default flashcards;