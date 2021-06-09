export function switchBodyScroll(isShow) {
    if (isShow) {
        document.body.style.overflow = 'auto'
    } else {
        document.body.style.overflow = 'hidden'
    }
}