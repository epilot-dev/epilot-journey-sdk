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
  const { token } = args && JSON.parse(args)

  if (value) {
    return JSON.stringify(value)
  }
  return (
    <CalendlyBlock url="https://calendly.com/mohand-9992/30-minute-meeting-clone" onChange={event => setValue(event)} theme={theme} token={token} />
  )
}

export default App
