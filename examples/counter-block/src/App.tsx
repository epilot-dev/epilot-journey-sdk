import React, { FC } from "react"
import { ControlledCustomBlockProps } from '@epilot/epilot-journey-sdk/src/types'

type BlockValueType = {
    count: number
}
type CounterProps = ControlledCustomBlockProps<BlockValueType> & {
}

// this is a react component that includes a counter number with 2 buttons next to it
// the buttons will increase or decrease the counter number
const CounterAPP: FC<CounterProps> = (props: CounterProps) => {
    const { value, setValue } = props
    const { count = 0 } = value || {}
    console.log('CounterAPP', props)
    return (
        <div>
            <button onClick={() => setValue({ count: count - 1 })}>-</button>
            <span>{count}</span>
            <button onClick={() => setValue({ count: count + 1 })}>+</button>
        </div>
    )
}

export default CounterAPP
