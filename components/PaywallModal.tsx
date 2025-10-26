import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Crown, Heart, Sparkles, Star, X } from 'lucide-react-native';
import zenColors from '../constants/colors';
import { useUserStore } from '../stores/userStore';
import { useActions } from '../stores/actionsStore';
import { useUIStore } from '../stores/uiStore';

type PriceInfo = {
  monthlyLabel?: string; // e.g. "$0.99/month"
  lifetimeLabel?: string; // e.g. "$4.99 lifetime"
};

interface PaywallUltraProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseMonthly?: () => Promise<void> | void;
  onPurchaseLifetime?: () => Promise<void> | void;
  onRestore?: () => Promise<void> | void;
  prices?: PriceInfo;
}

export default function PaywallModal({
  visible,
  onClose,
  onPurchaseMonthly,
  onPurchaseLifetime,
  onRestore,
  prices,
}: PaywallUltraProps) {
  const [plan, setPlan] = useState<'monthly' | 'lifetime'>('lifetime');

  const scale = useRef(new Animated.Value(1)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  const setPremium = useUserStore((s) => s.setPremium);
  const onUpgrade = useActions((s) => s.onUpgrade);
  const close = useUIStore((s) => s.closePaywall);

  const handleUpgrade = () => {
    setPremium(true); // plus tard: RevenueCat logic
    onUpgrade(); // ajoute la quote si en attente
    close(); // ferme la modale visuellement
  };

  useEffect(() => {
    if (!visible) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -6,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [visible, scale, floatY]);

  const handlePrimary = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (plan === 'monthly') await onPurchaseMonthly?.();
      else await onPurchaseLifetime?.();
    } catch (_) {}
  };

  const ctaLabel = useMemo(() => {
    if (plan === 'monthly') return prices?.monthlyLabel ?? '$0.99 / month';
    return prices?.lifetimeLabel ?? '$4.99 lifetime';
  }, [plan, prices]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.shell} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={[zenColors.lavender, zenColors.peach]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <BlurView intensity={40} tint="light" style={styles.card}>
              <TouchableOpacity
                style={styles.close}
                onPress={onClose}
                hitSlop={12}
              >
                <X size={22} color={zenColors.textDark} />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                bounces
              >
                <Animated.View
                  style={[
                    styles.heroIcon,
                    { transform: [{ scale }, { translateY: floatY }] },
                  ]}
                >
                  <Crown
                    size={64}
                    color={zenColors.deepPurple}
                    strokeWidth={1.5}
                  />
                </Animated.View>
                <Text style={styles.title}>Unlock Premium</Text>
                <Text style={styles.subtitle}>
                  Save your favorite quotes. Enjoy peace without limits.
                </Text>

                <View style={styles.badgesRow}>
                  <Badge
                    icon={<Heart size={16} color={zenColors.deepPurple} />}
                    label="Unlimited favorites"
                  />
                  <Badge
                    icon={<Sparkles size={16} color={zenColors.deepPurple} />}
                    label="Share it to your crush"
                  />
                  <Badge
                    icon={<Star size={16} color={zenColors.deepPurple} />}
                    label="Build your own wall of quotes"
                  />
                </View>

                {/*<View style={styles.features}>
                  <FeatureRow
                    title="Lifetime backup"
                    desc="Keep your quotes forever, even after reinstall."
                  />
                  <FeatureRow
                    title="Customize notifications"
                    desc="Choose when you want to be notified."
                  />
                  <FeatureRow
                    title="No ads"
                    desc="No noise. Just mindfulness and you."
                  />
                </View>*/}

                <View style={styles.planSwitcher}>
                  <Segment
                    active={plan === 'monthly'}
                    onPress={() => setPlan('monthly')}
                    title="Monthly"
                    caption={prices?.monthlyLabel ?? '$0.99/month'}
                  />
                  <Segment
                    active={plan === 'lifetime'}
                    onPress={() => setPlan('lifetime')}
                    title="Lifetime"
                    caption={prices?.lifetimeLabel ?? '$4.99'}
                  />
                </View>

                <TouchableOpacity
                  style={styles.cta}
                  activeOpacity={0.9}
                  onPress={handleUpgrade}
                >
                  <LinearGradient
                    colors={[zenColors.deepPurple, zenColors.lavender]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaText}>Continue • {ctaLabel}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restore} onPress={onRestore}>
                  <Text style={styles.restoreText}>Restore purchases</Text>
                </TouchableOpacity>

                <Text style={styles.legal}>
                  By continuing, you agree to our{' '}
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL('https://example.com/terms')}
                  >
                    Terms
                  </Text>{' '}
                  and{' '}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL('https://example.com/privacy')
                    }
                  >
                    Privacy Policy
                  </Text>
                  .
                </Text>

                <Text style={styles.footerNote}>
                  You can still read the daily quote for free. But admit it,
                  that heart button is calling your name.
                </Text>
              </ScrollView>
            </BlurView>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.badge}>
      {icon}
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureDot} />
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function Segment({
  active,
  onPress,
  title,
  caption,
}: {
  active: boolean;
  onPress: () => void;
  title: string;
  caption: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.segment, active && styles.segmentActive]}
    >
      <Text style={[styles.segmentTitle, active && styles.segmentTitleActive]}>
        {title}
      </Text>
      <Text
        style={[styles.segmentCaption, active && styles.segmentCaptionActive]}
      >
        {caption}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  shell: { width: '100%', maxWidth: 520, borderRadius: 28, overflow: 'hidden' },
  cardGradient: { borderRadius: 28, overflow: 'hidden' },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 8,
    borderRadius: 999,
  },
  content: { paddingTop: 20, paddingBottom: 8 },
  heroIcon: { alignSelf: 'center', marginBottom: 14 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: zenColors.textDark,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: zenColors.textLight,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },

  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  badgeText: { fontSize: 12, color: zenColors.textDark, fontWeight: '600' },

  features: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 16,
  },
  featureRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: zenColors.deepPurple,
    opacity: 0.9,
    marginTop: 7,
  },
  featureTitle: { fontSize: 15, fontWeight: '600', color: zenColors.textDark },
  featureDesc: { fontSize: 13, color: zenColors.textLight, marginTop: 2 },

  planSwitcher: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  segment: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  segmentActive: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: zenColors.deepPurple,
  },
  segmentTitle: { fontSize: 14, color: zenColors.textLight, fontWeight: '600' },
  segmentTitleActive: { color: zenColors.textDark },
  segmentCaption: { fontSize: 12, color: zenColors.textLight, marginTop: 2 },
  segmentCaptionActive: { color: zenColors.deepPurple, fontWeight: '700' },

  cta: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  ctaGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  restore: { alignSelf: 'center', paddingVertical: 10 },
  restoreText: { fontSize: 14, color: zenColors.deepPurple, fontWeight: '600' },

  legal: {
    fontSize: 11,
    color: zenColors.textLight,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 6,
  },
  link: { color: zenColors.deepPurple, textDecorationLine: 'underline' },

  footerNote: {
    fontSize: 12,
    color: zenColors.textLight,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9,
  },
});
