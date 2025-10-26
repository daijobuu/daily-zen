// screens/Favorites.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import zenColors from '../constants/colors';
import { useFavoritesStore } from '../stores/favoritesStore';
import { quotes } from '../constants/quotes';
import { useNavigation } from '@react-navigation/native';

export default function Favorites() {
  const nav = useNavigation<any>();
  const { ids, remove } = useFavoritesStore();
  const [q, setQ] = useState('');

  const data = useMemo(() => {
    const arr = Array.from(ids);
    const items = arr
      .map((id) => {
        const idx = Number(id); // si ton id = index; adapte si hash
        const base = quotes[idx];
        return base ? { ...base, id } : null;
      })
      .filter(Boolean) as { id: string; text: string; author: string }[];
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter(
      (it) =>
        it.text.toLowerCase().includes(s) ||
        it.author.toLowerCase().includes(s),
    );
  }, [ids, q]);

  const rightAction = (id: string) => (
    <TouchableOpacity onPress={() => remove(id)} style={styles.swipeDelete}>
      <Feather name="trash-2" size={18} color="#fff" />
      <Text style={styles.swipeDeleteText}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[zenColors.lavender, zenColors.peach, zenColors.cream]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {data.length > 0 && (
          <TouchableOpacity
            onPress={() => Array.from(ids).forEach(remove)}
            style={styles.clearBtn}
          >
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}

        {data.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="heart" size={28} color={zenColors.deepPurple} />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySub}>
              Tap the heart on any quote to save it here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 18,
              paddingBottom: 20,
              gap: 12,
            }}
            renderItem={({ item }) => (
              <Swipeable renderRightActions={() => rightAction(item.id)}>
                <View style={styles.card}>
                  <Text style={styles.quote}>"{item.text}"</Text>
                  <Text style={styles.author}>— {item.author}</Text>
                </View>
              </Swipeable>
            )}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: zenColors.textDark },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  searchInput: { flex: 1, color: zenColors.textDark, fontSize: 14 },

  clearBtn: {
    alignSelf: 'flex-end',
    marginRight: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearText: {
    color: zenColors.textLight,
    fontSize: 12,
    textDecorationLine: 'underline',
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 14,
    shadowColor: zenColors.deepPurple,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  quote: {
    fontSize: 14,
    color: zenColors.textDark,
    lineHeight: 20,
    marginBottom: 6,
    textAlign: 'center',
  },
  author: { fontSize: 12, color: zenColors.textLight, textAlign: 'center' },

  swipeDelete: {
    width: 88,
    backgroundColor: '#E5484D',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  swipeDeleteText: { color: '#fff', fontSize: 11, marginTop: 4 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: zenColors.textDark },
  emptySub: { fontSize: 13, color: zenColors.textLight },
});
