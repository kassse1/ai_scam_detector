import { View, Text, TouchableOpacity } from "react-native";
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

export function HistoryView({ history, onRefresh }: Props) {
  return (
    <View style={styles.historyScreenPanel}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.panelTitle}>Recent Checks</Text>
          <Text style={styles.panelSubtitle}>
            Last analyzed messages from backend history.
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <Text style={styles.emptyText}>No history yet. Analyze a message first.</Text>
      ) : (
        history.map((item, index) => {
          const itemRiskColor = getRiskColor(item.risk_level);
          const itemProb = Math.round(item.scam_probability * 100);

          return (
            <View key={index} style={styles.historyLargeItem}>
              <View style={styles.historyLargeTop}>
                <View style={styles.historyIcon}>
                  <Text>{item.scam_prediction === "SCAM" ? "🚨" : "✅"}</Text>
                </View>

                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>
                    {item.scam_prediction} · {item.risk_level}
                  </Text>
                  <Text style={styles.historyCategory}>
                    Category: {item.scam_category}
                  </Text>
                </View>

                <View
                  style={[
                    styles.historyPercentBadge,
                    { backgroundColor: itemRiskColor },
                  ]}
                >
                  <Text style={styles.historyPercentText}>{itemProb}%</Text>
                </View>
              </View>

              <Text style={styles.historyMessage} numberOfLines={3}>
                {item.text}
              </Text>

              {item.important_keywords?.length > 0 && (
                <View style={styles.historyKeywords}>
                  {item.important_keywords.slice(0, 4).map((word, i) => (
                    <Text key={i} style={styles.historyKeyword}>
                      #{word}
                    </Text>
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