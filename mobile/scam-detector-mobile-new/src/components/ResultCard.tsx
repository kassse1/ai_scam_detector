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

const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};

export function ResultCard({ result, feedbackSent, onFeedback }: Props) {
  const isScam = result.scam_prediction === "SCAM";
  const probability = Math.round(result.scam_probability * 100);
  const riskColor = getRiskColor(result.risk_level);
  const riskBg = getRiskBg(result.risk_level);

  const modelName =
    result.model_used === "hybrid_ml_transformer"
      ? "Hybrid AI"
      : result.model_used;

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
            Model confidence: {formatPercent(result.confidence)}
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
          <Text style={styles.metricLabel}>Generated Check</Text>
          <Text style={styles.metricValue}>{result.ai_prediction}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Model used</Text>
          <Text style={styles.metricValue}>{modelName}</Text>
        </View>
      </View>

      <View style={styles.hybridPanel}>
        <Text style={styles.xaiTitle}>Hybrid AI Analysis</Text>
        <Text style={styles.xaiSubtitle}>
          Final decision is calculated from Classical ML and Transformer scores.
        </Text>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreRowLabel}>Classical ML</Text>
          <Text style={styles.scoreRowValue}>
            {formatPercent(result.classical_ml_score)}
          </Text>
        </View>

        <View style={styles.smallProgressTrack}>
          <View
            style={[
              styles.smallProgressFill,
              {
                width: `${Math.round(result.classical_ml_score * 100)}%`,
              },
            ]}
          />
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreRowLabel}>Transformer</Text>
          <Text style={styles.scoreRowValue}>
            {formatPercent(result.transformer_score)}
          </Text>
        </View>

        <View style={styles.smallProgressTrack}>
          <View
            style={[
              styles.smallProgressFill,
              {
                width: `${Math.round(result.transformer_score * 100)}%`,
              },
            ]}
          />
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreRowLabel}>Hybrid Score</Text>
          <Text style={styles.scoreRowValue}>
            {formatPercent(result.hybrid_score)}
          </Text>
        </View>

        <View style={styles.smallProgressTrack}>
          <View
            style={[
              styles.smallProgressFill,
              {
                width: `${Math.round(result.hybrid_score * 100)}%`,
                backgroundColor: riskColor,
              },
            ]}
          />
        </View>
      </View>

      {result.explanation_text && (
        <View style={styles.explanationPanel}>
          <Text style={styles.xaiTitle}>Why this result?</Text>
          <Text style={styles.explanationText}>{result.explanation_text}</Text>
        </View>
      )}

      {result.scam_prediction === "SCAM" &&
        result.important_keywords?.length > 0 && (
          <View style={styles.xaiPanel}>
            <Text style={styles.xaiTitle}>Model Keywords</Text>
            <Text style={styles.xaiSubtitle}>
  Important words extracted from model-based explanation.
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

      {result.suspicious_keywords?.length > 0 && (
        <View style={styles.xaiPanel}>
          <Text style={styles.xaiTitle}>Suspicious Indicators</Text>
          <Text style={styles.xaiSubtitle}>
            Scam-related words detected by rule-based explanation module.
          </Text>

          <View style={styles.keywordWrap}>
            {result.suspicious_keywords.map((word, index) => (
              <View key={index} style={styles.keywordChipDanger}>
                <Text style={styles.keywordTextDanger}>#{word}</Text>
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