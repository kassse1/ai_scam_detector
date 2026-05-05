import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
import type { TabName } from "../types/api";

type Props = {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  onRefresh: () => void;
};

export function Tabs({ activeTab, setActiveTab, onRefresh }: Props) {
  const openTab = (tab: TabName) => {
    setActiveTab(tab);
    if (tab !== "analyze") onRefresh();
  };

  return (
    <View style={styles.tabs}>
      {(["analyze", "dashboard", "history"] as TabName[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabButton, activeTab === tab && styles.activeTab]}
          onPress={() => openTab(tab)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}
          >
            {tab === "analyze"
              ? "Analyze"
              : tab === "dashboard"
              ? "Dashboard"
              : "History"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}