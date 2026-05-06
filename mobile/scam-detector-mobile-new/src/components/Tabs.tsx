import { Ionicons } from "@expo/vector-icons";
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
  {
    key: "analyze",
    label: "Analyze",
    icon: "scan",
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "stats-chart",
  },
  {
    key: "history",
    label: "History",
    icon: "time",
  },
];

export function Tabs({ activeTab, setActiveTab, onRefresh }: Props) {
  const openTab = (tab: TabName) => {
    setActiveTab(tab);
    if (tab !== "analyze") {
      onRefresh();
    }
  };

  return (
    <View style={styles.bottomNavWrapper}>
      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.bottomNavItem,
                isActive && styles.bottomNavItemActive,
              ]}
              onPress={() => openTab(tab.key)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.bottomNavIconBox,
                  isActive && styles.bottomNavIconBoxActive,
                ]}
              >
                <Ionicons
                  name={tab.icon}
                  size={20}
                  color={isActive ? "#ffffff" : "#94a3b8"}
                />
              </View>

              <Text
                style={[
                  styles.bottomNavText,
                  isActive && styles.bottomNavTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}