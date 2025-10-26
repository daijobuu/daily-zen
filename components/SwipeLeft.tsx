import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import zenColors from '../constants/colors';

export default function SwipeLeft() {
  return (
    <View style={styles.container}>
      <Feather name="chevron-left" size={18} color={zenColors.textLight} />
      <Text style={styles.text}>Swipe left to see your favorites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  text: {
    color: zenColors.textLight,
    fontSize: 13,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
});
