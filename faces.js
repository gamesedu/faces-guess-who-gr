/*

TODO

* INTRO SCREENS
* COMPLETION SCREEN
    * # of questions
    * time
    * score
* game over
* levels
* PORTRAIT LAYOUT
    - ctrls at the bottom of screen
    - tiles take up full width
    - DIALOG BOX WITH IMAGE IN PORTRAIT
* TIMER BAR    
* USE TOUCH EVENTS IF AVAILABLE
* PRELOAD IMAGES

*/

var faces = {

    answer: undefined,
    score: 0,
    rows: 4,
    cols: 6,
    level: 1,
    level_time: 60, // this is the initial amount of time for level 1.

    faceObjs: [],

    faces: [
        ['Jackie',     'short black',     '?',     '', 'male',     'light', ''],
        ['Soulja',     '?',     '?',     '', 'male',     'dark', 'spectacles hat'],
        ['Bjork',     'long black',     'green',     '', 'female',     'light', ''],
        ['George',     'long brown',     'green',     'moustache beard', 'male',     'light', 'spectacles'],
        ['Michael', 'short black',     'black',     '', 'male',     'light', 'spectacles'],
        ['Katy',     'long black',     'blue',     '', 'female',     'light', ''],
        ['Elton',     'short brown',    '?',     '', 'male',     'light', 'spectacles'],
        ['Ozzy',     'long black',     'black',     '', 'male',     'light', 'spectacles'],
        ['Kanye',    'short black',     '',         'beard moustache', 'male',     'dark', 'spectacles'],
        ['John',     'long brown',     'black',     '', 'male',         'light', 'spectacles'],
        ['GaGa',     'long blonde',     '',         '', 'female',         'light', 'spectacles'],
        ['Snoop',     'long black',     'brown',     'beard moustache',     'male',     'dark', ''],
        ['Ice-T',     '?',             'brown',     'beard moustache',     'male',     'light', 'hat'],
        ['Jessie',     'long black',     'blue',     '',                 'female',     'light', 'earrings'],
        ['Bono',     'short black',     '?',         '',                 'male',         'light', 'spectacles'],
        ['David',     'short blonde', 'blue',     '',                 'male',         'light', ''],
        ['Britney',    'bald',         'black',     '',                 'female',         'light', 'earrings'],
        ['Freddie',    'short black',     'black',     'moustache',         'male',     'light', ''],
        ['Polly',    'long black',     'brown',     '',                 'female',     'light', 'earrings'],
        ['Edge',    '?',             'black',     'moustache',         'male',     'light', 'hat'],
        ['Alfred',     'bald grey',     'black',     '',                 'male',     'light', ''],
        ['Stanley', 'bald grey',     'black',     'beard moustache',    'male',        'light', 'spectacles'],
        ['Grace',     'short black',     'brown',     '', 'female',     'dark', ''],
        ['Bill',     'short brown',     'green',     '', 'male',     'light', ''],
        ['Larry',     'bald grey',     'black',     '', 'male',     'light', 'spectacles'],
        ['Jack',     'long brown',     'brown',     'beard', 'male',     'light', ''],
        ['Annie',     'short blonde', 'blue',     '', 'female',     'light', ''],
        ['Lemmy',     'long brown',     'black',     'moustache', 'male',     'light', ''],
        ['Will',     'short black',     'brown',     'moustache', 'male',     'dark', ''],
        ['Bean',    'short black',    'black',        '',         'male',        'light', ''],
        ['Mario',    'short black',    'blue',        'moustache', 'male',    'light',  'hat'],
        ['Simon',    'short black',    'brown',    '', 'male',    'light',  ''],
        ["Nicki",    'long blonde',    'black',    '', 'female',    'dark',  'hat'],
        ["Keef",    'long grey',    'black',    '', 'male',    'light',  'earrings']
        // George Clooney
        // Russell Brand
        // Oprah Winfrey
        // Albert Einstein
        // Leonardo Di Caprio
        // Paul McCartney
        // Mick Jagger
    ],

    faces_left: [],

    init: function() {
        var f, d;
        for (f in this.faces) {
            d = this.faces[f];
            this.faceObjs.push({
                'name': d[0],
                'img': "i/" + this.slug(d[0]) + ".png",
                'hair': d[1],
                'eyes': d[2],
                'facialhair': d[3],
                'gender': d[4],
                'skin': d[5],
                'access': d[6]
            });
        }
        this.assess_window();
        this.attach_questions();
    },

    list_names: function(arr) {
        /* build an array of all the names */
        var num, arr2 = [];
        for (num in arr) {
            arr2.push(arr[num].name);
        }
        return arr2;
    },

    slug: function(str) {
        /* takes a string and returns a simplified version for filenames and/or id values */
        return str.replace(/[\s]/g, '-').replace(/[^a-zA-Z0-9\-_]/g, '').toLowerCase();
    },

    start_game: function() {
        this.score = 0;
        this.start_level(1);
    },

    start_level: function(num) {
        this.level = num;
        this.faceObjs = this.faceObjs.sort(function() { var rand = Math.random(); return (0.5 - rand); });
        this.gameFaceObjs = this.faceObjs.slice(0,24);
        this.faces_left = this.list_names(this.gameFaceObjs);
        this.answer = this.gameFaceObjs[Math.floor(Math.random() * this.gameFaceObjs.length)];
        this.render_board();
        var level_time = this.level_time - ((this.level - 1) * 2);
        this.countdown.start(level_time, $('#time'), this.game_over);
    },

    game_over: function() {
        var msg, btns
        msg = "<h1>Game Over</h1><p>You ran out of time!</p><p>You were searching for <b>" + faces.answer.name + "</b></p>";
        if (this.score) {
            msg += "<p>Your final score is " + this.score + "</p>";
        }
        btns = [
            { text: "Play Again", callback: function() {
                    faces.dialog.dismiss();
                    faces.start_game();
                }
            }
        ];
        faces.dialog.show(msg, btns, faces.answer.img);
    },

    render_board: function () {
        var that = this;
        this.build_board();
        window.setTimeout(function() { that.resize_board(); }, 1);
    },

    build_board: function() {
        var $board = $('#faces'),
            d,
            h = '',
            that = this;
        for (d in this.gameFaceObjs) {
            h += this.build_tile(this.gameFaceObjs[d]);
        }
        $board.html(h);
        // attach the cancel buttons
        $('ul#faces a').mousedown(function(e) {
            e.preventDefault();
            var $li = $(this).parent(),
                classVal = $li.attr('class');
            if (classVal.indexOf('eliminated') > -1) {
                that.faces_left.push($(this).attr('data-name'));
            }
            else {
                that.faces_left = that.remove_from(that.faces_left, $(this).attr('data-name'));
            }
            $li.toggleClass('eliminated');
            if (that.faces_left.length === 1) {
                that.guess(that.faces_left[0]);
            }
        });
    },

    assess_window: function() {
        var h = window.innerHeight,
            w = window.innerWidth,
            orient;
        if (h>w) {
            orient = 'portrait';
            this.rows = 6;
            this.cols = 4;
        }
        else {
            orient = 'landscape';
            this.rows = 4;
            this.cols = 6;
        }
        $('body').attr('class', orient);
    },

    build_tile: function(face) {
        return '<li><span class="card">\
                        <a href="#' + this.slug(face.name) + '" data-name="' + face.name + '">\
                            <img draggable="false" src="' + face.img + '">\
                        </a><span class="name">' + face.name + '</span></span></li>';        
    },

    resize_board: function() {
        this.scale_tiles();
    },

    scale_tiles: function() {
        var board = $('#faces'),
            avail_width = board.innerWidth(),
            avail_height = board.innerHeight() - 15;
        $('#faces li').css('width', Math.floor(avail_width/this.cols) + 'px')
                      .css('height', Math.floor(avail_height/this.rows) + 'px');
    },

    remove_from: function(arr, val) {
        /* removes a given value from an array (assuming it only appears once) */
        var pos = arr.indexOf(val),
            arr1,
            arr2;
        if (pos > -1) {
            arr1 = arr.splice(0, pos);
            arr2 = arr.slice(1);
            return arr1.concat(arr2);
        }
        return arr;
    },

    respond: function(val) {
        /*
        display the yes/no/don't-know answer
        */
        var $response = $('#response');
        $response.attr('class', this.slug(val))
                 .html('<span>'+val+'</span>')
                 .show();
        setTimeout(function() {
            $response.hide();
        }, 750);
    },

    question: function(attr, value) {
        if (this.answer[attr].indexOf('?') !== -1) { return "Don't Know"; }
        return !!(this.answer[attr].indexOf(value) + 1) ? "Yes":"No";
    },

    attach_questions: function() {
        var that = this;
        $('#questions a').click(function(e) {
            /* get the link id, clean it, split it on underscore, test the attribute (0) for the value (1) */
            var href = $(this).attr('href').replace('#', ''),
                bits = href.split('_');
            that.respond(that.question(bits[0], bits[1]));
            e.preventDefault();
        });
    },

    level_complete: function() {
        // stop the clock!
        this.countdown.stop();
        var level_score = this.countdown._display;
        this.score += level_score;
        var msg = "<h1>Correct!</h1>\
                    <p>You found the face!</p>\
                    <p>Level " + this.level + " completed with " + level_score + " seconds remaining.</p>";
        var btns = [{
                text:"Next Level",
                callback: function() {
                    faces.dialog.dismiss();
                    faces.start_level(faces.level + 1);
                }
            }
        ]
        faces.dialog.show(msg, btns, this.answer.img)
    },

    guess: function(name) {
        if (name === this.answer.name) {
            this.level_complete();
        }
        else {
            alert("No, it's not " + name);
        }
    },

    dialog: {

        _initted: false,
        _$box: undefined,
        _$box_content: undefined,
        _$mask: undefined,

        init: function() {
            this._$mask = $('<div id="mask" />').hide();
            this._$box = $('<div id="dialog"></div>').hide();
            this._$box_content = $('<div id="dialog_content"></div>');
            this._$box.append(this._$box_content);
            $('body').append(this._$mask).append(this._$box);
            this._initted = true;
        },

        show: function(text, btns, img) {
            /* renders HTML in a dialog box
                expected args are as follows:
                text: html string
                img: optional image file path (i.e a. face)
                btns: an array of objects that have the following attrs: 'text' and 'callback'
            */
            if (!this._initted) this.init();
            this._$box_content.html(text);
            if (img) {
                this._$box_content.append('<img src="' + img + '">');
                this._$box_content.addClass('with_img');
            }
            else {
                this._$box.removeClass('with_img');                
            }
            if (btns) {
                var $ul = $('<ul>')
                for (var b in btns) {
                    var txt = btns[b].text;
                    var button = $("<li><a href='#" + faces.slug(txt) + "'>" + txt + "</a></li>");
                    button.bind('click', function(e){
                        e.preventDefault();
                        btns[b].callback()
                    });
                    $ul.append(button.wrap('<li>'));
                }
                this._$box_content.append($ul)
            }
            this._$mask.show();
            this._$box.show();
        },

        dismiss: function() {
            if (this._initted) {
                this._$mask.hide();
                this._$box.hide();
            }
        }

    },

    countdown: {

        _st_time:0,
        _st_num:0,
        _display:0,
        _running: false,

        start: function(num, $output, cback) {
            this.$output = $output;
            this.callback = cback;
            var now = new Date();
            this._st_time = now.getTime();
            this._st_num = num;
            this._display = num;
            this._running = true;
            this.display();
        },

        display:function () {
            var now = new Date();
            var elapsed = now.getTime() - this._st_time;
            this._display = this._st_num - Math.floor(elapsed/1000);
            if (this._display < 0) {
                this.callback();
            }
            else {
                this.$output.html(this._display)
                this._temp = setTimeout(function() {
                    if (faces.countdown._running) {
                        faces.countdown.display();
                    }
                }, 499);
            }
        },

        stop: function() {
            this._running = false;
            return this._display;
        },

    }
};
