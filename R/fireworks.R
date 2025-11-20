#' Launch Fireworks
#'
#' Triggers a fireworks display on screen.
#'
#' @param duration Number of seconds to run. Default is 5.
#' @param speed Number. Speed of simulation (default 1).
#' @param width,height Must be valid CSS unit. Leave as default for overlay.
#' @param elementId Optional ID.
#'
#' @import htmlwidgets
#'
#' @export
fireworks <- function(duration = 5, speed = 1, width = "100%", height = "0px", elementId = NULL) {
  
  x = list(
    duration = duration,
    speed = speed
  )
  
  htmlwidgets::createWidget(
    name = 'fireworks',
    x = x,
    width = width,
    height = height,
    package = 'sparkler',
    elementId = elementId
  )
}

#' @export
fireworksOutput <- function(outputId, width = '100%', height = '0px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'fireworks', width, height, package = 'sparkler')
}

#' @export
renderFireworks <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) }
  htmlwidgets::shinyRenderWidget(expr, fireworksOutput, env, quoted = TRUE)
}