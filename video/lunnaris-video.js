class LunnarisVideoPlayer {
    constructor(video) {
        this.root = null;
        this.video = video;
        this.skipValue = 10;
        this.decimalFormatter = new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 2
        });
    }

    render(){
        //Create root component
        this.root = document.createElement('div');
        this.root.className = 'lunnaris-video';
        this.video.className = 'lunnaris-video-content';
        this.video.controls = false;
        this.video.addEventListener('timeupdate',() => {
            const progress = this.video.currentTime/ this.video.duration;
            this.currentTime.textContent = this.formatTime(this.video.currentTime);
            this.root.style.setProperty('--lunnaris-video-progress', progress);
        });

        this.video.addEventListener('loadedmetadata', ()=> {
            this.duration.textContent = this.formatTime(this.video.duration);
        });
        this.rot = 0;
        this.video.addEventListener('waiting',() => {
            this.loadingComponent.classList.toggle('loading', true);
        });

        this.video.addEventListener('canplay',() => {
            this.loadingComponent.classList.toggle('loading', false);
        });

        this.topLayer = this.createElement('div', 'lunnaris-video-topLayer');
        this.loadingComponent = this.createElement('div', 'lunnaris-video-loadingComponent');
        this.root.appendChild(this.video);
        this.topLayer.appendChild(this.loadingComponent);
        this.leftControlPane = this.createElement('div','lunnaris-video-leftControlPane');
        this.rightControlPane = this.createElement('div','lunnaris-video-rightControlPane');
        //this.leftControlPane.appendChild(this.createVolumePane());
        //this.volumePanel.classList.toggle('floating', true);
        
        this.root.appendChild(this.topLayer);
        this.root.appendChild(this.leftControlPane);
        this.root.appendChild(this.rightControlPane);
        this.createControlPane();
        document.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowLeft') {
                this.skipBackwards();
            }

            if (event.code === 'ArrowRight') {
                this.skipForwards();
            }

            if (event.code === 'ArrowUp') {
                this.volumeUp()
            }

            if (event.code === 'ArrowDown') {
                this.volumeDown();
            }

            if (event.code === 'KeyM') {
                this.toggleMute();
            }

            if (event.code === 'KeyF') {
                this.toggleFullscreen();
            }

            if(event.code === 'Space'){
                this.togglePlay();
            }

        });

        return this.root;
    }

    createTimePreview(){
        this.timePreview = this.createElement('div', 'lunnaris-video-timePreview');
        this.timePreview.textContent = '0:00';
    }

    volumeUp(){
        var tempVol = this.video.volume + 0.1;
        this.video.volume = Math.min(tempVol, 1);
        this.input.value = this.video.volume;
        this.input.style.backgroundSize = `${this.video.volume*100}% 100%`;
        
    }

    volumeDown(){
        var tempVol = this.video.volume - 0.1;
        this.video.volume = Math.max(tempVol, 0);
        this.input.value = this.video.volume;
        this.input.style.backgroundSize = `${this.video.volume*100}% 100%`;
    }

    createTimeline() {
        this.timeline = this.createElement('div', 'lunnaris-video-timeline');
        this.timelineContainer = this.createElement('div','lunnaris-video-timelineContainer');
        this.timelineThumb = this.createElement('div', 'lunnaris-video-thumb');
        this.timelineContainer.appendChild(this.timeline);
        this.timelineContainer.appendChild(this.timelineThumb);
        this.controlsContainer.appendChild(this.timelineContainer);
        this.timelineContainer.addEventListener('click', (e) => {
            this.handleSelectTime(e);
        });
        this.createTimePreview();
        this.timelineContainer.appendChild(this.timePreview);
        this.timelineContainer.addEventListener('mousemove', (e) => {
            this.handleTimePreview(e);
        })

        
    }

    createElement(tag, class_){
        var element = document.createElement(tag);
        element.className = class_;
        return element;
    }

    createControlPane() {
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.className = 'lunnaris-video-controls-container';
        this.root.appendChild(this.controlsContainer);
        this.createTimeline();
        this.controlPane = document.createElement('div');
        this.controlPane.className = 'lunnaris-video-control-pane';
        this.controlsContainer.appendChild(this.controlPane);
        var left = this.createElement('div', 'lunnaris-video-left-pane');
        var right = this.createElement('div', 'lunnaris-video-right-pane');
        left.appendChild(this.createPlayButton());
        left.appendChild(this.createPauseButton());
        this.pause.classList.toggle('hidden', true);

        this.controlPane.appendChild(left);
        this.controlPane.appendChild(right);

        this.currentTime = this.createElement('div', 'lunnaris-video-timeLabel');
        this.currentTime.textContent = '0:00';
        this.duration = this.createElement('div', 'lunnaris-video-timeLabel');
        this.duration.textContent = '0:00';

        this.timeView = this.createElement('div','lunnaris-video-timeView');
        this.timeView.appendChild(this.currentTime);
        this.timeView.appendChild(document.createTextNode('/'));
        this.timeView.appendChild(this.duration);
        

        left.appendChild(this.createVolumePane());

        this.volumePanel.classList.toggle('vertical', true);
        this.slider.classList.toggle('floating', true);
        this.slider.classList.toggle('vertical', true);

        left.appendChild(this.timeView);
        right.appendChild(this.createExpandButton());
        right.appendChild(this.createMinimizeButton());
        this.minimize.classList.toggle('hidden', true);

        this.timeout = undefined;
        this.root.addEventListener('mousemove', () => {
            this.controlsContainer.classList.toggle('showing', true);
            this.rightControlPane.classList.toggle('showing', true);
            this.leftControlPane.classList.toggle('showing', true);
            this.root.style.cursor = 'default';
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.controlsContainer.classList.toggle('showing', false);
                this.rightControlPane.classList.toggle('showing', false);
                this.leftControlPane.classList.toggle('showing', false);
                this.root.style.cursor = 'none';
            }, 2000);
        });

        this.video.addEventListener('click', () => {
            this.togglePlay();
        })

        this.rightControlPane.appendChild(this.createForwardButton());
        this.leftControlPane.appendChild(this.createBackwardButton());
        document.addEventListener('fullscreenchange', () => {
            if(document.fullscreenElement == null){//I'm not in fullscreen
                this.minimize.classList.toggle('hidden', true);
                this.expand.classList.toggle('hidden', false);
                this.root.classList.toggle('fullscreen', false);
            }else{ //I'm on fullscreen
                this.minimize.classList.toggle('hidden', false);
                this.expand.classList.toggle('hidden', true);
                this.root.classList.toggle('fullscreen', true);
                //this.root..style.cursor = 'default';
            }
        })

    }

    createPlayButton(){
        var button = this.createButton('');
        this.play = button;
        var icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"' + 
        'width="50px" viewBox="0 0 512.000000 512.000000"' +
        'preserveAspectRatio="xMidYMid meet" class="lunnaris-video-icon" id="play">' +
        '<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"' +
        'fill="#000000" stroke="none" class="lunnaris-video-g"> ' +
        '<path d="M620 5110 c-71 -15 -151 -60 -206 -115 -86 -85 -137 -210 -154 -375' +
        '-13 -129 -13 -3991 0 -4120 17 -165 68 -290 154 -375 149 -149 373 -163 619' +
        '-39 76 37 3457 1975 3546 2031 31 20 90 70 131 112 159 161 196 340 107 521' +
        '-37 76 -152 198 -238 253 -89 56 -3470 1994 -3546 2031 -37 19 -97 44 -133 56' +
        '-74 24 -214 34 -280 20z"/>' +
        '</g>' +
        '</svg>';

        button.innerHTML = icon;
        button.addEventListener('click', () => {
            this.togglePlay();
        });
        return button;
    }

    createPauseButton(){
        var button = this.createButton('');
        this.pause = button;
        var icon_ = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"' + 
        'width="50px" viewBox="0 0 512.000000 512.000000"' + 
        'preserveAspectRatio="xMidYMid meet" class="lunnaris-video-icon" id="pause">' + 
        '<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"' + 
        'fill="#000000" stroke="none" class="lunnaris-video-g" >' + 
        '<path d="M1204 4581 c-122 -20 -232 -77 -315 -167 -59 -64 -92 -122 -118 -208 ' + 
        '-21 -68 -21 -75 -21 -1648 l0 -1579 25 -75 c14 -41 37 -93 51 -117 64 -103 ' + 
        '180 -192 299 -230 66 -21 88 -22 375 -22 304 0 305 0 376 26 164 60 273 169 ' + 
        '336 335 l23 59 3 1565 c2 1105 0 1584 -8 1630 -31 184 -168 342 -354 408 -69 ' + 
        '25 -80 26 -346 28 -151 1 -298 -1 -326 -5z"/> ' + 
        '<path d="M3329 4580 c-215 -34 -400 -212 -438 -424 -15 -83 -15 -3109 0 -3192 ' + 
        '34 -191 188 -355 389 -416 34 -10 122 -13 345 -13 282 0 304 1 370 22 178 56 ' + 
        '313 199 360 379 13 51 15 261 15 1624 0 1711 3 1613 -58 1738 -56 115 -182 ' + 
        '221 -311 264 -60 19 -91 21 -341 24 -151 1 -300 -1 -331 -6z"/> ' + 
        '</g>' + 
        '</svg>';

        button.innerHTML = icon_;
        button.addEventListener('click', () => {
            this.togglePlay();
        });
        return button;
    }

    createExpandButton(){
        var button = this.createElement('button', 'lunnaris-video-button');
        this.expand = button;
        var icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"' +
        'width="50px" viewBox="0 0 512.000000 512.000000" ' +
        'preserveAspectRatio="xMidYMid meet" class="lunnaris-video-icon" id="expand"> ' +
        '<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" ' +
        'fill="#000000" stroke="none" class="lunnaris-video-g"> ' +
        '<path d="M3412 5107 c-94 -35 -147 -118 -140 -222 5 -78 38 -132 105 -172 l48 ' +
        '-28 473 -5 472 -5 -801 -800 c-548 -547 -807 -813 -820 -840 -37 -79 -16 -187 ' +
        '47 -247 60 -56 156 -74 232 -43 26 11 277 256 845 823 l807 807 0 -453 c0 ' +
        '-293 4 -468 11 -496 29 -117 154 -186 272 -152 64 19 129 82 146 142 7 26 11 ' +
        '274 11 745 0 779 1 767 -63 851 -20 27 -55 54 -92 73 l-59 30 -730 2 c-548 1 ' +
        '-739 -1 -764 -10z"/> ' +
        '<path d="M2085 2371 c-27 -13 -293 -272 -840 -820 l-800 -801 -5 472 -5 473 ' +
        '-28 48 c-39 66 -93 100 -168 105 -110 8 -201 -52 -228 -151 -9 -31 -11 -237 ' +
        '-9 -763 l3 -720 30 -59 c19 -37 46 -72 73 -92 84 -64 72 -63 851 -63 480 0 ' +
        '719 4 746 11 61 17 130 93 145 161 25 113 -43 226 -155 257 -26 7 -197 11 ' +
        '-495 11 l-455 0 807 808 c567 567 812 818 823 844 32 79 10 182 -51 240 -62 ' +
        '58 -163 75 -239 39z"/> ' +
        '</g> ' +
        '</svg>';

        button.innerHTML = icon;
        button.addEventListener('click', ()=> {
            this.toggleFullscreen();
        })
        return button;
    }

    createMinimizeButton() {
        var button = this.createElement('button', 'lunnaris-video-button');
        this.minimize = button;
        var icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"' +
        'width="50px" viewBox="0 0 512.000000 512.000000" ' +
        'preserveAspectRatio="xMidYMid meet" class="lunnaris-video-icon" id="minimize"> ' +
        '<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" ' +
        'fill="#000000" stroke="none" class="lunnaris-video-g"> ' +
        '<path d="M4825 5105 c-22 -8 -42 -15 -45 -15 -2 0 -370 -366 -817 -812 l-813 ' +
        '-813 0 472 0 471 -28 53 c-40 77 -102 114 -192 114 -90 0 -152 -37 -192 -114 ' +
        'l-28 -53 0 -722 c0 -798 -1 -784 63 -868 20 -27 55 -54 92 -73 l59 -30 740 -3 ' +
        '741 -3 55 28 c75 38 112 93 118 172 2 32 -1 76 -8 96 -17 51 -85 117 -136 133 ' +
        '-30 9 -167 12 -505 12 l-464 0 807 808 c443 444 813 822 822 839 44 88 28 184 ' +
        '-43 254 -66 67 -141 84 -226 54z"/> ' +
        '<path d="M675 2391 c-76 -34 -135 -123 -135 -201 0 -78 59 -167 135 -201 37 ' +
        '-17 77 -19 510 -19 l470 0 -807 -807 c-443 -445 -813 -823 -822 -840 -44 -88 ' +
        '-28 -184 43 -254 70 -71 166 -87 254 -43 17 9 395 379 840 822 l807 807 0 ' +
        '-470 c0 -434 2 -473 19 -510 65 -141 234 -177 346 -74 80 73 76 31 73 860 l-3 ' +
        '735 -30 59 c-19 37 -46 72 -73 92 -84 64 -70 63 -866 63 -676 0 -724 -2 -761 ' +
        '-19z"/> ' +
        '</g> ' +
        '</svg>'; 

        button.innerHTML = icon;
        button.addEventListener('click', ()=> {
            this.toggleFullscreen();
        })

        return button;
    }

    createBackwardButton() {
        this.backward = this.createElement('button', 'lunnaris-video-button');
        this.backward.classList.toggle('noTransparent', true);
        var icon = '<svg ' +
        'viewBox="0 0 32.808333 32.808333" ' +
        'version="1.1" ' +
        'id="svg5" ' +
        'inkscape:version="1.2.1 (9c6d41e410, 2022-07-14)" ' +
        'sodipodi:docname="backward.svg" ' +
        'xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ' +
        'xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" ' +
        'xmlns="http://www.w3.org/2000/svg" ' +
        'xmlns:svg="http://www.w3.org/2000/svg" ' +
        'class="lunnaris-video-icon"> ' +
        '<defs ' +
        'id="defs2" /> ' +
        '<g ' +
        'inkscape:label="Capa 1" ' +
        'inkscape:groupmode="layer" ' +
        'id="layer1" ' +
        'class="lunnaris-video-g"> ' +
        '<path ' +
        'id="path234-1" ' +
        'style="fill:#ffffff;stroke:#ffffff;stroke-width:2.55185;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10" ' +
        'inkscape:transform-center-x="2.3786296" ' +
        'd="M 29.21445,6.1686158 V 26.639718 L 17.865789,18.500679 v 8.139039 L 3.5937917,16.404167 17.865789,6.1686158 v 8.1390382 z" ' +
        'inkscape:label="path234-1" /> ' +
        '</g>' +
        '</svg>';


        this.backward.innerHTML = icon;
        this.backward.addEventListener('click', () => {
            this.skipBackwards();
        })
        return this.backward;
    }

    createForwardButton(){
        this.forward = this.createElement('button', 'lunnaris-video-button');
        this.forward.classList.toggle('noTransparent', true);
        var icon = '<svg viewBox="0 0 32.808333 32.808333"' +
        'version="1.1" ' +
        'id="svg5" ' +
        'inkscape:version="1.2.1 (9c6d41e410, 2022-07-14)" ' +
        'sodipodi:docname="forward.svg" ' +
        'xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ' +
        'xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" ' +
        'xmlns="http://www.w3.org/2000/svg" ' +
        'xmlns:svg="http://www.w3.org/2000/svg" class="lunnaris-video-icon"> ' +
        '<g class="lunnaris-video-g" ' +
        'inkscape:label="Capa 1" ' +
        'inkscape:groupmode="layer" ' +
            'id="layer1"> ' +
            '<path ' +
                'id="path234-1" ' +
                'style="stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10" ' +
                'inkscape:transform-center-x="-2.3786294" ' +
                'd="M 1.0093672 4.2998031 L 1.0093672 14.376522 L 7.9485991 10.370152 L 7.9485991 14.376522 L 16.675329 9.3381624 L 7.9485991 4.2998031 L 7.9485991 8.3061725 L 1.0093672 4.2998031 z " ' +
                'transform="matrix(1.6354348,0,0,2.0315246,2.328331,-2.56654)" ' +
                'inkscape:label="path234-1" /> ' +
            '</g> ' +
        '</svg>';

        this.forward.innerHTML = icon;
        this.forward.addEventListener('click', () => {
            this.skipForwards();
        })
        return this.forward;
    }

    createVolumePane(){
        this.volume = this.createVolumeButton();
        this.mute = this.createMuteButton();
        this.volumePanel = this.createElement('div', 'lunnaris-video-volumePane');
        this.mute.classList.toggle('hidden', true);
        this.volumePanel.appendChild(this.mute);
        this.volumePanel.appendChild(this.volume);
        this.volumePanel.appendChild(this.createAudioSlider());
        return this.volumePanel;
    }

    createVolumeButton(){
        var button = this.createElement('button', 'lunnaris-video-button');
        var icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg"' +
        'viewBox="0 0 512.000000 512.000000" ' +
        'preserveAspectRatio="xMidYMid meet" id="volume" class="lunnaris-video-icon"> ' +
        '<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" ' +
        'fill="#000000" stroke="none" class="lunnaris-video-g"> ' +
        '<path d="M2846 4943 c-10 -3 -400 -310 -867 -684 l-849 -678 -442 -3 c-437 -3 ' +
        '-444 -3 -489 -26 -74 -36 -125 -87 -161 -160 l-33 -67 0 -765 0 -765 33 -67 ' +
        'c36 -73 87 -124 161 -160 45 -23 52 -23 489 -26 l442 -3 848 -678 c467 -373 ' +
        '859 -681 873 -684 75 -20 156 12 194 77 l25 43 0 2263 0 2263 -25 43 c-38 65 ' +
        '-121 97 -199 77z"/> ' +
        '<path d="M4249 4290 c-71 -21 -119 -87 -119 -165 0 -60 7 -72 104 -180 154 ' +
        '-171 247 -307 337 -491 233 -478 270 -1026 103 -1533 -93 -282 -227 -509 -440 ' +
        '-746 -97 -108 -104 -120 -104 -180 0 -115 101 -194 212 -165 34 9 60 29 120 ' +
        '90 291 299 512 714 603 1135 165 764 -54 1558 -591 2134 -91 98 -149 124 -225 ' +
        '101z"/> ' +
        '<path d="M3770 3807 c-77 -25 -120 -83 -120 -160 0 -62 16 -91 100 -183 225 ' +
        '-248 342 -556 342 -904 0 -345 -115 -652 -338 -899 -89 -100 -104 -126 -104 ' +
        '-186 0 -81 48 -144 125 -164 48 -12 102 -2 143 27 42 31 168 180 235 280 65 ' +
        '95 151 268 190 377 72 203 107 483 88 698 -34 382 -165 695 -410 982 -107 126 ' +
        '-170 159 -251 132z"/> ' +
        '</g> ' +
        '</svg>';

        button.innerHTML = icon;
        button.addEventListener('click', () => {
            this.toggleMute();
        })
        return button;
    }

    createAudioSlider(){
        this.input = this.createElement('input', 'lunnaris-video-slider');
        var slider = this.createElement('div', 'lunnaris-video-sliderPane');
        this.input.type = 'range';
        this.input.min = 0.0;
        this.input.max = 1.0;
        this.input.step = 0.01;
        slider.appendChild(this.input);
        this.input.addEventListener('input', (e) => {
            let target = e.target
            if (e.target.type !== 'range') {
                target = document.getElementById('range')
                
            } 
            const min = target.min
            const max = target.max
            const val = target.value
            
          target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
        });

        this.input.addEventListener('change', () => {
            this.video.volume = this.input.value/this.input.max;
        })
        this.slider = slider;
        return this.slider;

    }

    createMuteButton(){
        var button = this.createElement('button', 'lunnaris-video-button');
        var icon = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" ' +
        'width="50px" viewBox="0 0 512.000000 512.000000" ' +
        'preserveAspectRatio="xMidYMid meet" class="lunnaris-video-icon" id="mute"> ' +
        '<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" ' +
        'fill="#000000" stroke="none" class="lunnaris-video-g"> ' +
        '<path d="M102 5099 c-78 -39 -118 -133 -92 -215 10 -31 127 -154 603 -631 ' +
        'l592 -593 -56 0 c-82 0 -168 -18 -222 -48 -63 -34 -132 -109 -165 -180 l-27 ' +
        '-57 0 -815 0 -815 31 -65 c39 -83 101 -145 184 -184 l65 -31 468 -3 468 -3 ' +
        '895 -715 c492 -394 910 -722 929 -730 44 -18 87 -18 132 1 48 20 71 41 94 87 ' +
        '18 34 19 63 19 383 0 190 3 345 7 345 4 0 192 -184 418 -409 403 -402 411 ' +
        '-410 457 -416 87 -13 161 24 197 97 25 52 27 95 6 146 -22 52 -4793 4826 ' +
        '-4850 4853 -53 25 -100 24 -153 -2z"/> ' +
        '<path d="M3774 5106 c-27 -12 -1584 -1245 -1641 -1300 l-23 -21 955 -955 955 ' +
        '-955 0 1553 c0 1504 -1 1554 -19 1590 -23 46 -46 67 -94 87 -44 18 -92 19 ' +
        '-133 1z"/> ' +
        '</g> ' +
        '</svg>';

        button.innerHTML = icon;
        button.addEventListener('click', () => {
            this.toggleMute();
        })
        return button;
    }

    createButton(text) {
        var button = document.createElement('button');
        button.className = 'lunnaris-video-button';
        button.textContent = text;
        return button;
    }

    togglePlay() {
        if(this.video.paused){
            this.video.play();
            this.pause.style.display = 'block';
            this.play.style.display = 'none';
        }else{
            this.video.pause();
            this.pause.style.display = 'none';
            this.play.style.display = 'block';
        }
    }

    toggleFullscreen() {
        if(document.fullscreenElement == null){//I'm not in fullscreen
            this.root.requestFullscreen();
            this.isfullScreen = true;
            //this.minimize.classList.toggle('hidden', false);
            //this.expand.classList.toggle('hidden', true);
            //this.root.classList.toggle('fullscreen', true);
        }else{ //I'm on fullscreen
            document.exitFullscreen();
            this.isfullScreen = false;
            //this.minimize.classList.toggle('hidden', true);
            //this.expand.classList.toggle('hidden', false);
            //this.root.classList.toggle('fullscreen', false);
        }
    }

    toggleMute(){
        this.video.muted = !this.video.muted;
        if(this.video.muted){
            this.mute.classList.toggle('hidden', false);
            this.volume.classList.toggle('hidden', true);
        }else {
            this.mute.classList.toggle('hidden', true);
            this.volume.classList.toggle('hidden', false);
        }
    }

    handleSelectTime(e) {
        const rect = this.timelineContainer.getBoundingClientRect();
        const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
        this.video.currentTime = this.video.duration * percent;
        this.handleTimeUpdate(e);
    }

    handleTimePreview(e) {
        const rect = this.timelineContainer.getBoundingClientRect();
        const cursorOffset = Math.min(Math.max(0, e.x - rect.x), rect.width);
        const percent = cursorOffset / rect.width;
        if(cursorOffset < this.timePreview.getBoundingClientRect().width/2){
            this.timePreview.classList.toggle('leftClip', true);
        }else{
            this.timePreview.classList.toggle('leftClip', false);
        }

        if(cursorOffset > rect.width - this.timePreview.getBoundingClientRect().width/2){
            this.timePreview.classList.toggle('rightClip', true);
        }else{
            this.timePreview.classList.toggle('rightClip', false);
        }

        

        this.timePreview.textContent = this.formatTime(percent * this.video.duration);
        this.root.style.setProperty("--lunnaris-video-timePreview", percent);
    }

    handleTimeUpdate(e) {
        const rect = this.timelineContainer.getBoundingClientRect();
        const cursorOffset = Math.min(Math.max(0, e.x - rect.x), rect.width);
        const percent = cursorOffset / rect.width;
        this.root.style.setProperty("--lunnaris-video-progress", percent);
    }

    formatTime(time) {
        const seconds = Math.floor(time % 60);
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);
    
        if (hours === 0){
            return `${minutes}:${this.decimalFormatter.format(seconds)}`
        }else{
            return `${hours}:${this.decimalFormatter.format(minutes)}:${this.decimalFormatter.format(seconds)}`
        }
    
    }

    skipForwards() {
        this.video.currentTime = Math.min(this.video.currentTime + this.skipValue, this.video.duration);
    }

    skipBackwards() {
        this.video.currentTime = Math.max(this.video.currentTime - this.skipValue, 0);
    }


}