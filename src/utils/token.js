export function getTokenRemainingTime(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp
        const now = Math.floor(Date.now() / 1000)
        return exp - now
    } catch (e) {
        return 0
    }
}