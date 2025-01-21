import { View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from 'expo-router';

const flashcards = () => {
    const colorScheme = useColorScheme();
    const color = colorScheme === 'light' ? 'black' : 'white';


    return (
            <View style={styles.container}>
            <FlatList
            data={[
                {key: 'first flashcard'},
                {key: 'second flaschard'},
                {key: 'third flashcard'},
            ]}
            renderItem={
                ({item}) => 

                <Link href={{
                    pathname: "/flashcardPlay",
                    params: { name: item.key }
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