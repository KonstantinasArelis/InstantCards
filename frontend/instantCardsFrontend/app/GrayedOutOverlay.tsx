import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GrayedOutOverlay = ({visible, handleAddFlashcard}) => {

  if (!visible) {
    return null; // Don't render if not visible
  }

  return (
    <View style={styles.overlay}>
      <TouchableHighlight
      onPress={handleAddFlashcard}
      >
        <View style={styles.container}>
          <AntDesign name="plus" size={70} color="white" />
          <Text style={{color: 'white', fontSize: 20}}>Add flashcard</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',

    bottom: screenHeight * 0.20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    width: screenWidth * 0.7,
    height: screenHeight * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default GrayedOutOverlay;