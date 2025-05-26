// Import and register the Spline viewer web component
import { Application } from "https://unpkg.com/@splinetool/runtime@1.9.28/build/runtime.js"

// Define the custom element for spline-viewer
class SplineViewer extends HTMLElement {
  constructor() {
    super()
    this.canvas = null
    this.app = null
  }

  connectedCallback() {
    this.render()
  }

  disconnectedCallback() {
    if (this.app) {
      this.app.dispose()
    }
  }

  render() {
    // Create canvas element
    this.canvas = document.createElement("canvas")
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.display = "block"

    // Clear any existing content
    this.innerHTML = ""
    this.appendChild(this.canvas)

    // Get the URL from the url attribute
    const url = this.getAttribute("url")
    if (url) {
      this.loadSpline(url)
    }
  }

  async loadSpline(url) {
    try {
      this.app = new Application(this.canvas)
      await this.app.load(url)
    } catch (error) {
      console.error("Failed to load Spline scene:", error)
      // Fallback: show a gradient background
      this.showFallback()
    }
  }

  showFallback() {
    this.canvas.style.background = `
      radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
      linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)
    `
  }

  static get observedAttributes() {
    return ["url"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "url" && oldValue !== newValue) {
      this.render()
    }
  }
}

// Register the custom element
if (!customElements.get("spline-viewer")) {
  customElements.define("spline-viewer", SplineViewer)
}
