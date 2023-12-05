module.exports = (min, max) => {
    const array = new Uint32Array(1);
    const randomNum1 = crypto.getRandomValues(array)[0] / 10000000000
    const randomNum2 = Math.random()
    const randomNum3 = Date.now() / 10000000000000 - randomNum1
    const randomNum4 = (randomNum1 + randomNum3) / 2 + randomNum2
    const randomNum5 = randomNum4 > 1 ? randomNum4 - 1 : randomNum4
    const randomNum6 = Math.floor(randomNum5 * max) + min
    const randomNum7 = randomNum6 > max ? randomNum6 - 1 : randomNum6
    return randomNum7
}