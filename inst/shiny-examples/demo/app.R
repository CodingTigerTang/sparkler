library(shiny)
library(sparkler)

ui <- fluidPage(
  
  # Dark theme manual override
  tags$style(HTML("
    body { background-color: #1a1a1a; color: #ffffff; font-family: sans-serif; }
    .well { background-color: #333; border: 1px solid #555; box-shadow: none; }
    .btn-default { color: #333; }
    a { color: #4dc3ff; text-decoration: none; }
    a:hover { color: #99dfff; text-decoration: underline; }
  ")),
  
  div(style = "text-align: center; padding-top: 20px; padding-bottom: 20px;",
      h1("Sparkler Control Center", style = "font-weight: 300;")
  ),
  
## Controls -----------------------------------------------------

  fluidRow(
    
    ### Confetti --------------------------------------------------------------
    column(4,
           wellPanel(
             h4("🎉 Confetti", style = "margin-top: 0;"),
             sliderInput("conf_count", "Particle Count:", min = 10, max = 500, value = 150),
             sliderInput("conf_spread", "Spread:", min = 10, max = 180, value = 70),
             actionButton("btn_conf", "Launch Confetti", width = "100%",
                          style = "background-color: #17a2b8; color: white; border: none;")
           )
    ),
    
    ### fireworks -------------------------------------------------------------
    column(4,
           wellPanel(
             h4("🚀 Fireworks", style = "margin-top: 0;"),
             sliderInput("fw_duration", "Duration (Sec):", min = 1, max = 10, value = 3),
             sliderInput("fw_speed", "Speed Multiplier:", min = 0.5, max = 3, value = 1, step = 0.1),
             actionButton("btn_fw", "Launch Fireworks", width = "100%",
                          style = "background-color: #dc3545; color: white; border: none;")
           )
    ),
    
    ### Weather -------------------------------------------------------------
    column(4,
           wellPanel(
             h4("⛈️ Weather", style = "margin-top: 0;"),
             selectInput("wx_type", "Atmosphere:", 
                         choices = c("Clear" = "none", "Rain" = "rain", "Snow" = "snow", "Meteors" = "meteor")),
             
             conditionalPanel(
               condition = "input.wx_type != 'none'",
               sliderInput("wx_density", "Density:", min = 0.1, max = 3, value = 1, step = 0.1),
               sliderInput("wx_speed", "Speed:", min = 0.1, max = 3, value = 1, step = 0.1)
             )
           )
    )
  ),
  
## VP -----------------------------------------------------
  fluidRow(
    column(12,
           div(style = "height: 350px; border: 2px dashed #555; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-direction: column; background-color: #222; margin-bottom: 30px;",
               h2("Visual Playground"),
               p("Effects render on top of this layer."),
               br(),
               actionButton("dummy_btn", "I am a button behind the rain")
           )
    )
  ),
  
  div(style = "text-align: center; padding: 20px; border-top: 1px solid #333; font-size: 0.9em;",
      tags$a(href = "https://github.com/CodingTigerTang/sparkler", 
             target = "_blank", 
             "sparkler"),
      " package by ",
      tags$a(href = "https://github.com/CodingTigerTang", 
             target = "_blank", 
             "@CodingTigerTang")
  ),
  
### Invisible outputs -------------------------------------------------------

  confettiOutput("out_conf"),
  fireworksOutput("out_fw"),
  weatherOutput("out_wx")
)

server <- function(input, output) {
  
  observeEvent(input$btn_conf, {
    output$out_conf <- renderConfetti({
      confetti(particle_count = input$conf_count, spread = input$conf_spread)
    })
  })
  
  observeEvent(input$btn_fw, {
    output$out_fw <- renderFireworks({
      fireworks(duration = input$fw_duration, speed = input$fw_speed)
    })
  })
  
  observeEvent(c(input$wx_type, input$wx_density, input$wx_speed), {
    output$out_wx <- renderWeather({
      weather(type = input$wx_type, density = input$wx_density, speed = input$wx_speed)
    })
  })
  
  observeEvent(input$dummy_btn, {
    showNotification("Button Clicked!", type = "message")
  })
}

shinyApp(ui, server)