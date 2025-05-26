"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Search,
  Sparkles,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Newspaper,
  Activity,
  Shield,
} from "lucide-react"
import Link from "next/link"

interface ResearchData {
  symbol: string
  analysis: string
  signals: Array<{
    type: "BUY" | "SELL" | "HOLD"
    confidence: "HIGH" | "MEDIUM" | "LOW"
    timeframe: "SHORT" | "MEDIUM" | "LONG"
    reason: string
    target?: string
    stopLoss?: string
    entryPrice?: string
  }>
  marketData: any
  newsData?: any[]
  technicalIndicators?: any
  timestamp: string
  type: string
  query: string
}

export default function ResearchPage() {
  const [query, setQuery] = useState("")
  const [symbol, setSymbol] = useState("")
  const [assetType, setAssetType] = useState("stock")
  const [isResearching, setIsResearching] = useState(false)
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResearch = async () => {
    if (!query && !symbol) return

    setIsResearching(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: symbol || extractSymbol(query),
          query: query,
          type: assetType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate research")
      }

      const data = await response.json()
      setResearchData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Research failed")
    } finally {
      setIsResearching(false)
    }
  }

  const extractSymbol = (text: string): string => {
    // Extract potential symbols from the query
    const symbolMatch = text.match(/\b[A-Z]{2,5}\b/g)
    if (symbolMatch) return symbolMatch[0]

    // Common company names to symbols
    const companies: { [key: string]: string } = {
      apple: "AAPL",
      microsoft: "MSFT",
      google: "GOOGL",
      alphabet: "GOOGL",
      tesla: "TSLA",
      amazon: "AMZN",
      meta: "META",
      facebook: "META",
      nvidia: "NVDA",
      bitcoin: "BTC-USD",
      ethereum: "ETH-USD",
      dogecoin: "DOGE-USD",
      cardano: "ADA-USD",
      solana: "SOL-USD",
    }

    const lowerText = text.toLowerCase()
    for (const [company, sym] of Object.entries(companies)) {
      if (lowerText.includes(company)) return sym
    }

    return ""
  }

  const getSignalColor = (type: string) => {
    switch (type) {
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

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH":
        return "text-green-400"
      case "MEDIUM":
        return "text-yellow-400"
      case "LOW":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const formatPrice = (price: string | number) => {
    const num = typeof price === "string" ? Number.parseFloat(price) : price
    return num.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/images/onntix-logo.jpg" alt="onntix logo" className="w-8 h-8 object-contain filter invert" />
              </div>
              <span className="text-xl font-semibold text-white">onntix</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/analyzer">
                <Button variant="ghost" className="text-white/60 hover:text-white text-sm">
                  Analyzer
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="text-white/60 hover:text-white text-sm">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {!researchData ? (
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 inline-flex items-center px-4 py-2 rounded-full">
                <Brain className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm">AI-Powered Research • Analysis</span>
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                AI Research
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Assistant
                </span>
              </h1>

              <p className="text-xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
                Get comprehensive AI-powered analysis for any stock or cryptocurrency. Ask questions, get insights, and
                make informed decisions with real-time data and GPT-4 intelligence.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl max-w-2xl mx-auto">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto space-y-6">
                {/* Asset Type Selection */}
                <div className="flex justify-center space-x-4 mb-6">
                  <Button
                    onClick={() => setAssetType("stock")}
                    variant={assetType === "stock" ? "default" : "outline"}
                    className={
                      assetType === "stock" ? "bg-purple-600 text-white" : "border-white/20 text-white hover:bg-white/5"
                    }
                  >
                    📈 Stocks
                  </Button>
                  <Button
                    onClick={() => setAssetType("crypto")}
                    variant={assetType === "crypto" ? "default" : "outline"}
                    className={
                      assetType === "crypto"
                        ? "bg-purple-600 text-white"
                        : "border-white/20 text-white hover:bg-white/5"
                    }
                  >
                    🪙 Crypto
                  </Button>
                </div>

                {/* Symbol Input */}
                <div className="flex gap-3 items-stretch max-w-2xl mx-auto">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder={`Enter ${assetType} symbol (e.g., ${assetType === "stock" ? "AAPL, TSLA, NVDA" : "BTC, ETH, SOL"})`}
                    className="flex-1 h-14 bg-white/10 border border-white/20 rounded-2xl px-6 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Query Input */}
                <div className="flex gap-3 items-stretch max-w-4xl mx-auto">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask anything about the market... e.g., 'What's the outlook for Apple stock?' or 'Should I buy Bitcoin now?' or 'Technical analysis for Tesla'"
                      className="relative w-full h-32 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    />
                    <Sparkles className="absolute right-4 top-4 w-5 h-5 text-white/40" />
                  </div>

                  <Button
                    onClick={handleResearch}
                    disabled={(!query && !symbol) || isResearching}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 h-14 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed self-end"
                  >
                    {isResearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Researching
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Research
                      </>
                    )}
                  </Button>
                </div>

                {/* Example Queries */}
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  {[
                    "What's the technical analysis for Tesla stock?",
                    "Should I invest in Bitcoin right now?",
                    "What are the risks of investing in NVIDIA?",
                    "Compare Apple vs Microsoft for long-term investment",
                    "Is Ethereum a good buy at current prices?",
                    "What's driving Amazon stock price recently?",
                  ].map((exampleQuery, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(exampleQuery)}
                      className="text-white/40 hover:text-white transition-colors px-4 py-3 rounded-lg hover:bg-white/5 border border-white/10 text-left"
                    >
                      "{exampleQuery}"
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-2 text-white/40 mt-8">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Powered by OpenAI GPT-4 • Real-time Alpha Vantage Data</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Research Report: {researchData.symbol}</h1>
                  <p className="text-white/60">Generated on {new Date(researchData.timestamp).toLocaleString()}</p>
                  <p className="text-white/40 text-sm mt-1">Query: "{researchData.query}"</p>
                </div>
                <Button
                  onClick={() => {
                    setResearchData(null)
                    setQuery("")
                    setSymbol("")
                    setError(null)
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  New Research
                </Button>
              </div>

              {/* Market Data */}
              {researchData.marketData && (
                <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                    Real-time Market Data
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        ${formatPrice(researchData.marketData["05. price"])}
                      </div>
                      <div className="text-white/60 text-sm">Current Price</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold flex items-center justify-center ${
                          Number.parseFloat(researchData.marketData["09. change"]) > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {Number.parseFloat(researchData.marketData["09. change"]) > 0 ? (
                          <TrendingUp className="w-5 h-5 mr-1" />
                        ) : (
                          <TrendingDown className="w-5 h-5 mr-1" />
                        )}
                        {researchData.marketData["10. change percent"]}
                      </div>
                      <div className="text-white/60 text-sm">Daily Change</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {Number.parseInt(researchData.marketData["06. volume"]).toLocaleString()}
                      </div>
                      <div className="text-white/60 text-sm">Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        ${formatPrice(researchData.marketData["03. high"])} / $
                        {formatPrice(researchData.marketData["04. low"])}
                      </div>
                      <div className="text-white/60 text-sm">Day Range</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Technical Indicators */}
              {researchData.technicalIndicators && (
                <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-400" />
                    Technical Indicators
                  </h3>
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">
                        ${researchData.technicalIndicators.support}
                      </div>
                      <div className="text-white/60 text-sm">Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-400">
                        ${researchData.technicalIndicators.resistance}
                      </div>
                      <div className="text-white/60 text-sm">Resistance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-400">
                        {researchData.technicalIndicators.volatility}
                      </div>
                      <div className="text-white/60 text-sm">Volatility</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xl font-bold ${
                          researchData.technicalIndicators.momentum === "Bullish"
                            ? "text-green-400"
                            : researchData.technicalIndicators.momentum === "Bearish"
                              ? "text-red-400"
                              : "text-yellow-400"
                        }`}
                      >
                        {researchData.technicalIndicators.momentum}
                      </div>
                      <div className="text-white/60 text-sm">Momentum</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">{researchData.technicalIndicators.rsi}</div>
                      <div className="text-white/60 text-sm">RSI Signal</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Trading Signals */}
              {researchData.signals && researchData.signals.length > 0 && (
                <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-400" />
                    AI Trading Signals
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {researchData.signals.map((signal, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={getSignalColor(signal.type)}>{signal.type}</Badge>
                          <span className={`text-sm font-medium ${getConfidenceColor(signal.confidence)}`}>
                            {signal.confidence}
                          </span>
                        </div>
                        <div className="text-white/60 text-sm mb-2 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {signal.timeframe} Term
                        </div>
                        <p className="text-white text-sm mb-3">{signal.reason}</p>

                        <div className="space-y-1 text-xs">
                          {signal.target && (
                            <div className="text-green-400 flex items-center">
                              <Target className="w-3 h-3 mr-1" />
                              Target: {signal.target}
                            </div>
                          )}
                          {signal.stopLoss && (
                            <div className="text-red-400 flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              Stop Loss: {signal.stopLoss}
                            </div>
                          )}
                          {signal.entryPrice && (
                            <div className="text-blue-400 flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              Entry: {signal.entryPrice}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* News Sentiment */}
              {researchData.newsData && researchData.newsData.length > 0 && (
                <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Newspaper className="w-5 h-5 mr-2 text-blue-400" />
                    Recent News & Sentiment
                  </h3>
                  <div className="space-y-3">
                    {researchData.newsData.map((news, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-start justify-between">
                          <h4 className="text-white font-medium text-sm mb-1 flex-1">{news.title}</h4>
                          <Badge
                            className={`ml-2 ${
                              news.overall_sentiment_label === "Bullish"
                                ? "bg-green-500/20 text-green-400"
                                : news.overall_sentiment_label === "Bearish"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {news.overall_sentiment_label}
                          </Badge>
                        </div>
                        <p className="text-white/60 text-xs">
                          {news.source} • {new Date(news.time_published).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* AI Analysis */}
              <Card className="p-6 bg-black border-white/10 rounded-3xl">
                <div className="flex items-center mb-4">
                  <Brain className="w-5 h-5 text-purple-400 mr-2" />
                  <h3 className="text-xl font-semibold text-white">Analysis</h3>
                </div>
                <div className="prose max-w-none">
                  <div className="text-white/90 leading-relaxed whitespace-pre-wrap">{researchData.analysis}</div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-white/60">Powered by:</span>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">AI Model</Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Alpha Vantage</Badge>
                    </div>
                    <span className="text-white/40">Analysis generated in real-time</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
