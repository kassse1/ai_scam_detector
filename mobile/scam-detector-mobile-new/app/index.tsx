import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BASE_URL = "http://localhost:8000";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    const res = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
  };

  const sendFeedback = async (label: string) => {
    await fetch(`${BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        correct_label: label,
      }),
    });
  };

  const isScam = result?.scam_prediction === "SCAM";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ AI Scam Detector</Text>

      <TextInput
        style={styles.input}
        placeholder="Paste suspicious message..."
        placeholderTextColor="#94a3b8"
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.button} onPress={analyze}>
        <Text style={styles.buttonText}>Analyze</Text>
      </TouchableOpacity>

      {result && (
        <View style={[styles.card, isScam ? styles.scam : styles.safe]}>
          <Text style={styles.resultTitle}>
            {isScam ? "🚨 SCAM DETECTED" : "✅ SAFE MESSAGE"}
          </Text>

          <Text style={styles.infoText}>
            Risk Level: {result.risk_level}
          </Text>

          <Text style={styles.infoText}>
            Scam Probability: {(result.scam_probability * 100).toFixed(1)}%
          </Text>

          <Text style={styles.infoText}>
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </Text>

          {result.important_keywords?.length > 0 && (
            <Text style={styles.infoText}>
              Important Words: {result.important_keywords.join(", ")}
            </Text>
          )}

          <Text style={styles.infoText}>
            AI Detection: {result.ai_prediction}
          </Text>

          <Text style={styles.infoText}>
            AI Confidence: {(result.ai_probability * 100).toFixed(1)}%
          </Text>

          <Text style={styles.model}>
            Model used: {result.model_used}
          </Text>

          <Text style={styles.feedbackTitle}>Was this correct?</Text>

          <TouchableOpacity
            style={styles.correctBtn}
            onPress={() => sendFeedback(result.scam_prediction)}
          >
            <Text style={styles.btnText}>👍 Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.wrongBtn}
            onPress={() =>
              sendFeedback(result.scam_prediction === "SCAM" ? "SAFE" : "SCAM")
            }
          >
            <Text style={styles.btnText}>👎 No</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 16,
    borderRadius: 14,
    height: 130,
    fontSize: 15,
  },

  button: {
    marginTop: 15,
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  card: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },

  scam: {
    backgroundColor: "#7f1d1d",
  },

  safe: {
    backgroundColor: "#14532d",
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },

  infoText: {
    color: "#fff",
    marginTop: 6,
    fontSize: 14,
  },

  model: {
    marginTop: 8,
    fontStyle: "italic",
    color: "#cbd5f5",
  },

  feedbackTitle: {
    marginTop: 18,
    fontWeight: "600",
    color: "#fff",
  },

  correctBtn: {
    marginTop: 12,
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  wrongBtn: {
    marginTop: 10,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "600",
  },
});