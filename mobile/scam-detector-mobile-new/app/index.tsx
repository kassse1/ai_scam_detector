import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const BASE_URL = "http://localhost:8000";

const examples = [
  "Your bank account has been blocked. Verify your password immediately.",
  "Congratulations! You won $5000. Send your card details now.",
  "Срочно подтвердите данные карты, иначе аккаунт будет заблокирован.",
];

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const analyze = async () => {
    if (!text.trim()) {
      setError("Please enter a message first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFeedbackSent("");

      const res = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setResult(data);
      setHistory((prev) => [data, ...prev].slice(0, 3));
    } catch {
      setError("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (label: string) => {
    try {
      await fetch(`${BASE_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          correct_label: label,
        }),
      });

      setFeedbackSent("Feedback saved successfully.");
    } catch {
      setFeedbackSent("Feedback error.");
    }
  };

  const isScam = result?.scam_prediction === "SCAM";
  const probability = result?.scam_probability
    ? Math.round(result.scam_probability * 100)
    : 0;

  const riskColor =
    result?.risk_level === "HIGH"
      ? "#ef4444"
      : result?.risk_level === "MEDIUM"
      ? "#f59e0b"
      : "#22c55e";

  const riskBg =
    result?.risk_level === "HIGH"
      ? "#450a0a"
      : result?.risk_level === "MEDIUM"
      ? "#451a03"
      : "#052e16";

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />

          <View style={styles.logoCircle}>
            <Text style={styles.logo}>🛡️</Text>
          </View>

          <Text style={styles.title}>AI Scam Detector</Text>
          <Text style={styles.subtitle}>
            Hybrid AI system for detecting fraud, phishing and suspicious
            messages.
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatNumber}>ML</Text>
              <Text style={styles.heroStatLabel}>Fast model</Text>
            </View>

            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatNumber}>XLM-R</Text>
              <Text style={styles.heroStatLabel}>Transformer</Text>
            </View>

            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatNumber}>XAI</Text>
              <Text style={styles.heroStatLabel}>Explainable</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Analyze message</Text>
          <Text style={styles.panelSubtitle}>
            Paste a message and the system will estimate scam risk.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Paste suspicious message..."
            placeholderTextColor="#64748b"
            multiline
            value={text}
            onChangeText={setText}
          />

          <View style={styles.examples}>
            <Text style={styles.examplesTitle}>Quick examples</Text>

            {examples.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleChip}
                onPress={() => setText(item)}
              >
                <Text style={styles.exampleText} numberOfLines={1}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.mainButton} onPress={analyze}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.mainButtonText}>Analyze with AI</Text>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.resultPanel, { backgroundColor: riskBg }]}>
            <View style={styles.resultTop}>
              <View>
                <Text style={styles.resultLabel}>Detection result</Text>
                <Text style={styles.resultTitle}>
                  {isScam ? "Scam Detected" : "Safe Message"}
                </Text>
              </View>

              <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                <Text style={styles.riskBadgeText}>{result.risk_level}</Text>
              </View>
            </View>

            <View style={styles.bigScoreCard}>
              <Text style={styles.scoreNumber}>{probability}%</Text>
              <Text style={styles.scoreLabel}>Scam Probability</Text>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${probability}%`,
                      backgroundColor: riskColor,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Prediction</Text>
                <Text style={styles.metricValue}>{result.scam_prediction}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Confidence</Text>
                <Text style={styles.metricValue}>
                  {(result.confidence * 100).toFixed(1)}%
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>AI Text</Text>
                <Text style={styles.metricValue}>{result.ai_prediction}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Model</Text>
                <Text style={styles.metricValue}>{result.model_used}</Text>
              </View>
            </View>

            {result.important_keywords?.length > 0 && (
              <View style={styles.xaiBox}>
                <Text style={styles.xaiTitle}>Explainable AI Keywords</Text>
                <Text style={styles.xaiSubtitle}>
                  Words that had the strongest influence on prediction.
                </Text>

                <View style={styles.keywordWrap}>
                  {result.important_keywords.map((word: string, index: number) => (
                    <View key={index} style={styles.keywordChip}>
                      <Text style={styles.keywordText}>#{word}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackTitle}>Was this prediction correct?</Text>

              <View style={styles.feedbackButtons}>
                <TouchableOpacity
                  style={styles.yesButton}
                  onPress={() => sendFeedback(result.scam_prediction)}
                >
                  <Text style={styles.feedbackButtonText}>👍 Correct</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.noButton}
                  onPress={() =>
                    sendFeedback(
                      result.scam_prediction === "SCAM" ? "SAFE" : "SCAM"
                    )
                  }
                >
                  <Text style={styles.feedbackButtonText}>👎 Wrong</Text>
                </TouchableOpacity>
              </View>

              {feedbackSent ? (
                <Text style={styles.feedbackMessage}>{feedbackSent}</Text>
              ) : null}
            </View>
          </View>
        )}

        {history.length > 0 && (
          <View style={styles.historyPanel}>
            <Text style={styles.panelTitle}>Recent checks</Text>

            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyPrediction}>
                  {item.scam_prediction === "SCAM" ? "🚨 SCAM" : "✅ SAFE"}
                </Text>
                <Text style={styles.historyText} numberOfLines={1}>
                  {item.text}
                </Text>
                <Text style={styles.historyProb}>
                  {Math.round(item.scam_probability * 100)}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020617",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  hero: {
    marginTop: 40,
    padding: 24,
    borderRadius: 32,
    backgroundColor: "#0f172a",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  glowOne: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "#1d4ed8",
    opacity: 0.25,
    right: -60,
    top: -70,
  },

  glowTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: "#7c3aed",
    opacity: 0.18,
    left: -70,
    bottom: -80,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#334155",
  },

  logo: {
    fontSize: 38,
  },

  title: {
    color: "#f8fafc",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 310,
  },

  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },

  heroStatBox: {
    flex: 1,
    backgroundColor: "rgba(30,41,59,0.85)",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },

  heroStatNumber: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "900",
  },

  heroStatLabel: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 4,
  },

  panel: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  panelTitle: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "900",
  },

  panelSubtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
  },

  input: {
    height: 150,
    backgroundColor: "#020617",
    borderRadius: 22,
    padding: 16,
    color: "#f8fafc",
    fontSize: 15,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#334155",
  },

  examples: {
    marginTop: 14,
  },

  examplesTitle: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },

  exampleChip: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },

  exampleText: {
    color: "#cbd5e1",
    fontSize: 13,
  },

  mainButton: {
    marginTop: 16,
    backgroundColor: "#2563eb",
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: "center",
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  error: {
    color: "#f87171",
    marginTop: 10,
    fontWeight: "700",
  },

  resultPanel: {
    marginTop: 20,
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: "#334155",
  },

  resultTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "700",
  },

  resultTitle: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },

  riskBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  riskBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  bigScoreCard: {
    marginTop: 22,
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },

  scoreNumber: {
    color: "#f8fafc",
    fontSize: 46,
    fontWeight: "900",
  },

  scoreLabel: {
    color: "#cbd5e1",
    fontWeight: "700",
    marginBottom: 14,
  },

  progressBackground: {
    height: 14,
    backgroundColor: "#1e293b",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  metricsGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  metricCard: {
    width: "48%",
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.22)",
  },

  metricLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },

  metricValue: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "900",
  },

  xaiBox: {
    marginTop: 16,
    backgroundColor: "rgba(15,23,42,0.75)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },

  xaiTitle: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "900",
  },

  xaiSubtitle: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },

  keywordWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  keywordChip: {
    backgroundColor: "#312e81",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  keywordText: {
    color: "#ddd6fe",
    fontWeight: "800",
    fontSize: 13,
  },

  feedbackBox: {
    marginTop: 16,
  },

  feedbackTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  feedbackButtons: {
    flexDirection: "row",
    gap: 10,
  },

  yesButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  noButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  feedbackButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  feedbackMessage: {
    color: "#bfdbfe",
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },

  historyPanel: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  historyItem: {
    marginTop: 12,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },

  historyPrediction: {
    color: "#f8fafc",
    fontWeight: "900",
    marginBottom: 4,
  },

  historyText: {
    color: "#94a3b8",
    fontSize: 13,
  },

  historyProb: {
    color: "#60a5fa",
    fontWeight: "900",
    marginTop: 6,
  },
});