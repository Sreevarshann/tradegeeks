"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Brain,
  MessageCircle,
  Send,
  X,
  Sparkles,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  Target,
  Shield,
  DollarSign,
  Clock,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface StockAnalysis {
  symbol: string
  companyName: string
  currentPrice: string
  change: string
  changePercent: string
  volume: string
  marketCap?: string
  dayHigh: string
  dayLow: string
  previousClose: string
  open: string
  sector: string
  analysis: string
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL"
  confidence: number
  keyMetrics?: {
    peRatio: string
    eps: string
    dividend: string
    beta: string
    roe?: string
    debtToEquity?: string
  }
  technicalIndicators?: {
    support: string
    resistance: string
    rsi: string
    sma50: string
    sma200: string
    trend?: string
  }
  priceTargets?: {
    shortTerm: string
    mediumTerm: string
    longTerm: string
  }
  riskAnalysis?: {
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH"
    riskFactors: string[]
    riskMitigation: string[]
  }
  opportunities?: string[]
  recommendation?: {
    action: "BUY" | "SELL" | "HOLD"
    reasoning: string
    timeHorizon: "SHORT" | "MEDIUM" | "LONG"
    positionSize: string
  }
  marketContext?: {
    economicFactors: string
    sectorPerformance: string
    competitivePosition: string
  }
  chartData: Array<{
    date: string
    price: number
    volume: number
  }>
  timestamp: string
  source: string
  disclaimer: string
  dataFreshness: string
}

