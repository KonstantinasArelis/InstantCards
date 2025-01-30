import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const GrayedOutOverlay = ({ children, visible }) => {
  if (!visible) {
    return null; // Don't render if not visible
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {children} 
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent gray
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff', 
    padding: 20,
    borderRadius: 5,
    // Add any other styling you need for your content area
  },
});

export default GrayedOutOverlay;