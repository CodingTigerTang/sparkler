#' Start Weather Effect
#'
#' Adds a full-screen overlay of rain, snow, or meteors to the Shiny app or RMarkdown document.
#'
#' @param type Character. One of "snow", "rain", "meteor", or "none" (to stop the effect).
#' @param density Numeric. Multiplier for particle count (default 1).
#' @param speed Numeric. Multiplier for movement speed (default 1).
#' @param fullscreen Logical. If TRUE, forces the effect to cover the whole page (useful for RMarkdown). If NULL (default), it auto-detects if you are in Shiny.
#' @param width Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @param height Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @param elementId Optional ID.
#'
#' @import htmlwidgets
#'
#' @export
weather <- function(type = "snow", density = 1, speed = 1, fullscreen = NULL, width = NULL, height = NULL, elementId = NULL) {
  
  # Validate input
  type <- match.arg(type, c("snow", "rain", "meteor", "none"))
  
  # LOGIC: Determine if we should go full screen
  # 1. If user explicitly said TRUE/FALSE, use that.
  # 2. If user left it NULL, check if we are in Shiny.
  #    - In Shiny? Default to TRUE (Overlay).
  #    - In RMarkdown/Console? Default to FALSE (Inline Box).
  if (is.null(fullscreen)) {
    fullscreen <- !is.null(shiny::getDefaultReactiveDomain())
  }
  
  x = list(
    type = type,
    density = density,
    speed = speed,
    fullscreen = fullscreen
  )
  
  htmlwidgets::createWidget(
    name = 'weather',
    x = x,
    width = width,
    height = height,
    package = 'sparkler',
    elementId = elementId
  )
}

#' @rdname weather
#' @param outputId output variable to read from
#' @param width Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @param height Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @export
weatherOutput <- function(outputId, width = '100%', height = '0px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'weather', width, height, package = 'sparkler')
}

#' @rdname weather
#' @param expr An expression that generates weather
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression?
#' @export
renderWeather <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) }
  htmlwidgets::shinyRenderWidget(expr, weatherOutput, env, quoted = TRUE)
}