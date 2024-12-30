const rgbToHex = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)!.map(Number)
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
}

// check if string is rgb color, if so, convert it into hex
const isRgb = (color: string) => color.indexOf('rgb') === 0

export const processColor = (color: string) => {
    if (isRgb(color)) {
        color = rgbToHex(color)
    }

    return color.replace('#', '').slice(0, 6)
}


