"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Activity,
  Brain,
  MessageCircle,
  Send,
  X,
  ChevronDown,
  Zap,
  Layers,
  Terminal,
  ChevronRight,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message: "Hi! I'm here to help you analyze markets with AI. What insights are you looking for?",
    },
  ])
  const [scrollY, setScrollY] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedMarket, setSelectedMarket] = useState("stocks")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)

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

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 5000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(interval)
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

    if (lowerMessage.includes("trend") || lowerMessage.includes("predict")) {
      return "Our AI analyzes millions of data points using advanced ML models to predict market trends with up to 94% accuracy."
    } else if (lowerMessage.includes("data") || lowerMessage.includes("source")) {
      return "We aggregate real-time data from 50+ sources including exchanges, news, and social sentiment - all completely free!"
    } else if (lowerMessage.includes("alert") || lowerMessage.includes("notification")) {
      return "Set custom alerts for any market condition. Get notified instantly when opportunities arise."
    } else {
      return "I can help you with market analysis, predictions, data sources, and setting up alerts. What would you like to explore?"
    }
  }

  const handleAnalyze = async () => {
    if (!searchQuery) return

    setIsAnalyzing(true)

    // Simulate API call
    setTimeout(() => {
      // Mock data - in real app, this would come from your API
      const mockData = {
        name: searchQuery.includes("META") ? "Meta Platforms Inc." : "Asset Name",
        symbol: searchQuery.includes("META") ? "META" : "SYMBOL",
        price: "485.32",
        change: 2.4,
        marketCap: "$1.25T",
        volume: "$28.5B",
        high52w: "$542.81",
        low52w: "$379.16",
        analysis:
          "Based on current market conditions and technical indicators, META shows strong bullish momentum. The stock has broken through key resistance levels and is trading above both 50-day and 200-day moving averages. Recent earnings beat expectations, driving institutional interest.",
        sentiment: "Bullish",
        confidence: 87,
      }

      setAnalysisData(mockData)
      setShowResults(true)
      setIsAnalyzing(false)
    }, 2000)
  }

  const platforms = [
    { name: "Stocks", icon: "📈", count: "50K+" },
    { name: "Crypto", icon: "🪙", count: "10K+" },
    { name: "Forex", icon: "💱", count: "180+" },
    { name: "Commodities", icon: "🛢️", count: "500+" },
    { name: "Indices", icon: "📊", count: "100+" },
    { name: "Real Estate", icon: "🏠", count: "1M+" },
    { name: "Bonds", icon: "📜", count: "5K+" },
    { name: "Options", icon: "🎯", count: "100K+" },
  ]

  const features = [
    {
      title: "Real-time Analysis",
      description: "Process millions of data points per second with our distributed computing infrastructure",
      icon: <Activity className="w-6 h-6" />,
    },
    {
      title: "AI Predictions",
      description: "Advanced neural networks trained on 10+ years of historical data for accurate forecasting",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      title: "Custom Dashboards",
      description: "Build personalized analytics dashboards with drag-and-drop simplicity",
      icon: <Layers className="w-6 h-6" />,
    },
  ]

  const faqs = [
    {
      question: "What is onntix Market Analyzer?",
      answer:
        "onntix is a free, open-source market analytics platform that uses AI to provide real-time insights, predictions, and portfolio management tools for traders and investors.",
    },
    {
      question: "Is onntix really free for everyone?",
      answer:
        "Yes! onntix is 100% free and open-source. We believe financial analytics should be accessible to everyone, not just institutions.",
    },
    {
      question: "What data sources does onntix use?",
      answer:
        "We aggregate data from 50+ public APIs including Yahoo Finance, Alpha Vantage, CoinGecko, and more, ensuring comprehensive market coverage.",
    },
    {
      question: "How accurate are the AI predictions?",
      answer:
        "Our models achieve 85-94% accuracy depending on the market and timeframe, using LSTM, Prophet, and ensemble methods.",
    },
    {
      question: "Can I contribute to the project?",
      answer:
        "onntix is open-source on GitHub. We welcome contributions from developers, data scientists, and traders.",
    },
  ]

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
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/images/onntix-logo.jpg" alt="onntix logo" className="w-8 h-8 object-contain filter invert" />
              </div>
              <span className="text-xl font-semibold text-white">onntix</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-white/60 hover:text-white transition-colors text-sm">
                Features
              </Link>
              <Link href="/analyzer" className="text-white/60 hover:text-white transition-colors text-sm">
                Analyzer
              </Link>
              <Link href="/research" className="text-white/60 hover:text-white transition-colors text-sm">
                AI Research
              </Link>
              <Link href="#developers" className="text-white/60 hover:text-white transition-colors text-sm">
                Developers
              </Link>
              <Link href="#community" className="text-white/60 hover:text-white transition-colors text-sm">
                Community
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/5 text-sm"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <Github className="w-4 h-4 mr-2" />
                Star on GitHub
              </Button>
              <Link href="/analyzer">
                <Button className="bg-white text-black hover:bg-white/90 text-sm font-medium">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Spline */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Spline 3D Background */}
        <div
          className="absolute inset-0 w-full h-full z-20"
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-10 pointer-events-none" />

        {/* Chatbot Widget */}
        <div className="absolute bottom-6 right-6 z-50">
          {!isChatOpen ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Button
                onClick={() => setIsChatOpen(true)}
                className="relative bg-black/80 backdrop-blur-xl border border-white/10 text-white hover:bg-black/90 transition-all duration-300 rounded-2xl px-6 py-3"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI Assistant
              </Button>
            </div>
          ) : (
            <Card className="w-80 h-96 bg-black/80 backdrop-blur-xl border-white/10 flex flex-col rounded-2xl">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-sm">AI Assistant</span>
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
                    placeholder="Ask about market insights..."
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
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-30 max-w-4xl mx-auto px-6">
          <div className="text-center">
            <Badge className="mb-6 bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 inline-flex items-center px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm">AI-Powered Analysis • Free Forever</span>
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight tracking-tight">
              Markets beyond
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                imagination
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              One query away from comprehensive market insights
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/analyzer">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-xl">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/research">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-lg rounded-xl"
                >
                  <Brain className="mr-2 w-5 h-5" />
                  AI Research
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-2 text-white/40">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Analyzing 2.4M+ data points in real-time</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30 pointer-events-none">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* Platform Icons Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <p className="text-center text-white/40 text-sm mb-8">Available across all major markets</p>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
                  <div className="text-3xl mb-2">{platform.icon}</div>
                  <div className="text-white/80 font-medium text-sm">{platform.name}</div>
                  <div className="text-purple-400 text-xs mt-1">{platform.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Get the most out of
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                market analytics
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative cursor-pointer ${activeFeature === index ? "scale-105" : ""}`}
                onClick={() => setActiveFeature(index)}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl blur-2xl transition-opacity duration-500 ${
                    activeFeature === index ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
                <Card
                  className={`relative h-full p-8 bg-white/5 backdrop-blur-xl border transition-all duration-500 rounded-3xl ${
                    activeFeature === index ? "border-purple-500/50 bg-white/10" : "border-white/10"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                      activeFeature === index ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-white/10"
                    }`}
                  >
                    <div className={activeFeature === index ? "text-white" : "text-purple-400"}>{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                  <div className="mt-6">
                    <Link
                      href="#"
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                    >
                      Learn more
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-purple-900/10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-purple-500/10 border-purple-500/20 text-purple-400">
                <Terminal className="w-4 h-4 mr-2" />
                Developer First
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Build with
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  powerful APIs
                </span>
              </h2>
              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                Access our comprehensive REST and WebSocket APIs. Build custom trading bots, analytics dashboards, or
                integrate market data into your applications.
              </p>
              <div className="flex items-center space-x-4">
                <Button className="bg-white text-black hover:bg-white/90">
                  View Documentation
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  <Github className="mr-2 w-4 h-4" />
                  See Examples
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
              <Card className="relative bg-black/60 backdrop-blur-xl border-white/10 rounded-3xl overflow-hidden">
                <div className="flex items-center space-x-2 px-6 py-4 border-b border-white/10">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-white/40 text-sm">market-analyzer.js</span>
                </div>
                <div className="p-6 font-mono text-sm">
                  <div className="text-white/40">
                    <span className="text-purple-400">import</span> {"{"} MarketAnalyzer {"}"}{" "}
                    <span className="text-purple-400">from</span> <span className="text-green-400">'@onntix/sdk'</span>;
                  </div>
                  <div className="mt-4 text-white/40">
                    <span className="text-purple-400">const</span> analyzer ={" "}
                    <span className="text-purple-400">new</span> <span className="text-yellow-400">MarketAnalyzer</span>
                    ({"{"}
                  </div>
                  <div className="text-white/40 ml-4">
                    apiKey: <span className="text-green-400">'your-free-api-key'</span>,
                  </div>
                  <div className="text-white/40 ml-4">
                    markets: [<span className="text-green-400">'stocks'</span>,{" "}
                    <span className="text-green-400">'crypto'</span>]
                  </div>
                  <div className="text-white/40">{"}"});</div>
                  <div className="mt-4 text-white/40">
                    <span className="text-purple-400">const</span> prediction ={" "}
                    <span className="text-purple-400">await</span> analyzer.
                    <span className="text-yellow-400">predictTrend</span>({"{"}
                  </div>
                  <div className="text-white/40 ml-4">
                    symbol: <span className="text-green-400">'AAPL'</span>,
                  </div>
                  <div className="text-white/40 ml-4">
                    timeframe: <span className="text-green-400">'7d'</span>,
                  </div>
                  <div className="text-white/40 ml-4">
                    confidence: <span className="text-blue-400">0.85</span>
                  </div>
                  <div className="text-white/40">{"}"});</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">
            Frequently asked
            <br />
            questions
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium">
                  General
                </button>
                <button className="w-full text-left px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm">
                  Features
                </button>
                <button className="w-full text-left px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm">
                  Privacy
                </button>
                <button className="w-full text-left px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm">
                  Open Source
                </button>
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-white/10 pb-4"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left py-4 group"
                  >
                    <span className="text-white font-medium pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-white/40 transition-transform duration-300 ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFaq === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="text-white/60 pb-4">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Start analyzing
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              markets today
            </span>
          </h2>
          <p className="text-xl text-white/60 mb-8 leading-relaxed">
            Join thousands of traders using AI-powered insights.
            <br />
            Free forever. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyzer">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-xl">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/research">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-lg rounded-xl"
              >
                <Brain className="mr-2 w-5 h-5" />
                AI Research
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src="/images/onntix-logo.jpg"
                    alt="onntix logo"
                    className="w-8 h-8 object-contain filter invert"
                  />
                </div>
                <span className="text-xl font-semibold text-white">onntix</span>
              </div>
              <p className="text-white/40 mb-6 max-w-sm">
                Open-source market analytics powered by AI. Free forever for everyone.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-white/40 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-white/40 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-white/40 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Product</h4>
              <div className="space-y-3">
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  Features
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  Analytics
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  API Docs
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Developers</h4>
              <div className="space-y-3">
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  Documentation
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  API Reference
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  SDKs
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  Examples
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Community</h4>
              <div className="space-y-3">
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  GitHub
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  Discord
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  Forum
                </Link>
                <Link href="#" className="block text-white/40 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} onntix. MIT License.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                Terms
              </Link>
              <Link href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                Privacy
              </Link>
              <Link href="#" className="text-white/40 hover:text-white transition-colors text-sm">
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
