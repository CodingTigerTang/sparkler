# 🎇 Sparkler: Visual Delight for R


![Lifecycle: experimental](https://img.shields.io/badge/lifecycle-experimental-orange.svg)


**Sparkler** is an R package designed to bridge the gap between data science and user delight. While R is excellent for statistics and charts, it often lacks the "micro-interactions" and "gamification" elements found in modern web development.

**Sparkler** solves this by providing lightweight, high-performance visual engine: **Confetti**, **Fireworks**, and **Atmospheric Weather**, which render as full-screen overlays on top of your Shiny apps and RMarkdown documents.

### Why use Sparkler?
* **Gamification:** Reward users with confetti when they submit a form or hit a target.
* **Storytelling:** Use rain, snow, or meteors to set the mood for your data narrative.
* **Zero-Footprint:** The effects use a custom **Overlay Architecture** (Z-index 9999), meaning they float *over* your app without breaking your Bootstrap layout or blocking mouse clicks.

## 📦 Installation

You can install the development version from GitHub:

```r
# install.packages("devtools")
devtools::install_github("CodingTigerTang/sparkler")
```

## 🎮 Quick Start

The best way to understand the package is to run the built-in dashboard, which lets you control every parameter interactively.

```r
library(sparkler)
sparkler::run_demo()
```

## 💻 How to Use in Shiny

Using Sparkler in Shiny requires a slightly different mental model than standard plots.

**The Concept:** You place an **Output** function in your UI, but unlike a plot, it takes up **0 pixels** of space. It acts as an invisible "antenna." When you send data to it from the Server, it triggers the JavaScript engine to paint over the whole screen.

### Minimal Shiny Example

```r
library(shiny)
library(sparkler)

ui <- fluidPage(
  titlePanel("Sales Dashboard"),
  
  # 1. The Trigger
  actionButton("btn_success", "Close Deal"),
  
  # 2. The Invisible Antenna (Place this anywhere in UI)
  confettiOutput("celebration_effect")
)

server <- function(input, output) {
  
  # 3. The Logic
  observeEvent(input$btn_success, {
    output$celebration_effect <- renderConfetti({
      # Triggers the effect
      confetti(particle_count = 150, spread = 100) 
    })
  })
}

shinyApp(ui, server)
```

### Available Functions

| Function | UI Output | Usage |
| :--- | :--- | :--- |
| `confetti()` | `confettiOutput()` | Best for instant feedback (buttons, success messages). |
| `fireworks()` | `fireworksOutput()` | Best for major milestones. Runs for a set duration. |
| `weather()` | `weatherOutput()` | Continuous atmosphere (snow, rain, meteors). |

## 📄 How to Use in RMarkdown / Quarto

Sparkler works automatically in HTML documents. There are two distinct ways to use the **Weather** effect in reports.

### Mode 1: The "Atmospheric Overlay" (Fullscreen)
This makes the rain or snow cover the **entire webpage**, scrolling with the user. Perfect for immersive reports.

```markdown
```{r echo=FALSE}
library(sparkler)
# The 'fullscreen = TRUE' argument forces the overlay
sparkler::weather(type = "snow", density = 2, fullscreen = TRUE)
```
```

### Mode 2: The "Visual Block" (Inline)
If you leave `fullscreen` as `NULL` or `FALSE`, the weather renders inside a specific box, behaving like a standard plot.

```markdown
## Storm Analysis
Here is a visualization of the storm intensity:

```{r echo=FALSE}
# This creates a 300px box with rain inside it
sparkler::weather(type = "rain", speed = 2, height = "300px")
```
```

## 🎛 API Reference & Controls

You can fine-tune the physics of every effect.

### 1. `confetti()`
* **`particle_count`** *(int)*: Number of confetti pieces (Default: 100).
* **`spread`** *(int)*: How wide the explosion is in degrees (Default: 70).

### 2. `fireworks()`
* **`duration`** *(int)*: How many seconds the show lasts (Default: 5).
* **`speed`** *(numeric)*: Speed multiplier. Higher is faster (Default: 1).

### 3. `weather()`
* **`type`** *(char)*: One of `"snow"`, `"rain"`, `"meteor"`, or `"none"`.
* **`density`** *(numeric)*: Multiplier for how many particles appear (Default: 1).
* **`speed`** *(numeric)*: Multiplier for how fast they fall/fly (Default: 1).
* **`fullscreen`** *(logical)*: Force full-page overlay. Auto-detected in Shiny, manual in RMarkdown.

## ⚖️ Credits & Licenses

This package utilizes the following open-source assets:

### JavaScript Libraries
1. **canvas-confetti**
   * **Author:** Kiril Vatev (catdad)
   * **License:** ISC
   * **Source:** [https://github.com/catdad/canvas-confetti](https://github.com/catdad/canvas-confetti)

2. **fireworks-js**
   * **Author:** Vitalij Ryndin (crashmax-dev)
   * **License:** MIT
   * **Source:** [https://github.com/crashmax-dev/fireworks-js](https://github.com/crashmax-dev/fireworks-js)

---

Created with ❤️ using `htmlwidgets`.