export default function AnalyzerPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message:
        "Hi! I'm your AI analyst. Enter any stock symbol or company name for real-time analysis with comprehensive risk assessment.",
    },
  ])
  const [scrollY, setScrollY] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [analysisData, setAnalysisData] = useState<StockAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load Spline viewer script with proper error handling
    const loadSplineScript = async () => {
      try {
        const script = document.createElement("script")
        script.type = "module"
        script.src = "/spline-viewer.js"
        script.onload = () => {
          console.log("Spline viewer script loaded successfully")
        }
        script.onerror = () => {
          console.error("Failed to load Spline viewer script")
          // Add fallback styling to spline containers
          const splineContainers = document.querySelectorAll("spline-viewer")
          splineContainers.forEach((container) => {
            container.style.background = `
            radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)
          `
          })
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error("Error loading Spline script:", error)
      }
    }

    loadSplineScript()

    // Scroll effect
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const newMessages = [
      ...chatMessages,
      { type: "user", message: chatMessage },
      { type: "bot", message: getBotResponse(chatMessage) },
    ]
    setChatMessages(newMessages)
    setChatMessage("")
  }

  const getBotResponse = (message: string) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("risk") || lowerMessage.includes("safe")) {
      return "I provide comprehensive risk analysis including risk level assessment, specific risk factors, and mitigation strategies. All investments carry risk - please do your own research."
    } else if (lowerMessage.includes("real-time") || lowerMessage.includes("current")) {
      return "I use OpenAI's latest knowledge to provide the most current stock data and market analysis available, including recent price movements and market conditions."
    } else if (
      lowerMessage.includes("recommendation") ||
      lowerMessage.includes("buy") ||
      lowerMessage.includes("sell")
    ) {
      return "My recommendations are based on thorough risk-reward analysis, considering technical indicators, fundamentals, and market context. Remember this is for educational purposes only."
    } else if (lowerMessage.includes("how") && (lowerMessage.includes("work") || lowerMessage.includes("analyze"))) {
      return "I analyze stocks using multiple factors: current market data, technical indicators, fundamental analysis, risk assessment, and market context to provide comprehensive insights."
    } else {
      return "I can analyze any stock with real-time data, risk assessment, and actionable recommendations. Just enter a stock symbol or company name!"
    }
  }

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      console.log(`Analyzing: ${searchQuery}`)

      const response = await fetch("/api/stock-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: searchQuery.includes(" ") ? "" : searchQuery,
          query: searchQuery,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate analysis")
      }

      const data = await response.json()

      // Validate the response data
      if (!data.symbol || !data.analysis) {
        throw new Error("Invalid analysis data received")
      }

      console.log("Analysis received for:", data.companyName, data.symbol)
      setAnalysisData(data)
      setShowResults(true)
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze stock"
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    handleAnalyze()
  }

  const formatVolume = (volume: string): string => {
    const num = Number.parseInt(volume.replace(/,/g, ""))
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return volume
  }

  const prepareChartData = (chartData: StockAnalysis["chartData"]) => {
    return chartData.map((point) => ({
      date: new Date(point.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: point.price,
      volume: point.volume,
    }))
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "BULLISH":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "BEARISH":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "NEUTRAL":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case "BUY":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "SELL":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "HOLD":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "LOW":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "HIGH":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "VERY HIGH":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float-slow"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src="/images/onntix-logo.jpg"
                    alt="onntix logo"
                    className="w-8 h-8 object-contain filter invert"
                  />
                </div>
                <span className="text-xl font-semibold text-white">onntix</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/research">
                <Button variant="ghost" className="text-white/60 hover:text-white text-sm">
                  AI Research
                </Button>
              </Link>
              <Button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all duration-300 text-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {isChatOpen ? "Close Chat" : "Open Chat"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Section with Spline */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Spline 3D Background */}
        <div
          className="absolute inset-0 w-full h-full z-10 opacity-50"
          style={{
            background: `
    radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)
  `,
          }}
        >
          <spline-viewer
            url="https://prod.spline.design/jmNYkBWTHJAGLnkA/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-20 pointer-events-none" />

        {/* Chatbot Widget */}
        {isChatOpen && (
          <div className="fixed top-24 right-6 z-50">
            <Card className="w-80 h-96 bg-black/80 backdrop-blur-xl border-white/10 flex flex-col rounded-2xl">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-sm">AI Risk Analyst</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/60 hover:text-white h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-xl text-sm ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-white/5 text-white/90 border border-white/10"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about risk analysis..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-30 max-w-6xl mx-auto px-6">
          {!showResults ? (
            <div className="glass-strong p-10 rounded-3xl">
              <div className="text-center mb-8">
                <Badge className="mb-6 bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 inline-flex items-center px-4 py-2 rounded-full">
                  <Brain className="w-4 h-4 mr-2 text-purple-400" />
                  <span className="text-sm">Real-time Analysis • Risk Assessment • OpenAI GPT-4</span>
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight tracking-tight">
                  AI Stock
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    Risk Analyzer
                  </span>
                </h1>

                <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                  Get real-time stock analysis with comprehensive risk assessment, current market data, and AI-powered
                  investment recommendations
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                    <Button
                      onClick={handleRetry}
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex gap-3 items-stretch">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                      placeholder="Enter stock symbol (TSLA, NVDA) or company name (Tesla, NVIDIA)..."
                      className="relative w-full h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!searchQuery.trim() || isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 h-14 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        Analyze
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-6 text-sm text-white/40">
                  <button onClick={() => setSearchQuery("Tesla")} className="hover:text-white transition-colors">
                    Try: "Tesla"
                  </button>
                  <span>•</span>
                  <button onClick={() => setSearchQuery("NVIDIA")} className="hover:text-white transition-colors">
                    Try: "NVIDIA"
                  </button>
                  <span>•</span>
                  <button onClick={() => setSearchQuery("Microsoft")} className="hover:text-white transition-colors">
                    Try: "Microsoft"
                  </button>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-2 text-white/40">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Real-time Data • Risk Analysis • Current Market Conditions</span>
              </div>
            </div>
          ) : (
            <div className="glass-strong p-10 rounded-3xl max-w-full">
              <Button
                onClick={() => {
                  setShowResults(false)
                  setAnalysisData(null)
                  setError(null)
                }}
                variant="ghost"
                className="mb-6 text-white/60 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                New Analysis
              </Button>

              {analysisData && (
                <div className="space-y-8">
                  {/* Stock Header */}
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">{analysisData.companyName}</h2>
                    <div className="flex items-center justify-center space-x-4 mb-2">
                      <span className="text-3xl font-bold text-white">${analysisData.currentPrice}</span>
                      <div className="flex items-center space-x-1">
                        {Number.parseFloat(analysisData.change) > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                        <span
                          className={`text-lg font-medium ${Number.parseFloat(analysisData.change) > 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {Number.parseFloat(analysisData.change) > 0 ? "+" : ""}
                          {analysisData.change} ({Number.parseFloat(analysisData.changePercent) > 0 ? "+" : ""}
                          {analysisData.changePercent}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-white/60">
                      <span>Symbol: {analysisData.symbol}</span>
                      <span>•</span>
                      <span>Sector: {analysisData.sector}</span>
                      {analysisData.marketCap && (
                        <>
                          <span>•</span>
                          <span>Market Cap: {analysisData.marketCap}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-white/40 text-sm">
                      {analysisData.dataFreshness} • Updated: {new Date(analysisData.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {/* AI Analysis Summary */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl text-center">
                      <div className="text-white/60 text-sm mb-1">AI Sentiment</div>
                      <Badge className={getSentimentColor(analysisData.sentiment)}>{analysisData.sentiment}</Badge>
                    </Card>
                    <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl text-center">
                      <div className="text-white/60 text-sm mb-1">Confidence</div>
                      <div className="text-white font-semibold text-lg">{analysisData.confidence}%</div>
                    </Card>
                    <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl text-center">
                      <div className="text-white/60 text-sm mb-1">Risk Level</div>
                      {analysisData.riskAnalysis && (
                        <Badge className={getRiskLevelColor(analysisData.riskAnalysis.riskLevel)}>
                          {analysisData.riskAnalysis.riskLevel}
                        </Badge>
                      )}
                    </Card>
                    <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl text-center">
                      <div className="text-white/60 text-sm mb-1">Recommendation</div>
                      {analysisData.recommendation && (
                        <Badge className={getRecommendationColor(analysisData.recommendation.action)}>
                          {analysisData.recommendation.action}
                        </Badge>
                      )}
                    </Card>
                  </div>

                  {/* Interactive Chart */}
                  <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                      Real-time Price Chart - {analysisData.companyName}
                    </h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={prepareChartData(analysisData.chartData)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                          <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} domain={["dataMin - 1", "dataMax + 1"]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(0,0,0,0.8)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "8px",
                              color: "white",
                            }}
                            formatter={(value: any, name: string) => [`$${Number(value).toFixed(2)}`, "Price"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="url(#gradient)"
                            strokeWidth={3}
                            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: "#a855f7" }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { label: "Volume", value: formatVolume(analysisData.volume) },
                      { label: "Day High", value: `$${analysisData.dayHigh}` },
                      { label: "Day Low", value: `$${analysisData.dayLow}` },
                      { label: "Previous Close", value: `$${analysisData.previousClose}` },
                    ].map((metric, index) => (
                      <Card key={index} className="p-4 bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                        <div className="text-white/60 text-sm mb-1">{metric.label}</div>
                        <div className="text-white font-semibold text-lg">{metric.value}</div>
                      </Card>
                    ))}
                  </div>

                  {/* Enhanced Recommendation */}
                  {analysisData.recommendation && (
                    <Card className="p-6 bg-glitter-green border-white/10 rounded-3xl">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-green-800" />
                        AI Investment Recommendation
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <Badge className={getRecommendationColor(analysisData.recommendation.action)}>
                            {analysisData.recommendation.action}
                          </Badge>
                          <div className="text-white/60 text-sm mt-1">Action</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">{analysisData.recommendation.timeHorizon}</div>
                          <div className="text-white/60 text-sm">Time Horizon</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">{analysisData.recommendation.positionSize}</div>
                          <div className="text-white/60 text-sm">Position Size</div>
                        </div>
                      </div>
                      <div className="bg-black/5 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-2">Reasoning:</h4>
                        <p className="text-white/90 text-sm leading-relaxed">{analysisData.recommendation.reasoning}</p>
                      </div>
                    </Card>
                  )}

                  {/* Risk Analysis */}
                  {analysisData.riskAnalysis && (
                    <Card className="p-6 bg-red-500/5 backdrop-blur-xl border-red-500/20 rounded-3xl">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                        Comprehensive Risk Analysis
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-red-400" />
                            Risk Factors
                          </h4>
                          <ul className="space-y-2">
                            {analysisData.riskAnalysis.riskFactors.map((risk, index) => (
                              <li key={index} className="text-white/80 text-sm flex items-start">
                                <span className="text-red-400 mr-2 mt-1">•</span>
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-green-400" />
                            Risk Mitigation
                          </h4>
                          <ul className="space-y-2">
                            {analysisData.riskAnalysis.riskMitigation.map((mitigation, index) => (
                              <li key={index} className="text-white/80 text-sm flex items-start">
                                <span className="text-green-400 mr-2 mt-1">•</span>
                                {mitigation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Key Financial Metrics */}
                  {analysisData.keyMetrics && (
                    <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                      <h3 className="text-lg font-semibold text-white mb-4">Key Financial Metrics</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{analysisData.keyMetrics.peRatio}</div>
                          <div className="text-white/60 text-sm">P/E Ratio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">${analysisData.keyMetrics.eps}</div>
                          <div className="text-white/60 text-sm">EPS</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{analysisData.keyMetrics.dividend}</div>
                          <div className="text-white/60 text-sm">Dividend Yield</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{analysisData.keyMetrics.beta}</div>
                          <div className="text-white/60 text-sm">Beta</div>
                        </div>
                        {analysisData.keyMetrics.roe && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{analysisData.keyMetrics.roe}</div>
                            <div className="text-white/60 text-sm">ROE</div>
                          </div>
                        )}
                        {analysisData.keyMetrics.debtToEquity && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{analysisData.keyMetrics.debtToEquity}</div>
                            <div className="text-white/60 text-sm">Debt/Equity</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Price Targets */}
                  {analysisData.priceTargets && (
                    <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-green-400" />
                        AI Price Targets
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                          <div className="text-green-400 text-2xl font-bold">
                            ${analysisData.priceTargets.shortTerm}
                          </div>
                          <div className="text-white/60 text-sm">1-3 Months</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                          <div className="text-blue-400 text-2xl font-bold">
                            ${analysisData.priceTargets.mediumTerm}
                          </div>
                          <div className="text-white/60 text-sm">6-12 Months</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                          <div className="text-purple-400 text-2xl font-bold">
                            ${analysisData.priceTargets.longTerm}
                          </div>
                          <div className="text-white/60 text-sm">1-2 Years</div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Technical Indicators */}
                  {analysisData.technicalIndicators && (
                    <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                      <h3 className="text-lg font-semibold text-white mb-4">Technical Indicators</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          {
                            indicator: "Support",
                            value: `$${analysisData.technicalIndicators.support}`,
                            status: "Key Level",
                          },
                          {
                            indicator: "Resistance",
                            value: `$${analysisData.technicalIndicators.resistance}`,
                            status: "Key Level",
                          },
                          { indicator: "RSI", value: analysisData.technicalIndicators.rsi, status: "Momentum" },
                          {
                            indicator: "50-day SMA",
                            value: `$${analysisData.technicalIndicators.sma50}`,
                            status: "Trend",
                          },
                          {
                            indicator: "200-day SMA",
                            value: `$${analysisData.technicalIndicators.sma200}`,
                            status: "Long-term Trend",
                          },
                          {
                            indicator: "Trend",
                            value: analysisData.technicalIndicators.trend || "Neutral",
                            status: "Direction",
                          },
                        ].map((tech, index) => (
                          <div key={index} className="flex justify-between items-center py-2">
                            <span className="text-white/60">{tech.indicator}</span>
                            <div className="text-right">
                              <span className="text-white font-medium">{tech.value}</span>
                              <span className="text-white/40 text-xs ml-2">{tech.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Market Context */}
                  {analysisData.marketContext && (
                    <Card className="p-6 bg-blue-500/5 backdrop-blur-xl border-blue-500/20 rounded-3xl">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                        Market Context
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white font-medium mb-2">Economic Factors</h4>
                          <p className="text-white/80 text-sm">{analysisData.marketContext.economicFactors}</p>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-2">Sector Performance</h4>
                          <p className="text-white/80 text-sm">{analysisData.marketContext.sectorPerformance}</p>
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-2">Competitive Position</h4>
                          <p className="text-white/80 text-sm">{analysisData.marketContext.competitivePosition}</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Growth Opportunities */}
                  {analysisData.opportunities && (
                    <Card className="p-6 bg-green-500/5 backdrop-blur-xl border-green-500/20 rounded-3xl">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                        Growth Opportunities
                      </h3>
                      <ul className="space-y-2">
                        {analysisData.opportunities.map((opportunity, index) => (
                          <li key={index} className="text-white/80 text-sm flex items-start">
                            <span className="text-green-400 mr-2 mt-1">•</span>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* AI Analysis */}
                  <Card className="p-6 bg-glitter-green border-white/10 rounded-3xl">
                    <div className="flex items-center mb-4">
                      <Brain className="w-5 h-5 text-green-800 mr-2" />
                      <h3 className="text-xl font-semibold text-white">Comprehensive AI Analysis</h3>
                    </div>
                    <div className="prose max-w-none">
                      <div className="text-white/90 leading-relaxed whitespace-pre-wrap">{analysisData.analysis}</div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-white/80">Powered by:</span>
                          <Badge className="bg-green-500/20 text-green-800 border-green-500/30">OpenAI GPT-4</Badge>
                          <Badge className="bg-blue-500/20 text-blue-800 border-blue-500/30">Real-time Data</Badge>
                        </div>
                        <span className="text-white/60">
                          Generated: {new Date(analysisData.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-white/60">{analysisData.disclaimer}</div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
