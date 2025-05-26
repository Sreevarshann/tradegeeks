import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const ALPHA_VANTAGE_API_KEY = "9FZJ4DUD8HXH8TI7"

export async function POST(request: NextRequest) {
  try {
    const { symbol, query, type = "stock" } = await request.json()

    if (!symbol && !query) {
      return NextResponse.json({ error: "Symbol or query is required" }, { status: 400 })
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Get real market data first
    let marketData = null
    let newsData = null

    if (symbol) {
      try {
        // Get market data
        const marketResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
        )
        const data = await marketResponse.json()
        marketData = data["Global Quote"]

        // Get news sentiment (if available)
        try {
          const newsResponse = await fetch(
            `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}&limit=5`,
          )
          const newsJson = await newsResponse.json()
          if (newsJson.feed && newsJson.feed.length > 0) {
            newsData = newsJson.feed.slice(0, 3) // Top 3 news items
          }
        } catch (error) {
          console.warn("News data not available:", error)
        }
      } catch (error) {
        console.warn("Failed to fetch market data:", error)
      }
    }

    // Prepare context for AI
    let context = ""
    if (marketData) {
      const price = Number.parseFloat(marketData["05. price"])
      const change = Number.parseFloat(marketData["09. change"])
      const changePercent = marketData["10. change percent"]
      const volume = marketData["06. volume"]
      const high = marketData["03. high"]
      const low = marketData["04. low"]

      context = `
Current market data for ${symbol}:
- Current Price: $${price.toFixed(2)}
- Daily Change: ${change > 0 ? "+" : ""}${change.toFixed(2)} (${changePercent})
- Volume: ${Number.parseInt(volume).toLocaleString()}
- Day High: $${Number.parseFloat(high).toFixed(2)}
- Day Low: $${Number.parseFloat(low).toFixed(2)}
- Previous Close: $${Number.parseFloat(marketData["08. previous close"]).toFixed(2)}

Market Sentiment: ${change > 0 ? "Positive (Green)" : "Negative (Red)"}
`
    }

    // Add news context if available
    if (newsData && newsData.length > 0) {
      context += `\nRecent News Headlines:\n`
      newsData.forEach((news: any, index: number) => {
        context += `${index + 1}. ${news.title} (Sentiment: ${news.overall_sentiment_label})\n`
      })
    }

    // Enhanced AI research prompt
    const prompt = `
You are an expert financial analyst providing research insights for the onntix platform. You have access to real-time market data and should provide actionable, data-driven analysis.

${context}

User Query: ${query || `Provide comprehensive analysis for ${symbol} ${type}`}

Please provide a detailed analysis covering:

1. **Current Market Position**: Analyze the current price action, volume, and recent performance
2. **Technical Analysis**: Key support/resistance levels, trend analysis, momentum indicators
3. **Fundamental Factors**: Company/asset fundamentals, sector analysis, competitive position
4. **Risk Assessment**: Key risks and potential catalysts (both positive and negative)
5. **Market Outlook**: Short-term (1-3 months) and medium-term (6-12 months) outlook
6. **Key Levels**: Important price levels to watch for entry/exit points

${
  type === "crypto"
    ? `
For cryptocurrency analysis, also consider:
- Blockchain metrics and adoption
- Regulatory environment
- Technology developments
- Market cycles and correlation with Bitcoin
`
    : `
For stock analysis, also consider:
- Earnings expectations and guidance
- Sector rotation and market conditions
- Institutional sentiment
- Valuation metrics (P/E, growth rates)
`
}

Format your response in clear sections with specific price targets and actionable insights. Be objective and mention both bullish and bearish scenarios.

Keep the response comprehensive but concise (400-600 words).
`

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Generate specific trading signals
    const signalsPrompt = `
Based on the market data and analysis for ${symbol}, provide 3 specific trading signals with exact price levels:

${context}

Consider the current price of $${marketData ? Number.parseFloat(marketData["05. price"]).toFixed(2) : "N/A"} and recent market action.

Respond with a JSON object containing an array of signals:
{
  "signals": [
    {
      "type": "BUY" | "SELL" | "HOLD",
      "confidence": "HIGH" | "MEDIUM" | "LOW",
      "timeframe": "SHORT" | "MEDIUM" | "LONG",
      "reason": "Specific technical or fundamental reason",
      "target": "Specific price target",
      "stopLoss": "Risk management level",
      "entryPrice": "Suggested entry price range"
    }
  ]
}

Provide realistic price targets based on technical analysis and current market conditions.
`

    const { text: signalsText } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: signalsPrompt,
      temperature: 0.3,
      maxTokens: 400,
    })

    let signals = []
    try {
      const signalsData = JSON.parse(signalsText)
      signals = signalsData.signals || []
    } catch (error) {
      console.warn("Failed to parse signals:", error)
      // Fallback signals based on market data
      if (marketData) {
        const currentPrice = Number.parseFloat(marketData["05. price"])
        const change = Number.parseFloat(marketData["09. change"])
        signals = [
          {
            type: change > 0 ? "BUY" : change < -2 ? "SELL" : "HOLD",
            confidence: Math.abs(change) > 3 ? "HIGH" : "MEDIUM",
            timeframe: "SHORT",
            reason: `Based on current ${change > 0 ? "positive" : "negative"} momentum`,
            target: `$${(currentPrice * (change > 0 ? 1.05 : 0.95)).toFixed(2)}`,
            entryPrice: `$${(currentPrice * 0.99).toFixed(2)} - $${(currentPrice * 1.01).toFixed(2)}`,
          },
        ]
      }
    }

    // Calculate additional metrics
    let technicalIndicators = null
    if (marketData) {
      const currentPrice = Number.parseFloat(marketData["05. price"])
      const high = Number.parseFloat(marketData["03. high"])
      const low = Number.parseFloat(marketData["04. low"])
      const change = Number.parseFloat(marketData["09. change"])

      technicalIndicators = {
        support: (currentPrice * 0.97).toFixed(2),
        resistance: (currentPrice * 1.03).toFixed(2),
        volatility: (((high - low) / currentPrice) * 100).toFixed(1) + "%",
        momentum: change > 0 ? "Bullish" : change < 0 ? "Bearish" : "Neutral",
        rsi: change > 0 ? "Potentially Overbought" : "Potentially Oversold",
      }
    }

    return NextResponse.json({
      symbol: symbol?.toUpperCase(),
      analysis: text,
      signals,
      marketData,
      newsData,
      technicalIndicators,
      timestamp: new Date().toISOString(),
      type,
      query: query || `Analysis for ${symbol}`,
    })
  } catch (error) {
    console.error("AI Research error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate research. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
