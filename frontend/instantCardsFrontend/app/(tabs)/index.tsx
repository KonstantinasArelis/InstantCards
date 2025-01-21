import { View, Text , StyleSheet, ImageBackground, Pressable } from 'react-native'
import { Link} from 'expo-router'

import backround1 from "@/assets/images/backround1.png";

const index = () => {
  return (
    <View style={styles.container}>
        <ImageBackground
        source={backround1}
        resizeMode="cover"
        style={styles.image}
        >
          <Text style={styles.title}>Instant Cards</Text>
          <Link href="/contact" style={{marginHorizontal: 'auto'}} asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Contact us</Text>
            </Pressable>
          </Link>
        </ImageBackground>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginBottom: 120
  },
  link: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    padding: 4,
    textAlign: 'center', 
  },
  button: {
    height: 60,
    borderRadius: 20,
    padding: 6,
    backgroundColor: 'rgba(1, 1, 1, 0.2)',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center', 
  }
})