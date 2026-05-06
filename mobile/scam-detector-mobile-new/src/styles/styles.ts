import { StyleSheet } from "react-native";
import { colors, radius, shadow } from "./theme";

export const styles = StyleSheet.create({
  screen: {
  flex: 1,
  backgroundColor: colors.bg,
},

  container: {
  padding: 20,
  paddingBottom: 120,
  width: "100%",
  maxWidth: 520,
  alignSelf: "center",
},

  hero: {
    marginTop: 36,
    padding: 24,
    borderRadius: 34,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    overflow: "hidden",
  },

  glowBlue: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: "#2563eb",
    opacity: 0.22,
    right: -70,
    top: -80,
  },

  glowPurple: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "#7c3aed",
    opacity: 0.18,
    left: -70,
    bottom: -70,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(30,41,59,0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },

  logo: {
    fontSize: 38,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(22,163,74,0.16)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.35)",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 7,
  },

  statusText: {
    color: "#bbf7d0",
    fontSize: 12,
    fontWeight: "800",
  },

  title: {
    color: "#f8fafc",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 22,
    letterSpacing: -0.8,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },

  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },

  heroStat: {
    flex: 1,
    backgroundColor: "rgba(30,41,59,0.72)",
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },

  heroStatValue: {
    color: "#f8fafc",
    fontWeight: "900",
    fontSize: 17,
  },

  heroStatLabel: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 12,
  },

  tabs: {
    flexDirection: "row",
    marginTop: 18,
    backgroundColor: "#0f172a",
    padding: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 6,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#2563eb",
  },

  tabText: {
    color: "#94a3b8",
    fontWeight: "900",
    fontSize: 13,
  },

  activeTabText: {
    color: "#fff",
  },

  inputPanel: {
  marginTop: 20,
  backgroundColor: colors.panel2,
  borderRadius: radius.xl,
  padding: 20,
  borderWidth: 1,
  borderColor: colors.border,
  ...shadow.blueGlow,
},

  panelTitle: {
  color: colors.text,
  fontSize: 26,
  fontWeight: "900",
  letterSpacing: -0.4,
},

  panelSubtitle: {
  color: colors.muted,
  marginTop: 6,
  marginBottom: 16,
  fontSize: 14,
  lineHeight: 22,
},

  input: {
  minHeight: 150,
  backgroundColor: "#020617",
  borderRadius: radius.lg,
  padding: 16,
  color: colors.text,
  borderWidth: 1,
  borderColor: colors.borderStrong,
  fontSize: 15,
  textAlignVertical: "top",
},

  quickTitle: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 10,
  },

  examplesWrap: {
    gap: 8,
  },

  exampleCard: {
  backgroundColor: "rgba(30, 41, 59, 0.86)",
  borderRadius: radius.md,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(148, 163, 184, 0.22)",
},

  exampleText: {
  color: colors.muted2,
  fontSize: 13,
  lineHeight: 19,
},

  analyzeButton: {
  marginTop: 18,
  backgroundColor: colors.blue,
  borderRadius: radius.lg,
  paddingVertical: 17,
  alignItems: "center",
  ...shadow.blueGlow,
},

  analyzeButtonText: {
  color: "#fff",
  fontSize: 17,
  fontWeight: "900",
},

  errorText: {
    marginTop: 12,
    color: "#fca5a5",
    fontWeight: "800",
  },

  resultPanel: {
    marginTop: 20,
    borderRadius: 34,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },

  resultTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultSmallText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "800",
  },

  resultTitle: {
    color: "#f8fafc",
    fontSize: 29,
    fontWeight: "900",
    marginTop: 4,
  },

  riskBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  riskBadgeText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },

  scoreCard: {
    marginTop: 22,
    flexDirection: "row",
    gap: 16,
    backgroundColor: "rgba(15,23,42,0.74)",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    alignItems: "center",
  },

  scoreCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#020617",
    borderWidth: 8,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  scoreValue: {
    color: "#f8fafc",
    fontSize: 25,
    fontWeight: "900",
  },

  scoreCaption: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
  },

  scoreInfo: {
    flex: 1,
  },

  scoreTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },

  progressTrack: {
    height: 13,
    backgroundColor: "#1e293b",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  scoreDescription: {
    color: "#cbd5e1",
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
  },

  metricsGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  metricCard: {
    width: "48%",
    backgroundColor: "rgba(15,23,42,0.74)",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.22)",
  },

  metricLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "700",
  },

  metricValue: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "900",
  },

  xaiPanel: {
    marginTop: 16,
    backgroundColor: "rgba(15,23,42,0.78)",
    borderRadius: 24,
    padding: 17,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },

  xaiTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "900",
  },

  xaiSubtitle: {
    color: "#94a3b8",
    marginTop: 5,
    marginBottom: 13,
    fontSize: 13,
    lineHeight: 18,
  },

  keywordWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  keywordChip: {
    backgroundColor: "#312e81",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  keywordText: {
    color: "#ddd6fe",
    fontSize: 13,
    fontWeight: "900",
  },

  feedbackPanel: {
    marginTop: 17,
  },

  feedbackTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  feedbackButtons: {
    flexDirection: "row",
    gap: 10,
  },

  correctButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  wrongButton: {
    flex: 1,
    backgroundColor: "#dc2626",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  feedbackButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  feedbackMessage: {
    marginTop: 12,
    textAlign: "center",
    color: "#bfdbfe",
    fontWeight: "800",
  },

  dashboardHeader: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  refreshButton: {
    backgroundColor: "rgba(37,99,235,0.16)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },

  refreshText: {
    color: "#bfdbfe",
    fontWeight: "900",
    fontSize: 12,
  },

  statsGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  bigStatCard: {
    width: "48%",
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  bigStatNumber: {
    color: "#f8fafc",
    fontSize: 34,
    fontWeight: "900",
  },

  bigStatLabel: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "700",
  },

  dashboardPanel: {
    marginTop: 16,
    backgroundColor: "#0f172a",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#f8fafc",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 12,
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 8,
  },

  categoryRow: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  categoryName: {
    color: "#f8fafc",
    fontWeight: "900",
    fontSize: 15,
  },

  categoryHint: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },

  categoryCount: {
    backgroundColor: "#2563eb",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryCountText: {
    color: "#fff",
    fontWeight: "900",
  },

  historyScreenPanel: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  historyLargeItem: {
    marginTop: 14,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },

  historyLargeTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  historyContent: {
    flex: 1,
  },

  historyTitle: {
    color: "#f8fafc",
    fontWeight: "900",
    fontSize: 14,
  },

  historyCategory: {
    color: "#94a3b8",
    marginTop: 3,
    fontSize: 12,
  },

  historyPercentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  historyPercentText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },

  historyMessage: {
    color: "#cbd5e1",
    marginTop: 12,
    lineHeight: 19,
    fontSize: 13,
  },

  historyKeywords: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },

  historyKeyword: {
    color: "#ddd6fe",
    backgroundColor: "#312e81",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "800",
  },
    heroGradient: {
    marginTop: 36,
    padding: 24,
    borderRadius: 34,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(147,197,253,0.24)",
  },

  heroGlowBlue: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 140,
    backgroundColor: "#38bdf8",
    opacity: 0.16,
    right: -80,
    top: -80,
  },

  heroGlowPurple: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 120,
    backgroundColor: "#a855f7",
    opacity: 0.18,
    left: -80,
    bottom: -90,
  },

  logoBoxPremium: {
    width: 74,
    height: 74,
    borderRadius: 26,
    backgroundColor: "rgba(15,23,42,0.55)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(219,234,254,0.35)",
  },

  statusPillPremium: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34,197,94,0.14)",
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(134,239,172,0.28)",
  },

  statusTextPremium: {
    color: "#dcfce7",
    fontSize: 12,
    fontWeight: "900",
  },

  heroIllustration: {
    marginTop: 22,
    height: 132,
    justifyContent: "center",
    alignItems: "center",
  },

  orbitCircleLarge: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    borderColor: "rgba(191,219,254,0.25)",
  },

  orbitCircleSmall: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: "rgba(221,214,254,0.35)",
  },

  centerAiIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(37,99,235,0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },

  titlePremium: {
    color: "#f8fafc",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1,
    marginTop: 8,
  },

  subtitlePremium: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },

  hybridPanel: {
  marginTop: 16,
  backgroundColor: "rgba(15,23,42,0.78)",
  borderRadius: 24,
  padding: 17,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.25)",
},

