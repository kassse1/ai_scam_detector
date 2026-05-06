import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BASE_URL } from "../src/config/api";
import { examples } from "../src/data/examples";
import { styles } from "../src/styles/styles";
import type {
  AnalyzeResult,
  ModelInfo,
  Stats,
  TabName,
} from "../src/types/api";

import { DashboardView } from "../src/components/DashboardView";
import { Hero } from "../src/components/Hero";
import { HistoryView } from "../src/components/HistoryView";
import { ResultCard } from "../src/components/ResultCard";
import { Tabs } from "../src/components/Tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabName>("analyze");

  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<AnalyzeResult[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  const [loading, setLoading] = useState(false);
  const [refreshingStats, setRefreshingStats] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState("");
  const [error, setError] = useState("");

  const [batchMode, setBatchMode] = useState(false);
  const [batchText, setBatchText] = useState("");
  const [batchResults, setBatchResults] = useState<AnalyzeResult[]>([]);

  const loadStatsAndHistory = async () => {
    try {
      setRefreshingStats(true);

      const statsRes = await fetch(`${BASE_URL}/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      const historyRes = await fetch(`${BASE_URL}/history`);
      const historyData = await historyRes.json();
      setHistory(historyData.history || []);

      const modelRes = await fetch(`${BASE_URL}/models/info`);
      const modelData = await modelRes.json();
      setModelInfo(modelData);
    } catch {
      // backend may be offline before first request
    } finally {
      setRefreshingStats(false);
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
      setBatchResults([]);

      const res = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.error || data.detail) {
        setError(data.error || data.detail);
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

  const analyzeBatch = async () => {
    const messages = batchText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (messages.length === 0) {
      setError("Please enter at least one message.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFeedbackSent("");
      setResult(null);

      const res = await fetch(`${BASE_URL}/analyze/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          save_to_history: true,
        }),
      });

      const data = await res.json();

      if (data.error || data.detail) {
        setError(data.error || data.detail);
        return;
      }

      setBatchResults(data.results || []);
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

  const renderAnalyze = () => {
    return (
      <>
        <View style={styles.inputPanel}>
          <Text style={styles.panelTitle}>Analyze message</Text>
          <Text style={styles.panelSubtitle}>
            Analyze one message or run batch analysis for multiple messages.
          </Text>

          <View style={styles.modeSwitch}>
            <TouchableOpacity
              style={[styles.modeButton, !batchMode && styles.modeButtonActive]}
              onPress={() => {
                setBatchMode(false);
                setError("");
              }}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  !batchMode && styles.modeButtonTextActive,
                ]}
              >
                Single
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeButton, batchMode && styles.modeButtonActive]}
              onPress={() => {
                setBatchMode(true);
                setError("");
              }}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  batchMode && styles.modeButtonTextActive,
                ]}
              >
                Batch
              </Text>
            </TouchableOpacity>
          </View>

          {!batchMode ? (
            <>
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
            </>
          ) : (
            <>
              <TextInput
                style={styles.batchInput}
                placeholder={
                  "Enter one message per line...\n\nExample:\nYour bank account is blocked...\nHi, can we meet tomorrow?"
                }
                placeholderTextColor="#64748b"
                multiline
                value={batchText}
                onChangeText={setBatchText}
              />

              <TouchableOpacity
                style={styles.exampleCard}
                onPress={() => setBatchText(examples.join("\n"))}
              >
                <Text style={styles.exampleText}>Use demo batch examples</Text>
              </TouchableOpacity>
            </>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={batchMode ? analyzeBatch : analyze}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>
                {batchMode ? "Analyze Batch" : "Analyze with AI"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {batchMode && batchResults.length > 0 && (
          <View style={styles.batchResultsPanel}>
            <Text style={styles.sectionTitle}>Batch Results</Text>

            {batchResults.map((item, index) => {
              const isBatchScam = item.scam_prediction === "SCAM";
              const probability = Math.round(item.scam_probability * 100);

              return (
                <View key={index} style={styles.batchResultItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.batchResultTitle}>
                      {isBatchScam ? "🚨 SCAM" : "✅ SAFE"} · {item.risk_level}
                    </Text>

                    <Text style={styles.batchResultCategory}>
                      Category: {item.scam_category}
                    </Text>

                    <Text style={styles.batchResultText} numberOfLines={2}>
                      {item.text}
                    </Text>
                  </View>

                  <Text style={styles.batchResultPercent}>{probability}%</Text>
                </View>
              );
            })}
          </View>
        )}

        {!batchMode && result && (
          <ResultCard
            result={result}
            feedbackSent={feedbackSent}
            onFeedback={sendFeedback}
          />
        )}
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.appShell}>
        <ScrollView contentContainerStyle={styles.container}>
          <Hero />

          {activeTab === "analyze" && renderAnalyze()}

          {activeTab === "dashboard" && (
            <DashboardView
              stats={stats}
              modelInfo={modelInfo}
              refreshing={refreshingStats}
              onRefresh={loadStatsAndHistory}
            />
          )}

          {activeTab === "history" && (
            <HistoryView history={history} onRefresh={loadStatsAndHistory} />
          )}
        </ScrollView>

        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onRefresh={loadStatsAndHistory}
        />
      </View>
    </KeyboardAvoidingView>
  );
}