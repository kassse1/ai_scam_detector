import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";
import type { ModelInfo, Stats } from "../types/api";

type Props = {
  stats: Stats | null;
  modelInfo: ModelInfo | null;
  refreshing: boolean;
  onRefresh: () => void;
};

const getCategoryIcon = (category: string) => {
  if (category.includes("phishing")) return "fish";
  if (category.includes("financial")) return "card";
  if (category.includes("lottery")) return "gift";
  if (category.includes("social")) return "people";
  if (category.includes("support")) return "headset";
  if (category.includes("safe")) return "shield-checkmark";
  return "alert-circle";
};

const getCategoryColor = (category: string) => {
  if (category.includes("safe")) return "#22c55e";
  if (category.includes("phishing")) return "#ef4444";
  if (category.includes("financial")) return "#f97316";
  if (category.includes("lottery")) return "#f59e0b";
  if (category.includes("social")) return "#8b5cf6";
  return "#60a5fa";
};

export function DashboardView({
  stats,
  modelInfo,
  refreshing,
  onRefresh,
}: Props) {
  const categories = stats?.categories || {};
  const topKeywords = stats?.top_keywords || [];

  const total = stats?.total_checks || 0;
  const scam = stats?.scam_count || 0;
  const safe = stats?.safe_count || 0;
  const highRisk = stats?.high_risk_count || 0;

  const categoryEntries = Object.entries(categories);
  const maxCategoryCount =
    categoryEntries.length > 0
      ? Math.max(...categoryEntries.map(([, count]) => Number(count)))
      : 1;

  return (
    <>
      <View style={styles.dashboardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.panelTitle}>AI Dashboard</Text>
          <Text style={styles.panelSubtitle}>
            Statistics, categories, keywords and loaded model information.
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          {refreshing ? (
            <ActivityIndicator color="#bfdbfe" />
          ) : (
            <Text style={styles.refreshText}>Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.bigStatCard}>
          <View style={styles.statIconBlue}>
            <Ionicons name="analytics" size={20} color="#bfdbfe" />
          </View>
          <Text style={styles.bigStatNumber}>{total}</Text>
          <Text style={styles.bigStatLabel}>Total checks</Text>
        </View>

        <View style={styles.bigStatCard}>
          <View style={styles.statIconRed}>
            <Ionicons name="warning" size={20} color="#fecaca" />
          </View>
          <Text style={styles.bigStatNumber}>{scam}</Text>
          <Text style={styles.bigStatLabel}>Scam detected</Text>
        </View>

        <View style={styles.bigStatCard}>
          <View style={styles.statIconGreen}>
            <Ionicons name="shield-checkmark" size={20} color="#bbf7d0" />
          </View>
          <Text style={styles.bigStatNumber}>{safe}</Text>
          <Text style={styles.bigStatLabel}>Safe messages</Text>
        </View>

        <View style={styles.bigStatCard}>
          <View style={styles.statIconPurple}>
            <Ionicons name="flame" size={20} color="#ddd6fe" />
          </View>
          <Text style={styles.bigStatNumber}>{highRisk}</Text>
          <Text style={styles.bigStatLabel}>High risk</Text>
        </View>
      </View>

      <View style={styles.dashboardPanel}>
        <Text style={styles.sectionTitle}>Scam Categories</Text>

        {categoryEntries.length === 0 ? (
          <Text style={styles.emptyText}>No category data yet.</Text>
        ) : (
          categoryEntries.map(([category, count]) => {
            const numericCount = Number(count);
            const percentage =
              maxCategoryCount > 0
                ? Math.max(8, Math.round((numericCount / maxCategoryCount) * 100))
                : 8;

            const color = getCategoryColor(category);

            return (
              <View key={category} style={styles.categoryBarCard}>
                <View style={styles.categoryBarTop}>
                  <View style={styles.categoryTitleRow}>
                    <View
                      style={[
                        styles.categoryIconBox,
                        { backgroundColor: `${color}22` },
                      ]}
                    >
                      <Ionicons
                        name={getCategoryIcon(category) as any}
                        size={18}
                        color={color}
                      />
                    </View>

                    <View>
                      <Text style={styles.categoryName}>{category}</Text>
                      <Text style={styles.categoryHint}>Detected category</Text>
                    </View>
                  </View>

                  <Text style={styles.categoryNumber}>{numericCount}</Text>
                </View>

                <View style={styles.categoryTrack}>
                  <View
                    style={[
                      styles.categoryFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.dashboardPanel}>
        <Text style={styles.sectionTitle}>Top Keywords</Text>

        {topKeywords.length === 0 ? (
          <Text style={styles.emptyText}>No keywords yet.</Text>
        ) : (
          <View style={styles.keywordWrap}>
            {topKeywords.map((item, index) => (
              <View key={index} style={styles.keywordChip}>
                <Text style={styles.keywordText}>
                  #{item[0]} · {item[1]}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {modelInfo && (
        <View style={styles.dashboardPanel}>
          <Text style={styles.sectionTitle}>AI Model Information</Text>

          <View style={styles.modelInfoCardPremium}>
            <View style={styles.modelIconBlue}>
              <Ionicons name="flash" size={20} color="#bfdbfe" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modelInfoLabel}>Classical Model</Text>
              <Text style={styles.modelInfoValue}>
                {modelInfo.classical_model}
              </Text>
            </View>
          </View>

          <View style={styles.modelInfoCardPremium}>
            <View style={styles.modelIconPurple}>
              <Ionicons name="hardware-chip" size={20} color="#ddd6fe" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modelInfoLabel}>Transformer Model</Text>
              <Text style={styles.modelInfoValue}>
                {modelInfo.transformer_model}
              </Text>
            </View>
          </View>

          <View style={styles.modelInfoCardPremium}>
            <View style={styles.modelIconGreen}>
              <Ionicons name="scan" size={20} color="#bbf7d0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modelInfoLabel}>AI Text Detector</Text>
              <Text style={styles.modelInfoValue}>{modelInfo.ai_detector}</Text>
            </View>
          </View>

          <View style={styles.formulaBox}>
            <Text style={styles.formulaTitle}>Hybrid Formula</Text>
            <Text style={styles.formulaText}>{modelInfo.hybrid_formula}</Text>
          </View>
        </View>
      )}
    </>
  );
}