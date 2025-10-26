import React, { useEffect, useState } from 'react';
import Favorites from '../screens/Favorites';
import PaywallModal from '../components/PaywallModal';
import { useUserStore } from '../stores/userStore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function FavoritesGuard() {
  const isPremium = useUserStore((s) => s.isPremium);

  const [showPaywall, setShowPaywall] = useState(false);
  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      if (!isPremium) setShowPaywall(true);
      else setShowPaywall(false);
    }, [isPremium]),
  );

  const handleClose = () => {
    setShowPaywall(false);
    if (!isPremium) {
      navigation.navigate('Home');
    }
  };

  if (isPremium) {
    return <Favorites />;
  }

  if (showPaywall) {
    return <PaywallModal visible={showPaywall} onClose={handleClose} />;
  }

  return null;
}
