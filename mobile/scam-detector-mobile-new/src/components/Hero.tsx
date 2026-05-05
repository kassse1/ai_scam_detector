import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/styles";

export function Hero() {
  return (
    <LinearGradient
      colors={["#172554", "#312e81", "#0f172a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroGradient}
    >
      <View style={styles.heroGlowBlue} />
      <View style={styles.heroGlowPurple} />

      <View style={styles.topRow}>
        <View style={styles.logoBoxPremium}>
          <Ionicons name="shield-checkmark" size={42} color="#dbeafe" />
        </View>

        <View style={styles.statusPillPremium}>
          <View style={styles.statusDot} />
          <Text style={styles.statusTextPremium}>AI System Online</Text>
        </View>
      </View>

      <View style={styles.heroIllustration}>
        <View style={styles.orbitCircleLarge} />
        <View style={styles.orbitCircleSmall} />
        <View style={styles.centerAiIcon}>
          <Ionicons name="sparkles" size={34} color="#ffffff" />
        </View>
      </View>

      <Text style={styles.titlePremium}>AI Scam Detector</Text>

      <Text style={styles.subtitlePremium}>
        Hybrid AI system for scam detection, explainability, feedback and
        multilingual analysis.
      </Text>

      <View style={styles.heroStats}>
        <View style={styles.heroStatPremium}>
          <Ionicons name="flash" size={18} color="#93c5fd" />
          <Text style={styles.heroStatValue}>ML</Text>
          <Text style={styles.heroStatLabelPremium}>Fast model</Text>
        </View>

        <View style={styles.heroStatPremium}>
          <Ionicons name="hardware-chip" size={18} color="#c4b5fd" />
          <Text style={styles.heroStatValue}>XLM-R</Text>
          <Text style={styles.heroStatLabelPremium}>Transformer</Text>
        </View>

        <View style={styles.heroStatPremium}>
          <Ionicons name="bulb" size={18} color="#fde68a" />
          <Text style={styles.heroStatValue}>XAI</Text>
          <Text style={styles.heroStatLabelPremium}>Explainable</Text>
        </View>
      </View>
    </LinearGradient>
  );
}