scoreRow: {
  marginTop: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

scoreRowLabel: {
  color: "#cbd5e1",
  fontSize: 13,
  fontWeight: "800",
},

scoreRowValue: {
  color: "#f8fafc",
  fontSize: 13,
  fontWeight: "900",
},

smallProgressTrack: {
  marginTop: 7,
  height: 8,
  backgroundColor: "#1e293b",
  borderRadius: 999,
  overflow: "hidden",
},

smallProgressFill: {
  height: "100%",
  borderRadius: 999,
  backgroundColor: "#60a5fa",
},

explanationPanel: {
  marginTop: 16,
  backgroundColor: "rgba(15,23,42,0.78)",
  borderRadius: 24,
  padding: 17,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.25)",
},

explanationText: {
  color: "#cbd5e1",
  fontSize: 14,
  lineHeight: 21,
  marginTop: 6,
},

keywordChipDanger: {
  backgroundColor: "rgba(239,68,68,0.2)",
  borderColor: "rgba(248,113,113,0.45)",
  borderWidth: 1,
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

keywordTextDanger: {
  color: "#fecaca",
  fontSize: 13,
  fontWeight: "900",
},
appShell: {
  flex: 1,
},

bottomNavWrapper: {
  paddingHorizontal: 20,
  paddingBottom: 18,
  paddingTop: 8,
  backgroundColor: "#020617",
},

bottomNav: {
  flexDirection: "row",
  backgroundColor: "rgba(15,23,42,0.96)",
  borderRadius: 28,
  padding: 8,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.22)",
},

