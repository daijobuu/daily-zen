import React, { useMemo, useRef } from 'react';
import { TouchableOpacity, Animated, Easing, ViewStyle } from 'react-native';
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import zenColors from '../constants/colors';

type Props = {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
  style?: ViewStyle;
};

export default function HeartToggle({
  isFavorite,
  onToggle,
  size = 24,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const tint = useMemo(
    () => (isFavorite ? zenColors.deepPurple : zenColors.textLight),
    [isFavorite],
  );

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.15,
        duration: 110,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Heart
          size={size}
          color={tint}
          strokeWidth={1.6}
          fill={isFavorite ? tint : 'transparent'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
