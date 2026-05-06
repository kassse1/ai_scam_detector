import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { styles } from "../styles/styles";

export function Hero() {
  return (
    <LinearGradient
      colors={["#1e1b4b", "#312e81", "#0f172a", "#020617"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.newHero}
    >
      <View style={styles.newHeroGlowBlue} />
      <View style={styles.newHeroGlowPink} />

      <View style={styles.newHeroTop}>
        <View style={styles.newHeroLogo}>
          <Ionicons name="shield-checkmark" size={42} color="#ffffff" />
        </View>

        <View style={styles.newHeroBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.newHeroBadgeText}>AI ONLINE</Text>
        </View>
      </View>

      <View style={styles.newHeroCenter}>
        <LinearGradient
          colors={["#2563eb", "#7c3aed", "#ec4899"]}
          style={styles.newHeroAiCircle}
        >
          <Ionicons name="sparkles" size={38} color="#ffffff" />
        </LinearGradient>
      </View>

      <Text style={styles.newHeroTitle}>AI Scam Detector</Text>

      <Text style={styles.newHeroSubtitle}>
        Hybrid AI system for scam detection, explainability and multilingual
        fraud analysis.
      </Text>

      <View style={styles.newHeroCards}>
        <View style={styles.newHeroCard}>
          <Ionicons name="flash" size={20} color="#60a5fa" />
          <Text style={styles.newHeroCardTitle}>ML</Text>
          <Text style={styles.newHeroCardText}>Fast scan</Text>
        </View>

        <View style={styles.newHeroCard}>
          <Ionicons name="hardware-chip" size={20} color="#c084fc" />
          <Text style={styles.newHeroCardTitle}>XLM-R</Text>
          <Text style={styles.newHeroCardText}>Deep AI</Text>
        </View>

        <View style={styles.newHeroCard}>
          <Ionicons name="bulb" size={20} color="#facc15" />
          <Text style={styles.newHeroCardTitle}>XAI</Text>
          <Text style={styles.newHeroCardText}>Explain</Text>
        </View>
      </View>
    </LinearGradient>
  );
}