

export const firsLetterToUpperCase = (value : string) => {
    const splitStr = value.split(' ')
    return splitStr.map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ')
}