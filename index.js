function Klavogonki() {
    this.field = document.getElementById("inputtext");
    this.timeout = null;
    this.interval = null;
    this.speed = 100;
    this.isEnd = false;

    var evt = document.createEvent("KeyboardEvent");
    evt.initKeyboardEvent("keyup", true, true, window, false, false, false, false, 40, 0);

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    this.keyup = function () {
        this.field.dispatchEvent(evt);
    };

    this.word = function () {
        var focus = document.getElementById('typefocus');

        var word;
        var spans = focus.getElementsByTagName('span');
        if (spans.length > 0) {
            word = '';
            for (var i = 0; i < spans.length; i++) {
                if (spans[i].style.display !== 'none') {
                    word += spans[i].innerHTML;
                }
            }
        } else {
            word = focus.innerHTML;
        }

        var afterfocus = document.getElementById('afterfocus').getElementsByTagName('span');

        if (afterfocus.length > 0) {
            word += ' ';
        } else {
            this.isEnd = true;
            word += '.';
        }

        return word;
    };

    this.value = function (word, complete) {
        var self = this;
        var i = 0;

        function addValue() {
            self.timeout = setTimeout(function () {
                if (i < word.length) {
                    switch (word[i].charCodeAt()) {
                        case 111:
                            self.field.value += 'о';
                            break;
                        case 99:
                            self.field.value += 'с';
                            break;
                        default:
                            self.field.value += word[i];
                    }
                    i++;
                    self.keyup();
                    addValue.call(self);
                } else {
                    var j = 0;
                    self.keyup();
                    self.interval = setInterval(function () {
                        if (self.field.value === '' || self.field.value.length == 0) {
                            clearInterval(self.interval);
                            complete.call(self);
                        }
                        if (j > 2) {
                            self.cancel();
                            self.value(word, complete);
                        }
                        j++;
                    }, 100);
                }
            }, typeof self.speed === 'number' ? self.speed : rand(80, 110));
        }

        addValue.call(this);
    };

    this.cancel = function () {
        this.field.value = '';
        clearTimeout(this.timeout);
        clearInterval(this.interval);
    };

    this.run = function () {
        var word = this.word();
        //console.log('detected word: %s', word);

        this.value(word, function () {
            //console.log('word: "%s" complete', word);
            this.keyup();
            if (!this.isEnd) {
                this.run();
            } else {
                this.cancel();
            }
        });

        return this;
    };

    this.getInvalidChar = function (el, txt) {
        var eltxt = el.innerHTML;
        for (var i = 0; i < txt.length; i++) {
            if (txt[i].charCodeAt() != eltxt[i].charCodeAt()) {
                console.log(txt[i], 'valid char:', txt[i].charCodeAt(), 'invalid char', eltxt[i].charCodeAt());
            }
        }
    };

    this.setSpeed = function (speed) {
        this.speed = speed;
    }
}

var GONKI = (new Klavogonki()).run();

