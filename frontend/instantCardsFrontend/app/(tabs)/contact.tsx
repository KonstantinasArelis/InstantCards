import { View, Text , StyleSheet } from 'react-native'

const contact = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Contact Instant Cards</Text>
    </View>
  )
}

export default contact

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center', 
  }
})