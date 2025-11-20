#' Launch Confetti
#'
#' Triggers a confetti explosion on the screen.
#'
#' @param particle_count Integer. Number of particles to fire (default 150).
#' @param spread Integer. How wide the explosion is in degrees (default 100).
#' @param width Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @param height Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @param elementId Use an explicit element ID for the widget (optional).
#'
#' @import htmlwidgets
#' @export
confetti <- function(particle_count = 100, spread = 70, width = NULL, height = NULL, elementId = NULL) {
  x = list(particleCount = particle_count, spread = spread)
  htmlwidgets::createWidget(name = 'confetti', x = x, width = width, height = height, package = 'sparkler', elementId = elementId)
}

#' @rdname confetti
#' @param outputId output variable to read from
#' @param width Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @param height Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @export
confettiOutput <- function(outputId, width = '100%', height = '0px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'confetti', width, height, package = 'sparkler')
}

#' @rdname confetti
#' @param expr An expression that generates a confetti
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})?
#' @export
renderConfetti <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } 
  htmlwidgets::shinyRenderWidget(expr, confettiOutput, env, quoted = TRUE)
}