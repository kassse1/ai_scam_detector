import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";
import type { AnalyzeResult } from "../types/api";

type Props = {
  history: AnalyzeResult[];
  onRefresh: () => void;
};

const getRiskColor = (risk: string) => {
  if (risk === "HIGH") return "#ef4444";
  if (risk === "MEDIUM") return "#f59e0b";
  return "#22c55e";
};

const getRiskIcon = (prediction: string, risk: string) => {
  if (prediction === "SAFE") return "shield-checkmark";
  if (risk === "HIGH") return "warning";
  if (risk === "MEDIUM") return "alert-circle";
  return "shield";
};

export function HistoryView({ history, onRefresh }: Props) {
  return (
    <View style={styles.historyScreenPanel}>
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.panelTitle}>History</Text>
          <Text style={styles.panelSubtitle}>
            Recent analyzed messages with risk level, category and keywords.
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyStateCard}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="time-outline" size={28} color="#93c5fd" />
          </View>

          <Text style={styles.emptyStateTitle}>No history yet</Text>
          <Text style={styles.emptyStateText}>
            Analyze your first message to see previous checks here.
          </Text>
        </View>
      ) : (
        history.map((item, index) => {
          const riskColor = getRiskColor(item.risk_level);
          const probability = Math.round(item.scam_probability * 100);
          const isScam = item.scam_prediction === "SCAM";

          return (
            <View key={index} style={styles.historyCardPremium}>
              <View
                style={[
                  styles.historyAccentLine,
                  { backgroundColor: riskColor },
                ]}
              />

              <View style={styles.historyPremiumTop}>
                <View
                  style={[
                    styles.historyIconPremium,
                    { backgroundColor: `${riskColor}22` },
                  ]}
                >
                  <Ionicons
                    name={getRiskIcon(
                      item.scam_prediction,
                      item.risk_level
                    ) as any}
                    size={22}
                    color={riskColor}
                  />
                </View>

                <View style={styles.historyPremiumContent}>
                  <Text style={styles.historyPremiumTitle}>
                    {item.scam_prediction} · {item.risk_level}
                  </Text>

                  <View style={styles.historyMetaRow}>
                    <View
                      style={[
                        styles.historyCategoryBadge,
                        { borderColor: `${riskColor}66` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.historyCategoryBadgeText,
                          { color: riskColor },
                        ]}
                      >
                        {item.scam_category}
                      </Text>
                    </View>

                    <Text style={styles.historyModelText}>
                      {item.model_used === "hybrid_ml_transformer"
                        ? "Hybrid AI"
                        : item.model_used}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.historyPercentBadgePremium,
                    { backgroundColor: riskColor },
                  ]}
                >
                  <Text style={styles.historyPercentText}>{probability}%</Text>
                </View>
              </View>

              <Text style={styles.historyMessagePremium} numberOfLines={3}>
                {item.text}
              </Text>

              <View style={styles.historyScoreRow}>
                <Text style={styles.historyScoreText}>
                  ML: {(item.classical_ml_score * 100).toFixed(0)}%
                </Text>
                <Text style={styles.historyScoreText}>
                  TR: {(item.transformer_score * 100).toFixed(0)}%
                </Text>
                <Text style={styles.historyScoreText}>
                  Hybrid: {(item.hybrid_score * 100).toFixed(0)}%
                </Text>
              </View>

              {isScam && item.important_keywords?.length > 0 && (
                <View style={styles.historyKeywordsPremium}>
                  {item.important_keywords.slice(0, 5).map((word, i) => (
                    <View key={i} style={styles.historyKeywordChip}>
                      <Text style={styles.historyKeywordText}>#{word}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })
      )}
    </View>
  );
}