bottomNavItem: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 8,
  borderRadius: 22,
},

bottomNavItemActive: {
  backgroundColor: "#2563eb",
},

bottomNavIconBox: {
  width: 34,
  height: 34,
  borderRadius: 17,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 4,
},

bottomNavIconBoxActive: {
  backgroundColor: "rgba(255,255,255,0.16)",
},

bottomNavText: {
  color: "#94a3b8",
  fontSize: 11,
  fontWeight: "900",
},

bottomNavTextActive: {
  color: "#ffffff",
},
modelInfoCard: {
  backgroundColor: "#1e293b",
  borderRadius: 18,
  padding: 14,
  borderWidth: 1,
  borderColor: "#334155",
  marginTop: 10,
},

modelInfoLabel: {
  color: "#94a3b8",
  fontSize: 12,
  fontWeight: "800",
  marginBottom: 5,
},

modelInfoValue: {
  color: "#f8fafc",
  fontSize: 14,
  fontWeight: "900",
  lineHeight: 20,
},

formulaBox: {
  marginTop: 14,
  backgroundColor: "rgba(37,99,235,0.16)",
  borderRadius: 18,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(96,165,250,0.35)",
},

formulaTitle: {
  color: "#bfdbfe",
  fontSize: 13,
  fontWeight: "900",
  marginBottom: 6,
},

formulaText: {
  color: "#dbeafe",
  fontSize: 13,
  fontWeight: "800",
  lineHeight: 20,
},
modeSwitch: {
  flexDirection: "row",
  backgroundColor: "#020617",
  borderRadius: 18,
  padding: 5,
  borderWidth: 1,
  borderColor: "#334155",
  marginBottom: 14,
},

modeButton: {
  flex: 1,
  paddingVertical: 11,
  borderRadius: 14,
  alignItems: "center",
},

modeButtonActive: {
  backgroundColor: "#2563eb",
},

modeButtonText: {
  color: "#94a3b8",
  fontSize: 13,
  fontWeight: "900",
},

modeButtonTextActive: {
  color: "#ffffff",
},

batchInput: {
  minHeight: 210,
  backgroundColor: "#020617",
  borderRadius: 24,
  padding: 16,
  color: "#f8fafc",
  borderWidth: 1,
  borderColor: "#334155",
  fontSize: 15,
  textAlignVertical: "top",
},

