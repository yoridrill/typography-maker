const app = new Vue({
    el: '#app',
    data: {
        tgData: {
            color: {
                bg: '#B3E5FC',
                text: '#000',
                point: '#ee5555',
            },
            text: [{
                content: 'これは<br><bb>サンプル</bb>です。',
                pos: 'cc',
                font: 'Hiragino Kaku Gothic StdN',
                size: 16
            }, {
                content: '「縦書き」は<br>こんな感じです。',
                pos: 'vr',
                font: 'serif',
                size: 8
            }, {
                content: 'Typography maker',
                pos: 'bc',
                font: 'serif',
                size: 10
            }],
            effect: null,
            mark: {
                img: null,
                pos: null
            },
            sizeW: 1280,
            sizeH: 670
        },
        ctx: null,
        prCtx: null,
        tab: {
            color: 'random',
            text: 0
        },
        textPos: [{
            str: 'tl',
            label: '左上'
        }, {
            str: 'cc',
            label: '中央'
        }, {
            str: 'tr',
            label: '右上'
        }, {
            str: 'bl',
            label: '左下'
        }, {
            str: 'bc',
            label: '中下'
        }, {
            str: 'br',
            label: '右下'
        }, {
            str: 'vl',
            label: '縦左'
        }, {
            str: 'vc',
            label: '縦中'
        }, {
            str: 'vr',
            label: '縦右'
        }],
        fontList: [
            {
                name: 'sans-serif',
                label: 'ゴシック体'
            }, {
                name: 'serif',
                label: '明朝体'
            }, {
                name: 'YuKyokasho',
                label: '游教科書体'
            }, {
                name: 'YuGothic',
                label: '游ゴシック体'
            }, {
                name: 'YuMincho',
                label: '游明朝体'
            }, {
                name: 'Hiragino Kaku Gothic StdN',
                label: 'ヒラギノ角ゴ StdN'
            }, {
                name: 'Corporate Logo Bold',
                label: 'コーポレート・ロゴB Bold'
            }
        ]
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

        self.ctx = self.$refs.tgCanvas.getContext('2d');
        self.prCtx = self.$refs.prCanvas.getContext('2d');

        self.createImg();
    },
    computed: {
        queryString: function () {
            const self = this;

            let str = '?data=1';
            for (key in self.tgData) {
                if (self.tgData[key] instanceof Object) {
                    for (key2 in self.tgData[key]) {
                        if (self.tgData[key][key2] instanceof Object) {
                            for (key3 in self.tgData[key][key2]) {
                                str += `&${key}${key2}${key3}=${self.tgData[key][key2][key3]}`;
                            }
                        } else if (self.tgData[key][key2]) {
                            str += `&${key}${key2}=${self.tgData[key][key2]}`;
                        }
                    }
                } else if (self.tgData[key]) {
                    str += `&${key}=${self.tgData[key]}`;
                }
            }
            return str;
        }
    },
    watch: {
        queryString: function() {
            const self = this;
            //history.replaceState('', '', self.queryString);
            Vue.nextTick(function () {
                self.createImg();
            });
        }
    },
    methods: {
        textStyle: function(txt) {
            return {
                fontFamily: txt.font, color: this.tgData.color.text, fontSize: txt.size + 'vmin'
            }
        },
        createImg: function() {
            const self = this;
            console.log('aa');
            const serializeHtml = (new XMLSerializer).serializeToString(self.$refs.html);

            let longShadow = `text-shadow: 1px 1px 0 ${self.tgData.color.point}`;
            for (let i=2; i<self.tgData.sizeH/2; i++) {
                longShadow += `,${i}px ${i}px 0 ${self.tgData.color.point}`
            }
            longShadow += ';'


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
                            font-feature-settings: initial;
                            -webkit-font-feature-settings: initial;
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
                        .fuchidori {
                            text-shadow:
                            ${self.tgData.color.point} 4px 0px 1px,  ${self.tgData.color.point} -4px 0px 1px,
                            ${self.tgData.color.point} 0px -4px 1px, ${self.tgData.color.point} 0px 4px 1px,
                            ${self.tgData.color.point} 4px 4px 1px, ${self.tgData.color.point} -4px 4px 1px,
                            ${self.tgData.color.point} 4px -4px 1px, ${self.tgData.color.point} -4px -4px 1px,
                            ${self.tgData.color.point} 2px 4px 1px,  ${self.tgData.color.point} -2px 4px 1px,
                            ${self.tgData.color.point} 2px -4px 1px, ${self.tgData.color.point} -2px -4px 1px,
                            ${self.tgData.color.point} 4px 2px 1px,  ${self.tgData.color.point} -4px 2px 1px,
                            ${self.tgData.color.point} 4px -2px 1px, ${self.tgData.color.point} -4px -2px 1px;
                        }
                        .longShadow {
                            ${longShadow}
                        }
                        </style>
                        ${serializeHtml}
                    </div>
              </foreignObject>
            </svg>
                `;

                console.log(data);

            const svg = new Blob([data], {
                type: 'image/svg+xml'
            });

            const DOMURL = window.URL || window.webkitURL || window;
            const url = DOMURL.createObjectURL(svg);

            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;

            img.onload = () => {
                self.ctx.clearRect(0, 0, self.tgData.sizeW, self.tgData.sizeH);
                self.ctx.drawImage(img, 0, 0);
                self.prCtx.clearRect(0, 0, self.tgData.sizeW, self.tgData.sizeH);
                self.prCtx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
            }
        }
    }
});
