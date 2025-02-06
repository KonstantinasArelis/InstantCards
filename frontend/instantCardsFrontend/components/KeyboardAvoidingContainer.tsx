import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Platform, ScrollView, StatusBar } from "react-native";
const KeyboardAvoidingContainer = ({children}) => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === 'ios' ? "padding" : 'height'}
            >
                <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                >
                    {children}
                </ScrollView>
                
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainer: {
        padding: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 50 : 50,
    }
})

export default KeyboardAvoidingContainer;