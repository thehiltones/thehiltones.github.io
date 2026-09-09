import { HILTONES_INDEX, HYMNS_INDEX, BASE_URL } from "/js/types.js"

const IS_HYMNS = `hymns=${location.href.includes("hymns")}`
const SONG_TYPE = IS_HYMNS ? "hymns" : "hiltones";
const SONG_INDEX = IS_HYMNS ? HYMNS_INDEX : HILTONES_INDEX

const list_songs = function() {
    let leftList = document.querySelector("#left-list");
    let rightList = document.querySelector("#right-list");
    for (let i = 0; i < SONG_INDEX.length; i++) {
        if (i%2 == 0) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.href = "play.html?song=" + SONG_INDEX[i] + `&hymns=${IS_HYMNS}`;
            a.innerHTML = SONG_INDEX[i];
            li.appendChild(a);
            leftList.append(li);
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let title = JSON.parse(this.responseText)['title'];
                        a.innerHTML = title;
                }
            };
            xhttp.open("GET",
                 `${BASE_URL}/${SONG_TYPE}/${SONG_INDEX[i]}`, true);
            xhttp.send();
        }
    }
    for (let i = 0; i < SONG_INDEX.length; i++) {
        if (i%2 == 1) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.href = "play.html?song=" + SONG_INDEX[i] + `&hymns=${IS_HYMNS}`;
            a.innerHTML = SONG_INDEX[i];
            li.appendChild(a);
            rightList.append(li);
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let title = JSON.parse(this.responseText)['title'];
                        a.innerHTML = title;
                }
            };
            xhttp.open("GET",
                 `${BASE_URL}/${SONG_TYPE}/${SONG_INDEX[i]}`, true);
            xhttp.send();
        }
    }
}

document.addEventListener('DOMContentLoaded', list_songs);