batchResultsPanel: {
  marginTop: 20,
  backgroundColor: "#0f172a",
  borderRadius: 30,
  padding: 20,
  borderWidth: 1,
  borderColor: "#1e293b",
},

batchResultItem: {
  marginTop: 12,
  backgroundColor: "#1e293b",
  borderRadius: 20,
  padding: 14,
  borderWidth: 1,
  borderColor: "#334155",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 12,
},

batchResultTitle: {
  color: "#f8fafc",
  fontWeight: "900",
  fontSize: 14,
},

batchResultCategory: {
  color: "#93c5fd",
  fontSize: 12,
  fontWeight: "800",
  marginTop: 4,
},

batchResultText: {
  color: "#94a3b8",
  fontSize: 12,
  marginTop: 5,
  lineHeight: 17,
  maxWidth: 280,
},

batchResultPercent: {
  color: "#60a5fa",
  fontWeight: "900",
  fontSize: 16,
},
glassCard: {
  backgroundColor: "rgba(15, 23, 42, 0.86)",
  borderRadius: radius.xl,
  borderWidth: 1,
  borderColor: colors.border,
},

neonDivider: {
  height: 1,
  backgroundColor: "rgba(96, 165, 250, 0.22)",
  marginVertical: 16,
},

privacyText: {
  color: colors.muted,
  fontSize: 12,
  textAlign: "center",
  marginTop: 14,
},

blueChip: {
  backgroundColor: "rgba(37, 99, 235, 0.18)",
  borderColor: "rgba(96, 165, 250, 0.45)",
  borderWidth: 1,
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

purpleChip: {
  backgroundColor: "rgba(124, 58, 237, 0.20)",
  borderColor: "rgba(167, 139, 250, 0.45)",
  borderWidth: 1,
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

dangerChip: {
  backgroundColor: colors.dangerBg,
  borderColor: "rgba(248, 113, 113, 0.45)",
  borderWidth: 1,
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

successChip: {
  backgroundColor: colors.successBg,
  borderColor: "rgba(74, 222, 128, 0.45)",
  borderWidth: 1,
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

chipTextBlue: {
  color: "#bfdbfe",
  fontSize: 13,
  fontWeight: "900",
},

chipTextDanger: {
  color: "#fecaca",
  fontSize: 13,
  fontWeight: "900",
},

chipTextSuccess: {
  color: "#bbf7d0",
  fontSize: 13,
  fontWeight: "900",
},
heroPremium: {
  marginTop: 36,
  padding: 24,
  borderRadius: 36,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "rgba(147,197,253,0.28)",
  shadowColor: "#2563eb",
  shadowOpacity: 0.35,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
},

heroGlowOne: {
  position: "absolute",
  width: 260,
  height: 260,
  borderRadius: 140,
  backgroundColor: "#38bdf8",
  opacity: 0.17,
  right: -80,
  top: -90,
},

heroGlowTwo: {
  position: "absolute",
  width: 240,
  height: 240,
  borderRadius: 130,
  backgroundColor: "#a855f7",
  opacity: 0.2,
  left: -90,
  bottom: -90,
},

heroLogo: {
  width: 74,
  height: 74,
  borderRadius: 26,
  backgroundColor: "rgba(15,23,42,0.55)",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(219,234,254,0.35)",
},

onlineBadge: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(34,197,94,0.14)",
  paddingVertical: 9,
  paddingHorizontal: 13,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: "rgba(134,239,172,0.28)",
},

onlineBadgeText: {
  color: "#dcfce7",
  fontSize: 12,
  fontWeight: "900",
},

heroCenterIcon: {
  height: 132,
  marginTop: 24,
  justifyContent: "center",
  alignItems: "center",
},

orbitOuter: {
  position: "absolute",
  width: 132,
  height: 132,
  borderRadius: 66,
  borderWidth: 1,
  borderColor: "rgba(191,219,254,0.25)",
},

orbitInner: {
  position: "absolute",
  width: 86,
  height: 86,
  borderRadius: 43,
  borderWidth: 1,
  borderColor: "rgba(221,214,254,0.35)",
},

aiIconCircle: {
  width: 66,
  height: 66,
  borderRadius: 33,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.28)",
},

heroTitle: {
  color: "#f8fafc",
  fontSize: 38,
  fontWeight: "900",
  letterSpacing: -1,
  marginTop: 10,
},

heroSubtitle: {
  color: "#cbd5e1",
  fontSize: 15,
  lineHeight: 23,
  marginTop: 10,
},

heroStatPremium: {
  flex: 1,
  backgroundColor: "rgba(15,23,42,0.52)",
  padding: 14,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "rgba(203,213,225,0.22)",
},

heroStatLabelPremium: {
  color: "#cbd5e1",
  marginTop: 4,
  fontSize: 12,
},

bottomNavPremium: {
  flexDirection: "row",
  backgroundColor: "rgba(15,23,42,0.98)",
  borderRadius: 30,
  padding: 8,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.22)",
  shadowColor: "#2563eb",
  shadowOpacity: 0.25,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,
},

bottomNavItemPremium: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 8,
  borderRadius: 22,
},

