const btnPlay = document.querySelectorAll('.audio-control-play')
const btnVol = document.querySelectorAll('.audio-control-volume')

btnPlay.forEach((elem) => {
    elem.addEventListener('click', () => {
        elem.classList.toggle('audio-control-play_active')
    })
})
btnVol.forEach((elem) => {
    elem.addEventListener('click', () => {
        elem.classList.toggle('audio-control-volume_active')
    })
})