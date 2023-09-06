import React, { FC } from "react"

type HelloProps = {

}

const HelloApp: FC<HelloProps> = ({ }: HelloProps) => {
    return <h1>Hello, World!</h1>
}

export default HelloApp
