import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { styles } from "../styles/styles";
import type { Stats } from "../types/api";

type Props = {
  stats: Stats | null;
  refreshing: boolean;
  onRefresh: () => void;
};

export function DashboardView({ stats, refreshing, onRefresh }: Props) {
  const categories = stats?.categories || {};
  const topKeywords = stats?.top_keywords || [];

  return (
    <>
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.panelTitle}>System Dashboard</Text>
          <Text style={styles.panelSubtitle}>
            Live statistics from analyzed messages.
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
          <Text style={styles.bigStatNumber}>{stats?.total_checks || 0}</Text>
          <Text style={styles.bigStatLabel}>Total checks</Text>
        </View>

        <View style={styles.bigStatCard}>
          <Text style={styles.bigStatNumber}>{stats?.scam_count || 0}</Text>
          <Text style={styles.bigStatLabel}>Scam</Text>
        </View>

        <View style={styles.bigStatCard}>
          <Text style={styles.bigStatNumber}>{stats?.safe_count || 0}</Text>
          <Text style={styles.bigStatLabel}>Safe</Text>
        </View>

        <View style={styles.bigStatCard}>
          <Text style={styles.bigStatNumber}>{stats?.high_risk_count || 0}</Text>
          <Text style={styles.bigStatLabel}>High risk</Text>
        </View>
      </View>

      <View style={styles.dashboardPanel}>
        <Text style={styles.sectionTitle}>Scam Categories</Text>

        {Object.keys(categories).length === 0 ? (
          <Text style={styles.emptyText}>No category data yet.</Text>
        ) : (
          Object.entries(categories).map(([category, count]) => (
            <View key={category} style={styles.categoryRow}>
              <View>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryHint}>Detected category</Text>
              </View>

              <View style={styles.categoryCount}>
                <Text style={styles.categoryCountText}>{count}</Text>
              </View>
            </View>
          ))
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
    </>
  );
}