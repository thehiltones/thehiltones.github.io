import { HILTONES_INDEX, HYMNS_INDEX, BASE_URL } from "/js/types.js"
import { Matcher } from "/js/Matcher.js"

let n_found = 0
let matcher;

const handleGuess = function(exact_words, indices, give_up) {
    n_found += indices.length;
    const guess = document.getElementById('guess');
    guess.value = "";
    guess.style.animation = "flash 0.5s linear";
    setTimeout(clearAnimation, 500);
    let words = document.querySelectorAll(".word");
    for (let i = 0; i < indices.length; i++) {
        let index = indices[i];
        if (words[index].innerHTML === "") {
            if (give_up) {
                words[index].classList.add("given-up");
            }
            else {
                words[index].style.animation = "flash 0.5s linear";
            }
        }
        words[index].innerHTML = exact_words[i];
        if (exact_words[i].length > 9) {
            let size = 0.5;
            words[index].style.fontSize = `${size}em`;
        }
    }
    updateScore();
}

const inputHandler = function(e) {
    let indices = matcher.guess(e.target.value);
    if (indices.length > 0) {
        let exactWords = matcher.fetch_spelling(indices);
        handleGuess(exactWords, indices, false)
    }
}

const giveUp = function() {
    let indices = matcher.give_up();
    if (indices.length > 0) {
        let exactWords = matcher.fetch_spelling(indices);
        handleGuess(exactWords, indices, true);
    }
}

const clearAnimation = () => {
    // clear the input animation so that it can flash again at
    // the next correct guess
    const guess = document.getElementById('guess');
    guess.style.animation = "";
}

const findGetParameter = (parameterName) => {
    let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

const getNewLyricsBlock = () => {
    let lyricBlock = document.createElement("div");
    lyricBlock.classList.add("words");
    lyricBlock.classList.add("lyrics");
    return lyricBlock;
}

const updateScore = () => {
    let words = document.querySelectorAll(".word");
    const score = document.querySelector("#score");
    let n_total = words.length;
    score.innerHTML = (`${n_found}/${n_total}`);
}

const initialize = () => {
    const guess = document.getElementById('guess');
    guess.addEventListener('input', inputHandler);
    guess.addEventListener('propertychange', inputHandler); // for IE8
    // Firefox/Edge18-/IE9+ don’t fire on <select><option>
    // source.addEventListener('change', inputHandler); 

    let giveup_botton = document.getElementById("quit");
    if (giveup_botton.addEventListener)
        giveup_botton.addEventListener("click", giveUp, false);
    else if (giveup_botton.attachEvent)
        giveup_botton.attachEvent('onclick', giveUp);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let title = JSON.parse(this.responseText)['title'];
            let link = JSON.parse(this.responseText)['link'];
            let body = JSON.parse(this.responseText)['lyrics'];
            matcher = new Matcher(title, body);
            if (link != "") {
                let controlButtons = document.querySelector("#controls .buttons");
                let a = document.createElement("a");
                a.href = link;
                a.target = "_blank";
                let div = document.createElement("div");
                div.classList.add("button");
                div.innerHTML = "Music";
                a.appendChild(div);
                controlButtons.appendChild(a);
            }

            let titleDiv = document.querySelector(".title");
            for (let i = 0; i < title.split(/\s+/).length; i++) {
                let div = document.createElement("div");
                div.classList.add("word");
                titleDiv.appendChild(div);
            }
            let lyricBlock = getNewLyricsBlock();
            let main = document.querySelector("main");
            for (const line of body) {
                if (line === "") {
                    main.appendChild(lyricBlock);
                    lyricBlock = getNewLyricsBlock();
                    continue;
                }
                for (const word of line.split(/\s+/)) {
                    if (word === "CHORUS") {
                        main.appendChild(lyricBlock);
                        let p = document.createElement("p");
                        p.innerHTML = "CHORUS";
                        main.appendChild(p);
                        lyricBlock = getNewLyricsBlock();
                    }
                    else {
                        let div = document.createElement("div");
                        div.classList.add("word");  
                        lyricBlock.appendChild(div);
                    }
                }
            }
            if (lyricBlock.childElementCount > 0) {
                main.appendChild(lyricBlock);
            }
        }

        updateScore();
    };
    let song = findGetParameter("song");
    if (!HILTONES_INDEX.includes(song)) {
        song = Math.floor(Math.random() * HILTONES_INDEX.length);
        song = String(song).padStart(3, '0') + '.json';
    }
    xhttp.open("GET", `${BASE_URL}/hiltones/${song}`, true);
    xhttp.send();
}


document.addEventListener('DOMContentLoaded', initialize);