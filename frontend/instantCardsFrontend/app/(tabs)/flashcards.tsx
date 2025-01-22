import { View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import { flashcardPack, flashcardPack2, flashcardPack3 } from '@/constants/sampleData';

const flashcards = () => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? 'black' : 'white';


    return (
            <View style={styles.container}>
            <FlatList
            data={[
                {key: flashcardPack.GUID},
                {key: flashcardPack2.GUID},
                {key: flashcardPack3.GUID},
            ]}
            renderItem={
                ({item}) => 

                <Link href={{
                    pathname: "/flashcardPlay",
                    params: { item: item.key }
                }}
                style={{marginHorizontal: 'auto'}}
                asChild>
                    <Pressable>
                        <Text style={[styles.item, {color: color}]}>{item.key}</Text>
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