import { FC } from "react"
import type { ControlledCustomBlockProps } from '@epilot/epilot-journey-sdk'


type BlockValueType = {
    count: number
}

export type CounterProps = Omit<ControlledCustomBlockProps<string>, 'args'> & {
    container: ControlledCustomBlockProps<string>
    args?: Record<string, string>
}

// this is a react component that includes a counter number with 2 buttons next to it
// the buttons will increase or decrease the counter number
export const CounterAPP: FC<CounterProps> = (props: CounterProps) => {
    const { value: strValue, container, args = {} } = props
    const { person } = args
    const value: BlockValueType = typeof strValue === "string" && JSON.parse(strValue || '{}')
    const { setValue } = container
    const { count = 0 } = value
    return (
        <div>
            <p>Hi {person}, change the counter</p>
            <button onClick={() => setValue(JSON.stringify({ count: count - 1 }))}>-</button>
            <span>{count}</span>
            <button onClick={() => setValue(JSON.stringify({ count: count + 1 }))}>+</button>
        </div>
    )
}
