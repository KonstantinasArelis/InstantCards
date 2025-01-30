import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default GrayedOutOverlay;