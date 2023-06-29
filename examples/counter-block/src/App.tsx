import React, { FC } from "react"
import { ControlledCustomBlockProps } from '@epilot/epilot-journey-sdk'

type BlockValueType = {
    count: number
}
type CounterProps = ControlledCustomBlockProps<BlockValueType> & {
    container:ControlledCustomBlockProps<string>
}

// this is a react component that includes a counter number with 2 buttons next to it
// the buttons will increase or decrease the counter number
const CounterAPP: FC<CounterProps> = (props: CounterProps) => {
    const { value, container } = props
    const { setValue } = container
    const { count = 0 } = value || {}
    return (
        <div>
            <button onClick={() => setValue(JSON.stringify({ count: count - 1 }))}>-</button>
            <span>{count}</span>
            <button onClick={() => setValue(JSON.stringify({ count: count + 1 }))}>+</button>
        </div>
    )
}

export default CounterAPP
