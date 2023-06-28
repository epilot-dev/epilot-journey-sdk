import React, { FC } from "react"
import { CustomBlockProps } from '@epilot/epilot-journey-sdk/src/types'

type ThemingProps = CustomBlockProps

const Theming: FC<ThemingProps> = ({ theme }: ThemingProps) => {
    console.log('theme', theme)
    const primaryColor = theme?.palette?.primary.main
    const secondaryColor = theme?.palette?.secondary.main
    const buttonStyle = theme?.typography?.button
    return (
        <>
        <h1>This line is using h1, since it is wrapped with a block, it has already the default theming applied to it</h1>
        <p style={{color: primaryColor}}>This paragraph is using the primary color defined on the theme</p>
        <p style={{color: secondaryColor}}>This paragraph is using the secondary color defined on the theme</p>
        <button style={{...buttonStyle, backgroundColor: primaryColor, color: secondaryColor}}>This button is using typography with the colors</button>
        </>
    )
}

export default Theming
