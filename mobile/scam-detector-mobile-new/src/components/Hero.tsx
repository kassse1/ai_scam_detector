import { View, Text } from "react-native";
import { styles } from "../styles/styles";

export function Hero() {
  return (
    <View style={styles.hero}>
      <View style={styles.glowBlue} />
      <View style={styles.glowPurple} />

      <View style={styles.topRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🛡️</Text>
        </View>

        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>AI System</Text>
        </View>
      </View>

      <Text style={styles.title}>AI Scam Detector</Text>
      <Text style={styles.subtitle}>
        Hybrid AI system for scam detection, explainability, feedback and
        multilingual analysis.
      </Text>

      <View style={styles.heroStats}>
        <View style={styles.heroStat}>
          <Text style={styles.heroStatValue}>ML</Text>
          <Text style={styles.heroStatLabel}>Fast model</Text>
        </View>
        <View style={styles.heroStat}>
          <Text style={styles.heroStatValue}>XLM-R</Text>
          <Text style={styles.heroStatLabel}>Transformer</Text>
        </View>
        <View style={styles.heroStat}>
          <Text style={styles.heroStatValue}>XAI</Text>
          <Text style={styles.heroStatLabel}>Explainable</Text>
        </View>
      </View>
    </View>
  );
}