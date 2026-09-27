import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SAARTHI Information</Text>
      <View style={styles.separator} />
      <Text style={styles.desc}>
        SAARTHI is your verified Indian heritage companion with offline accessibility, AI guidance, and source-grounded historical narratives.
      </Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FAF7F2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B2838',
  },
  desc: {
    fontSize: 14,
    color: '#5A6978',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  separator: {
    marginVertical: 16,
    height: 1,
    width: '80%',
    backgroundColor: '#E5E1D8',
  },
});
