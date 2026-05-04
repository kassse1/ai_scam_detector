import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
import type { AnalyzeResult } from "../types/api";

type Props = {
  result: AnalyzeResult;
  feedbackSent: string;
  onFeedback: (label: string) => void;
};

const getRiskColor = (risk: string) => {
  if (risk === "HIGH") return "#ef4444";
  if (risk === "MEDIUM") return "#f59e0b";
  return "#22c55e";
};

const getRiskBg = (risk: string) => {
  if (risk === "HIGH") return "#451111";
  if (risk === "MEDIUM") return "#422006";
  return "#052e16";
};

export function ResultCard({ result, feedbackSent, onFeedback }: Props) {
  const isScam = result.scam_prediction === "SCAM";
  const probability = Math.round(result.scam_probability * 100);
  const riskColor = getRiskColor(result.risk_level);
  const riskBg = getRiskBg(result.risk_level);

  return (
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
            {result.important_keywords.map((word, index) => (
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
            onPress={() => onFeedback(result.scam_prediction)}
          >
            <Text style={styles.feedbackButtonText}>👍 Correct</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.wrongButton}
            onPress={() =>
              onFeedback(result.scam_prediction === "SCAM" ? "SAFE" : "SCAM")
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
  );
}