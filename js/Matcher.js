/**
 * A class for tracking the lyrics of the song, determining is a given word
 * has a match in the song, and tracking the guesses made.
 */
class Matcher {
    /**
     * Lowercase and remove non-alphanumeric characters.
     * e.g., 'Hi!' becomes 'hi'
     */
    static sanitize(word) {
        return word.toLowerCase().replace(/[^A-Za-z]+/g, "");
    }

    /**
     * Maps words that are equivalent to each other, so that the users don't have to
     * guess the precise spelling used for some of these weird words.
     */
    static EQUIVALENCES = {
        "ho": "hohohod",
        "every": "evry",
        "heaven": "heavn",
        "listening": "listning",
        "th": "thhhhh",
        "evrybody": "evrybody",
        "for": "fer",
        "oo": "OOeeooahah",
        "ting": "tingtang",
        "walla": "wallawallabingbang",
        "wala": "wallawallabingbang",
        "fiddle": "fiddleeeioh",
        "tippy": "tippytoeing",
        "tick": "ticktock",
        "overflowing": "oerflowing",
        "given": "givn",
        "heavens": "heavns",
        "heavenly": "heavnly",
        "suffering": "suffring",
        "power": "powr",
        "wandering": "wandring",
        "long": "longawaited",
        "offering": "offring",
        "covenant": "cov'nant",
    }

    /**
     * @param {String} title 
     * @param {Array} body 
     */
    constructor(title, body) {
        this.title = [];
        this.words = [];
        this.word_locations = {};
        let title_words = title.split(/\s+/);
        for (let i = 0; i < title_words.length; i++) {
            let sanitized = Matcher.sanitize(title_words[i]);
            if (sanitized != "") {
                if (!(sanitized in this.word_locations)) {
                    this.word_locations[sanitized] = [];
                }
                this.word_locations[sanitized].push(i);
                this.title.push(title_words[i]);
                this.words.push(title_words[i]);
            }
        }
        for (const line of body) {
            if (line === "") {
                continue;
            }
            let line_words = line.split(/\s+/);
            for (let i = 0; i < line_words.length; i++) {
                let sanitized = Matcher.sanitize(line_words[i]);
                if (sanitized === "") {
                    continue;
                }
                else if (line_words[i] === "CHORUS") {
                    continue;
                }
                else {
                    if (!(sanitized in this.word_locations)) {
                        this.word_locations[sanitized] = [];
                    }
                    this.word_locations[sanitized].push(this.words.length);
                    this.words.push(line_words[i]);
                }
            }
        }
        this.foundWords = new Set();
    }
    /**
     * Return a list of indexes for the word if it hasn't been guessed before.
     * Return empty list if it's already been guessed or isn't in the body.
     * @param {String} word 
     * @returns {Array}
     */
    guess(word) {
        word = Matcher.sanitize(word);
        let equalent_matches = [];
        if (word in Matcher.EQUIVALENCES) {
            equalent_matches = this.guess(Matcher.EQUIVALENCES[word]);
        } 
        if (this.foundWords.has(word)) {
            return equalent_matches;
        }
        else if (word in this.word_locations) {
            this.foundWords.add(word);
            return this.word_locations[word].concat(equalent_matches);
        }
        else {
            return equalent_matches;
        }
    }

    /**
     * Mark all words as found and return the indices of all the words
     * @returns {Array}
     */
    give_up() {
        for (const word of this.words) {
            this.foundWords.add(Matcher.sanitize(word));
        }
        return [...Array(this.words.length).keys()]
    }

    /**
     * Return the exact spelling, i.e., the original capitalization and punctuation
     * for the words at the given indices.
     * @param {Array} indices 
     * @returns {Array}
     */
    fetch_spelling(indices) {
        indices = new Set(indices);
        let spellings = [];
        for (let i = 0; i < this.words.length; i++) {
            if (indices.has(i)) {
                spellings.push(this.words[i]);
            }
        }
        return spellings
    }

    /**
     * Return the full lyrics as an array of words.
     * @returns {Array} The full lyrics
     */
    get_lyrics() {
        return this.words
    }

}

export { Matcher };