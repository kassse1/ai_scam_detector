import { useEffect, useState } from "react";
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
  "Your bank account is blocked. Verify your password now.",
  "Congratulations! You won $5000. Send your card details.",
  "Срочно подтвердите данные карты, иначе аккаунт будет заблокирован.",
  "Сіздің картаңыз бұғатталды. Қазір құпиясөзді растаңыз.",
];

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState("");
  const [error, setError] = useState("");

  const loadStatsAndHistory = async () => {
    try {
      const statsRes = await fetch(`${BASE_URL}/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      const historyRes = await fetch(`${BASE_URL}/history`);
      const historyData = await historyRes.json();
      setHistory(historyData.history || []);
    } catch {
      // backend may be offline before first analyze
    }
  };

  useEffect(() => {
    loadStatsAndHistory();
  }, []);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setResult(data);
      await loadStatsAndHistory();
    } catch {
      setError("Cannot connect to backend. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (label: string) => {
    try {
      await fetch(`${BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      ? "#451111"
      : result?.risk_level === "MEDIUM"
      ? "#422006"
      : "#052e16";

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.glowBlue} />
          <View style={styles.glowPurple} />

          <View style={styles.topRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logo}>🛡️</Text>
            </View>

            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>API Connected</Text>
            </View>
          </View>

          <Text style={styles.title}>AI Scam Detector</Text>
          <Text style={styles.subtitle}>
            Hybrid AI mobile system for scam detection, explainable prediction,
            multilingual testing and adaptive feedback.
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>ML</Text>
              <Text style={styles.heroStatLabel}>Fast</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>XLM-R</Text>
              <Text style={styles.heroStatLabel}>Deep</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>XAI</Text>
              <Text style={styles.heroStatLabel}>Explain</Text>
            </View>
          </View>
        </View>

        {stats && (
          <View style={styles.statsPanel}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>System Dashboard</Text>
              <Text style={styles.sectionBadge}>LIVE</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.total_checks}</Text>
                <Text style={styles.statLabel}>Total checks</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.scam_count}</Text>
                <Text style={styles.statLabel}>Scam</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.safe_count}</Text>
                <Text style={styles.statLabel}>Safe</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.high_risk_count}</Text>
                <Text style={styles.statLabel}>High risk</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.inputPanel}>
          <Text style={styles.panelTitle}>Analyze message</Text>
          <Text style={styles.panelSubtitle}>
            Paste a suspicious message or use a quick example.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Paste suspicious message here..."
            placeholderTextColor="#64748b"
            multiline
            value={text}
            onChangeText={setText}
          />

          <Text style={styles.quickTitle}>Quick examples</Text>

          <View style={styles.examplesWrap}>
            {examples.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleCard}
                onPress={() => setText(item)}
              >
                <Text style={styles.exampleText} numberOfLines={2}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.analyzeButton} onPress={analyze}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.resultPanel, { backgroundColor: riskBg }]}>
            <View style={styles.resultTop}>
              <View>
                <Text style={styles.resultSmallText}>Detection result</Text>
                <Text style={styles.resultTitle}>
                  {isScam ? "Scam Detected" : "Safe Message"}
                </Text>
              </View>

              <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                <Text style={styles.riskBadgeText}>{result.risk_level}</Text>
              </View>
            </View>

            <View style={styles.scoreCard}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{probability}%</Text>
                <Text style={styles.scoreCaption}>Risk</Text>
              </View>

              <View style={styles.scoreInfo}>
                <Text style={styles.scoreTitle}>Scam probability</Text>
                <View style={styles.progressTrack}>
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
                <Text style={styles.scoreDescription}>
                  Model confidence: {(result.confidence * 100).toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Prediction</Text>
                <Text style={styles.metricValue}>{result.scam_prediction}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Category</Text>
                <Text style={styles.metricValue}>{result.scam_category}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>AI Text</Text>
                <Text style={styles.metricValue}>{result.ai_prediction}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Model used</Text>
                <Text style={styles.metricValue}>{result.model_used}</Text>
              </View>
            </View>

            {result.important_keywords?.length > 0 && (
              <View style={styles.xaiPanel}>
                <Text style={styles.xaiTitle}>Explainable AI</Text>
                <Text style={styles.xaiSubtitle}>
                  Important words used by the system during prediction.
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

            <View style={styles.feedbackPanel}>
              <Text style={styles.feedbackTitle}>Was the prediction correct?</Text>

              <View style={styles.feedbackButtons}>
                <TouchableOpacity
                  style={styles.correctButton}
                  onPress={() => sendFeedback(result.scam_prediction)}
                >
                  <Text style={styles.feedbackButtonText}>👍 Correct</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.wrongButton}
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Checks</Text>
              <Text style={styles.historyCount}>{history.length}</Text>
            </View>

            {history.slice(0, 6).map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Text>
                    {item.scam_prediction === "SCAM" ? "🚨" : "✅"}
                  </Text>
                </View>

                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>
                    {item.scam_prediction} · {item.risk_level}
                  </Text>
                  <Text style={styles.historyText} numberOfLines={1}>
                    {item.text}
                  </Text>
                </View>

                <Text style={styles.historyPercent}>
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
    paddingBottom: 44,
  },

  hero: {
    marginTop: 36,
    padding: 24,
    borderRadius: 34,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    overflow: "hidden",
  },

  glowBlue: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: "#2563eb",
    opacity: 0.22,
    right: -70,
    top: -80,
  },

  glowPurple: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "#7c3aed",
    opacity: 0.18,
    left: -70,
    bottom: -70,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(30,41,59,0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },

  logo: {
    fontSize: 38,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(22,163,74,0.16)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.35)",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 7,
  },

  statusText: {
    color: "#bbf7d0",
    fontSize: 12,
    fontWeight: "800",
  },

  title: {
    color: "#f8fafc",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 22,
    letterSpacing: -0.8,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },

  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },

  heroStat: {
    flex: 1,
    backgroundColor: "rgba(30,41,59,0.72)",
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },

  heroStatValue: {
    color: "#f8fafc",
    fontWeight: "900",
    fontSize: 17,
  },

  heroStatLabel: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 12,
  },

  statsPanel: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "900",
  },

  sectionBadge: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "900",
    backgroundColor: "rgba(37,99,235,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statsGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },

  statNumber: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "900",
  },

  statLabel: {
    color: "#94a3b8",
    marginTop: 5,
    fontSize: 13,
    fontWeight: "700",
  },

  inputPanel: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  panelTitle: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "900",
  },

  panelSubtitle: {
    color: "#94a3b8",
    marginTop: 6,
    marginBottom: 16,
    fontSize: 14,
  },

  input: {
    minHeight: 150,
    backgroundColor: "#020617",
    borderRadius: 24,
    padding: 16,
    color: "#f8fafc",
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 15,
    textAlignVertical: "top",
  },

  quickTitle: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 10,
  },

  examplesWrap: {
    gap: 8,
  },

  exampleCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },

  exampleText: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
  },

  analyzeButton: {
    marginTop: 18,
    backgroundColor: "#2563eb",
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: "center",
  },

  analyzeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  errorText: {
    marginTop: 12,
    color: "#fca5a5",
    fontWeight: "800",
  },

  resultPanel: {
    marginTop: 20,
    borderRadius: 34,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },

  resultTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultSmallText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "800",
  },

  resultTitle: {
    color: "#f8fafc",
    fontSize: 29,
    fontWeight: "900",
    marginTop: 4,
  },

  riskBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  riskBadgeText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },

  scoreCard: {
    marginTop: 22,
    flexDirection: "row",
    gap: 16,
    backgroundColor: "rgba(15,23,42,0.74)",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    alignItems: "center",
  },

  scoreCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#020617",
    borderWidth: 8,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  scoreValue: {
    color: "#f8fafc",
    fontSize: 25,
    fontWeight: "900",
  },

  scoreCaption: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
  },

  scoreInfo: {
    flex: 1,
  },

  scoreTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },

  progressTrack: {
    height: 13,
    backgroundColor: "#1e293b",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  scoreDescription: {
    color: "#cbd5e1",
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
  },

  metricsGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  metricCard: {
    width: "48%",
    backgroundColor: "rgba(15,23,42,0.74)",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.22)",
  },

  metricLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "700",
  },

  metricValue: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "900",
  },

  xaiPanel: {
    marginTop: 16,
    backgroundColor: "rgba(15,23,42,0.78)",
    borderRadius: 24,
    padding: 17,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },

  xaiTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "900",
  },

  xaiSubtitle: {
    color: "#94a3b8",
    marginTop: 5,
    marginBottom: 13,
    fontSize: 13,
    lineHeight: 18,
  },

  keywordWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  keywordChip: {
    backgroundColor: "#312e81",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  keywordText: {
    color: "#ddd6fe",
    fontSize: 13,
    fontWeight: "900",
  },

  feedbackPanel: {
    marginTop: 17,
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

  correctButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  wrongButton: {
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
    marginTop: 12,
    textAlign: "center",
    color: "#bfdbfe",
    fontWeight: "800",
  },

  historyPanel: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  historyCount: {
    color: "#93c5fd",
    backgroundColor: "rgba(37,99,235,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontWeight: "900",
  },

  historyItem: {
    marginTop: 12,
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },

  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  historyContent: {
    flex: 1,
  },

  historyTitle: {
    color: "#f8fafc",
    fontWeight: "900",
    fontSize: 13,
  },

  historyText: {
    color: "#94a3b8",
    marginTop: 3,
    fontSize: 12,
  },

  historyPercent: {
    color: "#60a5fa",
    fontWeight: "900",
    marginLeft: 10,
  },
});