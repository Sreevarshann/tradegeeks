import { type NextRequest, NextResponse } from "next/server"

const ALPHA_VANTAGE_API_KEY = "9FZJ4DUD8HXH8TI7"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const functionType = searchParams.get("function") || "GLOBAL_QUOTE"

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
  }

  try {
    let url = ""
    let fallbackUrl = ""

    // Primary endpoint - Global Quote (most reliable)
    if (functionType === "GLOBAL_QUOTE") {
      url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    }
    // Daily data (more reliable than intraday)
    else if (functionType === "TIME_SERIES_DAILY") {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=compact`
      fallbackUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    }
    // Intraday with fallback
    else if (functionType === "TIME_SERIES_INTRADAY") {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=compact`
      fallbackUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    }

    console.log(`Fetching data from: ${url}`)

    const response = await fetch(url, {
      headers: {
        "User-Agent": "onntix-market-analyzer/1.0",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("API Response:", JSON.stringify(data, null, 2))

    // Check for API errors
    if (data["Error Message"]) {
      console.error("API Error Message:", data["Error Message"])

      // Try fallback if available
      if (fallbackUrl) {
        console.log("Trying fallback URL:", fallbackUrl)
        const fallbackResponse = await fetch(fallbackUrl)
        const fallbackData = await fallbackResponse.json()

        if (!fallbackData["Error Message"] && !fallbackData["Note"] && !fallbackData["Information"]) {
          return NextResponse.json({
            symbol: symbol.toUpperCase(),
            timeSeries: [],
            globalQuote: fallbackData["Global Quote"],
            metadata: null,
            success: true,
            fallback: true,
          })
        }
      }

      return NextResponse.json(
        { error: "Invalid symbol or API error. Please check the stock symbol and try again." },
        { status: 400 },
      )
    }

    if (data["Note"]) {
      console.error("API Rate Limit:", data["Note"])
      return NextResponse.json(
        {
          error: "API rate limit reached. Please wait a moment and try again.",
          isRateLimit: true,
        },
        { status: 429 },
      )
    }

    if (data["Information"]) {
      console.error("API Information:", data["Information"])
      return NextResponse.json(
        {
          error: "API rate limit reached. Please wait a moment and try again.",
          isRateLimit: true,
        },
        { status: 429 },
      )
    }

    // Process the data based on function type
    let timeSeries: any[] = []
    let globalQuote: any = null

    if (functionType === "TIME_SERIES_INTRADAY") {
      const timeSeriesData = data["Time Series (5min)"]
      if (timeSeriesData) {
        timeSeries = Object.entries(timeSeriesData)
          .slice(0, 100) // Limit to last 100 data points
          .map(([time, values]: [string, any]) => ({
            time,
            open: Number.parseFloat(values["1. open"]),
            high: Number.parseFloat(values["2. high"]),
            low: Number.parseFloat(values["3. low"]),
            close: Number.parseFloat(values["4. close"]),
            volume: Number.parseInt(values["5. volume"]),
          }))
      }
    } else if (functionType === "TIME_SERIES_DAILY") {
      const timeSeriesData = data["Time Series (Daily)"]
      if (timeSeriesData) {
        timeSeries = Object.entries(timeSeriesData)
          .slice(0, 100) // Limit to last 100 data points
          .map(([time, values]: [string, any]) => ({
            time,
            open: Number.parseFloat(values["1. open"]),
            high: Number.parseFloat(values["2. high"]),
            low: Number.parseFloat(values["3. low"]),
            close: Number.parseFloat(values["4. close"]),
            volume: Number.parseInt(values["5. volume"]),
          }))
      }
    } else if (functionType === "GLOBAL_QUOTE") {
      globalQuote = data["Global Quote"]
    }

    // If no data found and we have a fallback, try it
    if (timeSeries.length === 0 && !globalQuote && fallbackUrl) {
      console.log("No data found, trying fallback:", fallbackUrl)
      const fallbackResponse = await fetch(fallbackUrl)
      const fallbackData = await fallbackResponse.json()

      if (!fallbackData["Error Message"] && !fallbackData["Note"] && !fallbackData["Information"]) {
        globalQuote = fallbackData["Global Quote"]
      }
    }

    // If still no data found, return error
    if (timeSeries.length === 0 && !globalQuote) {
      return NextResponse.json(
        {
          error: "No data available for this symbol. Please check the symbol and try again.",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      timeSeries,
      globalQuote,
      metadata: data["Meta Data"],
      success: true,
    })
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stock data. Please check your internet connection and try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
