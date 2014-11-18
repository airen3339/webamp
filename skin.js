// Dynamically set the css background images for all the sprites
var SkinManager = {
    fileManager: FileManager,
    visColors: [],
    style: document.getElementById('skin'),

    _skinImages: {
        "#winamp": "MAIN.BMP",
        "#title-bar": "TITLEBAR.BMP",
        "#title-bar #option": "TITLEBAR.BMP",
        "#title-bar #minimize": "TITLEBAR.BMP",
        "#title-bar #shade": "TITLEBAR.BMP",
        "#title-bar #close": "TITLEBAR.BMP",
        ".status #clutter-bar": "TITLEBAR.BMP",
        ".status #play-pause": "PLAYPAUS.BMP",
        ".play .status #work-indicator": "PLAYPAUS.BMP",
        ".status #time #minus-sign": "NUMBERS.BMP",
        ".media-info .mono-stereo div": "MONOSTER.BMP",
        "#volume": "VOLUME.BMP",
        "#volume::-webkit-slider-thumb": "VOLUME.BMP",
        "#volume::-moz-range-thumb": "VOLUME.BMP",
        "#balance": "BALANCE.BMP",
        "#balance::-webkit-slider-thumb": "VOLUME.BMP",
        "#balance::-moz-range-thumb": "VOLUME.BMP",
        ".windows div": "SHUFREP.BMP",
        "#position": "POSBAR.BMP",
        "#position::-webkit-slider-thumb": "POSBAR.BMP",
        "#position::-moz-range-thumb": "POSBAR.BMP",
        ".actions div": "CBUTTONS.BMP",
        "#eject": "CBUTTONS.BMP",
        ".shuffle-repeat div": "SHUFREP.BMP",
        ".character": "TEXT.BMP",
        ".digit": "NUMBERS.BMP",
        // Put this second, since it will trump .digit
        ".digit-ex": "NUMS_EX.BMP",
        ".shade #position": "TITLEBAR.BMP",
        ".shade #position::-webkit-slider-thumb": "TITLEBAR.BMP",
        ".shade #position::-moz-range-thumb": "TITLEBAR.BMP",
    },

    // Given a file of an original Winamp WSZ file, set the current skin
    setSkinByFileReference: function(fileReference) {
        this.fileManager.bufferFromFileReference(fileReference, this._setSkinByBuffer.bind(this));
    },

    // Given the url of an original Winamp WSZ file, set the current skin
    setSkinByUrl: function(url) {
        this.fileManager.bufferFromUrl(url, this._setSkinByBuffer.bind(this));
    },

    // Given a bufferArray containing a Winamp WSZ file, set the current skin
    // Gets passed as a callback, so don't have access to `this`
    _setSkinByBuffer: function(buffer) {
        var zip = new JSZip(buffer);

        // XXX Ideally we would empty the style tag here, but I don't know how
        // Appending overwrites, which has the same net effect, but after
        // several skin changes, this tag will get pretty bloated.
        var cssRules = '';
        for(var selector in SkinManager._skinImages) {
            var fileName = SkinManager._skinImages[selector];
            var file = this._findFileInZip(fileName, zip);

            if (file) {
                var value = "background-image: url(data:image/bmp;base64," + btoa(file.asBinary()) + ")"
                cssRules += selector + "{" + value + "}\n";
            }

        }
        this.style.appendChild(document.createTextNode(cssRules));

        this._parseVisColors(zip);

    },

    _parseVisColors: function(zip) {
        var entries = this._findFileInZip("VISCOLOR.TXT", zip).asText().split("\n");
        var regex = /^(\d+),(\d+),(\d+)/
        for(var i = 0; i <= entries.length; i++) {
            var matches = regex.exec(entries[i]);
            if(matches) {
                this.visColors.push('rgb(' + matches.slice(1,4).join(',') + ')');
            }
        }
    },

    _findFileInZip: function(name, zip) {
        return zip.filter(function (relativePath, file){
            return new RegExp("(^|/)" + name, 'i').test(relativePath)
        })[0];
    }
}
