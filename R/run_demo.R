#' Run the Sparkler Demo App
#'
#' Launches a Shiny app showcasing confetti, fireworks, and weather effects.
#'
#' @export
run_demo <- function() {
  # Locate the app inside the installed package
  appDir <- system.file("shiny-examples", "demo", package = "sparkler")
  
  # Safety check: If package isn't installed properly, path might be empty
  if (appDir == "") {
    stop("Could not find example directory. Try re-installing `sparkler`.", call. = FALSE)
  }
  
  shiny::runApp(appDir, display.mode = "normal")
}