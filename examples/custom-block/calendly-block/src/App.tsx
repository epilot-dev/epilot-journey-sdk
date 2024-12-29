import { CalendlyBlock } from "./components/CalendlyBlock"
import type { ControlledCustomBlockProps, EpilotTheme } from '@epilot/epilot-journey-sdk'
import { CalendlyBlockData } from "./components/types"

export type AppProps = {
  container: ControlledCustomBlockProps<CalendlyBlockData> & {
    theme: EpilotTheme
  }
}

function App(props: AppProps) {
  const { theme, args, setValue, value } = props.container
  const { token, url } = args && JSON.parse(args)

  if (value) {
    return JSON.stringify(value)
  }
  return (
    <CalendlyBlock url={url} onChange={event => setValue(event)} theme={theme} token={token} />
  )
}

export default App