bottomNavActiveBg: {
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 22,
  paddingVertical: 9,
},

bottomNavTextPremium: {
  color: "#94a3b8",
  fontSize: 11,
  fontWeight: "900",
  marginTop: 4,
},

resultPanelPremium: {
  marginTop: 20,
  borderRadius: 36,
  padding: 22,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.25)",
  overflow: "hidden",
  shadowColor: "#000",
  shadowOpacity: 0.35,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 10,
},

resultLabelRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},
newHero: {
  marginTop: 36,
  padding: 24,
  borderRadius: 38,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "rgba(147,197,253,0.35)",
},

newHeroGlowBlue: {
  position: "absolute",
  width: 280,
  height: 280,
  borderRadius: 140,
  backgroundColor: "#2563eb",
  opacity: 0.35,
  right: -100,
  top: -110,
},

newHeroGlowPink: {
  position: "absolute",
  width: 260,
  height: 260,
  borderRadius: 130,
  backgroundColor: "#ec4899",
  opacity: 0.22,
  left: -110,
  bottom: -120,
},

newHeroTop: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

newHeroLogo: {
  width: 76,
  height: 76,
  borderRadius: 28,
  backgroundColor: "rgba(255,255,255,0.12)",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.25)",
},

newHeroBadge: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(34,197,94,0.18)",
  borderWidth: 1,
  borderColor: "rgba(74,222,128,0.45)",
  paddingHorizontal: 13,
  paddingVertical: 9,
  borderRadius: 999,
},

newHeroBadgeText: {
  color: "#bbf7d0",
  fontWeight: "900",
  fontSize: 12,
},

newHeroCenter: {
  alignItems: "center",
  marginTop: 28,
  marginBottom: 12,
},

newHeroAiCircle: {
  width: 96,
  height: 96,
  borderRadius: 48,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.35)",
},

newHeroTitle: {
  color: "#ffffff",
  fontSize: 40,
  fontWeight: "900",
  letterSpacing: -1,
  textAlign: "center",
  marginTop: 8,
},

newHeroSubtitle: {
  color: "#cbd5e1",
  fontSize: 15,
  lineHeight: 23,
  textAlign: "center",
  marginTop: 10,
},

newHeroCards: {
  flexDirection: "row",
  gap: 10,
  marginTop: 24,
},

newHeroCard: {
  flex: 1,
  backgroundColor: "rgba(15,23,42,0.65)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.16)",
  borderRadius: 22,
  padding: 14,
  alignItems: "center",
},

newHeroCardTitle: {
  color: "#ffffff",
  fontWeight: "900",
  fontSize: 15,
  marginTop: 6,
},

newHeroCardText: {
  color: "#94a3b8",
  fontSize: 11,
  marginTop: 3,
},
statIconBlue: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: "rgba(37,99,235,0.22)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
},

statIconRed: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: "rgba(239,68,68,0.22)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
},

statIconGreen: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: "rgba(34,197,94,0.22)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
},

statIconPurple: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: "rgba(139,92,246,0.22)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
},

