import { EpilotTheme } from "./theming"

export type CustomBlockProps = {
  theme: EpilotTheme
}


export type ControlledCustomBlockProps<T> = {
  /**
   * a call back function to set the value of the custom block
   */
  setValue: React.Dispatch<T>

  /**
   * the value of the custom block
   */
  value: T

  /**
   * any errors that the block might have. ex. value is required
   */
  errors?: string

  /**
   * if the block is required or not
   * it is up to the implementer to display it in a good way
   */
  required?: boolean

  /**
   * extra arguments that the implementer might need which the configuring user has added them in the Journey Builder
   */
  args?: string
}