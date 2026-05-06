import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";
import type { TabName } from "../types/api";

type Props = {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  onRefresh: () => void;
};

const tabs: {
  key: TabName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "analyze", label: "Analyze", icon: "scan" },
  { key: "dashboard", label: "Dashboard", icon: "stats-chart" },
  { key: "history", label: "History", icon: "time" },
];

export function Tabs({ activeTab, setActiveTab, onRefresh }: Props) {
  const openTab = (tab: TabName) => {
    setActiveTab(tab);
    if (tab !== "analyze") onRefresh();
  };

  return (
    <View style={styles.bottomNavWrapper}>
      <View style={styles.bottomNavPremium}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.bottomNavItemPremium}
              onPress={() => openTab(tab.key)}
              activeOpacity={0.85}
            >
              {isActive ? (
                <LinearGradient
                  colors={["#2563eb", "#7c3aed"]}
                  style={styles.bottomNavActiveBg}
                >
                  <Ionicons name={tab.icon} size={20} color="#ffffff" />
                  <Text style={styles.bottomNavTextActive}>{tab.label}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Ionicons name={tab.icon} size={20} color="#94a3b8" />
                  <Text style={styles.bottomNavTextPremium}>{tab.label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}