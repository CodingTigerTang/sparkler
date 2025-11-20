#' Launch Confetti
#'
#' @import htmlwidgets
#' @export
confetti <- function(particle_count = 100, spread = 70, width = "100%", height = "400px", elementId = NULL) {
  
  x = list(
    particleCount = particle_count,
    spread = spread
  )
  
  htmlwidgets::createWidget(
    name = 'confetti',
    x = x,
    width = width,
    height = height,
    package = 'sparkler',
    elementId = elementId
  )
}

# Standard Shiny boilerplate
#' @export
confettiOutput <- function(outputId, width = '100%', height = '0px'){
  # We set height to 0px so it doesn't take up layout space.
  # The JS will auto-expand it to full screen fixed position.
  htmlwidgets::shinyWidgetOutput(outputId, 'confetti', width, height, package = 'sparkler')
}

#' @export
renderConfetti <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) }
  htmlwidgets::shinyRenderWidget(expr, confettiOutput, env, quoted = TRUE)
}