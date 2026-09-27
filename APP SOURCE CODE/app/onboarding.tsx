// SAARTHI — Onboarding Screen & Visitor Preference Setup
// Implements 4-step value proposition carousel + preferences per PRD §10

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../constants/layout';
import { Button } from '../components/common/Button';
import { useUserStore } from '../store/userStore';
import type { InterestCategory, MobilityLevel, AgeGroup } from '../types/user';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const setName = useUserStore((s) => s.setName);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const setInterests = useUserStore((s) => s.setInterests);
  const setMobility = useUserStore((s) => s.setMobility);
  const setAgeGroup = useUserStore((s) => s.setAgeGroup);
  const setTravelTime = useUserStore((s) => s.setTravelTime);
  const setAudioPreference = useUserStore((s) => s.setAudioPreference);

  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [userName, setUserName] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>([
    'Architecture',
    'History',
  ]);
  const [selectedMobility, setSelectedMobility] = useState<MobilityLevel>('full');
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('adult');
  const [selectedTime, setSelectedTime] = useState('1-2 hours');
  const [audioPref, setAudioPref] = useState(true);

  const carouselItems = [
    {
      icon: 'compass-outline' as const,
      title: t('onboarding.screen1Title', "Discover India's Heritage Differently"),
      subtitle: t(
        'onboarding.screen1Subtitle',
        "Your AI-powered companion for understanding India's rich heritage — not just visiting it."
      ),
      accent: Colors.primary,
    },
    {
      icon: 'sparkles-outline' as const,
      title: t('onboarding.screen2Title', "Understand What You're Seeing"),
      subtitle: t(
        'onboarding.screen2Subtitle',
        'Get verified, contextual explanations about every monument, sculpture, and story around you.'
      ),
      accent: Colors.secondary,
    },
    {
      icon: 'language-outline' as const,
      title: t('onboarding.screen3Title', 'Explore in Your Language'),
      subtitle: t(
        'onboarding.screen3Subtitle',
        'Heritage stories in English, Hindi, Marathi, and more — read or listen.'
      ),
      accent: '#2A9D8F',
    },
    {
      icon: 'cloud-download-outline' as const,
      title: t('onboarding.screen4Title', 'Download Before You Go'),
      subtitle: t(
        'onboarding.screen4Subtitle',
        'Download site packs and explore heritage even without internet connectivity.'
      ),
      accent: Colors.accent,
    },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  const interestOptions: InterestCategory[] = [
    'Architecture',
    'History',
    'Culture',
    'Photography',
    'Religion',
    'Nature',
  ];

  const toggleInterest = (interest: InterestCategory) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinish = () => {
    setName(userName.trim() || 'Heritage Explorer');
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    setInterests(selectedInterests);
    setMobility(selectedMobility);
    setAgeGroup(selectedAge);
    setTravelTime(selectedTime);
    setAudioPreference(audioPref);
    completeOnboarding();
    router.replace('/(tabs)');
  };

  // Render carousel pages (Steps 0-3)
  if (step < 4) {
    const item = carouselItems[step];

    return (
      <View style={styles.container}>
        {/* Top Header Row with Logo & Skip */}
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.brandLogo}
              resizeMode="cover"
            />
            <Text style={styles.brandTitle}>SAARTHI</Text>
          </View>
          <TouchableOpacity
            onPress={() => setStep(4)}
            accessibilityRole="button"
            accessibilityLabel="Skip intro"
          >
            <Text style={styles.skipText}>{t('common.skip', 'Skip')}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Illustration */}
        <View style={styles.carouselBody}>
          <View
            style={[styles.iconCircle, { backgroundColor: `${item.accent}18` }]}
          >
            <Ionicons name={item.icon} size={64} color={item.accent} />
          </View>

          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
        </View>

        {/* Carousel indicators & Next button */}
        <View style={styles.carouselFooter}>
          <View style={styles.indicatorRow}>
            {carouselItems.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === step ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          <Button
            title={step === 3 ? t('onboarding.getStarted', 'GET STARTED') : t('common.next', 'Next')}
            onPress={() => setStep((step + 1) as any)}
            size="lg"
            style={styles.actionBtn}
          />
        </View>
      </View>
    );
  }

  // Step 4: Preference Setup Form
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.formContent}>
      <Text style={styles.formTitle}>Tailor Your Sarthi Experience</Text>
      <Text style={styles.formSubtitle}>
        Help us personalize recommendations, walking routes, and stories for you.
      </Text>

      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('onboarding.nameLabel', 'What should we call you?')}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={t('onboarding.namePlaceholder', 'Enter your name')}
          placeholderTextColor={Colors.textTertiary}
          value={userName}
          onChangeText={setUserName}
        />
      </View>

      {/* Language Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('onboarding.languageLabel', 'Preferred Language')}</Text>
        <View style={styles.chipRow}>
          {languages.map((l) => {
            const isSelected = selectedLang === l.code;
            return (
              <TouchableOpacity
                key={l.code}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedLang(l.code)}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextSelected]}
                >
                  {l.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Interests */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('onboarding.interestsLabel', 'What interests you?')}</Text>
        <View style={styles.chipGrid}>
          {interestOptions.map((item) => {
            const isSelected = selectedInterests.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => toggleInterest(item)}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextSelected]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Mobility */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('onboarding.mobilityLabel', 'Mobility Preferences')}</Text>
        <View style={styles.chipGrid}>
          {[
            { id: 'full' as const, label: 'Full Mobility' },
            { id: 'wheelchair' as const, label: 'Wheelchair / Step-Free' },
            { id: 'assisted' as const, label: 'Senior / Easy Pace' },
          ].map((m) => {
            const isSelected = selectedMobility === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedMobility(m.id)}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextSelected]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Finish CTA */}
      <Button
        title={t('onboarding.letsExplore', "LET'S EXPLORE")}
        onPress={handleFinish}
        size="lg"
        style={styles.finishBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(196, 150, 60, 0.3)',
  },
  brandTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  skipText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
  },
  carouselBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  carouselTitle: {
    fontSize: Typography.scale.h1,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  carouselSubtitle: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  carouselFooter: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.border,
  },
  actionBtn: {
    width: '100%',
  },
  formContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  formTitle: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.sans,
    color: Colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.scale.caption + 1,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  chipTextSelected: {
    color: Colors.white,
    fontFamily: Typography.fonts.sansBold,
  },
  finishBtn: {
    marginTop: Spacing.md,
  },
});