categoryBarCard: {
  marginTop: 12,
  backgroundColor: "rgba(30,41,59,0.86)",
  borderRadius: 20,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.22)",
},

categoryBarTop: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},

categoryTitleRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

categoryIconBox: {
  width: 38,
  height: 38,
  borderRadius: 19,
  justifyContent: "center",
  alignItems: "center",
},

categoryNumber: {
  color: "#f8fafc",
  fontSize: 18,
  fontWeight: "900",
},

categoryTrack: {
  height: 9,
  backgroundColor: "#020617",
  borderRadius: 999,
  overflow: "hidden",
},

categoryFill: {
  height: "100%",
  borderRadius: 999,
},

modelInfoCardPremium: {
  marginTop: 12,
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  backgroundColor: "rgba(30,41,59,0.86)",
  borderRadius: 20,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.22)",
},

modelIconBlue: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "rgba(37,99,235,0.22)",
  justifyContent: "center",
  alignItems: "center",
},

modelIconPurple: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "rgba(139,92,246,0.22)",
  justifyContent: "center",
  alignItems: "center",
},

modelIconGreen: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "rgba(34,197,94,0.22)",
  justifyContent: "center",
  alignItems: "center",
},
emptyStateCard: {
  marginTop: 18,
  backgroundColor: "rgba(30,41,59,0.86)",
  borderRadius: 24,
  padding: 22,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.22)",
  alignItems: "center",
},

emptyStateIcon: {
  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: "rgba(37,99,235,0.22)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 12,
},

emptyStateTitle: {
  color: "#f8fafc",
  fontSize: 18,
  fontWeight: "900",
},

emptyStateText: {
  color: "#94a3b8",
  fontSize: 13,
  textAlign: "center",
  lineHeight: 19,
  marginTop: 6,
},

historyCardPremium: {
  marginTop: 14,
  backgroundColor: "rgba(30,41,59,0.88)",
  borderRadius: 24,
  padding: 16,
  borderWidth: 1,
  borderColor: "rgba(148,163,184,0.22)",
  overflow: "hidden",
},

historyAccentLine: {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: 5,
},

historyPremiumTop: {
  flexDirection: "row",
  alignItems: "center",
},

historyIconPremium: {
  width: 44,
  height: 44,
  borderRadius: 22,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},

historyPremiumContent: {
  flex: 1,
},

historyPremiumTitle: {
  color: "#f8fafc",
  fontSize: 15,
  fontWeight: "900",
},

historyMetaRow: {
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 7,
  marginTop: 6,
},

historyCategoryBadge: {
  borderWidth: 1,
  borderRadius: 999,
  paddingHorizontal: 9,
  paddingVertical: 4,
  backgroundColor: "rgba(15,23,42,0.55)",
},

historyCategoryBadgeText: {
  fontSize: 11,
  fontWeight: "900",
},

historyModelText: {
  color: "#94a3b8",
  fontSize: 11,
  fontWeight: "800",
},

historyPercentBadgePremium: {
  paddingHorizontal: 10,
  paddingVertical: 7,
  borderRadius: 999,
  marginLeft: 8,
},

historyMessagePremium: {
  color: "#cbd5e1",
  fontSize: 13,
  lineHeight: 19,
  marginTop: 13,
},

historyScoreRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 12,
},

historyScoreText: {
  color: "#93c5fd",
  backgroundColor: "rgba(37,99,235,0.16)",
  borderWidth: 1,
  borderColor: "rgba(96,165,250,0.25)",
  paddingHorizontal: 9,
  paddingVertical: 5,
  borderRadius: 999,
  fontSize: 11,
  fontWeight: "900",
},

historyKeywordsPremium: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 7,
  marginTop: 12,
},

historyKeywordChip: {
  backgroundColor: "rgba(124,58,237,0.22)",
  borderWidth: 1,
  borderColor: "rgba(167,139,250,0.35)",
  paddingHorizontal: 9,
  paddingVertical: 5,
  borderRadius: 999,
},

historyKeywordText: {
  color: "#ddd6fe",
  fontSize: 11,
  fontWeight: "900",
},
});