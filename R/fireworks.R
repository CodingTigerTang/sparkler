#' Launch Fireworks
#'
#' Triggers a fireworks display on screen.
#'
#' @param duration Number of seconds to run (default 5).
#' @param speed Number. Speed of simulation (default 1).
#' @param width Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
#' @param height Must be a valid CSS unit (like '100%', '400px', 'auto') or a number.
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

# Standard Shiny boilerplate
#' @rdname fireworks
#' @param outputId output variable to read from
#' @export
fireworksOutput <- function(outputId, width = '100%', height = '0px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'fireworks', width, height, package = 'sparkler')
}

#' @rdname fireworks
#' @param expr An expression that generates fireworks
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression?
#' @export
renderFireworks <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) }
  htmlwidgets::shinyRenderWidget(expr, fireworksOutput, env, quoted = TRUE)
}