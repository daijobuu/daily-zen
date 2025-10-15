import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type TipOption = {
  id: string;
  label: string; // ex: "Petit tip"
  price: string; // ex: "0,99 €"
  caption?: string; // ex: "Un thé au monastère"
};

type Props = {
  visible: boolean;
  onClose: () => void;
  zenColors: { [k: string]: string };
  options?: TipOption[]; // pour surcharger les options si tu veux
  onPressOption?: (id: string) => void; // callback facultatif (affichage seulement)
};

const DEFAULT_OPTIONS: TipOption[] = [
  {
    id: 'tip.small',
    label: 'Petit tip',
    price: '0,99 €',
    caption: 'Un thé au monastère',
  },
  {
    id: 'tip.medium',
    label: 'Tip zen',
    price: '2,99 €',
    caption: 'Un encens de gratitude',
  },
  {
    id: 'tip.large',
    label: 'Grand merci',
    price: '4,99 €',
    caption: 'Une offrande lumineuse',
  },
];

export default function TipForTheMonkDisplay({
  visible,
  onClose,
  zenColors,
  options = DEFAULT_OPTIONS,
  onPressOption,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop} />

      <View
        style={[styles.sheet, { backgroundColor: 'rgba(255,255,255,0.95)' }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: zenColors.textDark }]}>
            Tip for the Monk
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          >
            <Feather name="x" size={22} color={zenColors.textLight} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.subtitle, { color: zenColors.textLight }]}>
          Un petit geste pour soutenir la pratique 🧘‍♂️
        </Text>

        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onPressOption?.(item.id)}
              activeOpacity={0.8}
              style={[
                styles.row,
                {
                  borderColor: zenColors.deepPurple,
                  backgroundColor: 'rgba(255,255,255,0.6)',
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.rowLabel, { color: zenColors.deepPurple }]}
                >
                  {item.label} — {item.price}
                </Text>
                {!!item.caption && (
                  <Text
                    style={[styles.rowCaption, { color: zenColors.textLight }]}
                  >
                    {item.caption}
                  </Text>
                )}
              </View>
              <Feather name="heart" size={20} color={zenColors.deepPurple} />
            </TouchableOpacity>
          )}
        />

        <Text style={[styles.footer, { color: zenColors.textLight }]}>
          Affichage uniquement — aucun paiement n’est effectué.
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: { fontSize: 20, fontWeight: '600' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 14 },
  row: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: { fontSize: 16, fontWeight: '600' },
  rowCaption: { fontSize: 13, marginTop: 2 },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 12 },
});
