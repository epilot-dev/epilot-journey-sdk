import React, { FC } from "react"
import { ControlledCustomBlockProps } from '@epilot/epilot-journey-sdk/src/types'

type BlockValueType = {
    something: string
}
type RequiredBlockProps = ControlledCustomBlockProps<BlockValueType> & {
    container:ControlledCustomBlockProps<string>
}

// this is a react component that includes a counter number with 2 buttons next to it
// the buttons will increase or decrease the counter number
export function RequiredBlock(props: RequiredBlockProps) {
    const { value, container, required, errors } = props
    console.log("props", props)
    const { setValue } = container
    const { something } = value || {}
    return (
        <div style={{color:'black'}}>
            <p>When the required props is passed as true, it is a good practice to show an Asterisk next to the fields or the block corner</p>
            <p>so is this block required? {required ? <span style={{color: 'blue'}}> yes, it is required</span> : <span style={{color: 'red'}}> no, it is not</span>}</p>
            <p>Since this block is required, the journey will prevent the user from going to the next step as long as our block data is still empty</p>
            <p>try playing with the next buttons and click next on the step, if the block has no value it will block going next, then the prop errors will be passed as true to it</p>
            <button onClick={()=> setValue(JSON.stringify({ something: "some text" }))}>Set Data</button> - <button onClick={()=> setValue('')}>Empty the Data</button>
            <p>Block data: {JSON.stringify(something)}</p>
            <p>Click on the button "Empty the Data" then click Next in the journey</p>
            <p>do we have errors? {errors ? <span style={{color: 'red'}}>we have an ERROR, the error message is "{errors}"</span> : 'NO'}</p>
        </div>
    )
}
