import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { BASE_URL } from "../src/config/api";
import { examples } from "../src/data/examples";
import type { AnalyzeResult, Stats, TabName } from "../src/types/api";
import { styles } from "../src/styles/styles";

import { Hero } from "../src/components/Hero";
import { Tabs } from "../src/components/Tabs";
import { ResultCard } from "../src/components/ResultCard";
import { DashboardView } from "../src/components/DashboardView";
import { HistoryView } from "../src/components/HistoryView";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabName>("analyze");

  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<AnalyzeResult[]>([]);

  const [loading, setLoading] = useState(false);
  const [refreshingStats, setRefreshingStats] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState("");
  const [error, setError] = useState("");

  const loadStatsAndHistory = async () => {
    try {
      setRefreshingStats(true);

      const statsRes = await fetch(`${BASE_URL}/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      const historyRes = await fetch(`${BASE_URL}/history`);
      const historyData = await historyRes.json();
      setHistory(historyData.history || []);
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

  const renderAnalyze = () => (
    <>
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
        <ResultCard
          result={result}
          feedbackSent={feedbackSent}
          onFeedback={sendFeedback}
        />
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Hero />

        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onRefresh={loadStatsAndHistory}
        />

        {activeTab === "analyze" && renderAnalyze()}

        {activeTab === "dashboard" && (
          <DashboardView
            stats={stats}
            refreshing={refreshingStats}
            onRefresh={loadStatsAndHistory}
          />
        )}

        {activeTab === "history" && (
          <HistoryView history={history} onRefresh={loadStatsAndHistory} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}