import birdsData from './birds.js'

const difficulty = document.querySelectorAll('.question-list__item')
const answers = document.querySelectorAll('.answer-list__item')

const birdName = document.querySelector('.answer-info__content')
const birdNameLatin = document.querySelector('.answer-info__content-latin')
const birdImg = document.querySelector('.answer-info__img')
const birdText = document.querySelector('.answer-info__text')

const birdPlayer = document.querySelector('.answer-info__audio')
const playBird = document.querySelectorAll('.audio-control-play')
const volumeBird = document.querySelectorAll('.audio-control-volume')
const durationSound = document.querySelectorAll('.audio-full-time')
const currentLengthSound = document.querySelectorAll('.audio-current-time')
const progressSong = document.querySelectorAll('.audio-range')

const rightBirdImg = document.querySelector('.question-current__img')
const rightBirdName = document.querySelector('.question-current__header')
const btnNext = document.querySelector('.answer-btn-next')

const scoreCount = document.querySelector('.all-score')
const resultScore = document.querySelector('.result-score')
const quizPage = document.querySelector('.quiz-wrapper')
const pageLose = document.querySelector('.page-content_lose')
const pageWin = document.querySelector('.page-content_win')

let audioQuestion = new Audio()
let audioAnswer = new Audio()
let answer
let arr
let score = 5
let stage = 0
let isAnswered = false

function getArr() {
    let dataArr
    difficulty.forEach((elem) => {
        elem.classList.remove('question-list__item_active')
    })

    difficulty[stage].classList.add('question-list__item_active')

    for (let i = 0; i < difficulty.length; i++) {
        if (difficulty[i].classList.contains('question-list__item_active')) {
            dataArr = birdsData[i].slice()
        }
    }
    return dataArr
}

function getAnswers() {
    answers.forEach((elem, idx) => {
        elem.textContent = arr[idx].name
    })
}

function getRandomBird() {
    let randomNum = Math.floor(Math.random() * arr.length)
    let answer
    let idx
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id - 1 === randomNum) {
            answer = arr[i].name
            idx = i
        }
    }
    if (isAnswered === false) {
        // audio = new Audio()
        playSongBird(audioAnswer, arr, idx, 0)
    }
    return answer
}

function answerAudio(result) {
    if (result === true) {
        let audio = new Audio()
        audio.src = 'assets/song/right-answer.mp3'
        audio.autoplay = true
        audio.volume = 0.05;
    } else if (result === false) {
        let audio = new Audio()
        audio.src = 'assets/song/wrong-answer.mp3'
        audio.autoplay = true
        audio.volume = 0.1;
    }
}

answers.forEach((elem, idx) => {
    elem.addEventListener('click', () => {
        birdImg.classList.add('answer-info__img_active')
        birdPlayer.classList.add('answer-info__audio_active')

        birdName.textContent = arr[idx].name
        birdNameLatin.textContent = arr[idx].species
        birdImg.src = arr[idx].image
        birdText.textContent = arr[idx].description

        playSongBird(audioQuestion, arr, idx, 1)

        if (elem.textContent === answer) {
            if (isAnswered === false) {
                answerAudio(elem.textContent === answer)
                rightBirdImg.src = arr[idx].image
                rightBirdName.textContent = arr[idx].name
                elem.style.color = '#7bff7b';
                btnNext.classList.remove('answer-btn-next_disabled')
                isAnswered = true
            } else {
                return
            }
        } else {
            if (isAnswered === false) {
                answerAudio(elem.textContent === answer)
                elem.style.color = '#ff3a3a';

                if (score > 0 && !(elem.hasAttribute('checked'))) {
                    score -= 1
                    elem.setAttribute('checked', 'true')
                } else if (score === 0 || elem.hasAttribute('checked')) {
                    return
                }
            } else {
                playBird[1].classList.remove('audio-control-play_active')
                return
            }
        }
        playBird[1].classList.remove('audio-control-play_active')
    })
})

function playSongBird(audio, arr, index, rigthIdx) {
    audio.src = arr[index].audio
    durationSound[rigthIdx].textContent = arr[index].duration

    playBird[rigthIdx].addEventListener('click', () => {
        if (playBird[rigthIdx].classList.contains('audio-control-play_active')) {
            audio.play()
        } else {
            audio.pause()
        }
        btnNext.addEventListener('click', () => {
            audio.pause()
        })
    })
    volumeBird[rigthIdx].addEventListener('click', () => {
        if (volumeBird[rigthIdx].classList.contains('audio-control-volume_active')) {
            audio.muted = true
        } else {
            audio.muted = false
        }
    })

    function checkDuration() {
        if (audio.currentTime === audio.duration) {
            playBird[rigthIdx].classList.remove('audio-control-play_active')
        }
    }
    setInterval(checkDuration, 500)

    let timerIdCurrentTime

    progressSong.textContent = '00:00'
    timerIdCurrentTime = setInterval(() => {
        let time = audio.currentTime;
        let minutes = String(Math.floor(time / 60)).padStart(2, '0');
        let seconds = String(Math.floor(time % 60)).padStart(2, '0');
        currentLengthSound[rigthIdx].textContent = `${minutes}:${seconds}`
        progressSong[rigthIdx].style.width = Math.round(((audio.currentTime / audio.duration * 100))) + '%'
    }, 1000)
}

function nextStage() {
    playBird[1].classList.remove('audio-control-play_active')
    playBird[0].classList.remove('audio-control-play_active')

    answers.forEach((elem) => {
        elem.removeAttribute('checked')
    })
    stage += 1
    scoreCount.textContent = Number(scoreCount.textContent) + score
    score = 5
    isAnswered = false

    if (stage === 6) {
        if (Number(scoreCount.textContent) < 30) {
            quizPage.classList.add('quiz-wrapper_hidden')
            pageLose.classList.add('page-content_lose_active')
            resultScore.textContent = `${scoreCount.textContent}`

        } else {
            quizPage.classList.add('quiz-wrapper_hidden')
            pageWin.classList.add('page-content_win_active')
            resultScore.textContent = `${scoreCount.textContent}`
        }
    }

    arr = getArr()
    getAnswers()
    answer = getRandomBird()

    birdImg.classList.remove('answer-info__img_active')
    birdPlayer.classList.remove('answer-info__audio_active')

    birdName.innerHTML = `Послушайте плеер.<br />
    Выберите птицу из списка`
    birdNameLatin.textContent = ''
    birdImg.src = ''
    birdText.textContent = ''

    answers.forEach((elem) => {
        elem.style.color = `white`
    })

    rightBirdImg.src = `./assets/img/bird.jpg`
    rightBirdName.textContent = `**********`

    btnNext.classList.add('answer-btn-next_disabled')
}

function checkValidity() {
    if (!(btnNext.classList.contains('answer-btn-next_disabled'))) {
        btnNext.addEventListener('click', nextStage)
    } else {
        btnNext.removeEventListener('click', nextStage)
    }
}
setInterval(checkValidity, 500)



window.addEventListener('load', () => {
    arr = getArr()
    getAnswers()
    answer = getRandomBird()
})


