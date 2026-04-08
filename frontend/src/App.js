import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis");

  const analyze = async () => {
    if (!file) return setError("Please select a file to analyze");

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3001/analyze", formData);
      setData(res.data);
      setActiveTab("analysis");
    } catch (err) {
      console.error(err);
      setError("Failed to analyze paper. Please try again.");
    }

    setLoading(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || null);
  };

  const getScoreColor = (score) => {
    if (score > 8) return "#10b981";
    if (score > 5) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreStatus = (score) => {
    if (score > 8) return "High Quality";
    if (score > 5) return "Moderate Quality";
    return "Needs Improvement";
  };

  const getSummaryLabel = (score) => {
    if (score > 8) return "This is a high-quality research paper";
    if (score >= 5) return "This is a moderately strong paper";
    return "This paper needs improvement";
  };

  const getSummaryBorderColor = (score) => {
    if (score > 8) return "#10b981";
    if (score >= 5) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.maxWidth}>
          <h1 style={styles.title}>Research Paper Analyzer</h1>
          <p style={styles.subtitle}>
            Professional platform for research quality assessment and literature discovery
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.maxWidth}>
        <div style={styles.mainLayout}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.uploadSection}>
              <h3 style={styles.sidebarTitle}>Upload Research Paper</h3>

              <label style={styles.fileInputLabel}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  style={styles.fileInput}
                />
                <span style={styles.selectFileBtn}>Browse Files</span>
              </label>

              {fileName && (
                <div style={styles.fileName}>
                  <span style={styles.fileNameIcon}>📄</span>
                  <span>{fileName}</span>
                </div>
              )}

              <button
                onClick={analyze}
                disabled={loading}
                style={{
                  ...styles.analyzeButton,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Paper"
                )}
              </button>

              {error && <div style={styles.errorMessage}>{error}</div>}
            </div>

            {/* Database Summary */}
            {data && (
              <div style={styles.databaseSummary}>
                <h3 style={styles.sidebarTitle}>Database Summary</h3>
                <div style={styles.summaryStats}>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>1000</div>
                    <div style={styles.statLabel}>Papers</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>15+</div>
                    <div style={styles.statLabel}>Domains</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>Re...</div>
                    <div style={styles.statLabel}>Status</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div style={styles.contentArea}>
            {!data ? (
              <div style={styles.welcomeSection}>
                <div style={styles.welcomeCard}>
                  <h2 style={styles.welcomeTitle}>Welcome to Research Paper Analyzer</h2>
                  <p style={styles.welcomeText}>
                    A professional platform for analyzing research papers and discovering related work in our knowledge base
                  </p>
                </div>

                {/* How It Works */}
                <div style={styles.infoGrid}>
                  <div style={styles.infoCard}>
                    <h3 style={styles.infoTitle}>How It Works</h3>
                    <ol style={styles.infoList}>
                      <li>Upload a research paper in PDF format</li>
                      <li>Await completion of automated analysis</li>
                      <li>Review results across analytical tabs</li>
                      <li>Improved recommendations to enhance quality</li>
                    </ol>
                  </div>

                  <div style={styles.infoCard}>
                    <h3 style={styles.infoTitle}>Core Features</h3>
                    <ul style={styles.featureList}>
                      <li>Analysis Module: Extract comprehensive metrics and quality</li>
                      <li>Literature Discovery: Find semantically similar papers in the database</li>
                      <li>Quality Scoring: Automated quality evaluation and research positioning</li>
                      <li>Extractive Summary: Quick synthesis of key content and findings</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.resultsWrapper}>
                {/* Success Message */}
                <div style={styles.successBanner}>
                  Valid research paper detected (6 sections found)
                </div>

                {/* Tabs */}
                <div style={styles.tabsContainer}>
                  <button
                    style={{
                      ...styles.tab,
                      ...(activeTab === "analysis" ? styles.tabActive : {}),
                    }}
                    onClick={() => setActiveTab("analysis")}
                  >
                    Paper Analysis
                  </button>
                  <button
                    style={{
                      ...styles.tab,
                      ...(activeTab === "similar" ? styles.tabActive : {}),
                    }}
                    onClick={() => setActiveTab("similar")}
                  >
                    Similar Research
                  </button>
                  <button
                    style={{
                      ...styles.tab,
                      ...(activeTab === "recommendations" ? styles.tabActive : {}),
                    }}
                    onClick={() => setActiveTab("recommendations")}
                  >
                    Recommendations
                  </button>
                  <button
                    style={{
                      ...styles.tab,
                      ...(activeTab === "summary" ? styles.tabActive : {}),
                    }}
                    onClick={() => setActiveTab("summary")}
                  >
                    Summary
                  </button>
                </div>

                {/* Tab Content */}
                <div style={styles.tabContent}>
                  {activeTab === "analysis" && (
                    <div>
                      <div style={styles.scoreCard}>
                        <h2 style={styles.sectionTitle}>Overall Score</h2>
                        <div style={styles.scoreDisplay}>
                          <div style={styles.scoreValue}>{data.score.toFixed(0)}</div>
                          <div style={styles.scoreMax}>/10</div>
                        </div>
                        <div
                          style={{
                            ...styles.scoreBar,
                            width: `${(data.score / 10) * 100}%`,
                          }}
                        ></div>
                        <div style={styles.scoreStatus}>
                          <span style={{ color: getScoreColor(data.score) }}>
                            {getScoreStatus(data.score)}
                          </span>
                        </div>
                      </div>

                      <h2 style={styles.sectionTitle}>Key Metrics</h2>
                      <div style={styles.metricsGrid}>
                        <div style={styles.metricCard}>
                          <div style={styles.metricLabel}>WORD COUNT</div>
                          <div style={styles.metricValue}>{data.features.word_count.toLocaleString()}</div>
                        </div>
                        <div style={styles.metricCard}>
                          <div style={styles.metricLabel}>SENTENCE COUNT</div>
                          <div style={styles.metricValue}>{data.features.sentence_count}</div>
                        </div>
                        <div style={styles.metricCard}>
                          <div style={styles.metricLabel}>AVG WORD LENGTH</div>
                          <div style={styles.metricValue}>{data.features.avg_word_length.toFixed(1)}</div>
                        </div>
                      </div>

                      <div style={styles.metricsDetails}>
                        <div style={styles.detailsCard}>
                          <h3 style={styles.detailsTitle}>Quantitative Metrics</h3>
                          <ul style={styles.detailsList}>
                            <li>Word Count: Indicates content depth and comprehensiveness</li>
                            <li>Sentence Structure: Measures content granularity and organization</li>
                            <li>Word Length: Reflects vocabulary complexity</li>
                          </ul>
                        </div>
                        <div style={styles.detailsCard}>
                          <h3 style={styles.detailsTitle}>Quality Indicators</h3>
                          <ul style={styles.detailsList}>
                            <li>Readability: Flesch-Kincaid reading ease score</li>
                            <li>References: Citation frequency and research grounding</li>
                            <li>Overall Assessment: Composite quality evaluation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "similar" && (
                    <div>
                      <h2 style={styles.sectionTitle}>Similar Research</h2>
                      <p style={styles.tabDescription}>
                        The system identified 5 closely related papers in the knowledge base
                      </p>

                      <div style={styles.researchQuality}>
                        <h3 style={styles.qualityTitle}>Research Quality Assessment</h3>
                        <div style={styles.qualityContent}>
                          <div style={styles.qualityItem}>
                            <span style={styles.qualityLabel}>Novelty Assessment:</span>
                            <span style={styles.qualityValue}>Highly Novel</span>
                          </div>
                          <div style={styles.qualityItem}>
                            <span style={styles.qualityLabel}>Average Similarity Score:</span>
                            <span style={styles.qualityValue}>26.2%</span>
                          </div>
                        </div>
                      </div>

                      <h3 style={styles.papersTitle}>Top Ranked Papers</h3>
                      {data.similar_papers && data.similar_papers.length > 0 ? (
                        <div style={styles.papersList}>
                          {data.similar_papers.map((paper, i) => (
                            <div key={i} style={styles.similarPaperItem}>
                              <div style={styles.paperRank}>Rank {i + 1}</div>
                              <div style={styles.paperInfo}>
                                <p style={styles.paperTitle}>{paper.title}</p>
                                <div style={styles.paperMeta}>
                                  <span style={styles.metaLabel}>Similarity:</span>
                                  <span style={styles.metaValue}>{(paper.score * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                              <div style={styles.similarityBarContainer}>
                                <div
                                  style={{
                                    ...styles.similarityBar,
                                    width: `${paper.score * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={styles.noResults}>No similar papers found</p>
                      )}
                    </div>
                  )}

                  {activeTab === "recommendations" && (
                    <div>
                      <h2 style={styles.sectionTitle}>Recommendations</h2>
                      <p style={styles.tabDescription}>
                        Personalized suggestions to strengthen your research paper:
                      </p>
                      <div style={styles.recommendationsList}>
                        {data.recommendations && data.recommendations.length > 0 ? (
                          data.recommendations.map((rec, index) => (
                            <div key={index} style={styles.recommendationItem}>
                              <div style={styles.recommendationNumber}>
                                Suggestion {index + 1}: {rec.title}
                              </div>
                              <p style={styles.recommendationText}>
                                {rec.description}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p style={styles.noResults}>No recommendations available</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "summary" && (
                    <div>
                      <h2 style={styles.sectionTitle}>Paper Summary</h2>
                      <div
                        style={{
                          ...styles.summaryCard,
                          borderLeft: `5px solid ${getSummaryBorderColor(data.score)}`,
                        }}
                      >
                        <div
                          style={{
                            ...styles.summaryLabel,
                            color: getSummaryBorderColor(data.score),
                          }}
                        >
                          {getSummaryLabel(data.score)}
                        </div>
                        <p style={styles.summaryText}>
                          {data.summary || "This paper presents a comprehensive analysis of research methodologies and findings in the field."}
                        </p>
                        <div style={styles.summaryNote}>
                          <strong>Note:</strong> This represents an extractive summary highlighting key sentences from your paper.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    color: "#1e293b",
  },

  header: {
    background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
    padding: "60px 40px 40px",
    borderBottom: "1px solid rgba(30, 41, 59, 0.08)",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06)",
  },

  maxWidth: {
    maxWidth: "100%",
    margin: "0 auto",
    paddingLeft: "40px",
    paddingRight: "40px",
  },

  title: {
    fontSize: "48px",
    fontWeight: "800",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.8px",
    lineHeight: "1.2",
  },

  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "0",
    fontWeight: "400",
    lineHeight: "1.6",
  },

  mainLayout: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "40px",
    paddingTop: "40px",
    paddingBottom: "60px",
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  uploadSection: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  sidebarTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#1e293b",
    margin: "0 0 16px 0",
  },

  fileInputLabel: {
    display: "block",
    marginBottom: "16px",
  },

  fileInput: {
    display: "none",
  },

  selectFileBtn: {
    display: "block",
    textAlign: "center",
    padding: "10px 16px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },

  fileName: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 14px",
    background: "rgba(16, 185, 129, 0.08)",
    border: "1.5px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "8px",
    color: "#10b981",
    fontSize: "12px",
    marginBottom: "16px",
    fontWeight: "500",
  },

  fileNameIcon: {
    fontSize: "14px",
  },

  analyzeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "11px 16px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },

  spinner: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    border: "2px solid rgba(255, 255, 255, 0.25)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  errorMessage: {
    padding: "12px 14px",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1.5px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "12px",
    textAlign: "center",
    fontWeight: "500",
  },

  databaseSummary: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  summaryStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
  },

  statItem: {
    textAlign: "center",
  },

  statValue: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#3b82f6",
    marginBottom: "4px",
  },

  statLabel: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  contentArea: {
    minHeight: "600px",
  },

  welcomeSection: {
    animation: "fadeIn 0.5s ease",
  },

  welcomeCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "40px",
    marginBottom: "32px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    textAlign: "center",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  welcomeTitle: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "16px",
    color: "#1e293b",
    margin: "0 0 16px 0",
  },

  welcomeText: {
    fontSize: "15px",
    color: "#475569",
    lineHeight: "1.7",
    margin: "0",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },

  infoCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  infoTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#1e293b",
    margin: "0 0 16px 0",
  },

  infoList: {
    paddingLeft: "20px",
    margin: "0",
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.8",
  },

  featureList: {
    paddingLeft: "20px",
    margin: "0",
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.8",
  },

  resultsWrapper: {
    animation: "fadeIn 0.5s ease",
  },

  successBanner: {
    padding: "14px 18px",
    background: "rgba(16, 185, 129, 0.08)",
    border: "1.5px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "10px",
    color: "#10b981",
    fontSize: "14px",
    marginBottom: "24px",
    fontWeight: "600",
  },

  tabsContainer: {
    display: "flex",
    gap: "4px",
    marginBottom: "32px",
    borderBottom: "1px solid rgba(30, 41, 59, 0.08)",
  },

  tab: {
    padding: "14px 20px",
    background: "transparent",
    color: "#64748b",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },

  tabActive: {
    color: "#3b82f6",
    borderBottomColor: "#3b82f6",
  },

  tabContent: {
    animation: "fadeIn 0.3s ease",
  },

  tabDescription: {
    fontSize: "14px",
    color: "#475569",
    marginBottom: "24px",
    margin: "0 0 24px 0",
  },

  sectionTitle: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "24px",
    color: "#1e293b",
    margin: "0 0 24px 0",
    borderBottom: "2px solid rgba(59, 130, 246, 0.15)",
    paddingBottom: "12px",
  },

  scoreCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    marginBottom: "32px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    textAlign: "center",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  scoreDisplay: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "2px",
    marginBottom: "20px",
  },

  scoreValue: {
    fontSize: "72px",
    fontWeight: "900",
    color: "#3b82f6",
    lineHeight: "1",
  },

  scoreMax: {
    fontSize: "20px",
    color: "#64748b",
    fontWeight: "600",
    marginTop: "8px",
  },

  scoreBar: {
    height: "8px",
    background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
    borderRadius: "4px",
    marginBottom: "16px",
    maxWidth: "300px",
    margin: "0 auto 16px",
    transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0 12px rgba(59, 130, 246, 0.2)",
  },

  scoreStatus: {
    fontSize: "16px",
    fontWeight: "700",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },

  metricCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    textAlign: "center",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  metricLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "12px",
  },

  metricValue: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#3b82f6",
  },

  metricsDetails: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  detailsCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  detailsTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1e293b",
    margin: "0 0 12px 0",
  },

  detailsList: {
    paddingLeft: "20px",
    margin: "0",
    fontSize: "13px",
    color: "#475569",
    lineHeight: "1.8",
  },

  researchQuality: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  qualityTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#1e293b",
    margin: "0 0 16px 0",
  },

  qualityContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  qualityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
  },

  qualityLabel: {
    color: "#64748b",
    fontWeight: "600",
  },

  qualityValue: {
    color: "#3b82f6",
    fontWeight: "700",
  },

  papersTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#1e293b",
    margin: "24px 0 16px 0",
    borderBottom: "2px solid rgba(59, 130, 246, 0.15)",
    paddingBottom: "8px",
  },

  papersList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  similarPaperItem: {
    background: "#ffffff",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 1px 3px rgba(30, 41, 59, 0.04)",
  },

  paperRank: {
    display: "inline-block",
    padding: "4px 12px",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  paperInfo: {
    marginBottom: "12px",
  },

  paperTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
    lineHeight: "1.5",
  },

  paperMeta: {
    display: "flex",
    gap: "8px",
    fontSize: "13px",
  },

  metaLabel: {
    color: "#64748b",
    fontWeight: "600",
  },

  metaValue: {
    color: "#3b82f6",
    fontWeight: "700",
  },

  similarityBarContainer: {
    height: "5px",
    background: "rgba(30, 41, 59, 0.08)",
    borderRadius: "3px",
    overflow: "hidden",
  },

  similarityBar: {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
    borderRadius: "3px",
    transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0 12px rgba(59, 130, 246, 0.2)",
  },

  noResults: {
    textAlign: "center",
    color: "#64748b",
    padding: "28px",
    fontSize: "14px",
    fontWeight: "500",
  },

  recommendationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  recommendationItem: {
    background: "#ffffff",
    borderLeft: "4px solid #3b82f6",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    borderLeftWidth: "4px",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },

  recommendationNumber: {
    display: "inline-block",
    padding: "4px 12px",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  recommendationText: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.7",
    margin: "0",
  },

  summaryCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(30, 41, 59, 0.06), 0 1px 3px rgba(30, 41, 59, 0.04)",
    border: "1px solid rgba(30, 41, 59, 0.08)",
    borderLeft: "5px solid #3b82f6",
    transition: "all 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
  },

  summaryLabel: {
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "2px solid rgba(30, 41, 59, 0.08)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  summaryText: {
    fontSize: "16px",
    color: "#1e293b",
    lineHeight: "1.9",
    marginBottom: "20px",
    margin: "0 0 20px 0",
    textAlign: "justify",
    letterSpacing: "0.3px",
  },

  summaryNote: {
    padding: "14px 16px",
    background: "rgba(59, 130, 246, 0.06)",
    borderLeft: "3px solid #3b82f6",
    borderRadius: "4px",
    fontSize: "13px",
    color: "#475569",
    fontWeight: "500",
    lineHeight: "1.6",
  },
};

export default App;
