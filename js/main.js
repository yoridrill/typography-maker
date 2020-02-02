const app = new Vue({
    el: '#app',
    data: {
        tgData: {
            color: {
                bg: '#ccccff',
                text: '#000',
                point: '#ee5555',
            },
            text: [{
                content: 'おお<br>おあ123い<bb>おう</bb>ええうううおおおう',
                pos: 'cc',
                font: 'Hiragino Kaku Gothic StdN',
                size: 16
            }, {
                content: 'おおおあ123いおうええうううおおおう',
                pos: 'vr',
                font: 'serif',
                size: 5
            }],
            textEff: null,
            mark: [{
                img: null,
                pos: null
            }],
            sizeW: 1280,
            sizeH: 670
        }
    },
    created: function() {
        const self = this;
        if (!location.search) return;

        const arg = {};
        const pair = location.search.substring(1).split('&');
        for (let i = 0; pair[i]; i++) {
            const kv = pair[i].split('=');
            arg[kv[0]] = decodeURIComponent(kv[1]);
        }


    },
    mounted: function() {
        const self = this;

        self.createImg();
    },
    computed: {
        // queryString: function () {
        //     const self = this;
        //
        //     let str = '?data=1';
        //     for (key in self.tgData) {
        //         str += `&${key}=${self.tgData[key]}`;
        //     }
        //     return str;
        // }
    },
    methods: {
        textStyle: function(txt) {
            return {
                fontFamily: txt.font, color: this.tgData.color.text, fontSize: txt.size + 'vmin'
            }
        },
        createImg: function() {
            const self = this;
            const serializeHtml = (new XMLSerializer).serializeToString(self.$refs.html);
            const ctx = self.$refs.tgCanvas.getContext('2d');
            const data =
                `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0, 0, ${self.tgData.sizeW}, ${self.tgData.sizeH}' width='${self.tgData.sizeW}' height='${self.tgData.sizeH}'>
                <foreignObject width='100%' height='100%'>
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        <style>
                        .wrapper {
                            width: 100%;
                            height: 100vh;
                            font-kerning: normal;
                            font-feature-settings: "palt";
                            -webkit-font-feature-settings: "palt";
                        }
                        bb {
                            font-size: 150%;
                        }
                        .ab-100 {
                            position: absolute;
                            width: 100%;
                        }
                        .tp-tl {
                            top: 6vmin;
                            left: 8vmin;
                        }
                        .tp-tr {
                            top: 6vmin;
                            right: 8vmin;
                            text-align: right;
                        }
                        .tp-bl {
                            bottom: 6vmin;
                            left: 8vmin;
                        }
                        .tp-br {
                            right: 8vmin;
                            bottom: 6vmin;
                            text-align: end;
                        }
                        .tp-bc {
                            bottom: 8vmin;
                            text-align: center;
                        }
                        .table-cc {
                            height: 100vh;
                            display: table;
                        }
                        .tp-cc {
                            display: table-cell;
                            vertical-align: middle;
                            text-align: center;
                        }
                        .table-v {
                            height: 95vh;
                            display: table;
                            writing-mode: vertical-rl;
                            text-orientation: upright;
                            padding-top: 6vmin;
                        }
                        .tp-vc {
                            display: table-cell;
                            vertical-align: middle;
                        }
                        .tp-vl {
                            display: table-cell;
                            vertical-align: bottom;
                            padding-left: 6vmin;
                        }

                        .tp-vr {
                            display: table-cell;
                            padding-right: 6vmin;
                        }

                        </style>
                        ${serializeHtml}
                    </div>
              </foreignObject>
            </svg>
                `;

            const svg = new Blob([data], {
                type: 'image/svg+xml'
            });

            const DOMURL = window.URL || window.webkitURL || window;
            const url = DOMURL.createObjectURL(svg);

            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;

            img.onload = () => {
                ctx.clearRect(0, 0, self.tgData.sizeW, self.tgData.sizeH)
                ctx.drawImage(img, 0, 0);
                self.$refs.tgImg.src = self.$refs.tgCanvas.toDataURL();
                DOMURL.revokeObjectURL(url);
            }
        }
    }
});
