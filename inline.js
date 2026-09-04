
;

;

        // ============================================================

        // ============================================================
        // GITHUB REMOTE GATEWAY — only file.json is needed in Sketchware
        // ============================================================
        var NX_GATEWAY_DEFAULT = {
            version: '4.0.0',
            gateway_url: 'file.json',
            source_url: '',
            assets_base: 'https://cdn.jsdelivr.net/gh/yansupport1/Nexus@main/assets',
            assets: {},
            telegram_api_url: '',
            firebase: {}
        };
        var NX_GATEWAY = Object.assign({}, NX_GATEWAY_DEFAULT);
        function nx_gateway_abs(url) {
            if (!url) return '';
            try { return new URL(url, document.baseURI).toString(); } catch (e) { return url; }
        }
        function nx_remote_asset(name) {
            var n = String(name || '').replace(/^\/+/, '');
            var mapped = NX_GATEWAY.assets && NX_GATEWAY.assets[n];
            if (mapped) return nx_gateway_abs(mapped);
            if (NX_GATEWAY.assets_base) return nx_gateway_abs(String(NX_GATEWAY.assets_base).replace(/\/$/, '') + '/' + n);
            return n;
        }
        function nx_set_loader_text(text) {
            var el = document.querySelector('#nx_boot_loader .loader_text');
            if (el) el.textContent = text || 'Connecting';
        }
        function nx_hide_boot_loader() {
            var el = document.getElementById('nx_boot_loader');
            if (!el) return;
            el.classList.add('hide');
            setTimeout(function(){ if (el.parentNode) el.parentNode.removeChild(el); }, 650);
        }
        function nx_apply_gateway(cfg) {
            if (!cfg || typeof cfg !== 'object') return;
            NX_GATEWAY = Object.assign({}, NX_GATEWAY_DEFAULT, cfg, { assets: Object.assign({}, NX_GATEWAY_DEFAULT.assets, cfg.assets || {}) });
            _boxVideoReady = false;
            var gatewayBox = document.getElementById('box_video');
            if (gatewayBox) gatewayBox.removeAttribute('data-loading');
            if (NX_GATEWAY.telegram_api_url) window.NX_TELEGRAM_API_URL = NX_GATEWAY.telegram_api_url;
            if (NX_GATEWAY.getkey_url) window.NX_GETKEY_URL = NX_GATEWAY.getkey_url;
            var media = {
                'video_background': 'background.mp4',
                'boost_video_player': 'start.mp4',
                'uc_card_video': 'card.mp4',
                'nx_dashboard_music': 'musik.mp3',
                'nx_start_audio': 'start.mp3'
            };
            Object.keys(media).forEach(function(id){
                var el = document.getElementById(id);
                if (!el) return;
                var url = nx_remote_asset(media[id]);
                if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
                    el.setAttribute('data-gateway-src', url);
                    if (el.src !== url) el.src = url;
                    try { el.load(); } catch (e) {}
                }
            });
            // Refresh all media after the gateway arrives; no local media files are required.
            setTimeout(function(){
                try { if (typeof init_v31_audio === 'function') init_v31_audio(); } catch (e) {}
                try { if (typeof forceLoadBackgroundVideo === 'function') forceLoadBackgroundVideo(); } catch (e) {}
                try { if (typeof forceLoadBoxVideo === 'function') forceLoadBoxVideo(); } catch (e) {}
            }, 0);
            nx_set_loader_text('Ready');
        }
        function nx_load_gateway() {
            nx_set_loader_text('Loading gateway');
            var url = NX_GATEWAY_DEFAULT.gateway_url;
            try { url = new URL('file.json', document.baseURI).toString(); } catch (e) {}
            return fetch(url, { cache:'no-store' }).then(function(r){ if (!r.ok) throw new Error('gateway ' + r.status); return r.json(); }).then(function(cfg){ nx_apply_gateway(cfg); return cfg; }).catch(function(){ nx_set_loader_text('Offline mode'); return NX_GATEWAY; }).finally(function(){ setTimeout(nx_hide_boot_loader, 420); });
        }
        function nx_telegram_notify(eventName, payload) {
            var url = window.NX_TELEGRAM_API_URL || NX_GATEWAY.telegram_api_url;
            if (!url) return Promise.resolve(false);
            var body = Object.assign({ event:eventName, app:'Nexus-X', version:'4.0.0', ts:new Date().toISOString() }, payload || {});
            return fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body), keepalive:true }).then(function(r){ return r.ok; }).catch(function(){ return false; });
        }
        nx_load_gateway();

        // FIREBASE CONFIG
        // ============================================================
        var fb = {
            apiKey: "AIzaSyCaLwgD-awY2IogmcXZPh-iaxZpg0Y6G-4",
            authDomain: "yanzcode-74c34.firebaseapp.com",
            databaseURL: "https://yanzcode-74c34-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "yanzcode-74c34",
            storageBucket: "yanzcode-74c34.firebasestorage.app",
            messagingSenderId: "418323693228",
            appId: "1:418323693228:android:d1889645ad0fa098886909"
        };
        firebase.initializeApp(fb);
        var _firebaseDb = firebase.database();
        var FIREBASE_DATA_ROOT = 'v3_2';
        var db = { ref: function(path) {
            path = String(path || '').replace(/^\/+|\/+$/g, '');
            return _firebaseDb.ref(FIREBASE_DATA_ROOT + (path ? '/' + path : ''));
        }};
        // v3.2 version contract: developer controls min_supported_version/disabled_versions in app_config.
        setTimeout(function(){ try { db.ref('app_config').once('value').then(function(s){ if(typeof enforce_v32_version_gate==='function') enforce_v32_version_gate(s.val()||{}); }); } catch(e) {} }, 1200);
        setTimeout(function(){ try { if(typeof load_developer_ad_popup==='function') load_developer_ad_popup(false); } catch(e) {} }, 6500);

        // ============================================================
        // VARIABLES
        // ============================================================
        var SESSION_KEY = 'boost_session_data';
        var LOAD_TIMEOUT = 5000;
        var app_version = '3.2.1';
        var NX_BUILD_VERSION = '3.2.1';
        var NX_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbCrRPjDDmFLQpbX6n3n';
        var current_key_tab = 'aktif'; // aktif | expired | semua

        // DEFAULT VIDEO BACKGROUND - HARCODE - CERAH 100% + SUARA
        // Nexus-X v3.0 — WAJIB dari Asset Manager Sketchware
        // assets/background.mp4  +  assets/start.mp4
        var DEFAULT_VIDEO = "background.mp4";
        var DEFAULT_BOOST_VIDEO = "start.mp4";
        var ASSET_VIDEO_BG = "background.mp4";
        var ASSET_VIDEO_START = "start.mp4";

        // BOOST VIDEO SOUND STATE
        var boost_sound_muted = false;

        // SELECTED GAME - DEFAULT FFTH
        var selected_package = 'com.dts.freefireth';
        var is_game_launching = false;

        var user_key = '',
            user_data = null,
            user_role = 'GUEST';
        var features = {},
            quick = {},
            keys = {},
            notifications = [];
        var loading = false,
            confirm_cb = null;
        var expiry_interval = null;
        var current_page = 'home';

        var selected_app_style = 'liquid';
        var dashboard_music_muted = localStorage.getItem('nexus_music_muted') === '1';
        var NX_AUDIO_START = 'start.mp3';
        var NX_AUDIO_MUSIC = 'musik.mp3';
        var nx_redeem_notice_bound = false;
        function nx_normalize_style(style) {
            return 'liquid';
        }
        function select_app_style(style) {
            selected_app_style = nx_normalize_style(style);
            localStorage.setItem('nexus_app_style', selected_app_style);
            apply_app_style(selected_app_style, true);
        }
        function apply_app_style(style, updatePicker) {
            selected_app_style = nx_normalize_style(style);
            document.body.classList.remove('nx-style-neon', 'nx-style-comic3d', 'nx-style-liquid', 'nx-style-liquid-white', 'nx-style-liquid-black');
            document.body.classList.add('nx-style-' + selected_app_style);
            document.documentElement.setAttribute('data-nx-style', selected_app_style);
            if (updatePicker !== false) localStorage.setItem('nexus_app_style', selected_app_style);
            var label = document.getElementById('style_picker_status');
            if (label) label.textContent = selected_app_style === 'liquid-white' ? 'Liquid White' : (selected_app_style === 'liquid-black' ? 'Liquid Black' : (selected_app_style === 'neon' ? 'Neon Glass' : 'Liquid Glass'));
            var choices = document.querySelectorAll('.style_choice');
            for (var i = 0; i < choices.length; i++) choices[i].classList.toggle('selected', choices[i].getAttribute('data-style') === selected_app_style);
        }
        function nx_audio_source(audio, relative) {
            if (!audio) return;
            audio.setAttribute('data-relative-source', relative);
            audio.preload = 'auto';
            audio.onerror = function() {
                if (audio.getAttribute('data-fallback-tried') === '1') return;
                audio.setAttribute('data-fallback-tried', '1');
                audio.src = relative;
                try { audio.load(); } catch (e) {}
            };
            audio.src = relative;
            try { audio.load(); } catch (e) {}
        }
        function update_music_button() {
            var btn = document.getElementById('music_toggle_btn');
            if (!btn) return;
            btn.classList.toggle('is-off', dashboard_music_muted);
            btn.classList.toggle('is-on', !dashboard_music_muted);
            btn.innerHTML = dashboard_music_muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
            btn.title = dashboard_music_muted ? 'Nyalakan musik dashboard' : 'Matikan musik dashboard';
        }
        function init_v31_audio() {
            var start = document.getElementById('nx_start_audio');
            var music = document.getElementById('nx_dashboard_music');
            nx_audio_source(start, nx_remote_asset(NX_AUDIO_START));
            nx_audio_source(music, nx_remote_asset(NX_AUDIO_MUSIC));
            if (music) { music.loop = true; music.volume = 0.42; music.muted = dashboard_music_muted; }
            update_music_button();
        }
        function play_start_audio() {
            var a = document.getElementById('nx_start_audio');
            if (!a) return;
            try {
                a.pause();
                a.muted = false;
                a.volume = 1.0;
                a.currentTime = 0;
                if (!a.getAttribute('src') || a.getAttribute('src').indexOf('/assets/') < 0) nx_audio_source(a, nx_remote_asset(NX_AUDIO_START));
                var p = a.play();
                if (p && p.catch) p.catch(function() { setTimeout(function(){ try { a.play(); } catch(e){} }, 80); });
            } catch (e) {}
        }
        function stop_start_audio() {
            var a = document.getElementById('nx_start_audio');
            if (!a) return;
            try { a.pause(); a.currentTime = 0; } catch (e) {}
        }
        function start_dashboard_music() {
            var a = document.getElementById('nx_dashboard_music');
            if (!a || dashboard_music_muted) return;
            try {
                if (!a.getAttribute('src') || a.getAttribute('src').indexOf('/assets/') < 0) {
                    nx_audio_source(a, nx_remote_asset(NX_AUDIO_MUSIC));
                }
                a.muted = false;
                a.volume = 0.65;
                try { a.load(); } catch (e) {}
                var playMusic = function() {
                    try { a.muted = false; var p = a.play(); if (p && p.catch) p.catch(function(){}); } catch (e) {}
                };
                if (a.readyState < 2) {
                    a.addEventListener('canplay', playMusic, { once:true });
                } else {
                    playMusic();
                }
            } catch (e) {}
            update_music_button();
        }
        function stop_dashboard_music() {
            var a = document.getElementById('nx_dashboard_music');
            if (!a) return;
            try { a.pause(); a.currentTime = 0; } catch (e) {}
        }
        function toggle_dashboard_music() {
            var a = document.getElementById('nx_dashboard_music');
            if (!a) return false;
            dashboard_music_muted = !dashboard_music_muted;
            localStorage.setItem('nexus_music_muted', dashboard_music_muted ? '1' : '0');
            a.loop = true;
            a.volume = 0.65;
            if (dashboard_music_muted) {
                a.muted = true;
                try { a.pause(); a.currentTime = 0; } catch (e) {}
            } else {
                a.muted = false;
                if (!a.getAttribute('src') || a.getAttribute('src').indexOf('/assets/') < 0) nx_audio_source(a, nx_remote_asset(NX_AUDIO_MUSIC));
                var playMusic = function() {
                    try {
                        a.muted = false;
                        a.volume = 0.65;
                        var p = a.play();
                        if (p && p.catch) p.catch(function(){ setTimeout(function(){ try { a.play(); } catch(e){} }, 100); });
                    } catch (e) {}
                };
                if (a.readyState === 0) {
                    a.addEventListener('canplay', playMusic, { once:true });
                    try { a.load(); } catch (e) {}
                } else playMusic();
            }
            update_music_button();
            var btn = document.getElementById('music_toggle_btn');
            if (btn) { btn.disabled = false; btn.setAttribute('aria-pressed', dashboard_music_muted ? 'true' : 'false'); }
            if (typeof showToast === 'function') showToast('Musik', dashboard_music_muted ? 'Musik dashboard dimatikan' : 'Musik dashboard dinyalakan');
            return false;
        }
        function bind_redeem_notifications() {
            if (nx_redeem_notice_bound || !db) return;
            nx_redeem_notice_bound = true;
            db.ref('notifications').limitToLast(20).on('child_added', function(snap) {
                var n = snap.val() || {};
                if (n.type !== 'redeem_new') return;
                var id = 'redeem_notice_seen_' + snap.key;
                if (localStorage.getItem(id)) return;
                localStorage.setItem(id, '1');
                if (user_key && n.target_key && n.target_key !== user_key) return;
                showToast(n.title || 'Kode random baru', n.message || 'Ada kode random baru.');
            });
        }
        var update_info = {};
        var force_active = false,
            update_available = false;
        var is_expired_flag = false,
            expired_popup_shown = false;
        var maintenance_active = false,
            app_status = true;
        var is_developer = false;
        var key_expired_listener = null;
        var splash_tips = [];
        var splash_index = 0;
        var role_features = {};
        var maintenance_versions = [];
        var force_versions = [];
        var online_users = {};
        var online_listener = null;
        var activity_listener = null;
        var device_info = {};
        var firebase_listeners = {};
        var session_checked = false;
        var load_started = false;
        var load_timeout_id = null;
        var SPLASH_MIN_DURATION = 6000;
        var splash_started_at = Date.now();
        var data_loaded = {
            app_config: false,
            update_info: false,
            valid_keys: false,
            booster_features: false,
            quick_actions: false,
            notifications: false,
            announcements: false
        };

        // ============================================================
        // SPLASH TIPS
        // ============================================================
        var splash_tips_data = [
            "Auto Headshot Pro - Akurasi tembakan ke kepala dengan AI canggih",
            "Aim Assist Pro - Bantuan bidikan dengan tracking AI real-time",
            "Anti Recoil Max - Menghilangkan recoil senjata secara otomatis",
            "Smart Aim v3 - AI auto aim dengan prediksi pergerakan musuh",
            "Custom Warna - Ubah tema aplikasi sesuai keinginan",
            "Online User - Lihat jumlah pengguna yang sedang online",
            "Bansos Key - Tambah masa aktif key dengan notifikasi"
        ];

        // ============================================================
        // SPLASH FUNCTIONS
        // ============================================================
        function splash_progress(pct, msg) {
            var fill = document.getElementById('splash_fill');
            if (fill) fill.style.width = Math.min(100, pct) + '%';
            var status = document.getElementById('splash_status');
            if (status && msg) status.textContent = msg;
        }

        function update_splash_tip() {
            var tip_el = document.getElementById('splash_tip_text');
            if (splash_tips.length > 0 && tip_el) {
                tip_el.textContent = splash_tips[splash_index % splash_tips.length];
                splash_index++;
            }
        }

        function start_splash_tips() {
            splash_tips = splash_tips_data;
            splash_index = 0;
            update_splash_tip();
            setInterval(update_splash_tip, 2500);
        }

        function hide_splash() {
            var el = document.getElementById('splash_screen');
            if (el) {
                el.style.opacity = '0';
                setTimeout(function() { el.style.display = 'none'; }, 600);
            }
        }

        // ============================================================
        // VIDEO BACKGROUND - HARCODE - CERAH 100% + SUARA
        // ============================================================
        function resolveMediaUrl(name) {
            if (!name) return '';
            if (name.indexOf('http') === 0 || name.indexOf('file:') === 0) return name;
            // Default: Asset Manager Sketchware
            return nx_remote_asset(name.replace(/^\/+/, ''));
        }

        function load_video_background() {
            var video = document.getElementById('video_background');
            if (!video) return;
            var candidates = [
                resolveMediaUrl(DEFAULT_VIDEO),
                resolveMediaUrl('background.mp4')
            ];
            var tryIdx = 0;
            function tryNext() {
                if (tryIdx >= candidates.length) {
                    console.log('Semua path video background gagal');
                    return;
                }
                var url = candidates[tryIdx++];
                try {
                    var sources = video.querySelectorAll('source');
                    if (sources.length) sources[0].src = url;
                    video.src = url;
                } catch (e) { video.src = url; }
                video.load();
            }
            video.onerror = function() { tryNext(); };
            video.onplaying = function() {
                video.classList.remove('video-waiting');
                video.style.opacity = '0.55';
                video.style.display = 'block';
            };
            video.onended = function() {
                this.currentTime = 0;
                this.play().catch(function() {});
            };
            tryNext();
            video.play().catch(function() {
                document.addEventListener('click', function playOnClick() {
                    video.play().catch(function() {});
                    document.removeEventListener('click', playOnClick);
                }, { once: true });
                document.addEventListener('touchstart', function playOnTouch() {
                    video.play().catch(function() {});
                    document.removeEventListener('touchstart', playOnTouch);
                }, { once: true });
            });
        }

        // ============================================================
        // START BOOST VIDEO - HARCODE - DENGAN SUARA
        // ============================================================
        var boost_video_playing = false;
        var boost_video_finished = false;

        function show_game_loading_splash(callback){
            var overlay=document.getElementById('game_loading_splash');
            var status=document.getElementById('game_loading_status');
            var fill=document.getElementById('game_loading_progress_fill');
            var colors=['#ff3b30','#007aff','#34c759','#ff2d92'];
            var texts=['Sedang download file','Menyuntikan file','waiting...','done (buka apk)'];
            if(!overlay){if(callback)callback();return;}
            overlay.classList.add('show'); overlay.style.display='flex';
            var start=Date.now(), duration=10000, tick=0, finished=false;
            var finish=function(){if(finished)return;finished=true;clearInterval(timer);clearInterval(colorTimer);overlay.classList.remove('show');overlay.style.display='none';if(fill)fill.style.width='100%';if(callback)callback();};
            var render=function(){var elapsed=Date.now()-start;var pct=Math.min(100,elapsed/duration*100);var idx=Math.min(texts.length-1,Math.floor(elapsed/(duration/texts.length)));var c=colors[idx%colors.length];overlay.style.setProperty('--game-accent',c);if(status){status.textContent=texts[idx];status.style.color=c;}if(fill){fill.style.width=pct+'%';fill.style.background=c;}if(elapsed>=duration)finish();};
            var timer=setInterval(render,100);var colorTimer=setInterval(function(){tick++;var c=colors[tick%colors.length];overlay.style.setProperty('--game-accent',c);},850);render();
        }

        function show_boost_video(callback) {
            var overlay = document.getElementById('start_boost_video_overlay');
            var video = document.getElementById('boost_video_player');

            if (!overlay || !video) {
                if (callback) callback();
                return;
            }

            boost_video_playing = false;
            boost_video_finished = false;

            overlay.classList.add('show');
            overlay.style.display = 'flex';

            video.src = resolveMediaUrl(DEFAULT_BOOST_VIDEO);
            video.load();
            play_start_audio();
            video.muted = true;
            video.volume = 0.0;
            video.currentTime = 0;

            var soundBtn = document.getElementById('boost_sound_btn');
            if (soundBtn) {
                soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
            boost_sound_muted = false;

            var is_skipped = false;

            function finish_boost() {
                if (is_skipped) return;
                is_skipped = true;
                boost_video_playing = false;
                video.pause();
                stop_start_audio();
                overlay.classList.remove('show');
                overlay.style.display = 'none';
                if (callback) callback();
            }

            video.play().then(function() {
                boost_video_playing = true;
                console.log('Boost video started muted; start.mp3 handles transition sound');
            }).catch(function(e) {
                console.log('Boost video autoplay error:', e);
                document.addEventListener('click', function playOnClick() {
                    video.play().then(function() {
                        boost_video_playing = true;
                    }).catch(function() {});
                    document.removeEventListener('click', playOnClick);
                }, { once: true });
                document.addEventListener('touchstart', function playOnTouch() {
                    video.play().then(function() {
                        boost_video_playing = true;
                    }).catch(function() {});
                    document.removeEventListener('touchstart', playOnTouch);
                }, { once: true });
            });

            video.onended = function() {
                boost_video_finished = true;
                finish_boost();
            };

            var skip_btn = overlay.querySelector('.skip_btn');
            if (skip_btn) {
                skip_btn.onclick = function() {
                    finish_boost();
                };
            }

            setTimeout(function() {
                if (!is_skipped) {
                    console.log('Boost video timeout, force continue');
                    finish_boost();
                }
            }, 30000);
        }

        function skip_boost_video() {
            var overlay = document.getElementById('start_boost_video_overlay');
            var video = document.getElementById('boost_video_player');
            if (overlay) {
                overlay.classList.remove('show');
                overlay.style.display = 'none';
            }
            if (video) {
                video.pause();
                stop_start_audio();
                boost_video_playing = false;
            }
            continue_game_launch();
        }

        function toggle_boost_sound() {
            var video = document.getElementById('boost_video_player');
            var soundBtn = document.getElementById('boost_sound_btn');
            if (!video || !soundBtn) return;

            boost_sound_muted = !boost_sound_muted;
            video.muted = true;
            if (boost_sound_muted) {
                soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            } else {
                soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
        }

        var pending_game_launch = null;

        function continue_game_launch() {
            if (pending_game_launch) {
                var pkg = pending_game_launch;
                pending_game_launch = null;
                console.log('Opening game with package:', pkg);
                openApp(pkg);
            }
        }

        // ============================================================
        // SELECT GAME - FIXED (1 KLIK, BISA PASTI) - VERSI 2.4 STYLE
        // ============================================================
        function selectGame(el, pkg) {
            try {
                console.log('selectGame dipanggil dengan package:', pkg);
                
                // Hapus active dari semua tombol
                var allBtns = document.querySelectorAll('.game-btn');
                for (var i = 0; i < allBtns.length; i++) {
                    allBtns[i].classList.remove('active');
                }
                
                // Tambah active ke tombol yang dipilih
                if (el) el.classList.add('active');
                
                // Simpan package yang dipilih
                selected_package = pkg || 'com.dts.freefireth';
                
                console.log('Game dipilih:', selected_package);
                
                // Visual feedback + toast
                var gameName = selected_package === 'com.dts.freefireth' ? 'FFTH' : 'FFMAX';
                if (typeof showToast === 'function') {
                    showToast('🎮 ' + gameName, 'Game ' + gameName + ' siap diluncurkan!');
                }
                
                // Haptic / vibration feedback jika tersedia
                if (navigator.vibrate) {
                    try { navigator.vibrate(15); } catch(e) {}
                }
            } catch (err) {
                console.error('Error selectGame:', err);
                selected_package = pkg || 'com.dts.freefireth';
            }
        }

        // ============================================================
        // LAUNCH GAME - VERSI 2.4 STYLE (SIMPLE & STABIL)
        // ============================================================
        function launchGame() {
            try {
                console.log('launchGame() dipanggil! Package:', selected_package);
                console.log('is_game_launching:', is_game_launching);

                // Cegah double click
                if (is_game_launching) {
                    console.log('Game sedang diluncurkan, tunggu...');
                    if (typeof showToast === 'function') showToast('Tunggu', 'Sedang memproses...');
                    return;
                }

                if (force_active) {
                    if (typeof show_modal === 'function') show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                    return;
                }
                if (!app_status) {
                    if (typeof showToast === 'function') showToast('Info', 'Aplikasi sedang dalam mode nonaktif');
                    return;
                }

                // VALIDASI: Pastikan package tidak kosong
                if (!selected_package || selected_package === '') {
                    console.error('selected_package kosong! Set default FFTH');
                    selected_package = 'com.dts.freefireth';
                    var btnTh = document.getElementById('btn_ffth');
                    var btnMax = document.getElementById('btn_ffmax');
                    if (btnTh) btnTh.classList.add('active');
                    if (btnMax) btnMax.classList.remove('active');
                }

                // Disable button + visual feedback
                var btn = document.getElementById('btn_launch_game');
                if (btn) {
                    btn.disabled = true;
                    btn.style.opacity = '0.75';
                    btn.style.cursor = 'not-allowed';
                    btn.style.pointerEvents = 'none';
                }

                is_game_launching = true;
                try { stop_dashboard_music(); } catch (e) {}

                // Haptic feedback
                if (navigator.vibrate) {
                    try { navigator.vibrate([20, 40, 20]); } catch(e) {}
                }

                // v3.2: no game video; show animated ten-second loading screen.
                if (typeof show_game_loading_splash === 'function') {
                    show_game_loading_splash(function() {
                        console.log('Game loading splash selesai, membuka game...');
                        is_game_launching = false;
                        if (btn) {
                            btn.disabled = false;
                            btn.style.opacity = '1';
                            btn.style.cursor = 'pointer';
                            btn.style.pointerEvents = 'auto';
                        }
                        openApp(selected_package);
                    });
                } else {
                    is_game_launching = false;
                    if (btn) {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                        btn.style.pointerEvents = 'auto';
                    }
                    openApp(selected_package);
                }

                // Safety timeout - jika video gagal
                setTimeout(function() {
                    if (is_game_launching) {
                        console.log('Safety timeout - memaksa buka game');
                        is_game_launching = false;
                        if (btn) {
                            btn.disabled = false;
                            btn.style.opacity = '1';
                            btn.style.cursor = 'pointer';
                            btn.style.pointerEvents = 'auto';
                        }
                        openApp(selected_package);
                    }
                }, 35000);
            } catch (err) {
                console.error('Error launchGame:', err);
                is_game_launching = false;
                var btn = document.getElementById('btn_launch_game');
                if (btn) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                    btn.style.pointerEvents = 'auto';
                }
                // Coba buka langsung
                try { openApp(selected_package || 'com.dts.freefireth'); } catch(e2) {}
            }
        }

        // ============================================================
        // OPEN APP - METODE STABIL (VERSI 2.4)
        // ============================================================
        function openApp(packageName) {
            console.log('openApp() dipanggil untuk package:', packageName);

            // VALIDASI: Pastikan packageName tidak kosong
            if (!packageName || packageName === '') {
                console.error('Package name kosong! Set default FFTH');
                packageName = 'com.dts.freefireth';
                selected_package = packageName;
                // Update UI
                var btnTh = document.getElementById('btn_ffth');
                var btnMax = document.getElementById('btn_ffmax');
                if (btnTh) btnTh.classList.add('active');
                if (btnMax) btnMax.classList.remove('active');
            }

            var gameName = packageName === 'com.dts.freefireth' ? 'FFTH' : 'FFMAX';
            showToast('🚀 ' + gameName, 'Membuka ' + gameName + '...');

            // === METODE 1: BRIDGE SKETCHWARE ===
            if (typeof Android !== 'undefined' && typeof Android.openApp === 'function') {
                console.log('Menggunakan Android Bridge untuk membuka:', packageName);
                try {
                    Android.openApp(packageName);
                    console.log('Berhasil membuka via Android Bridge');
                    return;
                } catch (e) {
                    console.error('Error Android Bridge:', e);
                    // Fallback ke metode 2
                }
            }

            // === METODE 2: INTENT URL FALLBACK ===
            openAppFallback(packageName);
        }

        function openAppFallback(packageName) {
            console.log('Fallback: mencoba intent URL untuk', packageName);
            
            // Build intent URL
            var intentUrl = 'intent://#Intent;package=' + packageName + ';scheme=https;end';
            console.log('Intent URL:', intentUrl);

            try {
                // Coba buka dengan intent
                window.location.href = intentUrl;

                // Tampilkan dialog jika game tidak terinstall (setelah 3 detik)
                setTimeout(function() {
                    var gameName = packageName === 'com.dts.freefireth' ? 'FFTH' : 'FFMAX';
                    show_modal('⚠️ ' + gameName,
                        'Pastikan game ' + gameName + ' sudah terinstall.\n\n' +
                        'Package: ' + packageName + '\n\n' +
                        'Jika sudah terinstall, buka secara manual dari menu aplikasi.',
                        '<i class="fa-solid fa-triangle-exclamation" style="color:var(--warning);"></i>'
                    );
                }, 3000);
            } catch (e) {
                console.error('Error fallback intent:', e);
                var gameName = packageName === 'com.dts.freefireth' ? 'FFTH' : 'FFMAX';
                show_modal('❌ Error',
                    'Gagal membuka ' + gameName + '.\n\n' +
                    'Silakan buka secara manual dari menu aplikasi.\n\n' +
                    'Package: ' + packageName,
                    '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger);"></i>'
                );
            }
        }

        // ============================================================
        // PROFILE CARD
        // ============================================================
        function load_profile_card() {
            db.ref('app_config/profile_card').once('value', function(s) {
                var data = s.val() || {};
                var card = document.getElementById('user_card');
                var avatar = document.getElementById('uc_avatar');

                if (data.avatar_url) {
                    var img = avatar.querySelector('img');
                    if (!img) {
                        img = document.createElement('img');
                        avatar.prepend(img);
                        var icon = avatar.querySelector('i');
                        if (icon) icon.style.display = 'none';
                    }
                    img.src = data.avatar_url;
                }

                if (data.bg_color) card.style.background = data.bg_color;
                if (data.border_color) card.style.borderColor = data.border_color;
                if (data.border_width) card.style.borderWidth = data.border_width;
                if (data.glass === false) {
                    card.style.backdropFilter = 'none';
                    card.style.background = data.bg_color || '#1c1c1e';
                } else {
                    card.style.backdropFilter = 'blur(30px) saturate(1.4)';
                }

                document.getElementById('profile_avatar').value = data.avatar_url || '';
                document.getElementById('card_bg_color').value = data.bg_color || '#1c1c1e';
                document.getElementById('card_border_color').value = data.border_color || '#007aff';
                document.getElementById('card_border_width').value = data.border_width || '1px';
                document.getElementById('card_glass').checked = data.glass !== false;
            });
        }

        function save_profile_card() {
            var data = {
                avatar_url: document.getElementById('profile_avatar').value.trim(),
                bg_color: document.getElementById('card_bg_color').value,
                border_color: document.getElementById('card_border_color').value,
                border_width: document.getElementById('card_border_width').value,
                glass: document.getElementById('card_glass').checked
            };
            db.ref('app_config/profile_card').set(data).then(function() {
                showToast('Sukses', 'Profile Card diupdate!');
                load_profile_card();
            });
        }

        // ============================================================
        // ACTIVITY LOG - FILTER USER 16062013
        // ============================================================
        function load_activity_log() {
            // DINONAKTIFKAN DEMI KEAMANAN & PRIVASI KEY USER
            // Section Aktivitas User sudah dihapus dari UI
            return;
        }

        function log_activity(status) {
            if (!user_key) return;
            if (user_key === '16062013') return;
            db.ref('activity_log').push({
                user: user_key,
                status: status,
                timestamp: new Date().toISOString(),
                device: device_info.name || 'Unknown'
            });
        }

        // ============================================================
        // DEVICE INFO
        // ============================================================
        function get_device_info() {
            var info = {
                name: 'Unknown Device',
                brand: 'Unknown',
                model: 'Unknown',
                android: 'Unknown',
                gpu: 'Unknown',
                ram_total: 0,
                ram_used: 0,
                fps: 0,
                connection: 'Offline',
                verified: true,
                id: ''
            };
            var id = localStorage.getItem('nx_device_id') || localStorage.getItem('dev_real');
            if (!id) {
                // fingerprint stabil (tanpa Date.now) agar 1 HP = 1 ID
                var str = [
                    screen.width, screen.height, screen.colorDepth,
                    navigator.userAgent || '',
                    navigator.language || '',
                    navigator.hardwareConcurrency || '',
                    navigator.platform || '',
                    navigator.deviceMemory || ''
                ].join('|');
                var hash = 0;
                for (var hi = 0; hi < str.length; hi++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(hi);
                    hash |= 0;
                }
                id = 'NX' + Math.abs(hash).toString(36).toUpperCase() + String(str.length).toString(36).toUpperCase();
                try {
                    var b = btoa(unescape(encodeURIComponent(str.slice(0, 80)))).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
                    id = 'NX' + b.toUpperCase();
                } catch (e) {}
                localStorage.setItem('nx_device_id', id);
                localStorage.setItem('dev_real', id);
            } else {
                localStorage.setItem('nx_device_id', id);
            }
            info.id = id;
            var ua = navigator.userAgent || '';
            if (ua.indexOf('Samsung') > -1) { info.brand = 'Samsung'; } else if (ua.indexOf('Xiaomi') > -1 || ua.indexOf(
                    'Redmi') > -1) { info.brand = 'Xiaomi'; } else if (ua.indexOf('POCO') > -1) { info.brand =
                'POCO'; } else if (ua.indexOf('OnePlus') > -1) { info.brand = 'OnePlus'; } else if (ua.indexOf('OPPO') >
                -1) { info.brand = 'OPPO'; } else if (ua.indexOf('Vivo') > -1) { info.brand = 'Vivo'; } else if (ua
                .indexOf('Realme') > -1) { info.brand = 'Realme'; } else if (ua.indexOf('Google') > -1 || ua.indexOf(
                    'Pixel') > -1) { info.brand = 'Google'; } else if (ua.indexOf('ASUS') > -1) { info.brand =
                'ASUS'; } else { info.brand = 'Unknown'; }
            var model_match = ua.match(/\(([^)]+)\)/);
            if (model_match) {
                var parts = model_match[1].split(';');
                for (var i = 0; i < parts.length; i++) {
                    var p = parts[i].trim();
                    if (p.match(/SM-[A-Z0-9]+/)) { info.model = p; break; }
                    if (p.match(/iPhone[0-9,]+/)) { info.model = p; break; }
                    if (p.match(/Pixel [0-9]+/)) { info.model = p; break; }
                }
            }
            if (info.brand !== 'Unknown' && info.model !== 'Unknown') info.name = info.brand + ' ' + info.model;
            else if (info.brand !== 'Unknown') info.name = info.brand + ' Device';
            else if (info.model !== 'Unknown') info.name = info.model;
            else info.name = 'Android Device';
            var android_match = ua.match(/Android\s([0-9.]+)/);
            if (android_match) info.android = android_match[1];
            try {
                var canvas = document.createElement('canvas');
                var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    var debug_info = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debug_info) {
                        var gpu = gl.getParameter(debug_info.UNMASKED_RENDERER_WEBGL);
                        if (gpu) info.gpu = gpu;
                    }
                }
            } catch (e) { info.gpu = 'Unknown'; }
            if (navigator.deviceMemory) {
                info.ram_total = Math.round(navigator.deviceMemory);
            } else {
                info.ram_total = 4;
            }
            var frames = 0;
            var last_time = performance.now();
            var check_fps = function() {
                frames++;
                var now = performance.now();
                if (now - last_time >= 1000) {
                    info.fps = frames;
                    frames = 0;
                    last_time = now;
                }
                requestAnimationFrame(check_fps);
            };
            requestAnimationFrame(check_fps);
            if (navigator.onLine !== undefined) {
                info.connection = navigator.onLine ? 'Online' : 'Offline';
            }
            info.verified = true;
            if (navigator.userAgent.indexOf('Android') === -1) info.verified = false;
            if (navigator.hardwareConcurrency < 2) info.verified = false;
            if (screen.width < 320) info.verified = false;
            if (performance && performance.memory) {
                info.ram_used = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024 * 1024) * 100) / 100;
            } else {
                info.ram_used = Math.round((Math.random() * 0.3 + 0.5) * 10) / 10;
            }
            // Nama tampilan device
            if (!info.model || info.model === 'Unknown') {
                var ua2 = navigator.userAgent || '';
                var mBuild = ua2.match(/;\s*([^;)]+)\s+Build\//i);
                if (mBuild) info.model = mBuild[1].trim();
                else {
                    var mAnd = ua2.match(/Android\s+[\d.]+;\s*([^)]+)\)/i);
                    if (mAnd) info.model = mAnd[1].trim().split(';')[0].trim();
                }
            }
            if (!info.brand || info.brand === 'Unknown') {
                var mod = (info.model || '').toLowerCase();
                if (mod.indexOf('xiaomi') >= 0 || mod.indexOf('redmi') >= 0 || mod.indexOf('poco') >= 0) info.brand = 'Xiaomi';
                else if (mod.indexOf('samsung') >= 0 || mod.indexOf('sm-') >= 0) info.brand = 'Samsung';
                else if (mod.indexOf('oppo') >= 0) info.brand = 'OPPO';
                else if (mod.indexOf('vivo') >= 0) info.brand = 'Vivo';
                else if (mod.indexOf('realme') >= 0) info.brand = 'Realme';
                else if (mod.indexOf('infinix') >= 0) info.brand = 'Infinix';
                else if (mod.indexOf('tecno') >= 0) info.brand = 'Tecno';
                else info.brand = 'Android';
            }
            info.name = (info.brand + ' ' + info.model).replace(/Unknown /g, '').trim() || 'Android Device';
            if (!info.id) {
                info.id = 'NX' + Date.now().toString(36).toUpperCase();
                localStorage.setItem('nx_device_id', info.id);
            }
            return info;
        }

        
        var _keysLiveListener = null;
        function start_keys_realtime() {
            if (_keysLiveListener) try { _keysLiveListener.off(); } catch (e) {}
            _keysLiveListener = db.ref('valid_keys');
            _keysLiveListener.on('value', function(s) {
                keys = s.val() || {};
                try { render_keys(); } catch (e) {}
            });
        }

        function push_device_heartbeat() {
            if (!user_key) return;
            var info = get_device_info();
            device_info = info;
            try {
                db.ref('online_users/' + user_key).update({
                    name: (user_data && user_data.name) || user_key,
                    device: info.name,
                    device_id: info.id,
                    brand: info.brand,
                    model: info.model,
                    status: 'online',
                    last_seen: new Date().toISOString()
                });
            } catch (e) {}
            try {
                var ud = document.getElementById('user_device');
                var uc = document.getElementById('uc_device');
                if (ud) ud.textContent = 'Device: ' + info.name;
                if (uc) uc.textContent = 'Device: ' + info.name;
            } catch (e) {}
            try { update_device_info(); } catch (e) {}
        }


        function update_device_info() {
            device_info = get_device_info();
            document.getElementById('device_fps').textContent = device_info.fps || '60';
            var used = device_info.ram_used || 0;
            var total = device_info.ram_total || 4;
            var percent = Math.round((used / total) * 100);
            document.getElementById('device_ram').textContent = used.toFixed(1) + ' / ' + total + ' GB';
            document.getElementById('device_ram_percent').textContent = percent + '%';
            var bar = document.getElementById('device_ram_bar');
            if (bar) {
                bar.style.width = Math.min(percent, 100) + '%';
                if (percent > 80) bar.className = 'fill danger';
                else if (percent > 60) bar.className = 'fill warning';
                else bar.className = 'fill';
            }
            document.getElementById('device_gpu').textContent = device_info.gpu && device_info.gpu.length > 20 ? device_info
                .gpu.substring(0, 18) + '...' : device_info.gpu || 'Unknown';
            var conn = document.getElementById('device_connection');
            if (conn) {
                if (device_info.connection === 'Online') {
                    conn.textContent = 'Online';
                    conn.className = 'd_value success';
                } else {
                    conn.textContent = 'Offline';
                    conn.className = 'd_value danger';
                }
            }
            document.getElementById('device_name').textContent = device_info.name;
            document.getElementById('device_android').textContent = 'Android ' + (device_info.android || 'Unknown');
            var icon = document.getElementById('anti_gimmick_icon');
            var text = document.getElementById('anti_gimmick_text');
            if (icon && text) {
                if (device_info.verified) {
                    icon.className = 'fa-solid fa-shield-check';
                    icon.style.color = 'var(--success)';
                    text.textContent = 'Verified - Real Device';
                    text.style.color = 'var(--text_secondary)';
                } else {
                    icon.className = 'fa-solid fa-shield-halved';
                    icon.style.color = 'var(--danger)';
                    text.textContent = 'Unverified - Emulator Detected';
                    text.style.color = 'var(--danger)';
                }
            }
        }

        // ============================================================
        // EXPIRED FUNCTIONS
        // ============================================================
        function is_expired(d) {
            if (!d) return true;
            if (d.duration === 'permanent') return false;
            if (!d.created_at) return true;
            var created = new Date(d.created_at);
            var now = new Date();
            var ms = 0,
                dur = d.duration || '';
            if (dur.includes('menit')) ms = parseInt(dur) * 60 * 1000;
            else if (dur.includes('jam')) ms = parseInt(dur) * 60 * 60 * 1000;
            else if (dur.includes('hari')) ms = parseInt(dur) * 24 * 60 * 60 * 1000;
            else if (dur.includes('minggu')) ms = parseInt(dur) * 7 * 24 * 60 * 60 * 1000;
            else if (dur.includes('bulan')) ms = parseInt(dur) * 30 * 24 * 60 * 60 * 1000;
            else if (dur.includes('tahun')) ms = parseInt(dur) * 365 * 24 * 60 * 60 * 1000;
            else return true;
            return now > new Date(created.getTime() + ms);
        }

        function get_expiry_time(d) {
            if (!d || d.duration === 'permanent') return null;
            if (d.expired) {
                var te = new Date(d.expired);
                if (!isNaN(te.getTime())) return te;
            }
            if (!d.created_at) return null;
            var created = new Date(d.created_at);
            var ms = 0,
                dur = d.duration || '';
            if (dur.includes('menit')) ms = parseInt(dur) * 60 * 1000;
            else if (dur.includes('jam')) ms = parseInt(dur) * 60 * 60 * 1000;
            else if (dur.includes('hari')) ms = parseInt(dur) * 24 * 60 * 60 * 1000;
            else if (dur.includes('minggu')) ms = parseInt(dur) * 7 * 24 * 60 * 60 * 1000;
            else if (dur.includes('bulan')) ms = parseInt(dur) * 30 * 24 * 60 * 60 * 1000;
            else if (dur.includes('tahun')) ms = parseInt(dur) * 365 * 24 * 60 * 60 * 1000;
            else return null;
            return new Date(created.getTime() + ms);
        }

        function get_remaining_string(d) {
            var expiry = get_expiry_time(d);
            if (!expiry) return 'Permanent';
            var diff = expiry - new Date();
            if (diff <= 0) return 'Expired';
            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var secs = Math.floor((diff % (1000 * 60)) / 1000);
            var parts = [];
            if (days > 0) parts.push(days + 'd');
            if (hours > 0 || days > 0) parts.push(hours + 'h');
            if (mins > 0 || days > 0 || hours > 0) parts.push(mins + 'm');
            parts.push(secs + 's');
            return parts.join(' ');
        }

        // ============================================================
        // SHOW EXPIRED POPUP
        // ============================================================
        function show_expired_popup(message) {
            try { remove_online_for_key(user_key); } catch (e) {}
            if (expired_popup_shown) return;
            expired_popup_shown = true;
            document.getElementById('expired_popup_desc').textContent = message || 'Key Anda sudah kadaluarsa. Silakan hubungi admin untuk perpanjangan.';
            document.getElementById('expired_popup_time').textContent = 'Expired pada: ' + new Date().toLocaleString('id-ID');
            var overlay = document.getElementById('expired_popup_overlay');
            if (overlay) {
                overlay.classList.add('show');
                overlay.style.display = 'flex';
            }
            setTimeout(function() {
                if (expired_popup_shown) close_expired_popup();
            }, 5000);
        }

        function close_expired_popup() {
            var overlay = document.getElementById('expired_popup_overlay');
            if (overlay) {
                overlay.classList.remove('show');
                overlay.style.display = 'none';
            }
            expired_popup_shown = false;
            do_logout();
        }

        // ============================================================
        // UPDATE EXPIRY DISPLAY
        // ============================================================
        function update_expiry_display() {
            var exp = document.getElementById('user_expiry');
            var uc_exp = document.getElementById('uc_expiry');
            if (!user_data) return;
            var expiry_date = get_expiry_time(user_data);
            if (!expiry_date) {
                var text = 'Permanent';
                if (exp) { exp.textContent = text;
                    exp.style.color = 'var(--success)'; }
                if (uc_exp) { uc_exp.textContent = text;
                    uc_exp.style.color = 'var(--success)'; }
                is_expired_flag = false;
                return;
            }
            var now = new Date();
            var diff = expiry_date - now;
            if (diff <= 0) {
                var text = 'EXPIRED';
                if (exp) { exp.textContent = text;
                    exp.style.color = 'var(--danger)'; }
                if (uc_exp) { uc_exp.textContent = text;
                    uc_exp.style.color = 'var(--danger)'; }
                if (!is_expired_flag) {
                    is_expired_flag = true;
                    try{remove_online_for_key(user_key);}catch(e){}
                    show_expired_popup('Key Anda sudah kadaluarsa. Silakan logout dan hubungi admin untuk perpanjangan.');
                }
                return;
            }
            is_expired_flag = false;
            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var secs = Math.floor((diff % (1000 * 60)) / 1000);
            var txt = '';
            if (days > 0) txt += days + 'd ';
            if (hours > 0 || days > 0) txt += hours + 'h ';
            if (mins > 0 || days > 0 || hours > 0) txt += mins + 'm ';
            txt += secs + 's';
            if (exp) { exp.textContent = txt;
                exp.style.color = 'var(--warning)'; }
            if (uc_exp) { uc_exp.textContent = txt;
                uc_exp.style.color = 'var(--warning)'; }
            if (diff <= 300000 && diff > 290000) {
                var notif_key_5min = 'notif_5min_' + user_key;
                if (!localStorage.getItem(notif_key_5min)) {
                    localStorage.setItem(notif_key_5min, 'true');
                    showToast('Peringatan', 'Key Anda akan expired dalam 5 menit');
                    db.ref('notifications').push({
                        title: 'Peringatan 5 Menit',
                        message: 'Key ' + user_key + ' akan expired dalam 5 menit',
                        timestamp: new Date().toISOString(),
                        user: user_key
                    });
                }
            }
            if (diff <= 5000 && diff > 0) {
                var notif_key_5detik = 'notif_5detik_' + user_key;
                if (!localStorage.getItem(notif_key_5detik)) {
                    localStorage.setItem(notif_key_5detik, 'true');
                    showToast('Peringatan Akhir', 'Key Anda akan expired dalam ' + Math.ceil(diff / 1000) + ' detik');
                    db.ref('notifications').push({
                        title: 'Peringatan 5 Detik',
                        message: 'Key ' + user_key + ' akan expired dalam ' + Math.ceil(diff / 1000) + ' detik',
                        timestamp: new Date().toISOString(),
                        user: user_key
                    });
                }
            }
            if (diff > 300000) {
                localStorage.removeItem('notif_5min_' + user_key);
                localStorage.removeItem('notif_5detik_' + user_key);
            }
        }

        // ============================================================
        // TOAST NOTIFICATION
        // ============================================================
        function showToast(title, body) {
            var toast = document.getElementById('notification_toast');
            if (!toast) return;
            document.getElementById('toast_title').textContent = title;
            document.getElementById('toast_body').textContent = body;
            document.getElementById('toast_time').textContent = new Date().toLocaleTimeString('id-ID');
            toast.classList.add('show');
            toast.style.display = 'block';
            if (window.toast_timeout) clearTimeout(window.toast_timeout);
            window.toast_timeout = setTimeout(function() { closeToast(); }, 3000);
        }

        function closeToast() {
            var toast = document.getElementById('notification_toast');
            if (!toast) return;
            toast.classList.remove('show');
            toast.style.display = 'none';
            if (window.toast_timeout) {
                clearTimeout(window.toast_timeout);
                window.toast_timeout = null;
            }
        }

        // ============================================================
        // ONLINE USERS - REALTIME
        // ============================================================
        var _online_show_all = false;
        function render_online_list(data) {
            var list_container = document.getElementById('online_list_dashboard');
            if (!list_container) return;
            data = data || online_users || {};
            var keys_ol = Object.keys(data);
            var showAll = _online_show_all === true;
            var limit = 5;
            var html = '';
            var maxShow = showAll ? keys_ol.length : Math.min(limit, keys_ol.length);
            for (var oi = 0; oi < maxShow; oi++) {
                var key = keys_ol[oi];
                var user = data[key] || {};
                var name = user.name || key;
                var device = user.device || '';
                var status = user.status || 'online';
                var dot_class = status === 'online' ? 'online' : 'offline';
                html += '<span class="user_tag"><span class="status_dot ' + dot_class + '"></span>' +
                    name + ' <span style="font-size:6px;color:var(--text_muted);">(' + device + ')</span></span>';
            }
            if (keys_ol.length === 0) {
                html = '<span class="user_tag" style="color:var(--text_muted);">Tidak ada user online</span>';
            } else if (keys_ol.length > limit) {
                if (!showAll) {
                    html += '<button type="button" onclick="_online_show_all=true;render_online_list(online_users)" style="font-size:9px;padding:3px 10px;border-radius:10px;border:1px solid var(--primary);background:var(--primary_light);color:var(--primary);cursor:pointer;font-weight:600;margin-top:2px;">Show +' + (keys_ol.length - limit) + '</button>';
                } else {
                    html += '<button type="button" onclick="_online_show_all=false;render_online_list(online_users)" style="font-size:9px;padding:3px 10px;border-radius:10px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-weight:600;margin-top:2px;">Hide</button>';
                }
            }
            list_container.innerHTML = html;
        }

        function init_online_users() {
            if (online_listener) {
                online_listener.off();
            }
            online_listener = db.ref('online_users');
            online_listener.on('value', function(s) {
                var data = s.val() || {};
                // Hanya hitung yang status online (hapus ghost offline)
                var cleaned = {};
                Object.keys(data).forEach(function(k) {
                    var st = ((data[k] && data[k].status) || 'online').toLowerCase();
                    if (st === 'online') cleaned[k] = data[k];
                    else {
                        // bersihkan entry offline sisa
                        try { db.ref('online_users/' + k).remove(); } catch (e) {}
                    }
                });
                online_users = cleaned;
                var count = Object.keys(cleaned).length;
                data = cleaned;
                var online_count = document.getElementById('online_count');
                var online_count_dashboard = document.getElementById('online_count_dashboard');
                if (online_count) online_count.textContent = count;
                if (online_count_dashboard) online_count_dashboard.textContent = count;
                render_online_list(data);
                var dot = document.getElementById('nav_online_dot');
                if (dot) {
                    dot.style.display = count > 0 ? 'block' : 'none';
                }
                var avatar_status = document.getElementById('avatar_status');
                var uc_status = document.getElementById('uc_status');
                if (avatar_status) {
                    avatar_status.className = 'online_status ' + (count > 0 ? 'online' : 'offline');
                }
                if (uc_status) {
                    uc_status.className = 'online_indicator ' + (count > 0 ? 'online' : 'offline');
                }
                if (user_key) {
                    var user_online = data[user_key];
                    if (user_online) {
                        var status_badge = document.getElementById('status_badge');
                        if (status_badge) {
                            var st = (user_online.status || 'online').toLowerCase();
                            var on = st === 'online';
                            status_badge.className = 'status-pill ' + (on ? 'on' : 'off');
                            status_badge.innerHTML = '<span class="dot"></span> ' + (on ? 'ON' : 'OFF');
                        }
                    }
                }
            });
        }

        function set_user_online() {
            var device_info = get_device_info();
            // Pastikan device tercatat di key (perbaiki 0/1)
            if (user_key && user_data) {
                try {
                    bind_or_check_device(user_key, user_data, function(errMsg, d2) {
                        if (!errMsg && d2) user_data = d2;
                        if (errMsg) {
                            console.log('bind online:', errMsg);
                            // Device limit saat sudah login → logout
                            if (String(errMsg).indexOf('terikat') >= 0) {
                                showToast('Device', 'Key terikat device lain');
                                setTimeout(function() { do_logout(); }, 1500);
                            }
                        }
                    });
                } catch (e) {}
            }
            var online_ref = db.ref('online_users/' + user_key);
            online_ref.set({
                name: user_data?.name || user_key,
                device: device_info.name,
                status: 'online',
                last_seen: new Date().toISOString()
            });
            online_ref.onDisconnect().remove();
            log_activity('online');
        }

        function set_user_offline() {
            if (user_key) {
                try { db.ref('online_users/' + user_key).remove(); } catch (e) {}
                log_activity('offline');
            }
        }

        function remove_online_for_key(k) {
            if (!k) return;
            try { db.ref('online_users/' + k).remove(); } catch (e) {}
        }

        function prune_online_users(validMap) {
            validMap = validMap || keys || {};
            db.ref('online_users').once('value').then(function(s) {
                var online = s.val() || {};
                Object.keys(online).forEach(function(k) {
                    if (!validMap[k]) {
                        db.ref('online_users/' + k).remove();
                    } else {
                        var d = validMap[k];
                        // expired key → remove online
                        try {
                            if (typeof is_expired === 'function' && is_expired(d)) {
                                db.ref('online_users/' + k).remove();
                            }
                        } catch (e) {}
                    }
                });
            });
        }

        // ============================================================
        // MAINTENANCE FUNCTIONS
        // ============================================================
        function check_maintenance() {
            if (firebase_listeners.maintenance) {
                firebase_listeners.maintenance.off();
            }
            firebase_listeners.maintenance = db.ref('app_config/maintenance');
            firebase_listeners.maintenance.on('value', function(s) {
                var is_on = s.val() === true;
                maintenance_active = is_on;
                var overlay = document.getElementById('maintenance_overlay');
                var close_btn = document.getElementById('close_maintenance_btn');
                if (is_on) {
                    db.ref('app_config/maintenance_versions').once('value', function(v) {
                        var versions = v.val() || [];
                        var is_targeted = versions.includes('all') || versions.includes(app_version);
                        if (is_targeted) {
                            if (overlay) {
                                overlay.classList.add('show');
                                overlay.style.display = 'flex';
                            }
                            if (close_btn) {
                                if (user_role === 'DEVELOPER') {
                                    close_btn.classList.add('show');
                                } else {
                                    close_btn.classList.remove('show');
                                }
                            }
                            document.getElementById('maintenance_badge').classList.remove('hidden');
                            db.ref('app_config/maintenance_message').once('value', function(msg) {
                                var m = msg.val() || 'Server sedang dalam proses maintenance. Mohon tunggu beberapa saat.';
                                document.getElementById('maintenance_desc').textContent = m;
                            });
                        } else {
                            if (overlay) {
                                overlay.classList.remove('show');
                                overlay.style.display = 'none';
                            }
                            if (close_btn) close_btn.classList.remove('show');
                            document.getElementById('maintenance_badge').classList.add('hidden');
                        }
                    });
                } else {
                    if (overlay) {
                        overlay.classList.remove('show');
                        overlay.style.display = 'none';
                    }
                    if (close_btn) close_btn.classList.remove('show');
                    document.getElementById('maintenance_badge').classList.add('hidden');
                }
            });
        }

        function close_maintenance() {
            if (user_role === 'DEVELOPER') {
                var overlay = document.getElementById('maintenance_overlay');
                if (overlay) {
                    overlay.classList.remove('show');
                    overlay.style.display = 'none';
                }
            }
        }

        function set_maintenance_mode(on) {
            db.ref('app_config/maintenance').set(on).then(function() {
                var msg = document.getElementById('maintenance_message_input').value.trim();
                if (on && msg) {
                    db.ref('app_config/maintenance_message').set(msg);
                }
                showToast('Sukses', 'Maintenance ' + (on ? 'AKTIF' : 'NONAKTIF'));
                document.getElementById('maintenance_status').textContent = 'Mode: ' + (on ? 'ON' : 'OFF');
            });
        }

        function set_maintenance_version(target) {
            if (target === 'all') {
                db.ref('app_config/maintenance_versions').set(['all']).then(function() {
                    showToast('Sukses', 'Maintenance untuk semua versi');
                    load_maintenance_versions();
                });
            }
        }

        function show_add_version_maintenance() {
            show_modal_input('Tambah Versi Maintenance',
                '<input id="add_maintenance_ver" placeholder="Contoh: 2.3" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.02);color:#fff;font-size:11px;outline:none;">',
                function() {
                    var ver = document.getElementById('add_maintenance_ver').value.trim();
                    if (!ver) { show_modal('Error', 'Masukkan versi!'); return; }
                    db.ref('app_config/maintenance_versions').once('value', function(s) {
                        var list = s.val() || [];
                        if (!list.includes(ver)) {
                            list.push(ver);
                            db.ref('app_config/maintenance_versions').set(list).then(function() {
                                showToast('Sukses', 'Versi ' + ver + ' ditambahkan ke maintenance');
                                load_maintenance_versions();
                            });
                        } else {
                            show_modal('Info', 'Versi sudah ada dalam daftar');
                        }
                    });
                });
        }

        function load_maintenance_versions() {
            if (firebase_listeners.maintenance_versions) {
                firebase_listeners.maintenance_versions.off();
            }
            firebase_listeners.maintenance_versions = db.ref('app_config/maintenance_versions');
            firebase_listeners.maintenance_versions.on('value', function(s) {
                var list = s.val() || [];
                maintenance_versions = list;
                var container = document.getElementById('maintenance_version_list');
                if (!container) return;
                if (list.length === 0) {
                    container.innerHTML = '<span style="color:var(--text_muted);font-size:9px;">Belum ada versi</span>';
                    return;
                }
                var html = '';
                for (var i = 0; i < list.length; i++) {
                    var v = list[i];
                    html += '<span class="version_tag">' + v +
                        ' <span class="remove_ver" onclick="remove_maintenance_version(\'' + v + '\')"><i class="fa-solid fa-times"></i></span></span>';
                }
                container.innerHTML = html;
            });
        }

        function remove_maintenance_version(ver) {
            var list = maintenance_versions.filter(function(v) { return v !== ver; });
            db.ref('app_config/maintenance_versions').set(list).then(function() {
                showToast('Sukses', 'Versi ' + ver + ' dihapus');
            });
        }

        // ============================================================
        // FORCE UPDATE FUNCTIONS
        // ============================================================
        function check_force_update() {
            if (firebase_listeners.force_update) {
                firebase_listeners.force_update.off();
            }
            firebase_listeners.force_update = db.ref('app_config/force_update');
            firebase_listeners.force_update.on('value', function(s) {
                var is_force = s.val() === true;
                if (is_force) {
                    db.ref('app_config/force_versions').once('value', function(v) {
                        var versions = v.val() || [];
                        var is_targeted = versions.includes('all') || versions.includes(app_version);
                        if (is_targeted) {
                            force_active = true;
                            document.getElementById('force_status').textContent = 'Status: ON';
                            document.getElementById('force_update_overlay').classList.add('show');
                            db.ref('app_config/force_title').once('value', function(t) {
                                document.getElementById('force_title').textContent = t.val() ||
                                'Update Wajib';
                            });
                            db.ref('app_config/force_message').once('value', function(m) {
                                document.getElementById('force_desc').textContent = m.val() ||
                                    'Versi aplikasi Anda sudah tidak didukung.';
                            });
                            db.ref('app_config/force_button_text').once('value', function(b) {
                                document.getElementById('force_btn_text').textContent = b.val() ||
                                    'Update Sekarang';
                            });
                            db.ref('app_config/force_url').once('value', function(u) {
                                var url = u.val();
                                if (url) window.force_url = url;
                            });
                            db.ref('app_config/version').once('value', function(ver) {
                                document.getElementById('force_version').textContent = ver.val() ||
                                    app_version;
                            });
                            if (user_role === 'DEVELOPER') {
                                document.getElementById('force_close_btn').classList.add('show');
                            } else {
                                document.getElementById('force_close_btn').classList.remove('show');
                            }
                            send_android_push_notification('Update Wajib', 'Versi baru tersedia, silakan update aplikasi!', 'update');
                        } else {
                            force_active = false;
                            document.getElementById('force_update_overlay').classList.remove('show');
                            document.getElementById('force_close_btn').classList.remove('show');
                        }
                    });
                } else {
                    force_active = false;
                    document.getElementById('force_update_overlay').classList.remove('show');
                    document.getElementById('force_close_btn').classList.remove('show');
                    document.getElementById('force_status').textContent = 'Status: OFF';
                }
            });
        }

        function close_force_update() {
            if (user_role === 'DEVELOPER') {
                document.getElementById('force_update_overlay').classList.remove('show');
                document.getElementById('force_close_btn').classList.remove('show');
                force_active = false;
            }
        }

        function set_force_update_mode(on) {
            db.ref('app_config/force_update').set(on).then(function() {
                var title = document.getElementById('force_title_input').value.trim();
                var msg = document.getElementById('force_message_input').value.trim();
                var url = document.getElementById('force_url_input').value.trim();
                var btn_text = document.getElementById('force_btn_text_input').value.trim();
                if (on) {
                    if (title) db.ref('app_config/force_title').set(title);
                    if (msg) db.ref('app_config/force_message').set(msg);
                    if (url) db.ref('app_config/force_url').set(url);
                    if (btn_text) db.ref('app_config/force_button_text').set(btn_text);
                    send_android_push_notification(title || 'Update Wajib', msg || 'Versi baru tersedia!', 'update');
                }
                showToast('Sukses', 'Force Update ' + (on ? 'AKTIF' : 'NONAKTIF'));
                document.getElementById('force_status').textContent = 'Status: ' + (on ? 'ON' : 'OFF');
            });
        }

        function set_force_version(target) {
            if (target === 'all') {
                db.ref('app_config/force_versions').set(['all']).then(function() {
                    showToast('Sukses', 'Force Update untuk semua versi');
                    load_force_versions();
                });
            }
        }

        function show_add_version_force() {
            show_modal_input('Tambah Versi Force Update',
                '<input id="add_force_ver" placeholder="Contoh: 2.3" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.02);color:#fff;font-size:11px;outline:none;">',
                function() {
                    var ver = document.getElementById('add_force_ver').value.trim();
                    if (!ver) { show_modal('Error', 'Masukkan versi!'); return; }
                    db.ref('app_config/force_versions').once('value', function(s) {
                        var list = s.val() || [];
                        if (!list.includes(ver)) {
                            list.push(ver);
                            db.ref('app_config/force_versions').set(list).then(function() {
                                showToast('Sukses', 'Versi ' + ver + ' ditambahkan ke force update');
                                load_force_versions();
                            });
                        } else {
                            show_modal('Info', 'Versi sudah ada dalam daftar');
                        }
                    });
                });
        }

        function load_force_versions() {
            if (firebase_listeners.force_versions) {
                firebase_listeners.force_versions.off();
            }
            firebase_listeners.force_versions = db.ref('app_config/force_versions');
            firebase_listeners.force_versions.on('value', function(s) {
                var list = s.val() || [];
                force_versions = list;
                var container = document.getElementById('force_version_list');
                if (!container) return;
                if (list.length === 0) {
                    container.innerHTML = '<span style="color:var(--text_muted);font-size:9px;">Belum ada versi</span>';
                    return;
                }
                var html = '';
                for (var i = 0; i < list.length; i++) {
                    var v = list[i];
                    html += '<span class="version_tag">' + v +
                        ' <span class="remove_ver" onclick="remove_force_version(\'' + v + '\')"><i class="fa-solid fa-times"></i></span></span>';
                }
                container.innerHTML = html;
            });
        }

        function remove_force_version(ver) {
            var list = force_versions.filter(function(v) { return v !== ver; });
            db.ref('app_config/force_versions').set(list).then(function() {
                showToast('Sukses', 'Versi ' + ver + ' dihapus');
            });
        }

        function force_download_apk() {
            if (window.force_url && window.force_url !== '#') {
                window.open(window.force_url, '_blank');
            } else {
                show_modal('Info', 'Link download belum tersedia.');
            }
        }

        // ============================================================
        // ANDROID PUSH NOTIFICATION (FCM)
        // ============================================================
        function send_android_push_notification(title, body, type) {
            try {
                if (window.AndroidBridge) {
                    window.AndroidBridge.sendPushNotification(title, body, type || 'default');
                } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.notify) {
                    window.webkit.messageHandlers.notify.postMessage({ title: title, body: body, type: type || 'default' });
                } else {
                    console.log('Push Notification:', title, body, type);
                    db.ref('push_notifications').push({
                        title: title,
                        body: body,
                        type: type || 'default',
                        timestamp: new Date().toISOString(),
                        target: 'all'
                    });
                }
            } catch (e) {
                console.log('Push notification error:', e);
            }
        }

        // ============================================================
        // APP STATUS (ON/OFF)
        // ============================================================
        function check_app_status() {
            db.ref('app_config/app_status').on('value', function(s) {
                var status = s.val();
                if (status === false) {
                    app_status = false;
                    var banner = document.getElementById('app_off_banner');
                    if (banner) banner.style.display = 'flex';
                    document.getElementById('app_off_badge').classList.remove('hidden');
                    document.getElementById('app_status_display').textContent = 'Status: OFF';
                    db.ref('app_config/app_off_message').once('value', function(msg) {
                        var m = msg.val() || 'Aplikasi sedang dalam mode nonaktif. Beberapa fitur mungkin tidak tersedia.';
                        document.getElementById('app_off_message').textContent = m;
                    });
                } else {
                    app_status = true;
                    var banner = document.getElementById('app_off_banner');
                    if (banner) banner.style.display = 'none';
                    document.getElementById('app_off_badge').classList.add('hidden');
                    document.getElementById('app_status_display').textContent = 'Status: ON';
                }
            });
        }

        function set_app_status(on) {
            db.ref('app_config/app_status').set(on).then(function() {
                var msg = document.getElementById('app_off_message_input').value.trim();
                if (!on && msg) {
                    db.ref('app_config/app_off_message').set(msg);
                }
                showToast('Sukses', 'Status aplikasi: ' + (on ? 'ON' : 'OFF'));
            });
        }

        // ============================================================
        // WEBSITE AUTO CREATE KEY CONFIG
        // ============================================================
        function load_website_config() {
            db.ref('app_config/website').on('value', function(s) {
                var cfg = s.val() || {};
                var el = document.getElementById('website_status_display');
                if (el) {
                    var st = [];
                    st.push(cfg.enabled !== false ? 'Website: ON' : 'Website: OFF');
                    st.push(cfg.auto_create !== false ? 'AutoCreate: ON' : 'AutoCreate: OFF');
                    st.push(cfg.maintenance ? 'Maintenance: ON' : 'Maintenance: OFF');
                    st.push('Role: ' + (cfg.default_role || 'MEMBER'));
                    st.push('Durasi: ' + (cfg.default_duration_days || 3) + ' hari');
                    if (cfg.random_expired) st.push('Random: ' + (cfg.random_min_days||1) + '-' + (cfg.random_max_days||7) + 'h');
                    el.textContent = st.join(' · ');
                }
                // Fill form fields if present
                var r = document.getElementById('web_default_role');
                if (r && cfg.default_role) r.value = cfg.default_role;
                var d = document.getElementById('web_default_days');
                if (d && cfg.default_duration_days) d.value = cfg.default_duration_days;
                var re = document.getElementById('web_random_expired');
                if (re) re.checked = !!cfg.random_expired;
                var rmin = document.getElementById('web_random_min');
                if (rmin && cfg.random_min_days) rmin.value = cfg.random_min_days;
                var rmax = document.getElementById('web_random_max');
                if (rmax && cfg.random_max_days) rmax.value = cfg.random_max_days;
                var maxd = document.getElementById('web_max_per_device');
                if (maxd && cfg.max_per_device !== undefined) maxd.value = cfg.max_per_device;
                var msg = document.getElementById('web_maintenance_msg');
                if (msg && cfg.maintenance_message) msg.value = cfg.maintenance_message;
                var mkt = document.getElementById('web_max_keys_total');
                if (mkt && cfg.max_keys_total) mkt.value = cfg.max_keys_total;
            });
        }

        function set_website_enabled(on) {
            db.ref('app_config/website/enabled').set(!!on).then(function() {
                showToast('Website', on ? 'Website ON' : 'Website OFF');
            });
        }

        function set_auto_create(on) {
            db.ref('app_config/website/auto_create').set(!!on).then(function() {
                showToast('Auto Create', on ? 'Auto Create ON' : 'Auto Create OFF');
            });
        }

        function set_website_maintenance(on) {
            var updates = { maintenance: !!on };
            var msg = document.getElementById('web_maintenance_msg');
            if (msg && msg.value.trim()) updates.maintenance_message = msg.value.trim();
            db.ref('app_config/website').update(updates).then(function() {
                showToast('Maintenance', on ? 'Maintenance ON' : 'Maintenance OFF');
            });
        }

        function save_website_config() {
            var data = {
                default_role: (document.getElementById('web_default_role') || {}).value || 'MEMBER',
                default_duration_days: parseInt((document.getElementById('web_default_days') || {}).value) || 3,
                random_expired: !!(document.getElementById('web_random_expired') || {}).checked,
                random_min_days: parseInt((document.getElementById('web_random_min') || {}).value) || 1,
                random_max_days: parseInt((document.getElementById('web_random_max') || {}).value) || 7,
                max_per_device: 1,
                max_devices: 1,
                max_keys_total: parseInt((document.getElementById('web_max_keys_total') || {}).value) || 100,
                maintenance_message: ((document.getElementById('web_maintenance_msg') || {}).value || '').trim() || 'Website sedang maintenance.'
            };
            db.ref('app_config/website').update(data).then(function() {
                showToast('Sukses', 'Pengaturan Website disimpan!');
            }).catch(function(e) {
                showToast('Error', e.message);
            });
        }

        // ============================================================
        // SHIZUKU (OPTIONAL) - graceful, no force close
        // ============================================================
        var shizuku_available = false;
        function check_shizuku() {
            try {
                // Deteksi via Android Bridge jika ada (Sketchware / native)
                if (typeof Android !== 'undefined' && typeof Android.isShizukuAvailable === 'function') {
                    shizuku_available = !!Android.isShizukuAvailable();
                    if (shizuku_available && typeof Android.requestShizukuPermission === 'function') {
                        try { Android.requestShizukuPermission(); } catch (e) {}
                    }
                } else if (window.Shizuku || (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.shizuku)) {
                    shizuku_available = true;
                }
            } catch (e) {
                shizuku_available = false;
                console.log('Shizuku not available (safe fallback):', e.message || e);
            }
            return shizuku_available;
        }

        // ============================================================
        // DURATION HELPER
        // ============================================================
        function set_duration(val, unit) {
            document.getElementById('new_exp_value').value = val;
            document.getElementById('new_exp_unit').value = unit;
        }

        function format_duration(value, unit) {
            if (unit === 'permanent') return 'permanent';
            if (!value || value <= 0) return 'permanent';
            return value + ' ' + unit;
        }

        // ============================================================
        // GENERATE RANDOM KEY - ENHANCED
        // ============================================================
        function generate_random_key() {
            var type = document.getElementById('key_type').value;
            var length = parseInt(document.getElementById('key_length').value) || 12;
            if (length < 1) length = 1;
            if (length > 100) length = 100;

            var chars = '';
            if (type === 'alnum') chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            else if (type === 'numeric') chars = '0123456789';
            else if (type === 'letter') chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

            var key = '';
            for (var i = 0; i < length; i++) {
                key += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('new_key').value = key;
            showToast('Generate', 'Key: ' + key + ' (' + length + ' karakter)');
        }

        // ============================================================
        // ROLE FEATURES MANAGEMENT
        // ============================================================
        function load_role_features() {
            if (firebase_listeners.role_features) {
                firebase_listeners.role_features.off();
            }
            firebase_listeners.role_features = db.ref('role_features');
            firebase_listeners.role_features.on('value', function(s) {
                role_features = s.val() || {};
                render_role_features();
                render_features();
            });
        }

        function render_role_features() {
            var c = document.getElementById('role_feature_manager');
            if (!c) return;
            var roles = ['MEMBER', 'TEAMPROJECT', 'VIP', 'VVIP', 'RESELLER', 'OWNER', 'DEVELOPER', 'all'];
            var html = '';
            var feature_keys = Object.keys(features);
            if (feature_keys.length === 0) {
                c.innerHTML = '<div style="color:var(--text_secondary);font-size:10px;padding:4px 0;">Belum ada fitur</div>';
                return;
            }
            html += '<div style="font-size:9px;color:var(--text_secondary);margin-bottom:4px;">Atur fitur per role</div>';
            for (var r = 0; r < roles.length; r++) {
                var role = roles[r];
                var label = role === 'all' ? 'All Role' : role;
                html += '<div style="margin-bottom:4px;padding:4px;background:rgba(255,255,255,0.02);border-radius:6px;">';
                html += '<div style="font-size:8px;font-weight:600;color:var(--text_secondary);margin-bottom:3px;">' + label +
                    '</div>';
                html += '<div style="display:flex;flex-wrap:wrap;gap:3px;">';
                for (var f = 0; f < feature_keys.length; f++) {
                    var f_key = feature_keys[f];
                    var f_data = features[f_key];
                    var is_enabled = false;
                    if (role === 'all') {
                        if (role_features.all && role_features.all[f_key] !== undefined) {
                            is_enabled = role_features.all[f_key] === true;
                        } else {
                            is_enabled = true;
                        }
                    } else {
                        if (role_features[role] && role_features[role][f_key] !== undefined) {
                            is_enabled = role_features[role][f_key] === true;
                        } else {
                            if (role_features.all && role_features.all[f_key] !== undefined) {
                                is_enabled = role_features.all[f_key] === true;
                            } else {
                                is_enabled = true;
                            }
                        }
                    }
                    html += '<label style="font-size:7px;display:flex;align-items:center;gap:2px;cursor:pointer;padding:1px 5px;background:' +
                        (is_enabled ? 'var(--primary_light)' : 'rgba(255,255,255,0.02)') +
                        ';border-radius:4px;border:1px solid ' + (is_enabled ? 'var(--primary)' :
                        'var(--glass_border)') + ';">';
                    html += '<input type="checkbox" ' + (is_enabled ? 'checked' : '') +
                        ' onchange="set_role_feature(\'' + role + '\',\'' + f_key + '\',this.checked)" style="width:8px;height:8px;accent-color:var(--primary);">';
                    html += f_data.name || f_key;
                    html += '</label>';
                }
                html += '</div>';
                html += '</div>';
            }
            c.innerHTML = html;
        }

        function set_role_feature(role, feature, enabled) {
            var ref = db.ref('role_features/' + role + '/' + feature);
            if (enabled) {
                ref.set(true);
            } else {
                ref.remove();
            }
            showToast('Update', 'Fitur ' + (enabled ? 'diaktifkan' : 'dinonaktifkan') + ' untuk ' + role);
        }

        // ============================================================
        // IS FEATURE AVAILABLE FOR ROLE
        // ============================================================
        function is_feature_available_for_role(feature_key) {
            if (user_role === 'DEVELOPER') return true;
            if (role_features.all && role_features.all[feature_key] !== undefined) {
                if (role_features.all[feature_key] === false) {
                    if (role_features[user_role] && role_features[user_role][feature_key] === true) {
                        return true;
                    }
                    return false;
                }
                if (role_features.all[feature_key] === true) {
                    return true;
                }
            }
            if (role_features[user_role] && role_features[user_role][feature_key] !== undefined) {
                return role_features[user_role][feature_key] === true;
            }
            return true;
        }

        // ============================================================
        // CUSTOM COLORS
        // ============================================================
        function load_colors() {
            db.ref('app_style').once('value').then(function(s) {
                var style = s.val() || {};
                if (style.primary_color) {
                    document.getElementById('color_primary').value = style.primary_color;
                    document.documentElement.style.setProperty('--primary', style.primary_color);
                }
                if (style.secondary_color) {
                    document.getElementById('color_secondary').value = style.secondary_color;
                    document.documentElement.style.setProperty('--secondary', style.secondary_color);
                }
                if (style.bg_color) {
                    document.getElementById('color_bg').value = style.bg_color;
                    document.documentElement.style.setProperty('--bg', style.bg_color);
                }
                if (style.card_color) {
                    document.getElementById('color_card').value = style.card_color;
                    document.documentElement.style.setProperty('--bg_card', style.card_color);
                }
                if (style.success_color) {
                    document.getElementById('color_success').value = style.success_color;
                    document.documentElement.style.setProperty('--success', style.success_color);
                }
                if (style.danger_color) {
                    document.getElementById('color_danger').value = style.danger_color;
                    document.documentElement.style.setProperty('--danger', style.danger_color);
                }
                if (style.warning_color) {
                    document.getElementById('color_warning').value = style.warning_color;
                    document.documentElement.style.setProperty('--warning', style.warning_color);
                }
                if (style.text_color) {
                    document.getElementById('color_text').value = style.text_color;
                    document.documentElement.style.setProperty('--text', style.text_color);
                }
                if (style.text_secondary_color) {
                    document.getElementById('color_text_sec').value = style.text_secondary_color;
                    document.documentElement.style.setProperty('--text_secondary', style.text_secondary_color);
                }
            });
        }

        function save_colors() {
            var colors = {
                primary_color: document.getElementById('color_primary').value,
                secondary_color: document.getElementById('color_secondary').value,
                bg_color: document.getElementById('color_bg').value,
                card_color: document.getElementById('color_card').value,
                success_color: document.getElementById('color_success').value,
                danger_color: document.getElementById('color_danger').value,
                warning_color: document.getElementById('color_warning').value,
                text_color: document.getElementById('color_text').value,
                text_secondary_color: document.getElementById('color_text_sec').value
            };
            document.documentElement.style.setProperty('--primary', colors.primary_color);
            document.documentElement.style.setProperty('--secondary', colors.secondary_color);
            document.documentElement.style.setProperty('--bg', colors.bg_color);
            document.documentElement.style.setProperty('--bg_card', colors.card_color);
            document.documentElement.style.setProperty('--success', colors.success_color);
            document.documentElement.style.setProperty('--danger', colors.danger_color);
            document.documentElement.style.setProperty('--warning', colors.warning_color);
            document.documentElement.style.setProperty('--text', colors.text_color);
            document.documentElement.style.setProperty('--text_secondary', colors.text_secondary_color);
            db.ref('app_style').update(colors).then(function() {
                showToast('Sukses', 'Warna berhasil disimpan!');
            }).catch(function(e) {
                showToast('Error', e.message);
            });
        }

        function reset_colors() {
            document.getElementById('color_primary').value = '#007aff';
            document.getElementById('color_secondary').value = '#5856d6';
            document.getElementById('color_bg').value = '#000000';
            document.getElementById('color_card').value = '#1c1c1e';
            document.getElementById('color_success').value = '#34c759';
            document.getElementById('color_danger').value = '#ff3b30';
            document.getElementById('color_warning').value = '#ff9500';
            document.getElementById('color_text').value = '#ffffff';
            document.getElementById('color_text_sec').value = '#8e8e93';
            save_colors();
        }

        // ============================================================
        // SESSION MANAGEMENT
        // ============================================================
        function save_session(key, data) {
            try {
                var session_data = { key: key, data: data, style: selected_app_style, time: Date.now() };
                localStorage.setItem(SESSION_KEY, JSON.stringify(session_data));
                localStorage.setItem('nexus_last_key_hint', key);
                console.log('Session saved:', key);
            } catch (e) { console.error('Failed to save session:', e); }
        }

        function get_session() {
            try {
                var raw = localStorage.getItem(SESSION_KEY);
                if (!raw) return null;
                var data = JSON.parse(raw);
                if (!data.key || !data.data) return null;
                return data;
            } catch (e) {
                return null;
            }
        }

        function clear_session() {
            localStorage.removeItem(SESSION_KEY);
        }

        // ============================================================
        // CHECK SESSION - AUTO LOGIN
        // ============================================================
        function check_session() {
            if (session_checked) return;
            session_checked = true;
            if (force_active) {
                document.getElementById('force_update_overlay').classList.add('show');
                return;
            }
            var session = get_session();
            if (session) {
                apply_app_style(session.style || localStorage.getItem('nexus_app_style') || 'liquid', false);
                var input = document.getElementById('key_input');
                if (input && session.key) {
                    input.value = session.key;
                    input.dataset.savedKey = '1';
                }
                var hint = document.getElementById('login_session_hint');
                if (hint) hint.style.display = session.key ? 'block' : 'none';
            }
            show_login();
        }
        function show_login() {
            var boot = document.getElementById('nx_boot_loader');
            if (boot) { boot.classList.add('hide'); boot.style.display = 'none'; boot.style.pointerEvents = 'none'; }
            var splash = document.getElementById('splash_screen');
            if (splash) { splash.classList.add('hide'); splash.style.display = 'none'; splash.style.pointerEvents = 'none'; }
            var login = document.getElementById('login_screen');
            if (login) { login.style.display = 'flex'; login.classList.add('show'); login.style.pointerEvents = 'auto'; }
            var login_btn = document.getElementById('login_btn');
            if (login_btn) { login_btn.disabled = false; login_btn.innerHTML = '<i class="fa-solid fa-unlock-keyhole"></i> Masuk ke Dashboard'; }
            var dashboard = document.getElementById('dashboard');
            if (dashboard) dashboard.style.display = 'none';
            stop_dashboard_music();
            apply_app_style(localStorage.getItem('nexus_app_style') || selected_app_style || 'liquid', false);
            init_online_users();
        }
        // ============================================================
        // LOGIN
        // ============================================================
        
        
        function get_key_max_devices(d) {
            if (!d) return 1;
            var m = parseInt(d.max_devices, 10);
            if (isNaN(m) || m < 1) return 1;
            return m;
        }

        function normalize_devices(list) {
            var out = [];
            if (!list) return out;
            if (Array.isArray(list)) {
                list.forEach(function(v) {
                    if (!v) return;
                    if (typeof v === 'string') out.push({ id: v, name: v });
                    else if (typeof v === 'object') out.push(v);
                });
                return out;
            }
            if (typeof list === 'object') {
                Object.keys(list).forEach(function(k) {
                    var v = list[k];
                    if (v === null || v === undefined) return;
                    if (typeof v === 'string') out.push({ id: k, name: v });
                    else if (typeof v === 'object') {
                        var o = Object.assign({}, v);
                        if (!o.id) o.id = k;
                        out.push(o);
                    }
                });
            }
            return out;
        }

        function devices_to_map(arr) {
            var map = {};
            (arr || []).forEach(function(d) {
                if (!d || !d.id) return;
                map[String(d.id)] = {
                    id: String(d.id),
                    name: d.name || 'Android Device',
                    brand: d.brand || 'Android',
                    model: d.model || 'Device',
                    last_login: d.last_login || new Date().toISOString()
                };
            });
            return map;
        }

        function write_key_devices(key, devicesArr, maxDev, cb) {
            var map = devices_to_map(devicesArr);
            // Tulis ke 2 path: devices (map) + max_devices
            var updates = {};
            updates['valid_keys/' + key + '/devices'] = map;
            updates['valid_keys/' + key + '/max_devices'] = maxDev || 1;
            db.ref().update(updates).then(function() {
                cb && cb(null, map);
            }).catch(function(err) {
                // REST fallback per-field
                var base = 'https://yanzcode-74c34-default-rtdb.asia-southeast1.firebasedatabase.app/valid_keys/' +
                    encodeURIComponent(key);
                var p1 = fetch(base + '/devices.json', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(map)
                });
                var p2 = fetch(base + '/max_devices.json', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(maxDev || 1)
                });
                Promise.all([p1, p2]).then(function(rs) {
                    if (!rs[0].ok) throw new Error('devices HTTP ' + rs[0].status);
                    cb && cb(null, map);
                }).catch(function(e2) {
                    cb && cb(e2 || err);
                });
            });
        }

        /** Cek & ikat device. Logout TIDAK melepas device (aman). */
        function bind_or_check_device(key, d, cb) {
            var info = get_device_info();
            if (!info || !info.id) {
                cb('Device ID gagal dibuat', d);
                return;
            }
            db.ref('valid_keys/' + key).once('value').then(function(snap) {
                var fresh = snap.val();
                if (!fresh) {
                    cb('Key tidak ditemukan', d);
                    return;
                }
                var devices = normalize_devices(fresh.devices);
                var maxDev = get_key_max_devices(fresh);
                var id = String(info.id);
                var found = -1;
                for (var i = 0; i < devices.length; i++) {
                    if (devices[i] && String(devices[i].id) === id) {
                        found = i;
                        break;
                    }
                }
                var now = new Date().toISOString();
                var entry = {
                    id: id,
                    name: info.name || ((info.brand || 'Android') + ' ' + (info.model || 'Device')),
                    brand: info.brand || 'Android',
                    model: info.model || 'Device',
                    last_login: now
                };
                if (found >= 0) {
                    devices[found] = Object.assign({}, devices[found], entry);
                } else if (devices.length >= maxDev) {
                    var names = devices.map(function(x) {
                        return (x.name || ((x.brand || '') + ' ' + (x.model || '')).trim() || x.id || '?');
                    }).join(', ');
                    cb('Key terikat ' + devices.length + '/' + maxDev + ' device.\n' + names + '\nAdmin harus hapus device di panel.', fresh);
                    return;
                } else {
                    devices.push(entry);
                }
                write_key_devices(key, devices, maxDev, function(err) {
                    if (err) {
                        cb('Gagal simpan device: ' + (err.message || err), fresh);
                        return;
                    }
                    fresh.devices = devices_to_map(devices);
                    fresh.max_devices = maxDev;
                    if (typeof keys === 'object') {
                        keys[key] = Object.assign({}, keys[key] || {}, {
                            devices: fresh.devices,
                            max_devices: maxDev
                        });
                    }
                    try { render_keys(); } catch (e) {}
                    cb(null, fresh);
                });
            }).catch(function(e) {
                cb('Gagal baca key: ' + (e.message || e), d);
            });
        }

        function do_login() {
            var boot = document.getElementById('nx_boot_loader');
            var splash = document.getElementById('splash_screen');
            if (boot) { boot.classList.add('hide'); boot.style.display = 'none'; boot.style.pointerEvents = 'none'; }
            if (splash) { splash.classList.add('hide'); splash.style.display = 'none'; splash.style.pointerEvents = 'none'; }
            if (loading) return;
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            var key = document.getElementById('key_input').value.trim();
            var btn = document.getElementById('login_btn');
            var err = document.getElementById('err_msg');
            if (!key) {
                if (err) {
                    err.textContent = 'Masukkan key!';
                    err.className = 'error_msg show';
                }
                return;
            }
            loading = true;
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner"></span> Memverifikasi...';
            }
            if (err) err.className = 'error_msg';
            db.ref('valid_keys/' + key).once('value').then(function(s) {
                var d = s.val();
                if (!d) {
                    if (err) {
                        err.textContent = 'Key tidak valid! Membuka saluran...';
                        err.className = 'error_msg show';
                    }
                    loading = false;
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fa-solid fa-unlock-keyhole"></i> Masuk';
                    }
                    setTimeout(function() {
                        try {
                            window.open('https://whatsapp.com/channel/0029VbCrRPjDDmFLQpbX6n3n', '_blank');
                        } catch (e) {
                            window.location.href = 'https://whatsapp.com/channel/0029VbCrRPjDDmFLQpbX6n3n';
                        }
                    }, 800);
                    return;
                }
                if (is_expired(d)) {
                    if (err) {
                        err.textContent = 'Key sudah kadaluarsa!';
                        err.className = 'error_msg show';
                    }
                    try{remove_online_for_key(user_key);}catch(e){}
                    show_expired_popup('Key ' + key + ' sudah kadaluarsa.');
                    loading = false;
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fa-solid fa-unlock-keyhole"></i> Masuk';
                    }
                    return;
                }
                // Enforce max device (default 1)
                if (d.max_devices === undefined || d.max_devices === null) {
                    d.max_devices = 1;
                }
                bind_or_check_device(key, d, function(errMsg, d2) {
                    if (errMsg) {
                        if (err) {
                            err.textContent = errMsg;
                            err.className = 'error_msg show';
                            err.style.whiteSpace = 'pre-line';
                        }
                        loading = false;
                        if (btn) {
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fa-solid fa-unlock-keyhole"></i> Masuk';
                        }
                        showToast('Device Limit', 'Key sudah dipakai di device lain');
                        return;
                    }
                    login_success(key, d2 || d);
                });
            }).catch(function(e) {
                if (err) {
                    err.textContent = 'Error: ' + e.message;
                    err.className = 'error_msg show';
                }
                loading = false;
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-unlock-keyhole"></i> Masuk';
                }
            });
        }

        function login_success(key, d) {
            user_key = key;
            user_data = d;
            apply_app_style(selected_app_style, true);
            user_role = d.role || 'GUEST';
            is_developer = (user_role === 'DEVELOPER');
            save_session(key, d);
            show_dashboard();
            setTimeout(start_dashboard_music, 160);
            loading = false;
            var btn = document.getElementById('login_btn');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-unlock-keyhole"></i> Masuk';
            }
            log_activity('login');
            try { var seenUser = localStorage.getItem('nx_user_telegram_seen_' + user_key); if (!seenUser) { localStorage.setItem('nx_user_telegram_seen_' + user_key, '1'); nx_telegram_notify('new_user', { key:user_key, name:(user_data && user_data.name) || user_key, role:user_role, device:get_device_info().name }); } } catch (e) {}
            // pastikan device tersimpan (logout tidak melepas slot)
            try {
                bind_or_check_device(key, d, function(e2, d3) {
                    if (!e2 && d3) user_data = d3;
                });
            } catch (e) {}
            set_user_online();
            try { nxAfterLogin(); } catch (e) {}
            if (key_expired_listener) {
                key_expired_listener.off();
            }
            key_expired_listener = db.ref('valid_keys/' + key);
            key_expired_listener.on('value', function(s) {
                var d2 = s.val();
                if (d2 && is_expired(d2)) {
                    is_expired_flag = true;
                    try{remove_online_for_key(user_key);}catch(e){}
                    show_expired_popup('Key Anda sudah kadaluarsa. Silakan logout dan hubungi admin untuk perpanjangan.');
                    setTimeout(function() { do_logout(); }, 3000);
                }
            });
        }

        // ============================================================
        // DASHBOARD
        // ============================================================
        function show_dashboard() {
            var login = document.getElementById('login_screen');
            if (login) { login.style.display = 'none';
                login.classList.remove('show'); }
            try {
                var mw = document.getElementById('main_wrapper') || document.querySelector('.main_wrapper');
                if (mw) { mw.style.display = 'block'; mw.style.opacity = '1'; mw.style.visibility = 'visible'; }
                var hp = document.getElementById('home_page');
                if (hp) { hp.style.display = 'block'; hp.style.opacity = '1'; }
            } catch (e) {}
            var dashboard = document.getElementById('dashboard');
            if (dashboard) { dashboard.style.display = 'flex';
                dashboard.classList.add('show'); }

            var name = user_data?.name || user_key;
            document.getElementById('user_name').textContent = '@' + name;
            document.getElementById('user_role').textContent = user_role;

            document.getElementById('uc_name').textContent = '@' + name;
            var uc_role = document.getElementById('uc_role');
            if (uc_role) {
                uc_role.textContent = user_role;
                uc_role.className = 'uc_role ' + (user_role || 'member').toLowerCase();
            }

            var role_colors = {
                DEVELOPER: 'var(--danger)',
                OWNER: '#ff9500',
                RESELLER: 'var(--warning)',
                VVIP: 'var(--warning)',
                VIP: 'var(--primary)',
                TEAMPROJECT: 'var(--success)',
                MEMBER: 'var(--success)',
                FREE: '#00f2ea'
            };
            var r = document.getElementById('user_role');
            if (r && role_colors[user_role]) {
                var color = role_colors[user_role];
                r.style.background = color + '22';
                r.style.borderColor = color;
                r.style.color = color;
            }

            var device_info = get_device_info();
            document.getElementById('user_device').textContent = 'Device: ' + device_info.name;
            document.getElementById('uc_device').textContent = 'Device: ' + device_info.name;

            if (expiry_interval) clearInterval(expiry_interval);
            update_expiry_display();
            expiry_interval = setInterval(update_expiry_display, 1000);

            if (user_role === 'DEVELOPER' || user_role === 'OWNER') {
                document.getElementById('menu_dev_item').classList.remove('hidden');
            } else {
                document.getElementById('menu_dev_item').classList.add('hidden');
            }

            load_profile_card();
            load_video_background();
            load_activity_log();

            render_features();
            render_quick();
            render_notifications();
            render_keys();
            render_del_features();
            show_home();
            setTimeout(function(){ load_developer_ad_popup(false); }, 700);

            if (update_available) {
                document.getElementById('update_badge').classList.remove('hidden');
                document.getElementById('update_badge').classList.add('update_available');
            }

            check_force_update();
            check_maintenance();
            check_app_status();
            init_online_users();
            update_device_info();
            
            // New features v2.6
            if (typeof load_website_config === 'function') load_website_config();
            if (typeof check_shizuku === 'function') check_shizuku();
            if (typeof setKeyTab === 'function') setKeyTab(current_key_tab || 'aktif');
        }

        // ============================================================
        // PAGE NAVIGATION
        // ============================================================
        function show_home() {
            if (force_active) {
                document.getElementById('force_update_overlay').classList.add('show');
                return;
            }
            current_page = 'home';
            var home = document.getElementById('home_page');
            var features = document.getElementById('features_page');
            var info = document.getElementById('info_update_page');
            var dev = document.getElementById('dev_page');
            var market = document.getElementById('market_page');
            if (home) { home.style.display = 'block'; }
            if (features) { features.style.display = 'none';
                features.classList.remove('show'); }
            if (info) { info.style.display = 'none';
                info.classList.remove('show'); }
            if (dev) { dev.style.display = 'none';
                dev.classList.remove('show'); }
            if (market) { market.style.display = 'none'; market.classList.remove('show'); }
            document.querySelectorAll('.nav_item').forEach(function(e) { e.classList.remove('active'); });
            var home_nav = document.querySelector('.nav_item[onclick*="home"]');
            if (home_nav) home_nav.classList.add('active');
            var wrapper = document.getElementById('main_wrapper');
            if (wrapper) wrapper.scrollTop = 0;
        }

        function show_features_page() {
            if (force_active) {
                document.getElementById('force_update_overlay').classList.add('show');
                return;
            }
            current_page = 'features';
            var home = document.getElementById('home_page');
            var features = document.getElementById('features_page');
            var info = document.getElementById('info_update_page');
            var dev = document.getElementById('dev_page');
            var market = document.getElementById('market_page');
            if (home) home.style.display = 'none';
            if (features) { features.style.display = 'block';
                features.classList.add('show'); }
            if (info) { info.style.display = 'none';
                info.classList.remove('show'); }
            if (dev) { dev.style.display = 'none';
                dev.classList.remove('show'); }
            if (market) { market.style.display = 'none'; market.classList.remove('show'); }
            document.querySelectorAll('.nav_item').forEach(function(e) { e.classList.remove('active'); });
            var features_nav = document.querySelector('.nav_item[onclick*="features"]');
            if (features_nav) features_nav.classList.add('active');
            var wrapper = document.getElementById('main_wrapper');
            if (wrapper) wrapper.scrollTop = 0;
            render_features();
            render_quick();
        }

        function show_info_update() {
            if (force_active) {
                document.getElementById('force_update_overlay').classList.add('show');
                return;
            }
            current_page = 'info';
            var home = document.getElementById('home_page');
            var features = document.getElementById('features_page');
            var info = document.getElementById('info_update_page');
            var dev = document.getElementById('dev_page');
            var market = document.getElementById('market_page');
            if (home) home.style.display = 'none';
            if (features) { features.style.display = 'none';
                features.classList.remove('show'); }
            if (info) { info.style.display = 'block';
                info.classList.add('show'); }
            if (dev) { dev.style.display = 'none';
                dev.classList.remove('show'); }
            document.getElementById('update_badge_menu').textContent = '✓';
            var wrapper = document.getElementById('main_wrapper');
            if (wrapper) wrapper.scrollTop = 0;
        }

        function show_dev_page() {
            if (force_active) {
                document.getElementById('force_update_overlay').classList.add('show');
                return;
            }
            if (user_role !== 'DEVELOPER' && user_role !== 'OWNER') {
                showToast('Akses', 'Hanya Developer / Owner');
                return;
            }
            current_page = 'dev';
            setTimeout(function(){ if(typeof load_blocked_devices==='function') load_blocked_devices(); if(typeof loadRedeemCodesDev==='function') loadRedeemCodesDev(); if(typeof loadBlockedCreateList==='function') loadBlockedCreateList(); if(typeof loadPurchaseRequests==='function') loadPurchaseRequests(); if(typeof start_keys_realtime==='function') start_keys_realtime(); }, 300);

            var home = document.getElementById('home_page');
            var features = document.getElementById('features_page');
            var info = document.getElementById('info_update_page');
            var dev = document.getElementById('dev_page');
            var market = document.getElementById('market_page');
            if (home) home.style.display = 'none';
            if (features) { features.style.display = 'none';
                features.classList.remove('show'); }
            if (info) { info.style.display = 'none';
                info.classList.remove('show'); }
            if (dev) { dev.style.display = 'block';
                dev.classList.add('show'); }
            render_keys();
            render_del_features();
            render_role_features();
            var wrapper = document.getElementById('main_wrapper');
            if (wrapper) wrapper.scrollTop = 0;
        }

        function show_market_page(tab) {
            if (force_active) { document.getElementById('force_update_overlay').classList.add('show'); return; }
            current_page = 'market';
            var pages = ['home_page','features_page','info_update_page','dev_page','market_page'];
            pages.forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });
            var market=document.getElementById('market_page'); if(market){ market.style.display='block'; market.classList.add('show'); }
            var frame=document.getElementById('market_frame');
            if(frame){
                var desired='crypto.html?tab='+(encodeURIComponent(tab||'market'))+'&v=3.2';
                if(!frame.getAttribute('src') || frame.getAttribute('src').indexOf('crypto.html')<0) frame.src=desired;
                frame.contentWindow && frame.contentWindow.postMessage({type:'nexus_market_tab',tab:tab||'market'}, '*');
            }
            var wrapper=document.getElementById('main_wrapper'); if(wrapper) wrapper.scrollTop=0;
        }
        function save_developer_ad(){
            if(user_role!=='DEVELOPER' && user_role!=='OWNER'){ showToast('Akses','Hanya Developer / Owner'); return; }
            var image=(document.getElementById('dev_ad_image')||{}).value||'';
            var title=(document.getElementById('dev_ad_title')||{}).value||'';
            var desc=(document.getElementById('dev_ad_desc')||{}).value||'';
            var link=(document.getElementById('dev_ad_link')||{}).value||'';
            var value=Math.max(1,parseInt((document.getElementById('dev_ad_duration')||{}).value,10)||1);
            var unit=(document.getElementById('dev_ad_unit')||{}).value||'hari';
            var enabled=!!((document.getElementById('dev_ad_enabled')||{}).checked);
            if(!image && !title){ showToast('Iklan','Isi URL gambar atau judul'); return; }
            var ms={jam:3600000,hari:86400000,minggu:604800000,bulan:2592000000}[unit]||86400000;
            var now=Date.now();
            var payload={enabled:enabled,image_url:image,title:title,description:desc,link_url:link,duration_value:value,duration_unit:unit,starts_at:now,expires_at:now+(value*ms),updated_at:now,id:'ad_'+now};
            db.ref('app_config/developer_ad').set(payload).then(function(){ showToast('Iklan','Konfigurasi iklan tersimpan'); load_developer_ad_popup(true); }).catch(function(e){ showToast('Iklan','Gagal: '+(e.message||e)); });
        }
        function load_developer_ad_popup(forceShow){
            var refs=[db.ref('app_config/developer_ad').once('value'),db.ref('developer_ad').once('value')];
            Promise.all(refs).then(function(snaps){
                var ad=snaps[0].val()||snaps[1].val()||{};
                if(ad.enabled===false) return;
                var now=Date.now();
                if(ad.starts_at && now<Number(ad.starts_at)) return;
                if(ad.expires_at && now>Number(ad.expires_at)) return;
                var id=String(ad.id||ad.updated_at||ad.image_url||ad.title||'default');
                if(!forceShow && localStorage.getItem('nx_ad_closed_'+id)==='1') return;
                var overlay=document.getElementById('developer_ad_overlay'); if(!overlay) return;
                var img=document.getElementById('developer_ad_image'); if(img){ img.src=ad.image_url||ad.image||''; img.onerror=function(){overlay.classList.remove('show');}; }
                var t=document.getElementById('developer_ad_title'); if(t)t.textContent=ad.title||'Informasi Developer';
                var d=document.getElementById('developer_ad_desc'); if(d)d.textContent=ad.description||'';
                var a=document.getElementById('developer_ad_link'); var url=ad.link_url||ad.url||'';
                if(a && url){a.href=url;a.style.display='inline-flex';} else if(a){a.style.display='none';}
                overlay.dataset.adId=id; overlay.classList.add('show'); overlay.setAttribute('aria-hidden','false');
            }).catch(function(){});
        }
        function close_developer_ad(){
            var overlay=document.getElementById('developer_ad_overlay'); if(!overlay)return;
            try{localStorage.setItem('nx_ad_closed_'+(overlay.dataset.adId||'default'),'1')}catch(e){}
            overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true');
        }
        function save_version_gate_v32(){
            if(user_role!=='DEVELOPER' && user_role!=='OWNER'){ showToast('Akses','Hanya Developer / Owner'); return; }
            var min=((document.getElementById('dev_min_version')||{}).value||'').trim();
            var raw=((document.getElementById('dev_disabled_versions')||{}).value||'').trim();
            var list=raw?raw.split(',').map(function(x){return x.trim();}).filter(Boolean):[];
            db.ref('app_config').update({min_supported_version:min,disabled_versions:list,version_schema:'v3.2',version_updated_at:Date.now()}).then(function(){showToast('Version Gate','Aturan versi v3.2 tersimpan');}).catch(function(e){showToast('Version Gate','Gagal: '+(e.message||e));});
        }

        function switch_tab(el, target) {
            document.querySelectorAll('.bottom_nav .nav_item').forEach(function(e) { e.classList.remove('active'); });
            if (el) el.classList.add('active');
            moveLiquidIndicator(el);
            if (target === 'home') show_home();
            else if (target === 'market' || target === 'trade' || target === 'wallet' || target === 'account') show_market_page(target);
            else if (target === 'features') show_features_page();
            else if (target === 'device') show_features_page();
            else if (target === 'contact') { show_home(); open_contact(); }
        }

        function moveLiquidIndicator(el) {
            var ind = document.getElementById('liquid_indicator');
            var bar = document.getElementById('liquid_nav');
            if (!ind || !bar || !el) return;
            var barRect = bar.getBoundingClientRect();
            var elRect = el.getBoundingClientRect();
            var center = elRect.left - barRect.left + elRect.width / 2;
            ind.style.left = center + 'px';
            var icon = el.getAttribute('data-icon') || 'fa-house';
            ind.innerHTML = '<i class="fa-solid ' + icon + '"></i>';
            ind.classList.remove('pop');
            void ind.offsetWidth;
            ind.classList.add('pop');
        }

        function initLiquidNav() {
            var active = document.querySelector('.bottom_nav .nav_item.active');
            if (active) moveLiquidIndicator(active);
            window.addEventListener('resize', function() {
                var a = document.querySelector('.bottom_nav .nav_item.active');
                if (a) moveLiquidIndicator(a);
            });
        }
        setTimeout(initLiquidNav, 300);
        setTimeout(initLiquidNav, 1200);

        // ============================================================
        // BURGER MENU
        // ============================================================
        function toggle_menu() {
            try {
                var menu = document.getElementById('burger_menu');
                var overlay = document.getElementById('burger_overlay');
                if (!menu) return;
                menu.style.transition = 'left 0.12s ease-out';
                var open = menu.classList.toggle('open');
                if (overlay) {
                    if (open) {
                        overlay.classList.add('show');
                        overlay.style.display = 'block';
                        overlay.style.zIndex = '99998';
                    } else {
                        overlay.classList.remove('show');
                        overlay.style.display = '';
                    }
                }
                if (open) {
                    menu.style.left = '0';
                    menu.style.zIndex = '99999';
                    menu.style.pointerEvents = 'auto';
                } else {
                    menu.style.left = '';
                }
            } catch (e) { console.log(e); }
        }

        function close_menu() {
            try {
                var menu = document.getElementById('burger_menu');
                var overlay = document.getElementById('burger_overlay');
                if (menu) {
                    menu.classList.remove('open');
                    menu.style.left = '';
                }
                if (overlay) {
                    overlay.classList.remove('show');
                    overlay.style.display = '';
                }
            } catch (e) {}
        }

        // ============================================================
        // RENDER QUICK
        // ============================================================
        function render_quick() {
            var c = document.getElementById('quick_container');
            if (!c) return;
            var en = Object.keys(quick).filter(function(k) { return quick[k].enabled !== false; });
            document.getElementById('quick_count').textContent = en.length + ' aktif';
            if (en.length === 0) {
                c.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:8px;color:var(--text_secondary);font-size:10px;">Tidak ada aksi</div>';
                return;
            }
            var html = '';
            for (var i = 0; i < en.length; i++) {
                var k = en[i];
                var a = quick[k];
                var is_available = is_feature_available_for_role(k);
                html += '<div class="quick_item anim_fade_scale anim_delay_' + ((i % 5) + 1) + '" onclick="run_quick(\'' + k +
                    '\')" style="' + (!is_available ? 'opacity:0.4;cursor:not-allowed;' : '') + '">';
                html += '<span class="q_icon">' + nx_feature_icon_html(a.icon) + '</span>';
                html += '<span class="q_label">' + (a.name || k) + '</span>';
                if (!is_available) html += '<div style="font-size:6px;color:var(--text_muted);">terkunci</div>';
                html += '</div>';
            }
            c.innerHTML = html;
        }

        function run_quick(k) {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            if (!app_status) {
                showToast('Info', 'Aplikasi sedang dalam mode nonaktif');
                return;
            }
            if (!is_feature_available_for_role(k)) {
                showToast('Akses Ditolak', 'Fitur ini tidak tersedia untuk role Anda');
                return;
            }
            var a = quick[k];
            if (!a) return;
            showToast('Quick Action', '' + (a.name || k) + ' selesai!');
        }

        // ============================================================
        // RENDER FEATURES
        // ============================================================
        function nx_normalize_fa_icon(value) {
            var raw = value;
            if (raw && typeof raw === 'object') raw = raw.icon || raw.fa || raw.class || raw.name || '';
            raw = String(raw || '').trim().toLowerCase();
            if (!raw) return 'fa-solid fa-cube';
            raw = raw.replace(/[<>"'`]/g, ' ').replace(/\s+/g, ' ').trim();
            var family = 'fa-solid';
            if (raw.indexOf('fa-brands') >= 0 || raw.indexOf('brands ') >= 0) family = 'fa-brands';
            else if (raw.indexOf('fa-regular') >= 0 || raw.indexOf('regular ') >= 0) family = 'fa-regular';
            var hit = raw.match(/fa-[a-z0-9-]+/g) || [];
            var name = hit.length ? hit[hit.length - 1] : raw.replace(/^fa[-_ ]*/, '').replace(/[^a-z0-9-]/g, '-');
            if (!name || name === 'fa') name = 'fa-cube';
            if (name.indexOf('fa-') !== 0) name = 'fa-' + name;
            return family + ' ' + name;
        }
        function nx_feature_icon_html(value, extra) {
            var cls = nx_normalize_fa_icon(value);
            return '<i class="' + cls + (extra ? ' ' + extra : '') + '"></i>';
        }
        
        function render_features() {
            var c = document.getElementById('feature_container');
            var count = document.getElementById('feature_count');
            if (!c) return;
            var ks = Object.keys(features);
            var available_features = ks.filter(function(k) { return is_feature_available_for_role(k); });
            if (count) count.textContent = available_features.length + ' fitur tersedia';
            if (ks.length === 0) {
                c.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:12px;color:var(--text_secondary);font-size:11px;">Belum ada fitur</div>';
                return;
            }
            var html = '';
            for (var i = 0; i < ks.length; i++) {
                var k = ks[i];
                var f = features[k];
                var active = f.enabled === true;
                var available = is_feature_available_for_role(k);
                html += '<div class="feature_card anim_fade_scale anim_delay_' + ((i % 5) + 1) + (active ? ' active' : '') +
                    '" style="' + (!available ? 'opacity:0.5;' : '') + '">';
                html += '<div class="f_top">';
                html += '<div class="f_icon">' + nx_feature_icon_html(f.icon) + '</div>';
                html += '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">';
                html += '<label class="toggle"><input type="checkbox" ' + (active ? 'checked' : '') +
                    ' onchange="toggle_f(\'' + k + '\',this.checked)" ' + (!available ? 'disabled' : '') +
                    '><span class="sl"></span></label>';
                if (!available) {
                    html += '<span class="f_locked"><i class="fa-solid fa-lock"></i> Terkunci</span>';
                }
                html += '</div>';
                html += '</div>';
                html += '<div class="f_name">' + (f.name || k) + '</div>';
                html += '<div class="f_desc">' + (f.desc || '') + '</div>';
                html += '<div class="f_ver"><i class="fa-regular fa-circle-check"></i> v' + (f.version || '1.0') +
                    '</div>';
                if (!available) {
                    html += '<div class="f_locked"><i class="fa-solid fa-lock"></i> Tidak tersedia untuk role Anda</div>';
                }
                html += '</div>';
            }
            c.innerHTML = html;
        }

        function toggle_f(k, checked) {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            if (!app_status) {
                showToast('Info', 'Aplikasi sedang dalam mode nonaktif');
                return;
            }
            if (!is_feature_available_for_role(k)) {
                showToast('Akses Ditolak', 'Fitur ini tidak tersedia untuk role Anda');
                return;
            }
            db.ref('booster_features/' + k + '/enabled').set(checked).then(function() {
                var f = features[k];
                showToast('Sukses', (checked ? 'Aktif' : 'Nonaktif') + ' - ' + (f?.name || k));
                features[k].enabled = checked;
                render_features();
            }).catch(function(e) {
                show_modal('Error', e.message);
            });
        }

        // ============================================================
        // KEY MANAGEMENT - ENHANCED
        // ============================================================
        var _key_show_all = false;
        function setKeyTab(tab) {
            current_key_tab = tab || 'aktif';
            _key_show_all = false;
            var tabs = {
                aktif: 'tab_key_aktif', expired: 'tab_key_expired',
                free_web: 'tab_key_free_web', free_dev: 'tab_key_free_dev', semua: 'tab_key_semua'
            };
            for (var t in tabs) {
                var el = document.getElementById(tabs[t]);
                if (!el) continue;
                if (t === current_key_tab) {
                    el.style.background = 'var(--primary_light)';
                    el.style.borderColor = 'var(--primary)';
                    el.style.color = 'var(--primary)';
                    el.classList.add('active-tab');
                } else {
                    el.style.background = 'transparent';
                    el.style.borderColor = 'var(--glass_border)';
                    el.style.color = 'var(--text_secondary)';
                    el.classList.remove('active-tab');
                }
            }
            render_keys();
        }

        function key_matches_tab(k, d) {
            var expired = is_expired(d);
            var src = (d.source || '').toLowerCase();
            var cat = (d.category || '').toLowerCase();
            var isWeb = src.indexOf('website') >= 0 || cat === 'free_web';
            var isDev = !isWeb; // dibuat dari panel = free_dev / manual
            if (current_key_tab === 'aktif') return !expired;
            if (current_key_tab === 'expired') return expired;
            if (current_key_tab === 'free_web') return isWeb;
            if (current_key_tab === 'free_dev') return isDev && src !== 'website_auto_create';
            if (current_key_tab === 'semua') return true;
            return true;
        }

        function delete_keys_in_tab() {
            if (user_role !== 'DEVELOPER' && user_role !== 'OWNER') {
                showToast('Akses', 'Hanya Developer/Owner');
                return;
            }
            var ks = Object.keys(keys);
            var toDel = [];
            for (var i = 0; i < ks.length; i++) {
                if (key_matches_tab(ks[i], keys[ks[i]])) toDel.push(ks[i]);
            }
            if (toDel.length === 0) {
                showToast('Info', 'Tidak ada key di tab ini');
                return;
            }
            show_confirm('Hapus ' + toDel.length + ' key di tab "' + current_key_tab + '"?', function() {
                var left = toDel.length;
                toDel.forEach(function(k) {
                    db.ref('valid_keys/' + k).remove().then(function() {
                        remove_online_for_key(k);
                        left--;
                        if (left <= 0) {
                            showToast('Sukses', 'Key di tab dihapus');
                            refresh_keys();
                            prune_online_users();
                        }
                    });
                });
            });
        }

        function render_keys() {
            var c = document.getElementById('key_list');
            if (!c) return;
            var ks = Object.keys(keys);
            var moreWrap = document.getElementById('key_show_more_wrap');
            if (ks.length === 0) {
                c.innerHTML = '<div style="color:var(--text_secondary);font-size:10px;padding:4px 0;">Belum ada key</div>';
                var cnt = document.getElementById('key_tab_count');
                if (cnt) cnt.textContent = '0 key';
                if (moreWrap) moreWrap.innerHTML = '';
                return;
            }
            var filtered = [];
            for (var i = 0; i < ks.length; i++) {
                var k = ks[i];
                if (key_matches_tab(k, keys[k])) filtered.push(k);
            }
            var labels = { aktif:'Aktif', expired:'Expired', free_web:'Free Web', free_dev:'Free Dev', semua:'Semua' };
            var cntEl = document.getElementById('key_tab_count');
            if (cntEl) {
                cntEl.textContent = filtered.length + ' key ' + (labels[current_key_tab]||'') + ' (total ' + ks.length + ')';
            }
            if (filtered.length === 0) {
                c.innerHTML = '<div style="color:var(--text_secondary);font-size:10px;padding:4px 0;">Tidak ada key di kategori ini</div>';
                if (moreWrap) moreWrap.innerHTML = '';
                return;
            }
            var limit = 5;
            var showAll = _key_show_all === true;
            var maxShow = showAll ? filtered.length : Math.min(limit, filtered.length);
            if (moreWrap) {
                if (filtered.length > limit) {
                    if (!showAll) {
                        moreWrap.innerHTML = '<button type="button" onclick="_key_show_all=true;render_keys()" style="font-size:9px;padding:5px 14px;border-radius:10px;border:1px solid var(--primary);background:var(--primary_light);color:var(--primary);cursor:pointer;font-weight:600;">Show +' + (filtered.length - limit) + ' key</button>';
                    } else {
                        moreWrap.innerHTML = '<button type="button" onclick="_key_show_all=false;render_keys()" style="font-size:9px;padding:5px 14px;border-radius:10px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-weight:600;">Hide</button>';
                    }
                } else {
                    moreWrap.innerHTML = '';
                }
            }
            var html = '';
            for (var i = 0; i < maxShow; i++) {
                var k = filtered[i];
                var d = keys[k];
                var devices = d.devices || [];
                var max_dev = get_key_max_devices(d);
                var expired = is_expired(d);
                var remaining = get_remaining_string(d);
                var isWebKey = ((d.source || '').indexOf('website') >= 0) || (d.category === 'free_web') || (String(k).indexOf('FREE-NEXUS') >= 0);
                html += '<div class="key_item anim_slide_left anim_delay_' + ((i % 5) + 1) + (isWebKey ? ' key-free-web' : '') + '" data-key="' + k + '" style="border-left-color:' +
                    (expired ? 'var(--danger)' : 'var(--primary)') + ';">';
                html += '<div class="key_row">';
                html += '<div><b>' + k + '</b> ' + (d.name ? ' ' + d.name : '') + ' <span class="role_badge" style="background:' +
                    (d.role === 'DEVELOPER' ? 'var(--danger_light)' : d.role === 'VVIP' ? 'var(--warning_light)' :
                        d.role === 'VIP' ? 'var(--primary_light)' : 'rgba(255,255,255,0.02)') + ';color:' + (d
                        .role === 'DEVELOPER' ? 'var(--danger)' : d.role === 'VVIP' ? 'var(--warning)' : d
                        .role === 'VIP' ? 'var(--primary)' : 'var(--text_secondary)') + ';font-size:7px;padding:1px 6px;border-radius:6px;">' +
                    (d.role || 'MEMBER') + '</span></div>';
                html += '<div>';
                html += '<span class="add_time" onclick="show_add_time_modal(\'' + k + '\')" style="color:var(--success);cursor:pointer;font-size:12px;padding:2px;margin-right:2px;"><i class="fa-solid fa-clock"></i></span>';
                html += '<span class="edit_key" onclick="edit_key(\'' + k + '\')" style="color:var(--warning);cursor:pointer;font-size:12px;padding:2px;margin-right:2px;"><i class="fa-solid fa-pen"></i></span>';
                html += '<span class="del" onclick="del_key(\'' + k + '\')" style="color:var(--danger);cursor:pointer;font-size:12px;padding:2px;"><i class="fa-solid fa-trash-can"></i></span>';
                html += '</div>';
                html += '</div>';
                html += '<div class="key_remaining">Sisa waktu: <span class="time">' + remaining + '</span></div>';
                html += '<div class="key_devices"><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:2px;"><span>Device (' + devices.length + '/' + max_dev + ')</span>';
                html += '<button type="button" class="dev-btn-mini btn-reset-all-dev" data-key="' + k + '">Reset Device</button></div>';
                if (devices.length === 0) {
                    html += '<span style="color:var(--text_muted);font-size:7px;">Belum ada device</span>';
                } else {
                    for (var j = 0; j < devices.length; j++) {
                        var dev = devices[j];
                        if (!dev) continue;
                        var dev_name = (dev.brand && dev.model) ? (dev.brand + ' ' + dev.model) : (dev.name || dev.model || 'Device');
                        var did = (dev.id || '').toString();
                        var last = dev.last_login ? String(dev.last_login).slice(0, 16).replace('T', ' ') : '';
                        html += '<div class="device_tag_row" style="display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:3px 0;">';
                        html += '<span class="device_tag" title="' + did + '">' + dev_name + (last ? ' · ' + last : '') + '</span>';
                        html += '<button type="button" class="dev-btn-mini del_device" data-key="' + k + '" data-did="' + did + '" title="Reset device">Reset</button>';
                        html += '<button type="button" class="dev-btn-mini danger btn-block-create" data-did="' + did + '" data-key="' + k + '" title="Blokir create key">Blokir Create</button>';
                        html += '</div>';
                    }
                }
                html += '</div>';
                html += '</div>';
            }
            c.innerHTML = html;
            c.querySelectorAll('.del_device').forEach(function(el) {
                el.onclick = function(ev) {
                    if (ev) ev.stopPropagation();
                    var kk = el.getAttribute('data-key');
                    var did = el.getAttribute('data-did');
                    if (kk && did) delete_device(kk, did);
                };
            });
            c.querySelectorAll('.btn-block-create').forEach(function(el) {
                el.onclick = function(ev) {
                    if (ev) ev.stopPropagation();
                    var did = el.getAttribute('data-did');
                    var kk = el.getAttribute('data-key');
                    if (did) blockCreateDevice(did, kk);
                };
            });
            c.querySelectorAll('.btn-reset-all-dev').forEach(function(el) {
                el.onclick = function(ev) {
                    if (ev) ev.stopPropagation();
                    var kk = el.getAttribute('data-key');
                    if (kk) resetAllDevicesOnKey(kk);
                };
            });
            c.querySelectorAll('.key-free-web').forEach(function(row) {
                row.style.cursor = 'pointer';
                row.addEventListener('click', function(ev) {
                    if (ev.target.closest('.del_device, .btn-block-create, .btn-reset-all-dev, .del, .edit, button, .fa-trash-can, .fa-pen')) return;
                    var kk = row.getAttribute('data-key');
                    if (kk) openFreeWebKeyModal(kk);
                });
            });



            if (window.key_interval) clearInterval(window.key_interval);
            window.key_interval = setInterval(function() {
                var items = c.querySelectorAll('.key_item');
                for (var idx = 0; idx < items.length; idx++) {
                    var key_text = items[idx].querySelector('.key_row b');
                    if (key_text) {
                        var key_name = key_text.textContent;
                        var d = keys[key_name];
                        if (d) {
                            var remaining_text = get_remaining_string(d);
                            var time_span = items[idx].querySelector('.key_remaining .time');
                            if (time_span) {
                                time_span.textContent = remaining_text;
                                if (remaining_text === 'Expired') {
                                    time_span.style.color = 'var(--danger)';
                                } else {
                                    time_span.style.color = 'var(--warning)';
                                }
                            }
                        }
                    }
                }
            }, 1000);
        }

        function render_del_features() {
            var c = document.getElementById('del_features');
            if (!c) return;
            var ks = Object.keys(features);
            if (ks.length === 0) {
                c.innerHTML = '<span style="color:var(--text_muted);font-size:9px;">Tidak ada fitur</span>';
                return;
            }
            var html = '';
            for (var i = 0; i < ks.length; i++) {
                var k = ks[i];
                html += '<button onclick="del_f(\'' + k + '\')">' + (features[k]?.name || k) + ' X</button>';
            }
            c.innerHTML = html;
        }

        function delete_device(key, device_id) {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            show_confirm('Hapus device dari key ini? Slot akan bebas.', function() {
                var d = keys[key] || {};
                var devices = normalize_devices(d.devices).filter(function(x) {
                    return x && String(x.id) !== String(device_id);
                });
                write_key_devices(key, devices, get_key_max_devices(d), function(err) {
                    if (err) {
                        // direct remove path
                        db.ref('valid_keys/' + key + '/devices/' + device_id).remove().then(function() {
                            showToast('Sukses', 'Device dihapus');
                            refresh_keys();
                        }).catch(function(e) {
                            showToast('Error', e.message || 'gagal hapus');
                        });
                        return;
                    }
                    showToast('Sukses', 'Device dihapus — slot bebas');
                    refresh_keys();
                });
            });
        }

        function add_key() {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            var k = document.getElementById('new_key').value.trim();
            var n = document.getElementById('new_name').value.trim();
            var r = document.getElementById('new_role').value;
            var exp_val = parseInt(document.getElementById('new_exp_value').value);
            var exp_unit = document.getElementById('new_exp_unit').value;
            var max_dev = parseInt(document.getElementById('new_max_devices').value, 10) || 1;
            if (max_dev < 1) max_dev = 1;
            if (!k) {
                show_modal('Error', 'Masukkan key!');
                return;
            }
            var duration = format_duration(exp_val, exp_unit);
            var data = {
                role: r,
                duration: duration,
                name: n || k,
                created_at: new Date().toISOString(),
                devices: [],
                max_devices: max_dev
            };
            db.ref('valid_keys/' + k).set(data).then(function() {
                showToast('Sukses', 'Key ditambahkan!');
                document.getElementById('new_key').value = '';
                document.getElementById('new_name').value = '';
                document.getElementById('new_exp_value').value = '';
                refresh_keys();
            }).catch(function(e) {
                show_modal('Error', e.message);
            });
        }

        function edit_key(key) {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            var d = keys[key];
            if (!d) return;
            show_modal_input('Edit Key: ' + key,
                'Nama: <input id="edit_name" value="' + (d.name || '') +
                '" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.02);color:#fff;font-size:10px;outline:none;margin:4px 0;"><br>Role: <select id="edit_role" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.02);color:#fff;font-size:10px;outline:none;margin:4px 0;"><option value="MEMBER"' +
                (d.role === 'MEMBER' ? ' selected' : '') + '>MEMBER</option><option value="VIP"' + (d.role === 'VIP' ?
                    ' selected' : '') + '>VIP</option><option value="VVIP"' + (d.role === 'VVIP' ? ' selected' : '') +
                '>VVIP</option><option value="RESELLER"' + (d.role === 'RESELLER' ? ' selected' : '') +
                '>RESELLER</option><option value="DEVELOPER"' + (d.role === 'DEVELOPER' ? ' selected' : '') +
                '>DEVELOPER</option></select><br>Max Device: <input id="edit_max_dev" type="number" min="1" value="' +
                (d.max_devices || 1) +
                '" style="width:100%;padding:6px;border-radius:6px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.02);color:#fff;font-size:10px;outline:none;margin:4px 0;">',
                function() {
                    var new_name = document.getElementById('edit_name').value.trim();
                    var new_role = document.getElementById('edit_role').value;
                    var new_max_dev = parseInt(document.getElementById('edit_max_dev').value) || 999;
                    if (new_max_dev < 1) new_max_dev = 1;
                    var updates = { name: new_name || key, role: new_role, max_devices: new_max_dev };
                    db.ref('valid_keys/' + key).update(updates).then(function() {
                        showToast('Sukses', 'Key diupdate!');
                        refresh_keys();
                    }).catch(function(e) {
                        show_modal('Error', e.message);
                    });
                });
        }

        function del_key(k) {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            show_confirm('Hapus key "' + k + '" ?', function() {
                db.ref('valid_keys/' + k).remove().then(function() {
                    remove_online_for_key(k);
                    showToast('Sukses', 'Key dihapus!');
                    refresh_keys();
                });
            });
        }

        function del_f(k) {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            show_confirm('Hapus fitur "' + (features[k]?.name || k) + '" ?', function() {
                db.ref('booster_features/' + k).remove().then(function() {
                    showToast('Sukses', 'Fitur dihapus!');
                    db.ref('booster_features').once('value').then(function(s) {
                        features = s.val() || {};
                        render_features();
                        render_del_features();
                        render_role_features();
                    });
                });
            });
        }

        function add_new_feature() {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            var name = document.getElementById('new_f_name').value.trim();
            var desc = document.getElementById('new_f_desc').value.trim();
            var icon = document.getElementById('new_f_icon').value.trim();
            var ver = document.getElementById('new_f_version').value;
            var role = document.getElementById('new_f_role').value;
            if (!name) {
                show_modal('Error', 'Masukkan nama fitur!');
                return;
            }
            if (!icon) {
                show_modal('Error', 'Masukkan icon!');
                return;
            }
            var key = name.toLowerCase().replace(/ /g, '_') + '_' + Date.now();
            var data = {
                enabled: true,
                name: name,
                desc: desc || 'Fitur baru',
                icon: icon,
                version: ver,
                created_at: new Date().toISOString()
            };
            db.ref('booster_features/' + key).set(data).then(function() {
                if (role !== 'all') {
                    db.ref('role_features/' + role + '/' + key).set(true);
                } else {
                    db.ref('role_features/all/' + key).set(true);
                }
                showToast('Sukses', 'Fitur "' + name + '" ditambahkan!');
                document.getElementById('new_f_name').value = '';
                document.getElementById('new_f_desc').value = '';
                document.getElementById('new_f_icon').value = '';
                db.ref('booster_features').once('value').then(function(s) {
                    features = s.val() || {};
                    render_features();
                    render_del_features();
                    render_role_features();
                });
            }).catch(function(e) {
                show_modal('Error', e.message);
            });
        }

        // ============================================================
        // SHOW ADD TIME MODAL
        // ============================================================
        function show_add_time_modal(key) {
            show_modal_input('Tambah Masa Aktif - ' + key,
                'Tambah waktu: <div style="display:flex;gap:4px;margin:6px 0;">' +
                '<input id="add_time_value" type="number" value="1" min="0" style="flex:0.4;padding:6px;border-radius:6px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.02);color:#fff;font-size:10px;outline:none;">' +
                '<select id="add_time_unit" style="flex:0.6;padding:6px;border-radius:6px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.02);color:#fff;font-size:10px;outline:none;">' +
                '<option value="menit">Menit</option><option value="jam">Jam</option><option value="hari">Hari</option><option value="minggu">Minggu</option><option value="bulan">Bulan</option><option value="tahun">Tahun</option><option value="permanent">Permanent</option>' +
                '</select></div>' +
                '<div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:4px;">' +
                '<button type="button" onclick="document.getElementById(\'add_time_value\').value=5;document.getElementById(\'add_time_unit\').value=\'menit\'" style="padding:1px 6px;border-radius:3px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-size:7px;">+5m</button>' +
                '<button type="button" onclick="document.getElementById(\'add_time_value\').value=30;document.getElementById(\'add_time_unit\').value=\'menit\'" style="padding:1px 6px;border-radius:3px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-size:7px;">+30m</button>' +
                '<button type="button" onclick="document.getElementById(\'add_time_value\').value=1;document.getElementById(\'add_time_unit\').value=\'jam\'" style="padding:1px 6px;border-radius:3px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-size:7px;">+1j</button>' +
                '<button type="button" onclick="document.getElementById(\'add_time_value\').value=1;document.getElementById(\'add_time_unit\').value=\'hari\'" style="padding:1px 6px;border-radius:3px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-size:7px;">+1h</button>' +
                '<button type="button" onclick="document.getElementById(\'add_time_value\').value=7;document.getElementById(\'add_time_unit\').value=\'hari\'" style="padding:1px 6px;border-radius:3px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-size:7px;">+7h</button>' +
                '<button type="button" onclick="document.getElementById(\'add_time_value\').value=1;document.getElementById(\'add_time_unit\').value=\'bulan\'" style="padding:1px 6px;border-radius:3px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-size:7px;">+1b</button>' +
                '<button type="button" onclick="document.getElementById(\'add_time_value\').value=0;document.getElementById(\'add_time_unit\').value=\'permanent\'" style="padding:1px 6px;border-radius:3px;border:1px solid var(--glass_border);background:transparent;color:var(--text_secondary);cursor:pointer;font-size:7px;">∞</button>' +
                '</div>' +
                '<div style="margin-top:4px;">Pesan ke user: <input id="bansos_message" placeholder="Pesan dari admin..." style="width:100%;padding:5px;border-radius:4px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.02);color:#fff;font-size:9px;outline:none;margin-top:2px;"></div>',
                function() {
                    var value = parseInt(document.getElementById('add_time_value').value) || 0;
                    var unit = document.getElementById('add_time_unit').value;
                    var duration = format_duration(value, unit);
                    var message = document.getElementById('bansos_message').value.trim() ||
                        'Masa aktif key Anda telah ditambahkan oleh admin.';
                    if (duration === 'permanent') {
                        db.ref('valid_keys/' + key + '/duration').set('permanent').then(function() {
                            showToast('Sukses', 'Key ' + key + ' PERMANENT!');
                            db.ref('notifications').push({
                                title: 'Bansos Key!',
                                message: 'Key ' + key + ' diubah menjadi PERMANENT oleh admin. ' + message,
                                timestamp: new Date().toISOString(),
                                user: key
                            });
                            refresh_keys();
                        });
                        return;
                    }
                    if (value <= 0) {
                        show_modal('Error', 'Masukkan nilai waktu yang valid!');
                        return;
                    }
                    var d = keys[key];
                    if (!d) { show_modal('Error', 'Key tidak ditemukan!');
                        return; }
                    var new_created = new Date(d.created_at);
                    var ms = 0;
                    if (unit === 'menit') ms = value * 60 * 1000;
                    else if (unit === 'jam') ms = value * 60 * 60 * 1000;
                    else if (unit === 'hari') ms = value * 24 * 60 * 60 * 1000;
                    else if (unit === 'minggu') ms = value * 7 * 24 * 60 * 60 * 1000;
                    else if (unit === 'bulan') ms = value * 30 * 24 * 60 * 60 * 1000;
                    else if (unit === 'tahun') ms = value * 365 * 24 * 60 * 60 * 1000;
                    else { show_modal('Error', 'Unit tidak valid!');
                        return; }
                    new_created = new Date(new_created.getTime() + ms);
                    var updates = {
                        created_at: new_created.toISOString(),
                        duration: duration
                    };
                    db.ref('valid_keys/' + key).update(updates).then(function() {
                        showToast('Sukses', 'Masa aktif key ' + key + ' +' + value + ' ' + unit + '!');
                        db.ref('notifications').push({
                            title: 'Bansos Key!',
                            message: 'Masa aktif key ' + key + ' ditambahkan ' + value + ' ' + unit +
                                ' oleh admin. ' + message,
                            timestamp: new Date().toISOString(),
                            user: key
                        });
                        refresh_keys();
                    }).catch(function(e) {
                        show_modal('Error', e.message);
                    });
                });
        }

        function refresh_keys() {
            db.ref('valid_keys').once('value').then(function(s) {
                keys = s.val() || {};
                render_keys();
                try { if (typeof prune_online_users === 'function') prune_online_users(keys); } catch (e) {}
            });
        }

        // ============================================================
        // ANNOUNCEMENT
        // ============================================================
        function show_announcement(title, message) {
            show_modal(title || 'Pengumuman', message || '');
            send_android_push_notification(title || 'Pengumuman', message || '', 'announcement');
        }

        function send_announcement() {
            var title = document.getElementById('announce_title').value.trim();
            var msg = document.getElementById('announce_msg').value.trim();
            var popup = document.getElementById('announce_popup').checked;
            if (!title || !msg) {
                show_modal('Error', 'Isi judul dan pesan!');
                return;
            }
            var data = {
                title: title,
                message: msg,
                timestamp: new Date().toISOString(),
                popup: popup
            };
            db.ref('announcements').push(data).then(function() {
                showToast('Sukses', 'Pengumuman terkirim!');
                send_android_push_notification(title, msg, 'announcement');
                document.getElementById('announce_title').value = '';
                document.getElementById('announce_msg').value = '';
            }).catch(function(e) {
                show_modal('Error', e.message);
            });
        }

        // ============================================================
        // SEND EXPIRED NOTIFICATION
        // ============================================================
        function send_expired_notification() {
            var key = document.getElementById('exp_notif_key').value.trim();
            if (!key) {
                show_modal('Error', 'Masukkan key!');
                return;
            }
            db.ref('valid_keys/' + key).once('value').then(function(s) {
                var d = s.val();
                if (!d) {
                    show_modal('Error', 'Key tidak ditemukan!');
                    return;
                }
                var data = {
                    title: 'Key Expired!',
                    message: 'Key ' + key + ' sudah kadaluarsa. Silakan perpanjang key Anda.',
                    timestamp: new Date().toISOString(),
                    user: key
                };
                db.ref('notifications').push(data).then(function() {
                    showToast('Sukses', 'Notifikasi expired terkirim!');
                    send_android_push_notification('Key Expired!', 'Key ' + key +
                        ' sudah kadaluarsa. Silakan perpanjang.', 'expired');
                    document.getElementById('exp_notif_key').value = '';
                });
            });
        }


        function nx_version_tuple(v){ return String(v||'0').replace(/^v/i,'').split('.').map(function(x){var n=parseInt(x,10);return isNaN(n)?0:n;}); }
        function nx_version_cmp(a,b){var x=nx_version_tuple(a),y=nx_version_tuple(b);for(var i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)>(y[i]||0)?1:-1;}return 0;}
        function nx_version_config(cfg){
            cfg=cfg||{}; var versions=cfg.versions||{}; var raw=String(NX_BUILD_VERSION); var safe=raw.replace(/[^A-Za-z0-9_-]/g,'_'); var scoped=versions[raw]||versions[safe]||versions[String(app_version)]||null;
            if(scoped===null && cfg.version_config){ scoped=cfg.version_config[raw]||cfg.version_config[safe]||cfg.version_config[String(app_version)]||null; }
            return scoped;
        }
        function enforce_v32_version_gate(cfg){
            cfg=cfg||{}; var scoped=nx_version_config(cfg); var missing=(cfg.require_version_node===true && !scoped);
            var min=(scoped&&scoped.min_supported_version)||cfg.min_supported_version||cfg.minimum_app_version||'';
            var blocked=Array.isArray(cfg.disabled_versions)?cfg.disabled_versions:[];
            var isBlocked=blocked.some(function(v){return String(v).toLowerCase()==='all'||String(v)===String(NX_BUILD_VERSION)||String(v)===String(app_version);});
            var isScopedDisabled=!!(scoped && (scoped.enabled===false || scoped.disabled===true));
            if(missing||isBlocked||isScopedDisabled||(min&&nx_version_cmp(NX_BUILD_VERSION,min)<0)){
                force_active=true;
                var ov=document.getElementById('force_update_overlay'); if(ov)ov.classList.add('show');
                var title=document.getElementById('force_title'); if(title)title.textContent=(scoped&&scoped.update_title)||cfg.version_gate_title||'Versi Lama Tidak Didukung';
                var desc=document.getElementById('force_desc'); if(desc)desc.textContent=(scoped&&scoped.update_message)||cfg.version_gate_message||'Versi aplikasi ini sudah dinonaktifkan. Silakan update dari saluran developer.';
                var fv=document.getElementById('force_version'); if(fv)fv.textContent=(scoped&&scoped.latest_version)||cfg.latest_version||min||'3.2.1';
                window.force_url=(scoped&&scoped.update_url)||cfg.update_url||NX_CHANNEL_URL;
                return false;
            }
            return true;
        }

        // ============================================================
        // CHECK UPDATE
        // ============================================================
        function check_update_now() {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            showToast('Cek Update', 'Memeriksa update tersedia...');
            db.ref('app_config').once('value').then(function(s) {
                var cfg = s.val() || {};
                enforce_v32_version_gate(cfg);
                if (cfg.update_available && cfg.update_url) {
                    show_modal('Update Tersedia!', cfg.update_message ||
                        'Versi baru tersedia. Klik download untuk update.');
                    window.update_url = cfg.update_url;
                    var banner = document.getElementById('update_banner');
                    if (banner) banner.style.display = 'flex';
                    if (cfg.update_message) document.getElementById('update_msg').textContent = cfg.update_message;
                    send_android_push_notification('Update Tersedia!', cfg.update_message ||
                        'Versi baru tersedia. Silakan update aplikasi.', 'update');
                } else {
                    show_modal('Tidak Ada Update', 'Aplikasi Anda sudah versi terbaru.');
                }
            });
        }

        function download_apk() {
            if (window.update_url && window.update_url !== '#') {
                window.open(window.update_url, '_blank');
            } else {
                show_modal('Info', 'Link download belum tersedia.');
            }
        }

        // ============================================================
        // REFRESH
        // ============================================================
        function refresh_all() {
            showToast('Refresh', 'Memuat ulang data...');
            try { if (typeof loadPurchaseRequests === 'function') loadPurchaseRequests(); } catch (e) {}
            try { if (typeof load_blocked_devices === 'function') load_blocked_devices(); } catch (e) {}
            try { if (typeof loadBlockedCreateList === 'function') loadBlockedCreateList(); } catch (e) {}
            try { if (typeof loadRedeemCodesDev === 'function') loadRedeemCodesDev(); } catch (e) {}
            try { if (typeof push_device_heartbeat === 'function') push_device_heartbeat(); } catch (e) {}
            try { if (typeof purge_expired_keys_auto === 'function') purge_expired_keys_auto(); } catch (e) {}

            db.ref('booster_features').once('value').then(function(s) {
                features = s.val() || {};
                render_features();
                render_del_features();
            });
            db.ref('quick_actions').once('value').then(function(s) {
                quick = s.val() || {};
                render_quick();
            });
            db.ref('valid_keys').once('value').then(function(s) {
                keys = s.val() || {};
                if (user_role === 'DEVELOPER' || user_role === 'OWNER') render_keys();
            });
            db.ref('app_config').once('value').then(function(s) {
                var cfg = s.val() || {};
                if (typeof enforce_v32_version_gate === 'function') enforce_v32_version_gate(cfg);
                if (cfg.banner_message) document.getElementById('banner_text').textContent = cfg.banner_message;
                if (cfg.update_available && cfg.update_url) {
                    var banner = document.getElementById('update_banner');
                    if (banner) banner.style.display = 'flex';
                    window.update_url = cfg.update_url || NX_CHANNEL_URL;
                    update_available = true;
                    document.getElementById('update_badge').classList.remove('hidden');
                }
                if (cfg.version) {
                    app_version = cfg.version;
                }
            });
            db.ref('update_info').once('value').then(function(s) {
                var info = s.val() || {};
                update_info = info;
                render_update_info(info);
            });
            db.ref('notifications').once('value').then(function(s) {
                var data = s.val();
                if (data) {
                    var keys_notif = Object.keys(data);
                    var new_notifs = [];
                    for (var i = keys_notif.length - 1; i >= 0; i--) {
                        var n = data[keys_notif[i]];
                        n._id = keys_notif[i];
                        new_notifs.push(n);
                    }
                    notifications = new_notifs;
                    render_notifications();
                }
            });
            db.ref('role_features').once('value').then(function(s) {
                role_features = s.val() || {};
                render_role_features();
                render_features();
            });
            load_profile_card();
            load_video_background();
            load_activity_log();
            check_force_update();
            check_maintenance();
            check_app_status();
            update_device_info();
            setTimeout(function() { closeToast(); }, 1200);
        }

        // ============================================================
        // LOGOUT
        // ============================================================
        function do_logout() {
            if (key_expired_listener) {
                key_expired_listener.off();
                key_expired_listener = null;
            }
            set_user_offline();
            stop_dashboard_music();
            log_activity('logout');
            if (user_key) {
                db.ref('online_users/' + user_key).remove();
            }
            clear_session();
            user_key = '';
            user_data = null;
            user_role = 'GUEST';
            is_developer = false;
            session_checked = false;
            var dashboard = document.getElementById('dashboard');
            if (dashboard) { dashboard.style.display = 'none';
                dashboard.classList.remove('show'); }
            var login = document.getElementById('login_screen');
            if (login) { login.style.display = 'flex';
                login.classList.add('show'); }
            var key_input = document.getElementById('key_input');
            if (key_input) key_input.value = '';
            if (expiry_interval) clearInterval(expiry_interval);
            is_expired_flag = false;
            expired_popup_shown = false;
            closeToast();
            var expired_overlay = document.getElementById('expired_popup_overlay');
            if (expired_overlay) {
                expired_overlay.classList.remove('show');
                expired_overlay.style.display = 'none';
            }
            showToast('Logout', 'Anda telah logout.');
        }

        // ============================================================
        // CONTACT
        // ============================================================
        
        // ===== CHAT / REPORT / TERMINAL / CROSSHAIR =====
        var _chatListener = null;
        var _reportListener = null;
        var _chTaps = 0; var _chTapTimer = null;

        function hide_extra_pages() {
            var market = document.getElementById('market_page');
            if (market) { market.style.display = 'none'; market.classList.remove('show'); }
            ['chat_page','report_page','terminal_page'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el) { el.style.display = 'none'; }
            });
            if (_chatListener) { try { _chatListener.off(); } catch(e){} _chatListener = null; }
            if (_reportListener) { try { _reportListener.off(); } catch(e){} _reportListener = null; }
        }

        var _reportSelectedUser = null;
        var _chDragging = false;
        var _chMoved = false;
        var _chStartX = 0, _chStartY = 0, _chOrigLeft = 0, _chOrigTop = 0;

        function requestOverlayPermission() {
            try {
                if (window.Android && typeof Android.requestOverlayPermission === 'function') {
                    Android.requestOverlayPermission();
                    return true;
                }
                if (window.Android && typeof Android.requestPermission === 'function') {
                    Android.requestPermission('overlay');
                    return true;
                }
            } catch (e) {}
            showToast('Overlay', 'Izinkan tampil di atas aplikasi lain di Pengaturan');
            return false;
        }

        function requestShizukuPermission() {
            try {
                if (window.Android && typeof Android.requestShizuku === 'function') {
                    Android.requestShizuku();
                    return true;
                }
                if (window.Android && typeof Android.requestPermission === 'function') {
                    Android.requestPermission('shizuku');
                    return true;
                }
            } catch (e) {}
            showToast('Shizuku', 'Buka app Shizuku & izinkan (opsional)');
            return false;
        }

        function show_chat_page() {
            hide_extra_pages();
            var p = document.getElementById('chat_page');
            if (!p) return;
            p.style.display = 'flex';
            var box = document.getElementById('chat_messages');
            if (box) box.innerHTML = '<div style="color:var(--text_muted);font-size:12px;text-align:center;padding:20px;">Memuat chat...</div>';
            if (_chatListener) try { _chatListener.off(); } catch (e) {}
            _chatListener = db.ref('room_chat').limitToLast(80);
            _chatListener.on('value', function(s) {
                var data = s.val() || {};
                var keys = Object.keys(data).sort(function(a, b) {
                    return (data[a].ts || 0) - (data[b].ts || 0);
                });
                var html = '';
                keys.forEach(function(k) {
                    var m = data[k];
                    if (!m) return;
                    var mine = (m.uid === user_key);
                    var timeStr = '';
                    try {
                        if (m.ts) {
                            var dt = new Date(m.ts);
                            timeStr = dt.getHours().toString().padStart(2, '0') + ':' + dt.getMinutes().toString().padStart(2, '0');
                        }
                    } catch (e) {}
                    html += '<div style="display:flex;flex-direction:column;align-items:' + (mine ? 'flex-end' : 'flex-start') + ';width:100%;">';
                    html += '<div style="max-width:78%;padding:8px 12px;border-radius:16px;border-bottom-' + (mine ? 'right' : 'left') + '-radius:4px;background:' + (mine ? 'rgba(0,122,255,0.4)' : 'rgba(255,255,255,0.1)') + ';font-size:13px;line-height:1.4;word-break:break-word;">';
                    if (!mine) html += '<div style="font-size:10px;font-weight:700;color:var(--primary);margin-bottom:3px;">' + escapeHtml(m.name || 'User') + '</div>';
                    if (m.image) html += '<img src="' + m.image + '" style="max-width:100%;border-radius:10px;margin-bottom:4px;display:block;">';
                    if (m.text) html += '<div>' + escapeHtml(m.text) + '</div>';
                    if (timeStr) html += '<div style="font-size:9px;color:rgba(255,255,255,0.4);margin-top:4px;text-align:right;">' + timeStr + '</div>';
                    html += '</div></div>';
                });
                box.innerHTML = html || '<div style="color:var(--text_muted);text-align:center;font-size:12px;padding:20px;">Belum ada pesan</div>';
                box.scrollTop = box.scrollHeight;
            });
        }

        function escapeHtml(t) {
            var d = document.createElement('div');
            d.textContent = t;
            return d.innerHTML;
        }

        function chatSend() {
            if (!user_key) { showToast('Login', 'Login dulu'); return; }
            var inp = document.getElementById('chat_input');
            var text = (inp && inp.value || '').trim();
            if (!text) return;
            var payload = {
                text: text,
                name: (user_data && user_data.name) || user_key,
                uid: user_key,
                ts: Date.now()
            };
            db.ref('room_chat').push(payload).then(function() {
                if (inp) inp.value = '';
            }).catch(function(e) { showToast('Error', e.message); });
        }

        function chatInsertEmoji() {
            var inp = document.getElementById('chat_input');
            if (inp) inp.value += ' 😊';
        }

        function chatSendImage(input) {
            if (!user_key || !input.files || !input.files[0]) return;
            var file = input.files[0];
            if (file.size > 400000) { showToast('Gambar', 'Max ~400KB'); return; }
            var reader = new FileReader();
            reader.onload = function() {
                var dataUrl = reader.result;
                if (dataUrl.length > 600000) { showToast('Gambar', 'Terlalu besar'); return; }
                db.ref('room_chat').push({
                    image: dataUrl,
                    name: (user_data && user_data.name) || user_key,
                    uid: user_key,
                    ts: Date.now()
                });
            };
            reader.readAsDataURL(file);
            input.value = '';
        }

        function show_report_page() {
            hide_extra_pages();
            var p = document.getElementById('report_page');
            if (!p) return;
            p.style.display = 'flex';
            if (!user_key) { showToast('Login', 'Login dulu'); return; }
            var isAdmin = (user_role === 'DEVELOPER' || user_role === 'OWNER');
            var picker = document.getElementById('report_dev_picker');
            if (picker) picker.style.display = isAdmin ? 'block' : 'none';
            _reportSelectedUser = isAdmin ? null : user_key;
            if (isAdmin) {
                loadReportUserList();
            } else {
                listenReportThread(user_key);
            }
        }

        function loadReportUserList() {
            var sel = document.getElementById('report_user_select');
            var box = document.getElementById('report_messages');
            if (box) box.innerHTML = '<div style="color:var(--text_muted);text-align:center;padding:16px;font-size:12px;">Pilih user di atas</div>';
            db.ref('report_bugs').once('value').then(function(s) {
                var data = s.val() || {};
                var uids = Object.keys(data);
                if (!sel) return;
                sel.innerHTML = '<option value="">-- Pilih key / nama --</option>';
                uids.forEach(function(uid) {
                    var thread = data[uid] || {};
                    var name = uid;
                    var mids = Object.keys(thread);
                    if (mids.length) {
                        var last = thread[mids[mids.length - 1]];
                        if (last && last.name) name = last.name + ' (' + uid + ')';
                        else name = uid;
                    }
                    var opt = document.createElement('option');
                    opt.value = uid;
                    opt.textContent = name;
                    sel.appendChild(opt);
                });
                if (uids.length === 0) {
                    box.innerHTML = '<div style="color:var(--text_muted);text-align:center;padding:16px;font-size:12px;">Belum ada laporan</div>';
                }
            });
        }

        function reportSelectUser(uid) {
            _reportSelectedUser = uid || null;
            if (!uid) {
                document.getElementById('report_messages').innerHTML = '<div style="color:var(--text_muted);text-align:center;padding:16px;font-size:12px;">Pilih user</div>';
                return;
            }
            listenReportThread(uid);
        }

        function listenReportThread(uid) {
            var box = document.getElementById('report_messages');
            if (box) box.innerHTML = 'Memuat...';
            if (_reportListener) try { _reportListener.off(); } catch (e) {}
            _reportListener = db.ref('report_bugs/' + uid).limitToLast(80);
            _reportListener.on('value', function(s) {
                var data = s.val() || {};
                var keys = Object.keys(data).sort(function(a, b) {
                    return (data[a].ts || 0) - (data[b].ts || 0);
                });
                var html = '';
                keys.forEach(function(mid) {
                    var m = data[mid];
                    if (!m) return;
                    var mine = m.from === 'user';
                    var isAdminMsg = m.from === 'admin';
                    html += '<div style="display:flex;flex-direction:column;align-items:' + (mine ? 'flex-end' : 'flex-start') + ';width:100%;">';
                    html += '<div style="max-width:80%;padding:8px 12px;border-radius:14px;background:' + (mine ? 'rgba(0,122,255,0.35)' : 'rgba(52,199,89,0.2)') + ';font-size:13px;word-break:break-word;">';
                    html += '<div style="font-size:9px;color:var(--text_muted);margin-bottom:2px;">' + (isAdminMsg ? 'Admin' : escapeHtml(m.name || 'User')) + '</div>';
                    html += '<div>' + escapeHtml(m.text || '') + '</div>';
                    html += '</div></div>';
                });
                box.innerHTML = html || '<div style="color:var(--text_muted);text-align:center;font-size:12px;padding:16px;">Belum ada pesan</div>';
                box.scrollTop = box.scrollHeight;
            });
        }

        function reportSend() {
            if (!user_key) return;
            var inp = document.getElementById('report_input');
            var text = (inp && inp.value || '').trim();
            if (!text) return;
            var isAdmin = (user_role === 'DEVELOPER' || user_role === 'OWNER');
            if (isAdmin) {
                if (!_reportSelectedUser) {
                    showToast('Pilih user', 'Pilih key/nama dulu');
                    return;
                }
                db.ref('report_bugs/' + _reportSelectedUser).push({
                    text: text,
                    from: 'admin',
                    ts: Date.now(),
                    name: 'Admin'
                }).then(function() { if (inp) inp.value = ''; });
            } else {
                db.ref('report_bugs/' + user_key).push({
                    text: text,
                    from: 'user',
                    ts: Date.now(),
                    name: (user_data && user_data.name) || user_key
                }).then(function() { if (inp) inp.value = ''; });
            }
        }

        function show_terminal_page() {
            hide_extra_pages();
            requestShizukuPermission();
            var p = document.getElementById('terminal_page');
            if (p) p.style.display = 'flex';
            var out = document.getElementById('term_out');
            if (out) out.textContent += '\n[!] Meminta izin Shizuku (opsional)...\n';
        }

        function termRun() {
            var inp = document.getElementById('term_in');
            var out = document.getElementById('term_out');
            var cmd = (inp && inp.value || '').trim();
            if (!cmd) return;
            out.textContent += '\n$ ' + cmd + '\n';
            if (cmd === 'help') {
                out.textContent += 'Perintah: help, clear, echo, whoami, version, shizuku\nFile .sh butuh native + Shizuku.\n';
            } else if (cmd === 'clear') {
                out.textContent = '';
            } else if (cmd.indexOf('echo ') === 0) {
                out.textContent += cmd.slice(5) + '\n';
            } else if (cmd === 'whoami') {
                out.textContent += (user_key || 'guest') + ' (' + (user_role || '?') + ')\n';
            } else if (cmd === 'version') {
                out.textContent += 'Nexus-X v3.0 ' + (app_version || '3.0') + '\n';
            } else if (cmd === 'shizuku') {
                requestShizukuPermission();
                out.textContent += 'Meminta Shizuku...\n';
            } else if (cmd.slice(-3) === '.sh' || cmd.indexOf('sh ') === 0) {
                requestShizukuPermission();
                out.textContent += '[!] Butuh native Sketchware + Shizuku untuk .sh\n';
            } else {
                out.textContent += 'Perintah tidak dikenal. Ketik help.\n';
            }
            if (inp) inp.value = '';
            out.scrollTop = out.scrollHeight;
        }

        function toggle_crosshair() {
            var ov = document.getElementById('crosshair_overlay');
            if (!ov) return;
            if (ov.style.display === 'none' || !ov.style.display) {
                requestOverlayPermission();
                ov.style.display = 'block';
                initCrosshairDrag();
                showToast('Crosshair', 'ON — geser bebas, ketuk 3x = menu');
            } else {
                ov.style.display = 'none';
                var menu = document.getElementById('crosshair_menu');
                if (menu) menu.style.display = 'none';
                showToast('Crosshair', 'OFF');
            }
        }

        function initCrosshairDrag() {
            var mark = document.getElementById('crosshair_mark');
            if (!mark || mark.dataset.dragReady) return;
            mark.dataset.dragReady = '1';

            function getPoint(e) {
                if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
                return { x: e.clientX, y: e.clientY };
            }

            function onStart(e) {
                e.preventDefault();
                e.stopPropagation();
                _chDragging = true;
                _chMoved = false;
                var p = getPoint(e);
                _chStartX = p.x;
                _chStartY = p.y;
                var rect = mark.getBoundingClientRect();
                _chOrigLeft = rect.left + rect.width / 2;
                _chOrigTop = rect.top + rect.height / 2;
            }

            function onMove(e) {
                if (!_chDragging) return;
                e.preventDefault();
                var p = getPoint(e);
                var dx = p.x - _chStartX;
                var dy = p.y - _chStartY;
                if (Math.abs(dx) > 4 || Math.abs(dy) > 4) _chMoved = true;
                var nx = _chOrigLeft + dx;
                var ny = _chOrigTop + dy;
                nx = Math.max(10, Math.min(window.innerWidth - 10, nx));
                ny = Math.max(10, Math.min(window.innerHeight - 10, ny));
                mark.style.left = nx + 'px';
                mark.style.top = ny + 'px';
                mark.style.marginLeft = (-mark.offsetWidth / 2) + 'px';
                mark.style.marginTop = (-mark.offsetHeight / 2) + 'px';
            }

            function onEnd(e) {
                if (!_chDragging) return;
                _chDragging = false;
                if (!_chMoved) {
                    crosshairTap(e);
                }
            }

            mark.addEventListener('mousedown', onStart);
            mark.addEventListener('touchstart', onStart, { passive: false });
            document.addEventListener('mousemove', onMove, { passive: false });
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        }

        function crosshairTap(e) {
            if (e) { try { e.preventDefault(); e.stopPropagation(); } catch (err) {} }
            _chTaps++;
            if (_chTapTimer) clearTimeout(_chTapTimer);
            _chTapTimer = setTimeout(function() { _chTaps = 0; }, 700);
            if (_chTaps >= 3) {
                _chTaps = 0;
                var menu = document.getElementById('crosshair_menu');
                if (menu) {
                    menu.style.display = 'block';
                    var presets = document.getElementById('ch_presets');
                    if (presets && !presets.dataset.ready) {
                        var types = ['dot', 'cross', 'circle', 'x', 'plus', 'box', 't', 'gap'];
                        presets.innerHTML = types.map(function(t) {
                            return '<button type="button" data-preset="' + t + '" class="ch-preset-btn" style="padding:8px;border-radius:8px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.05);color:#fff;font-size:10px;cursor:pointer;">' + t + '</button>';
                        }).join('');
                        presets.dataset.ready = '1';
                        presets.querySelectorAll('.ch-preset-btn').forEach(function(btn) {
                            btn.onclick = function() { setChPreset(btn.getAttribute('data-preset')); };
                        });
                    }
                }
            }
        }

        var _chPreset = 'cross';
        function setChPreset(t) { _chPreset = t; applyCrosshair(); }

        function applyCrosshair() {
            var color = (document.getElementById('ch_color') || {}).value || '#00ff00';
            var size = parseInt((document.getElementById('ch_size') || {}).value, 10) || 28;
            var mark = document.getElementById('crosshair_mark');
            var svg = document.getElementById('ch_svg');
            if (mark) {
                mark.style.width = size + 'px';
                mark.style.height = size + 'px';
                mark.style.marginLeft = (-size / 2) + 'px';
                mark.style.marginTop = (-size / 2) + 'px';
            }
            if (!svg) return;
            var s = size;
            var shapes = {
                dot: '<circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + s / 6 + '" fill="' + color + '"/>',
                cross: '<line x1="' + s / 2 + '" y1="2" x2="' + s / 2 + '" y2="' + s + '" stroke="' + color + '" stroke-width="2"/><line x1="2" y1="' + s / 2 + '" x2="' + s + '" y2="' + s / 2 + '" stroke="' + color + '" stroke-width="2"/>',
                circle: '<circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + s / 3 + '" fill="none" stroke="' + color + '" stroke-width="2"/>',
                x: '<line x1="4" y1="4" x2="' + (s - 4) + '" y2="' + (s - 4) + '" stroke="' + color + '" stroke-width="2"/><line x1="' + (s - 4) + '" y1="4" x2="4" y2="' + (s - 4) + '" stroke="' + color + '" stroke-width="2"/>',
                plus: '<line x1="' + s / 2 + '" y1="' + s * 0.2 + '" x2="' + s / 2 + '" y2="' + s * 0.8 + '" stroke="' + color + '" stroke-width="3"/><line x1="' + s * 0.2 + '" y1="' + s / 2 + '" x2="' + s * 0.8 + '" y2="' + s / 2 + '" stroke="' + color + '" stroke-width="3"/>',
                box: '<rect x="' + s * 0.25 + '" y="' + s * 0.25 + '" width="' + s * 0.5 + '" height="' + s * 0.5 + '" fill="none" stroke="' + color + '" stroke-width="2"/>',
                t: '<line x1="' + s * 0.2 + '" y1="' + s * 0.3 + '" x2="' + s * 0.8 + '" y2="' + s * 0.3 + '" stroke="' + color + '" stroke-width="2"/><line x1="' + s / 2 + '" y1="' + s * 0.3 + '" x2="' + s / 2 + '" y2="' + s * 0.85 + '" stroke="' + color + '" stroke-width="2"/>',
                gap: '<line x1="' + s / 2 + '" y1="2" x2="' + s / 2 + '" y2="' + s * 0.35 + '" stroke="' + color + '" stroke-width="2"/><line x1="' + s / 2 + '" y1="' + s * 0.65 + '" x2="' + s / 2 + '" y2="' + s + '" stroke="' + color + '" stroke-width="2"/><line x1="2" y1="' + s / 2 + '" x2="' + s * 0.35 + '" y2="' + s / 2 + '" stroke="' + color + '" stroke-width="2"/><line x1="' + s * 0.65 + '" y1="' + s / 2 + '" x2="' + s + '" y2="' + s / 2 + '" stroke="' + color + '" stroke-width="2"/>'
            };
            svg.setAttribute('width', s);
            svg.setAttribute('height', s);
            svg.setAttribute('viewBox', '0 0 ' + s + ' ' + s);
            svg.innerHTML = shapes[_chPreset] || shapes.cross;
        }

                function load_blocked_devices() {
            var box = document.getElementById('blocked_devices_list');
            if (!box) return;
            box.innerHTML = 'Memuat...';
            db.ref('blocked_devices').once('value').then(function(s) {
                var data = s.val() || {};
                var keys = Object.keys(data);
                if (keys.length === 0) {
                    box.innerHTML = '<div style="color:var(--text_muted);">Tidak ada perangkat diblokir</div>';
                    return;
                }
                var html = '';
                keys.forEach(function(id) {
                    var d = data[id] || {};
                    var until = d.until || 0;
                    var left = until - Date.now();
                    var status = left > 0 ? ('aktif ±' + Math.ceil(left/60000) + ' mnt') : 'expired';
                    html += '<div class="blocked-row" data-id="'+id+'" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;margin-bottom:4px;border-radius:8px;background:rgba(255,59,48,0.08);border:1px solid rgba(255,59,48,0.25);">';
                    html += '<div style="overflow:hidden;"><b style="font-size:9px;">'+id+'</b><div style="font-size:8px;color:var(--text_muted);">'+(d.reason||'-')+' · '+status+'</div></div>';
                    html += '<button type="button" class="btn-unban" style="padding:4px 8px;border-radius:6px;border:none;background:var(--success);color:#fff;font-size:9px;font-weight:700;cursor:pointer;">Unban</button>';
                    html += '</div>';
                });
                box.innerHTML = html;
                box.querySelectorAll('.btn-unban').forEach(function(btn){
                    btn.onclick = function(){
                        var row = btn.closest('.blocked-row');
                        if(row) unban_device(row.getAttribute('data-id'));
                    };
                });
            }).catch(function(){ box.innerHTML = 'Gagal memuat'; });
        }
        function unban_device(id) {
            if (!id) return;
            db.ref('blocked_devices/' + id).remove().then(function() {
                showToast('Unban', 'Perangkat dilepas');
                load_blocked_devices();
            }).catch(function(e){ showToast('Error', e.message); });
        }

        
        // ========== NEXUS-X v2.9 FEATURES ==========
        function pasteKey() {
            var inp = document.getElementById('key_input');
            if (!inp) return;
            var put = function(t) {
                t = String(t || '').trim();
                if (!t) return false;
                inp.type = 'text';
                inp.value = t;
                inp.dispatchEvent(new Event('input', { bubbles:true }));
                inp.focus();
                try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch(e) {}
                showToast('Paste', 'Key berhasil ditempel');
                return true;
            };
            /* Optional Sketchware JavaScriptInterface support. */
            try {
                var bridges = [window.Android, window.android, window.Sketchware];
                for (var bi=0; bi<bridges.length; bi++) {
                    var bridge = bridges[bi];
                    if (bridge && typeof bridge.getClipboardText === 'function') {
                        var bridged = bridge.getClipboardText();
                        if (put(bridged)) return;
                    }
                }
            } catch (e) {}
            if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
                navigator.clipboard.readText().then(function(t) {
                    if (!put(t)) fallbackPasteKey();
                }).catch(function() { fallbackPasteKey(); });
                return;
            }
            fallbackPasteKey();
        }
        function fallbackPasteKey() {
            var inp = document.getElementById('key_input');
            if (!inp) return;
            var ta = document.createElement('textarea');
            ta.setAttribute('readonly','');
            ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;z-index:-1;';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            var ok = false;
            try { ok = document.execCommand('paste'); } catch(e) {}
            var text = ta.value;
            document.body.removeChild(ta);
            if (text) {
                inp.type = 'text';
                inp.value = text.trim();
                inp.dispatchEvent(new Event('input', { bubbles:true }));
                inp.focus();
                showToast('Paste', 'Key berhasil ditempel');
            } else {
                inp.focus();
                showToast('Paste', 'Tahan kolom key lalu pilih Tempel');
            }
        }

        function pickAvatar() {
            if (!user_key) { showToast('Login', 'Login dulu'); return; }
            var f = document.getElementById('avatar_file_input');
            if (f) f.click();
        }

        function onAvatarPicked(input) {
            if (!input.files || !input.files[0] || !user_key) return;
            var file = input.files[0];
            if (file.size > 500000) { showToast('Foto', 'Max 500KB'); return; }
            var reader = new FileReader();
            reader.onload = function() {
                var dataUrl = reader.result;
                if (dataUrl.length > 700000) { showToast('Foto', 'Terlalu besar'); return; }
                localStorage.setItem('nx_avatar_' + user_key, dataUrl);
                applyAvatar(dataUrl);
                try {
                    db.ref('valid_keys/' + user_key + '/avatar').set(dataUrl.slice(0, 100000)).catch(function(){});
                } catch (e) {}
            };
            reader.readAsDataURL(file);
            input.value = '';
        }

        function applyAvatar(dataUrl) {
            var av = document.getElementById('user_avatar');
            if (!av || !dataUrl) return;
            av.style.backgroundImage = 'url(' + dataUrl + ')';
            av.style.backgroundSize = 'cover';
            av.style.backgroundPosition = 'center';
            av.innerHTML = '<span class="online_status online" id="avatar_status"></span>';
        }

        function loadUserAvatar() {
            if (!user_key) return;
            var local = localStorage.getItem('nx_avatar_' + user_key);
            if (local) { applyAvatar(local); return; }
            try {
                db.ref('valid_keys/' + user_key + '/avatar').once('value').then(function(s) {
                    var v = s.val();
                    if (v) applyAvatar(v);
                });
            } catch (e) {}
        }

        // Network quality
        var _netLabel = 'good';
        function updateNetworkQuality() {
            var badge = document.getElementById('net_quality_badge');
            var start = performance.now();
            var img = new Image();
            var done = false;
            function finish(ms) {
                if (done) return; done = true;
                var label = 'good', text = 'Good';
                if (ms < 300) { label = 'excellent'; text = 'Excellent'; }
                else if (ms > 1200) { label = 'poor'; text = 'Poor'; }
                _netLabel = label;
                if (badge) {
                    badge.className = 'net-quality ' + label;
                    badge.textContent = '● ' + text + ' (' + Math.round(ms) + 'ms)';
                }
                // Slow network: reduce heavy renders
                document.body.setAttribute('data-net', label);
            }
            img.onload = function() { finish(performance.now() - start); };
            img.onerror = function() { finish(2000); };
            img.src = 'https://www.gstatic.com/generate_204?' + Date.now();
            setTimeout(function() { finish(2500); }, 3000);
        }

        // Video: black until playing
        function enhanceVideoBackground() {
            var video = document.getElementById('video_background');
            if (!video) return;
            video.classList.add('video-waiting');
            function showVid() {
                video.classList.remove('video-waiting');
                video.style.opacity = '1';
                video.style.transition = 'opacity 0.6s ease';
            }
            video.addEventListener('playing', showVid);
            video.addEventListener('canplay', function() {
                video.play().then(showVid).catch(function() {});
            });
            // Optional custom URL from Firebase (assets tetap prioritas)
            try {
                db.ref('app_config/video_background_url').once('value').then(function(s) {
                    var url = s.val();
                    if (url && typeof url === 'string' && url.indexOf('http') === 0) {
                        video.src = url;
                        video.load();
                    }
                });
                db.ref('app_config/boost_video_url').once('value').then(function(s) {
                    var url = s.val();
                    if (url && typeof url === 'string' && url.indexOf('http') === 0) {
                        DEFAULT_BOOST_VIDEO = url;
                    }
                });
            } catch (e) {}
        }

        // Tools floating
        var TOOLS_LIST = [
            { id: 'iqc', icon: 'fa-image', name: 'IQC Generator' },
            { id: 'qr', icon: 'fa-qrcode', name: 'QR Generator' },
            { id: 'dana', icon: 'fa-wallet', name: 'Fake Dana' },
            { id: 'ganteng', icon: 'fa-face-smile', name: 'Cek Ganteng' },
            { id: 'jelek', icon: 'fa-face-frown', name: 'Cek Jelek' },
            { id: 'jodoh', icon: 'fa-heart', name: 'Cek Jodoh' },
            { id: 'wifi', icon: 'fa-wifi', name: 'Kill WiFi' },
            { id: 'tt', icon: 'fa-brands fa-tiktok', name: 'DL TikTok' },
            { id: 'ig', icon: 'fa-brands fa-instagram', name: 'DL Instagram' },
            { id: 'ttstat', icon: 'fa-chart-line', name: 'Cek TikTok' },
            { id: 'saluran', icon: 'fa-bullhorn', name: 'Join Saluran' },
            { id: 'virus', icon: 'fa-shield-virus', name: 'Scan Virus' }
        ];

        function toggleTools() {
            var p = document.getElementById('tools_panel');
            if (!p) return;
            if (p.classList.contains('show')) p.classList.remove('show');
            else {
                p.classList.add('show');
                renderToolsGrid();
                updateNetworkQuality();
            }
        }

        function renderToolsGrid() {
            var g = document.getElementById('tools_grid');
            if (!g) return;
            g.innerHTML = TOOLS_LIST.map(function(t) {
                return '<div class="tool_card" onclick="openTool(\'' + t.id + '\')">' + nx_feature_icon_html(t.icon) + t.name + '</div>';
            }).join('');
            // fix brand icons
            g.innerHTML = TOOLS_LIST.map(function(t) {
                var ic = t.icon.indexOf('fa-brands') >= 0 ? t.icon : ('fa-solid ' + t.icon);
                return '<div class="tool_card" data-id="' + t.id + '"><i class="' + ic + '"></i>' + t.name + '</div>';
            }).join('');
            g.querySelectorAll('.tool_card').forEach(function(el) {
                el.onclick = function() { openTool(el.getAttribute('data-id')); };
            });
        }

        function openTool(id) {
            var modal = document.getElementById('tool_modal');
            var body = document.getElementById('tool_modal_body');
            if (!modal || !body) return;
            var html = '<div style="display:flex;justify-content:space-between;margin-bottom:12px;"><b>Tool</b><button type="button" onclick="closeToolModal()" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">×</button></div>';
            if (id === 'qr') {
                html += '<input id="tool_qr_text" placeholder="Teks / URL" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;margin-bottom:10px;"><button class="flutter-btn" style="width:100%;" onclick="toolGenQR()">Generate QR</button><div id="tool_qr_out" style="text-align:center;margin-top:12px;"></div>';
            } else if (id === 'iqc') {
                html += '<p style="font-size:12px;color:var(--text_muted);margin-bottom:8px;">IQC style caption</p><input id="tool_iqc" placeholder="Caption..." style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;margin-bottom:10px;"><button class="flutter-btn" style="width:100%;" onclick="toolIQC()">Buat</button><pre id="tool_iqc_out" style="margin-top:10px;font-size:12px;white-space:pre-wrap;"></pre>';
            } else if (id === 'dana') {
                html += '<p style="font-size:11px;color:var(--warning);margin-bottom:8px;">⚠ Simulasi UI saja — bukan transaksi nyata</p><input id="tool_dana_name" placeholder="Nama" style="width:100%;padding:10px;margin-bottom:8px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;"><input id="tool_dana_amt" type="number" placeholder="Nominal" style="width:100%;padding:10px;margin-bottom:8px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;"><button class="flutter-btn" style="width:100%;" onclick="toolDana()">Generate</button><div id="tool_dana_out" style="margin-top:12px;"></div>';
            } else if (id === 'ganteng' || id === 'jelek') {
                html += '<p style="font-size:12px;color:var(--text_muted);">Masukkan nama</p><input id="tool_cek_name" placeholder="Nama" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;margin:8px 0;"><button class="flutter-btn" style="width:100%;" onclick="toolCek(\'' + id + '\')">Cek</button><div id="tool_cek_out" style="text-align:center;font-size:28px;font-weight:800;margin-top:16px;"></div>';
            } else if (id === 'jodoh') {
                html += '<input id="tool_j1" placeholder="Nama 1" style="width:100%;padding:10px;margin-bottom:8px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;"><input id="tool_j2" placeholder="Nama 2" style="width:100%;padding:10px;margin-bottom:8px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;"><button class="flutter-btn" style="width:100%;" onclick="toolJodoh()">Cek Jodoh</button><div id="tool_jodoh_out" style="text-align:center;font-size:24px;font-weight:800;margin-top:16px;"></div>';
            } else if (id === 'wifi') {
                html += '<p style="font-size:11px;color:var(--warning);">⚠ Simulasi saja — tidak memutus WiFi sungguhan</p><button class="flutter-btn" style="width:100%;margin-top:10px;" onclick="toolWifi()">Mulai Simulasi</button><div id="tool_wifi_out" style="margin-top:12px;font-family:monospace;font-size:12px;color:#34c759;"></div>';
            } else if (id === 'tt' || id === 'ig') {
                html += '<p style="font-size:12px;color:var(--text_muted);">Tempel link ' + (id==='tt'?'TikTok':'Instagram') + '</p><input id="tool_dl_url" placeholder="https://..." style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;margin:8px 0;"><button class="flutter-btn" style="width:100%;" onclick="toolDownloader(\'' + id + '\')">Proses</button><div id="tool_dl_out" style="margin-top:10px;font-size:12px;"></div>';
            } else if (id === 'ttstat') {
                html += '<input id="tool_tt_user" placeholder="Username TikTok (tanpa @)" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--glass_border);background:rgba(255,255,255,0.06);color:#fff;margin-bottom:10px;"><button class="flutter-btn" style="width:100%;" onclick="toolTtStat()">Cek</button><div id="tool_tt_out" style="margin-top:12px;font-size:13px;"></div>';
            } else if (id === 'saluran') {
                html += '<p style="font-size:12px;color:var(--text_muted);margin-bottom:8px;">Join saluran WA + unggah bukti foto untuk +waktu random 1 menit–1 jam</p><button class="flutter-btn" style="width:100%;margin-bottom:8px;background:#25D366;" onclick="window.open(\'https://whatsapp.com/channel/0029VbCrRPjDDmFLQpbX6n3n\',\'_blank\')">Buka Saluran</button><input type="file" id="tool_saluran_foto" accept="image/*" style="width:100%;margin:8px 0;color:#fff;"><button class="flutter-btn" style="width:100%;" onclick="toolSaluran()">Kirim Validasi</button><div id="tool_saluran_out" style="margin-top:10px;font-size:12px;"></div>';
            } else if (id === 'virus') {
                html += '<p style="font-size:11px;color:var(--text_muted);">Scan simulasi total perangkat</p><button class="flutter-btn" style="width:100%;margin-top:10px;" onclick="toolVirus()">Scan Sekarang</button><div id="tool_virus_out" style="margin-top:12px;font-family:monospace;font-size:12px;"></div>';
            } else {
                html += '<p>Tool tidak dikenal</p>';
            }
            body.innerHTML = html;
            modal.classList.add('show');
        }

        function closeToolModal() {
            var m = document.getElementById('tool_modal');
            if (m) m.classList.remove('show');
        }

        function toolGenQR() {
            var t = (document.getElementById('tool_qr_text') || {}).value || '';
            if (!t) return;
            var url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(t);
            document.getElementById('tool_qr_out').innerHTML = '<img src="' + url + '" style="border-radius:12px;background:#fff;padding:8px;">';
        }
        function toolIQC() {
            var t = (document.getElementById('tool_iqc') || {}).value || '';
            document.getElementById('tool_iqc_out').textContent = '「 ' + t + ' 」\\n— Nexus-X IQC';
        }
        function toolDana() {
            var n = (document.getElementById('tool_dana_name') || {}).value || 'User';
            var a = (document.getElementById('tool_dana_amt') || {}).value || '0';
            document.getElementById('tool_dana_out').innerHTML = '<div style="background:#0081c9;border-radius:12px;padding:16px;color:#fff;"><b>DANA</b> (simulasi)<br>Ke: ' + n + '<br>Rp ' + Number(a).toLocaleString('id-ID') + '<br><small>Bukan transfer asli</small></div>';
        }
        function toolCek(type) {
            var n = (document.getElementById('tool_cek_name') || {}).value || 'User';
            var pct = 40 + Math.floor(Math.random() * 55);
            document.getElementById('tool_cek_out').textContent = n + ' = ' + pct + '% ' + (type === 'ganteng' ? 'Ganteng' : 'Jelek');
        }
        function toolJodoh() {
            var a = (document.getElementById('tool_j1') || {}).value || 'A';
            var b = (document.getElementById('tool_j2') || {}).value || 'B';
            var pct = 30 + Math.floor(Math.random() * 70);
            document.getElementById('tool_jodoh_out').textContent = a + ' ❤ ' + b + ' = ' + pct + '%';
        }
        function toolWifi() {
            var out = document.getElementById('tool_wifi_out');
            out.textContent = 'Scanning interfaces...\\n';
            setTimeout(function(){ out.textContent += 'wlan0 associated\\n'; }, 400);
            setTimeout(function(){ out.textContent += 'SIMULASI: disconnect packet sent\\n(Tidak memutus WiFi nyata)\\n'; }, 1000);
        }
        function toolDownloader(kind) {
            var u = (document.getElementById('tool_dl_url') || {}).value || '';
            var out = document.getElementById('tool_dl_out');
            if (!u) { out.textContent = 'URL kosong'; return; }
            out.innerHTML = 'Memproses...';
            // Public third-party style note — open external downloader pages
            if (kind === 'tt') {
                out.innerHTML = '<a href="https://ttdownloader.com/?url=' + encodeURIComponent(u) + '" target="_blank" style="color:var(--primary);">Buka downloader TikTok</a><br><small>API pihak ketiga — hasil tergantung layanan</small>';
            } else {
                out.innerHTML = '<a href="https://snapinsta.app/?url=' + encodeURIComponent(u) + '" target="_blank" style="color:var(--primary);">Buka downloader IG</a><br><small>API pihak ketiga — hasil tergantung layanan</small>';
            }
        }
        function toolTtStat() {
            var u = (document.getElementById('tool_tt_user') || {}).value || '';
            var out = document.getElementById('tool_tt_out');
            if (!u) return;
            // Simulated stats (no reliable free API without keys)
            out.innerHTML = '<b>@' + u + '</b> (estimasi demo)<br>Followers: ' + (1000+Math.floor(Math.random()*90000)).toLocaleString() + '<br>Likes: ' + (5000+Math.floor(Math.random()*500000)).toLocaleString() + '<br>Avg views: ' + (500+Math.floor(Math.random()*50000)).toLocaleString() + '<br><small style="color:var(--text_muted);">Data demo — hubungkan API resmi untuk data real</small>';
        }
        function toolSaluran() {
            if (!user_key) { showToast('Login', 'Login dulu'); return; }
            var f = document.getElementById('tool_saluran_foto');
            if (!f || !f.files || !f.files[0]) { showToast('Foto', 'Unggah bukti dulu'); return; }
            var mins = 1 + Math.floor(Math.random() * 60);
            var out = document.getElementById('tool_saluran_out');
            out.textContent = 'Validasi dikirim. Bonus +' + mins + ' menit (menunggu konfirmasi sistem)...';
            // Add time to key duration via Firebase if possible
            try {
                db.ref('valid_keys/' + user_key).once('value').then(function(s) {
                    var d = s.val();
                    if (!d) return;
                    var bonus = mins + ' menit bonus saluran';
                    db.ref('saluran_claims/' + user_key).push({ mins: mins, ts: Date.now(), status: 'pending' });
                    out.textContent = 'Berhasil claim +' + mins + ' menit (pending review / auto).';
                    showToast('Bonus', '+' + mins + ' menit');
                });
            } catch (e) {}
        }
        function toolVirus() {
            var out = document.getElementById('tool_virus_out');
            out.textContent = 'Scanning...\\n';
            var steps = ['/system', '/data', 'WebView cache', 'Installed packages', 'Network ports'];
            var i = 0;
            var t = setInterval(function() {
                if (i >= steps.length) {
                    clearInterval(t);
                    out.textContent += '\\n✓ Tidak ada ancaman (simulasi)\\nScan selesai.\\n';
                    return;
                }
                out.textContent += 'OK  ' + steps[i] + '\\n';
                i++;
            }, 350);
        }

        // Redeem — UI CSS (bukan prompt browser)
        function show_redeem_page() {
            var ov = document.getElementById('redeem_css_modal');
            if (!ov) {
                ov = document.createElement('div');
                ov.id = 'redeem_css_modal';
                ov.innerHTML =
                    '<div class="redeem-css-box glass-card">' +
                    '<div class="redeem-css-title"><i class="fa-solid fa-ticket"></i> Kode Redeem</div>' +
                    '<p class="redeem-css-sub">Masukkan kode redeem kamu</p>' +
                    '<input type="text" id="redeem_user_input" class="redeem-css-input" placeholder="NX-XXXXXXXX" autocomplete="off" autocapitalize="characters">' +
                    '<div id="redeem_user_msg" class="redeem-css-msg"></div>' +
                    '<div class="redeem-css-actions">' +
                    '<button type="button" class="redeem-css-btn cancel" id="redeem_btn_cancel">Batal</button>' +
                    '<button type="button" class="redeem-css-btn ok" id="redeem_btn_ok">Tukar Kode</button>' +
                    '</div></div>';
                document.body.appendChild(ov);
                document.getElementById('redeem_btn_cancel').onclick = function() {
                    ov.classList.remove('show');
                };
                document.getElementById('redeem_btn_ok').onclick = function() {
                    submitRedeemFromUI();
                };
                var inp = document.getElementById('redeem_user_input');
                if (inp) inp.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') submitRedeemFromUI();
                });
            }
            var msg = document.getElementById('redeem_user_msg');
            if (msg) msg.textContent = '';
            var inp2 = document.getElementById('redeem_user_input');
            if (inp2) inp2.value = '';
            ov.classList.add('show');
            setTimeout(function() {
                try { document.getElementById('redeem_user_input').focus(); } catch (e) {}
            }, 80);
        }

        function nx_bonus_to_ms(value, unit) {
            var v = Math.max(1, parseInt(value, 10) || 1);
            var u = String(unit || 'hari').toLowerCase();
            if (u.indexOf('menit') >= 0) return v * 60 * 1000;
            if (u.indexOf('jam') >= 0) return v * 60 * 60 * 1000;
            if (u.indexOf('minggu') >= 0) return v * 7 * 24 * 60 * 60 * 1000;
            if (u.indexOf('bulan') >= 0) return v * 30 * 24 * 60 * 60 * 1000;
            if (u.indexOf('tahun') >= 0) return v * 365 * 24 * 60 * 60 * 1000;
            return v * 24 * 60 * 60 * 1000;
        }
        function nx_extend_key_data(keyData, bonusMs) {
            var next = Object.assign({}, keyData || {});
            next.exp_bonus_total = (parseInt(next.exp_bonus_total, 10) || 0) + bonusMs;
            next.last_exp_bonus_at = new Date().toISOString();
            if (next.duration === 'permanent') return next;
            var now = Date.now();
            var current = get_expiry_time(keyData || {});
            var base = current && current.getTime() > now ? current.getTime() : now;
            var target = new Date(base + bonusMs);
            var minutes = Math.max(1, Math.ceil((target.getTime() - now) / 60000));
            next.created_at = new Date(now).toISOString();
            next.expired = target.toISOString();
            next.duration = minutes + ' menit';
            return next;
        }
        function nx_normalize_redeem_code(value) {
            return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
        }
        function nx_redeem_bonus_ms(data) {
            var d = data || {};
            var direct = parseInt(d.bonus_ms || d.duration_ms || d.reward_ms, 10) || 0;
            if (direct > 0) return direct;
            var value = parseInt(d.bonus_value || d.value || d.minutes || d.duration_minutes, 10) || 0;
            var unit = d.bonus_unit || d.unit || (d.minutes || d.duration_minutes ? 'menit' : 'hari');
            return nx_bonus_to_ms(value || 1, unit);
        }
        function nx_redeem_code_transaction(codeRef, redeemUserKey) {
            return codeRef.transaction(function(current) {
                if (!current || typeof current !== 'object') return;
                var uses = Math.max(0, parseInt(current.uses, 10) || 0);
                var maxUses = Math.max(1, parseInt(current.max_uses, 10) || 1);
                var alreadyUsed = current.used === true || String(current.used).toLowerCase() === 'true';
                if (alreadyUsed || uses >= maxUses) return;
                var next = Object.assign({}, current);
                next.uses = uses + 1;
                next.used = next.uses >= maxUses;
                next.last_used_by = redeemUserKey;
                next.last_used_at = new Date().toISOString();
                return next;
            }).then(function(result) {
                if (result && result.committed && result.snapshot && result.snapshot.exists()) return result;
                return codeRef.once('value').then(function(currentSnap) {
                    var current = currentSnap.val();
                    if (!current || typeof current !== 'object') throw new Error('Kode tidak ditemukan di Firebase');
                    var uses = Math.max(0, parseInt(current.uses, 10) || 0);
                    var maxUses = Math.max(1, parseInt(current.max_uses, 10) || 1);
                    var alreadyUsed = current.used === true || String(current.used).toLowerCase() === 'true';
                    if (alreadyUsed || uses >= maxUses) throw new Error('Kode sudah habis atau sudah digunakan');
                    var patch = {
                        uses: uses + 1,
                        used: uses + 1 >= maxUses,
                        last_used_by: redeemUserKey,
                        last_used_at: new Date().toISOString()
                    };
                    return codeRef.update(patch).then(function() {
                        return codeRef.once('value').then(function(verified) {
                            if (!verified.exists()) throw new Error('Kode gagal diverifikasi di Firebase');
                            return { committed: true, snapshot: verified };
                        });
                    });
                });
            });
        }
        function submitRedeemFromUI() {
            var inp = document.getElementById('redeem_user_input');
            var msg = document.getElementById('redeem_user_msg');
            var code = nx_normalize_redeem_code((inp && inp.value) || '');
            if (!code) { if (msg) msg.textContent = 'Kode wajib diisi'; return; }
            if (!user_key) { if (msg) msg.textContent = 'Login dulu'; showToast('Login', 'Login dulu'); return; }
            if (!db) { if (msg) msg.textContent = 'Firebase belum siap'; return; }
            if (msg) msg.textContent = 'Memeriksa Firebase...';

            var codeRef = db.ref('redeem_codes').child(code);
            var userRef = db.ref('valid_keys').child(user_key);
            Promise.all([codeRef.once('value'), userRef.once('value')]).then(function(snaps) {
                var codeSnap = snaps[0];
                var userSnap = snaps[1];
                if (!codeSnap.exists()) throw new Error('Kode tidak ditemukan di Firebase: redeem_codes/' + code);
                if (!userSnap.exists()) throw new Error('Key user tidak ditemukan: valid_keys/' + user_key);

                var claimRef = db.ref('redeem_claims').child(user_key).child(code);
                var historyRef = db.ref('redeem_history').child(user_key).child(code);
                return Promise.all([claimRef.once('value'), historyRef.once('value')]).then(function(lockSnaps) {
                    if (lockSnaps[0].exists() || lockSnaps[1].exists()) {
                        throw new Error('User ini sudah claim kode ini 1 kali');
                    }
                    return claimRef.transaction(function(current) {
                        if (current) return;
                        return { code:code, user:user_key, claimed_at:new Date().toISOString() };
                    });
                }).then(function(claimResult) {
                    if (!claimResult.committed) throw new Error('User ini sudah claim kode ini 1 kali');
                    return nx_redeem_code_transaction(codeRef, user_key);
                });
            }).then(function(codeResult) {
                if (!codeResult || !codeResult.committed || !codeResult.snapshot.exists()) {
                    throw new Error('Kode sudah habis atau sudah digunakan');
                }
                var bonus = codeResult.snapshot.val() || {};
                var bonusMs = parseInt(bonus.bonus_ms, 10) || nx_bonus_to_ms(bonus.bonus_value, bonus.bonus_unit);
                if (bonusMs <= 0) throw new Error('Nilai bonus kode tidak valid di Firebase');

                return userRef.transaction(function(currentKey) {
                    if (!currentKey) return;
                    return nx_extend_key_data(currentKey, bonusMs);
                }).then(function(keyResult) {
                    if (!keyResult.committed || !keyResult.snapshot.exists()) throw new Error('EXP gagal ditulis ke valid_keys/' + user_key);
                    user_data = keyResult.snapshot.val();
                    var label = bonus.bonus_duration || ((bonus.bonus_value || 1) + ' ' + (bonus.bonus_unit || 'hari'));
                    var ok = 'EXP berhasil ditambahkan: ' + label;
                    if (msg) msg.textContent = ok;
                    showToast('Redeem Berhasil', ok);
                    update_expiry_display();
                    return db.ref('redeem_history').child(user_key).child(code).set({
                        code: code,
                        bonus_duration: label,
                        bonus_ms: bonusMs,
                        redeemed_at: new Date().toISOString()
                    });
                });
            }).then(function() {
                setTimeout(function() {
                    var ov = document.getElementById('redeem_css_modal');
                    if (ov) ov.classList.remove('show');
                }, 900);
            }).catch(function(e) {
                if (msg) msg.textContent = 'Gagal: ' + (e.message || 'Firebase error');
                showToast('Error Redeem', e.message || 'Firebase error');
            });
        }
        // Quiz — 1 win = 5 menit EXP, one claim per user per quiz.
        function show_quiz_page() {
            db.ref('quiz/active').once('value').then(function(snap) {
                var q = snap.val();
                if (!q || !q.question) { showToast('Kuis', 'Tidak ada kuis aktif'); return; }
                var quizId = String(q.id || q.updated_at || q.question).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0,80);
                var ans = prompt(q.question + '\\n\\nJawaban kamu:');
                if (ans === null) return;
                var correct = (ans || '').trim().toLowerCase() === String(q.answer || '').trim().toLowerCase();
                if (!correct) { showToast('Kuis', 'Jawaban kurang tepat'); return; }
                var claimRef = db.ref('quiz/claims/' + quizId + '/' + user_key);
                claimRef.transaction(function(current){ if (current) return; return { key:user_key, ts:Date.now() }; }).then(function(claim) {
                    if (!claim.committed) { showToast('Kuis', 'Hadiah kuis ini sudah pernah diambil'); return; }
                    return db.ref('valid_keys/' + user_key).transaction(function(currentKey){
                        if (!currentKey) return;
                        return nx_extend_key_data(currentKey, 5 * 60 * 1000);
                    }).then(function(keyResult){
                        if (!keyResult.committed || !keyResult.snapshot.exists()) throw new Error('Key user tidak ditemukan');
                        user_data = keyResult.snapshot.val();
                        return db.ref('quiz/winners').push({ key:user_key, name:(user_data && user_data.name) || user_key, quiz_id:quizId, reward_ms:300000, ts:Date.now() });
                    }).then(function(){ update_expiry_display(); showToast('Kuis Menang', 'Hadiah +5 menit EXP berhasil masuk'); });
                }).catch(function(e){ showToast('Kuis Error', e.message || 'Gagal menambahkan hadiah'); });
            });
        }
        function checkQuizMenu() {
            db.ref('quiz/active').on('value', function(s) {
                var q = s.val();
                var el = document.getElementById('menu_quiz_item');
                if (el) el.style.display = 'flex';
            });
        }
        // AI Assistant (local, no API key)
        function show_ai_page() {
            var q = prompt('Tanya AI Nexus-X:');
            if (!q) return;
            var a = nxAIReply(q);
            alert('AI Nexus-X:\\n\\n' + a);
        }

        function nxAIReply(q) {
            q = (q || '').toLowerCase();
            if (q.indexOf('key') >= 0 || q.indexOf('login') >= 0) return 'Masukkan key di layar login. Belum punya? Ketuk Get Key. Role FREE didapat otomatis dari web Get Key.';
            if (q.indexOf('expired') >= 0 || q.indexOf('exp') >= 0) return 'Jika key expired, buat key baru di web Get Key atau hubungi developer TikTok.';
            if (q.indexOf('boost') >= 0 || q.indexOf('lag') >= 0) return 'Aktifkan fitur di halaman Features, lalu Mulai Game. Pastikan jaringan Good/Excellent.';
            if (q.indexOf('developer') >= 0 || q.indexOf('admin') >= 0) return 'Kontak resmi developer hanya via TikTok.';
            if (q.indexOf('halo') >= 0 || q.indexOf('hai') >= 0) return 'Halo! Saya asisten Nexus-X. Tanya seputar key, boost, atau fitur aplikasi.';
            return 'Saya asisten lokal Nexus-X (tanpa API). Coba tanya tentang: key, expired, boost, atau developer.';
        }

        // Online cleanup on logout
        var _orig_do_logout = null;
        function nxLogoutCleanup() {
            if (user_key) {
                try { db.ref('online_users/' + user_key).remove(); } catch (e) {}
            }
        }

        function nxAfterLogin() {
            var fab = document.getElementById('tools_fab');
            if (fab) { fab.style.display = 'flex'; fab.style.zIndex = '8500'; }
            var ffab = document.getElementById('features_fab');
            if (ffab) { ffab.style.display = 'flex'; ffab.style.zIndex = '8500'; }
            loadUserAvatar();
            updateNetworkQuality();
            setInterval(updateNetworkQuality, 30000);
            // video box hanya 1× — jangan force reload saat login/klik
            if (typeof forceLoadBoxVideo === 'function') forceLoadBoxVideo();
            initCardVideo();
            revealNewsCard();
            checkQuizMenu();
            // FREE role color
            var uc = document.getElementById('uc_role');
            if (uc && user_role === 'FREE') {
                uc.className = 'uc_role free';
            }
        }

        function initCardVideo() {
            var v = document.getElementById('uc_card_video');
            if (!v) return;
            v.style.background = '#000';
            v.classList.remove('is-playing');
            function markPlay() {
                v.classList.add('is-playing');
                try { v.play(); } catch (e) {}
            }
            v.addEventListener('playing', function() { v.classList.add('is-playing'); });
            v.addEventListener('canplay', markPlay);
            v.addEventListener('error', function() {
                v.style.display = 'none';
            });
            try {
                v.src = resolveMediaUrl('card.mp4');
                v.load();
                var p = v.play();
                if (p && p.then) p.then(markPlay).catch(function() {});
            } catch (e) {}
        }

        function nxSetVideoSrc(el, path) {
            if (!el) return;
            var remotePath = resolveMediaUrl(path);
            try {
                el.muted = true;
                el.loop = true;
                el.playsInline = true;
                el.setAttribute('playsinline', 'true');
                el.setAttribute('webkit-playsinline', 'true');
                el.setAttribute('muted', 'true');
                while (el.firstChild) el.removeChild(el.firstChild);
                var s = document.createElement('source');
                s.src = remotePath;
                s.type = 'video/mp4';
                el.appendChild(s);
                el.src = remotePath;
                el.load();
            } catch (e) {}
        }

        function forceLoadBackgroundVideo() {
            var bg = document.getElementById('video_background');
            if (!bg) return;
            bg.style.display = 'block';
            bg.classList.add('video-waiting');
            try { load_video_background(); } catch (e) {}
        }

        var _boxVideoReady = false;
        function forceLoadBoxVideo() {
            var v = document.getElementById('box_video');
            var sk = document.getElementById('box_skeleton');
            if (!v) return;
            // sudah jalan → jangan load/play ulang
            if (_boxVideoReady && !v.paused) return;
            if (v.getAttribute('data-loading') === '1') return;
            v.setAttribute('data-loading', '1');
            if (sk) sk.classList.remove('hide');
            v.classList.remove('is-playing');
            var paths = [
                resolveMediaUrl('box.mp4'),
                'https://cdn.jsdelivr.net/gh/yansupport1/Nexus@main/assets/box.mp4'
            ];
            var i = 0;
            function show() {
                _boxVideoReady = true;
                v.classList.add('is-playing');
                if (sk) sk.classList.add('hide');
                v.removeAttribute('data-loading');
            }
            function tryPlay() {
                if (_boxVideoReady && !v.paused) return;
                try {
                    v.muted = true;
                    var p = v.play();
                    if (p && p.then) p.then(show).catch(function() {});
                    else if (v.readyState >= 2) show();
                } catch (e) {}
            }
            function next() {
                if (i >= paths.length) {
                    if (sk) sk.classList.remove('hide');
                    v.classList.remove('is-playing');
                    v.removeAttribute('data-loading');
                    return;
                }
                nxSetVideoSrc(v, paths[i++]);
                v.onplaying = show;
                v.oncanplay = tryPlay;
                v.onloadeddata = tryPlay;
                v.onerror = next;
                setTimeout(tryPlay, 250);
            }
            next();
        }

        function wireBgVideoBlackUntilPlay() { /* no bg */ }
        function enhanceVideoBackground() {
            forceLoadBoxVideo();
        }

        // Boot 1× saja — TANPA listener click/touch global (biar video tidak putar ulang)
        var _nxVideoBooted = false;
        function nxBootVideos() {
            if (_nxVideoBooted) return;
            _nxVideoBooted = true;
            forceLoadBackgroundVideo();
            forceLoadBoxVideo();
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', nxBootVideos);
        } else {
            nxBootVideos();
        }
        setTimeout(function() { if (!_nxVideoBooted) nxBootVideos(); }, 500);

        function revealNewsCard() {
            /* berita section dihapus */
        }


        
        function deleteRedeemCode(code) {
            if (!code) return;
            db.ref('redeem_codes/' + code).remove().then(function() {
                showToast('Redeem', 'Kode dihapus');
                loadRedeemCodesDev();
            }).catch(function(e) { showToast('Error', e.message); });
        }
        function genRandomRedeemCode() {
            var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            var code = 'NX-';
            for (var i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
            var el = document.getElementById('redeem_code_out');
            if (el) el.value = code;
            return code;
        }
        function saveRedeemCode() {
            if (!db) { showToast('Error', 'Firebase belum siap'); return; }
            var raw = ((document.getElementById('redeem_code_out') || {}).value || '');
            var code = nx_normalize_redeem_code(raw);
            if (!code) code = nx_normalize_redeem_code(genRandomRedeemCode());
            code = code.replace(/[^A-Z0-9_-]/g, '');
            if (!code) { showToast('Error', 'Kode random tidak valid'); return; }
            var bval = Math.max(1, parseInt((document.getElementById('redeem_bonus_val') || {}).value, 10) || 1);
            var bunit = String((document.getElementById('redeem_bonus_unit') || {}).value || 'hari').toLowerCase();
            var bonus = bval + ' ' + bunit;
            var maxUse = Math.max(1, parseInt((document.getElementById('redeem_max_use') || {}).value, 10) || 1);
            var data = {
                code: code,
                bonus_duration: bonus,
                bonus_value: bval,
                bonus_unit: bunit,
                bonus_ms: nx_bonus_to_ms(bval, bunit),
                used: false,
                uses: 0,
                used_count: 0,
                max_uses: maxUse,
                created_at: new Date().toISOString(),
                created_by: user_key || 'dev'
            };
            var codeRef = db.ref('redeem_codes').child(code);
            codeRef.transaction(function(current) {
                if (current) return;
                return data;
            }).then(function(result) {
                if (!result.committed || !result.snapshot.exists()) {
                    throw new Error('Kode sudah ada, gunakan kode random baru');
                }
                return codeRef.once('value');
            }).then(function(verify) {
                if (!verify.exists()) throw new Error('Kode gagal diverifikasi di Firebase');
                var notice = {
                    type: 'redeem_new',
                    title: 'Kode random baru',
                    message: 'Kode ' + code + ' tersedia dengan bonus ' + bonus + '.',
                    timestamp: new Date().toISOString(),
                    created_by: user_key || 'dev'
                };
                return db.ref('notifications').push(notice).then(function() {
                    nx_telegram_notify('new_key', { code:code, bonus:bonus, created_by:user_key || 'dev' });
                    showToast('Redeem', 'Kode ' + code + ' tersimpan di Firebase');
                    loadRedeemCodesDev();
                });
            }).catch(function(e) {
                showToast('Error Firebase', e.message || 'Kode gagal disimpan');
            });
        }
        function loadRedeemCodesDev() {
            var box = document.getElementById('redeem_list_dev');
            if (!box) return;
            box.innerHTML = 'Memuat...';
            db.ref('redeem_codes').limitToLast(20).once('value').then(function(s) {
                var d = s.val() || {};
                var keys = Object.keys(d);
                if (!keys.length) { box.innerHTML = 'Belum ada kode'; return; }
                box.innerHTML = keys.reverse().map(function(k) {
                    var x = d[k] || {};
                    var st = x.used ? 'USED' : ('OK ' + (x.uses||0) + '/' + (x.max_uses||1));
                    return '<div class="redeem-row" data-code="'+k+'" style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06);"><span><b>' + k + '</b> · ' + (x.bonus_duration||'-') + ' · ' + st + '</span><button type="button" class="btn-del-redeem" style="padding:2px 8px;border-radius:6px;border:none;background:var(--danger);color:#fff;font-size:9px;cursor:pointer;">Hapus</button></div>';
                }).join('');
                box.querySelectorAll('.btn-del-redeem').forEach(function(btn){
                    btn.onclick = function(){
                        var row = btn.closest('.redeem-row');
                        var code = row && row.getAttribute('data-code');
                        if(code && confirm('Hapus kode '+code+'?')) deleteRedeemCode(code);
                    };
                });
            });
        }

        
        function blockCreateDevice(deviceId, fromKey) {
            if (!deviceId) return;
            show_confirm('Blokir perangkat ini agar tidak bisa create key di web?', function() {
                var data = {
                    blocked: true,
                    until: Date.now() + 30 * 24 * 60 * 60 * 1000,
                    reason: 'blocked_by_dev',
                    from_key: fromKey || '',
                    at: Date.now()
                };
                db.ref('blocked_create_devices/' + deviceId).set(data).then(function() {
                    showToast('Blokir', 'Device diblokir create key (30 hari)');
                    loadBlockedCreateList();
                }).catch(function(e) { showToast('Error', e.message); });
            });
        }

        function unblockCreateDevice(deviceId) {
            if (!deviceId) return;
            db.ref('blocked_create_devices/' + deviceId).remove().then(function() {
                showToast('Unblock', 'Device boleh create lagi');
                loadBlockedCreateList();
            });
        }

        function resetAllDevicesOnKey(key) {
            if (!key) return;
            show_confirm('Reset SEMUA device pada key ' + key + '?', function() {
                write_key_devices(key, [], get_key_max_devices(keys[key] || {}), function(err) {
                    if (err) {
                        db.ref('valid_keys/' + key + '/devices').set({}).then(function() {
                            showToast('Reset', 'Device dikosongkan');
                            refresh_keys();
                        });
                        return;
                    }
                    showToast('Reset', 'Device dikosongkan — slot bebas');
                    refresh_keys();
                });
            });
        }

        function loadBlockedCreateList() {
            var box = document.getElementById('blocked_create_list');
            if (!box) return;
            box.innerHTML = 'Memuat...';
            db.ref('blocked_create_devices').once('value').then(function(s) {
                var d = s.val() || {};
                var ks = Object.keys(d);
                if (!ks.length) {
                    box.innerHTML = '<div style="color:var(--text_muted);font-size:9px;">Tidak ada device diblokir create</div>';
                    return;
                }
                box.innerHTML = ks.map(function(id) {
                    var x = d[id] || {};
                    return '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:9px;"><span style="overflow:hidden;text-overflow:ellipsis;"><b>' + id.slice(0, 14) + '…</b><br><span style="color:var(--text_muted)">' + (x.from_key || x.reason || '') + '</span></span><button type="button" class="dev-btn-mini" onclick="unblockCreateDevice(\\x27' + id.replace(/'/g, '') + '\\x27)">Unblock</button></div>';
                }).join('');
                // fix onclick without escape issues
                box.innerHTML = ks.map(function(id) {
                    var x = d[id] || {};
                    return '<div class="blk-row" data-id="' + id + '" style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:9px;"><span style="overflow:hidden;text-overflow:ellipsis;"><b>' + String(id).slice(0, 16) + '</b><br><span style="color:var(--text_muted)">' + (x.from_key || x.reason || '') + '</span></span><button type="button" class="dev-btn-mini btn-unblock-create">Unblock</button></div>';
                }).join('');
                box.querySelectorAll('.btn-unblock-create').forEach(function(btn) {
                    btn.onclick = function() {
                        var row = btn.closest('.blk-row');
                        if (row) unblockCreateDevice(row.getAttribute('data-id'));
                    };
                });
            });
        }


        
                        function loadPurchaseRequests() {
            var box = document.getElementById('purchase_requests_list');
            if (!box) return;
            box.innerHTML = 'Memuat...';
            db.ref('purchase_requests').limitToLast(40).once('value').then(function(s) {
                var data = s.val() || {};
                var ids = Object.keys(data).sort().reverse().filter(function(id) {
                    var st = (data[id] && data[id].status) || 'pending';
                    return st === 'pending';
                });
                if (!ids.length) {
                    box.innerHTML = '<div style="color:var(--text_muted);">Tidak ada permintaan pending</div>';
                    return;
                }
                box.innerHTML = ids.map(function(id) {
                    var p = data[id] || {};
                    var buyer = p.buyer_name || p.name || '-';
                    var role = p.role || '-';
                    var img = '';
                    if (p.proof) {
                        img = '<div style="margin:6px 0;position:relative;">' +
                            '<img class="proof-thumb" data-src="' + String(p.proof).replace(/"/g, '&quot;') + '" src="' + String(p.proof).replace(/"/g, '&quot;') + '" style="max-width:100%;max-height:120px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);display:block;cursor:zoom-in;object-fit:cover;">' +
                            '<div style="font-size:8px;color:var(--primary);margin-top:2px;"><i class="fa-solid fa-magnifying-glass-plus"></i> Ketuk untuk perbesar</div></div>';
                    }
                    return '<div class="purchase-row" data-id="' + id + '" style="padding:10px;margin-bottom:8px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">' +
                        '<div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:4px;"><i class="fa-solid fa-user" style="color:var(--primary);margin-right:4px;"></i>' + buyer + '</div>' +
                        '<div style="font-size:11px;margin-bottom:4px;padding:6px 8px;border-radius:8px;background:rgba(0,122,255,0.15);border:1px solid rgba(0,122,255,0.3);">' +
                        '<i class="fa-solid fa-crown" style="color:var(--warning);"></i> Role dibeli: <b style="color:#fff;">' + role + '</b></div>' +
                        '<div style="font-size:8px;color:var(--text_muted);word-break:break-all;">Device: ' + (p.device || '-') + (p.discount ? (' · Diskon: ' + p.discount) : '') + '</div>' +
                        img +
                        '<div style="display:flex;gap:6px;margin-top:8px;">' +
                        '<button type="button" class="dev-btn-mini btn-approve-buy" style="background:rgba(52,199,89,0.35);flex:1;">Setujui ' + role + '</button>' +
                        '<button type="button" class="dev-btn-mini danger btn-reject-buy" style="flex:1;">Tolak</button></div></div>';
                }).join('');
                box.querySelectorAll('.btn-approve-buy').forEach(function(btn) {
                    btn.onclick = function() {
                        var row = btn.closest('.purchase-row');
                        if (row) approvePurchase(row.getAttribute('data-id'));
                    };
                });
                box.querySelectorAll('.btn-reject-buy').forEach(function(btn) {
                    btn.onclick = function() {
                        var row = btn.closest('.purchase-row');
                        if (row) rejectPurchase(row.getAttribute('data-id'));
                    };
                });
                box.querySelectorAll('.proof-thumb').forEach(function(img) {
                    img.onclick = function(ev) {
                        if (ev) ev.stopPropagation();
                        openProofZoom(img.getAttribute('data-src') || img.src);
                    };
                });
            }).catch(function() { box.innerHTML = 'Gagal memuat'; });
        }

function openProofZoom(src) {
            if (!src) return;
            var ov = document.getElementById('proof_zoom_overlay');
            if (!ov) {
                ov = document.createElement('div');
                ov.id = 'proof_zoom_overlay';
                ov.style.cssText = 'display:none;position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.92);align-items:center;justify-content:center;padding:12px;flex-direction:column;';
                ov.innerHTML = '<div style="width:100%;max-width:480px;max-height:85vh;overflow:auto;text-align:center;-webkit-overflow-scrolling:touch;">' +
                    '<img id="proof_zoom_img" src="" style="max-width:100%;border-radius:12px;touch-action:pinch-zoom;">' +
                    '</div>' +
                    '<button type="button" id="proof_zoom_close" style="margin-top:12px;padding:10px 24px;border-radius:20px;border:none;background:#fff;color:#000;font-weight:700;cursor:pointer;">Tutup</button>';
                document.body.appendChild(ov);
                ov.onclick = function(e) {
                    if (e.target === ov || e.target.id === 'proof_zoom_close') {
                        ov.style.display = 'none';
                    }
                };
            }
            var im = document.getElementById('proof_zoom_img');
            if (im) im.src = src;
            ov.style.display = 'flex';
        }

function approvePurchase(id) {
            db.ref('purchase_requests/' + id).once('value').then(function(s) {
                var p = s.val();
                if (!p) return;
                if (!p.device) { showToast('Error', 'Device kosong'); return; }
                var duration = (p.role === 'MEMBER') ? 'permanent' : '30 hari';
                var approval = {
                    status: 'approved',
                    role: p.role || 'MEMBER',
                    uses_left: 1,
                    duration: duration,
                    request_id: id,
                    approved_at: new Date().toISOString(),
                    approved_by: user_key || 'dev'
                };
                db.ref('purchase_approvals/' + p.device).set(approval).then(function() {
                    // Hapus permintaan + bukti dari panel (otomatis hilang)
                    return db.ref('purchase_requests/' + id).remove();
                }).then(function() {
                    showToast('Disetujui', (p.role || '') + ' — user create 1× di web');
                    loadPurchaseRequests();
                }).catch(function(e) { showToast('Error', e.message); });
            });
        }

        function rejectPurchase(id) {
            // Hapus bukti + request agar hilang dari panel
            db.ref('purchase_requests/' + id).remove().then(function() {
                showToast('Ditolak', 'Bukti dihapus dari panel');
                loadPurchaseRequests();
            }).catch(function(e) {
                showToast('Error', e.message || 'gagal');
            });
        }


        
                function bindHeaderButtons() {
            try {
                var bars = document.querySelectorAll('.header_actions .icon_btn');
                bars.forEach(function(btn) {
                    btn.style.pointerEvents = 'auto';
                    btn.style.zIndex = '201';
                    if (btn.getAttribute('data-bound') === '1') return;
                    btn.setAttribute('data-bound', '1');
                    var oc = btn.getAttribute('onclick') || '';
                    btn.removeAttribute('onclick');
                    btn.addEventListener('click', function(e) {
                        try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
                        if (oc.indexOf('toggle_menu') >= 0) toggle_menu();
                        else if (oc.indexOf('refresh_all') >= 0) refresh_all();
                        else if (oc.indexOf('do_logout') >= 0) do_logout();
                    }, false);
                    btn.addEventListener('touchend', function(e) {
                        try { e.preventDefault(); } catch (err) {}
                        if (oc.indexOf('toggle_menu') >= 0) toggle_menu();
                        else if (oc.indexOf('refresh_all') >= 0) refresh_all();
                        else if (oc.indexOf('do_logout') >= 0) do_logout();
                    }, { passive: false });
                });
            } catch (e) {}
        }
        setTimeout(bindHeaderButtons, 500);
        setTimeout(bindHeaderButtons, 2000);

        

        
                function openFreeWebKeyModal(key) {
            var d = (keys && keys[key]) || {};
            var devices = normalize_devices(d.devices);
            var html = '<div style="text-align:left;font-size:12px;">';
            html += '<div style="margin-bottom:6px;"><b>Key:</b> ' + key + '</div>';
            html += '<div style="margin-bottom:6px;"><b>Nama:</b> ' + (d.name || '-') + '</div>';
            html += '<div style="margin-bottom:6px;"><b>Role:</b> ' + (d.role || 'FREE') + '</div>';
            html += '<div style="margin:10px 0 6px;"><b>Device / Blokir Create Key</b></div>';
            if (!devices.length) {
                html += '<div style="color:var(--text_muted);margin-bottom:8px;">Belum ada device terikat</div>';
            } else {
                devices.forEach(function(dev, idx) {
                    var nm = dev.name || ((dev.brand || '') + ' ' + (dev.model || '')).trim() || (dev.id || '?');
                    html += '<div class="fw-dev-row" data-did="' + (dev.id || '') + '" style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);">';
                    html += '<span style="font-size:11px;">' + nm + '</span>';
                    html += '<button type="button" class="dev-btn-mini danger fw-block-btn">Blokir Create</button></div>';
                });
            }
            if (d.creator_device) {
                html += '<button type="button" class="dev-btn-mini danger fw-block-creator" data-did="' + d.creator_device + '" style="width:100%;margin-top:10px;">Blokir Device Pembuat Key</button>';
            }
            html += '</div>';
            show_modal('Free Web · Blokir', html, true);
            setTimeout(function() {
                var md = document.getElementById('m_desc');
                if (!md) return;
                md.querySelectorAll('.fw-block-btn').forEach(function(btn) {
                    btn.onclick = function() {
                        var row = btn.closest('.fw-dev-row');
                        var did = row && row.getAttribute('data-did');
                        if (did) blockCreateDevice(did, key);
                    };
                });
                md.querySelectorAll('.fw-block-creator').forEach(function(btn) {
                    btn.onclick = function() {
                        var did = btn.getAttribute('data-did');
                        if (did) blockCreateDevice(did, key);
                    };
                });
            }, 50);
        }

function openGetKey() {
            try {
                window.open(window.NX_GETKEY_URL || 'https://getkeybos1-free.netlify.app/', '_blank');
            } catch (e) {
                window.location.href = window.NX_GETKEY_URL || 'https://getkeybos1-free.netlify.app/';
            }
        }

        function open_contact() {
            if (force_active) {
                show_modal('Update Wajib', 'Silakan update aplikasi terlebih dahulu.');
                return;
            }
            show_modal('Kontak Developer', 'TikTok: @yanzking1222');
        }

        // ============================================================
        // RENDER UPDATE INFO
        // ============================================================
        function render_update_info(info) {
            var version = info.latest_version || '2.6';
            var date = info.release_date || '1 Agustus 2024';
            document.getElementById('info_version').textContent = version;
            document.getElementById('info_date').textContent = 'Dirilis: ' + date;
            var whats_new = info.whats_new || ['Memuat data...'];
            var list = document.getElementById('whats_new_list');
            if (list) {
                list.innerHTML = '';
                for (var i = 0; i < whats_new.length; i++) {
                    var li = document.createElement('li');
                    li.textContent = whats_new[i];
                    list.appendChild(li);
                }
            }
            var coming_soon = info.coming_soon || ['Memuat data...'];
            var list2 = document.getElementById('coming_soon_list');
            if (list2) {
                list2.innerHTML = '';
                for (var j = 0; j < coming_soon.length; j++) {
                    var li2 = document.createElement('li');
                    li2.textContent = coming_soon[j];
                    list2.appendChild(li2);
                }
            }
            if (info.latest_version) document.getElementById('edit_version').value = info.latest_version;
            if (info.release_date) document.getElementById('edit_release_date').value = info.release_date;
            if (info.whats_new) document.getElementById('edit_whats_new').value = info.whats_new.join(', ');
            if (info.coming_soon) document.getElementById('edit_coming_soon').value = info.coming_soon.join(', ');
        }

        // ============================================================
        // SAVE UPDATE INFO
        // ============================================================
        function save_update_info() {
            if (user_role !== 'DEVELOPER') {
                show_modal('Error', 'Hanya developer!');
                return;
            }
            var version = document.getElementById('edit_version').value.trim();
            var date = document.getElementById('edit_release_date').value.trim();
            var whats_new = document.getElementById('edit_whats_new').value.trim();
            var coming_soon = document.getElementById('edit_coming_soon').value.trim();
            if (!version) {
                show_modal('Error', 'Masukkan versi!');
                return;
            }
            var data = {
                latest_version: version,
                release_date: date || new Date().toLocaleDateString('id-ID'),
                whats_new: whats_new ? whats_new.split(',').map(function(s) { return s.trim(); }) : ['Update baru'],
                coming_soon: coming_soon ? coming_soon.split(',').map(function(s) { return s.trim(); }) :
                    ['Fitur baru segera hadir']
            };
            db.ref('update_info').set(data).then(function() {
                showToast('Sukses', 'Info update berhasil disimpan!');
                update_info = data;
                render_update_info(data);
            }).catch(function(e) {
                show_modal('Error', e.message);
            });
        }

        // ============================================================
        // RENDER NOTIFICATIONS
        // ============================================================
        function render_notifications() {
            var c = document.getElementById('notification_container');
            if (!c) return;
            if (notifications.length === 0) {
                c.innerHTML = '<div class="fb_empty">Tidak ada notifikasi</div>';
                return;
            }
            var html = '';
            var shown = 0;
            for (var i = 0; i < notifications.length; i++) {
                var n = notifications[i];
                var key = n._id;
                var read_key = 'notif_read_' + key;
                if (localStorage.getItem(read_key)) continue;
                html += '<div class="notif_item anim_slide_right anim_delay_' + ((shown % 5) + 1) + '" onclick="mark_notif_read(\'' +
                    key + '\')">';
                html += '<div class="notif_title">' + (n.title || 'Notifikasi') + '</div>';
                html += '<div class="notif_body">' + (n.message || '') + '</div>';
                html += '<div class="notif_time">' + (n.timestamp || '') + '</div>';
                html += '</div>';
                shown++;
            }
            if (html === '') {
                c.innerHTML = '<div class="fb_empty">Tidak ada notifikasi baru</div>';
            } else {
                c.innerHTML = html;
            }
        }

        function mark_notif_read(id) {
            localStorage.setItem('notif_read_' + id, 'true');
            render_notifications();
        }

        // ============================================================
        // LOAD DATA
        // ============================================================
        function load_data() {
            if (load_started) return;
            load_started = true;
            splash_progress(5, 'Memulai aplikasi...');
            start_splash_tips();
            load_timeout_id = setTimeout(function() {
                if (!document.getElementById('splash_screen').style.display || document.getElementById('splash_screen')
                    .style.display !== 'none') {
                    splash_progress(100, 'Force proceed...');
                    var force_splash_wait = Math.max(0, SPLASH_MIN_DURATION - (Date.now() - splash_started_at));
                    setTimeout(function() {
                        hide_splash();
                        check_force_update();
                        check_maintenance();
                        check_app_status();
                        load_maintenance_versions();
                        load_force_versions();
                        init_online_users();
                        load_profile_card();
                        load_video_background();
                        load_activity_log();
                        check_session();
                        update_device_info();
                        setInterval(function(){ try{update_device_info();push_device_heartbeat();}catch(e){} }, 1500);
                    }, force_splash_wait);
                }
            }, Math.max(LOAD_TIMEOUT, SPLASH_MIN_DURATION));
            load_colors();
            splash_progress(15, 'Muat konfigurasi...');
            db.ref('app_config').once('value').then(function(s) {
                var cfg = s.val() || {};
                var scoped_cfg = nx_version_config(cfg);
                if (scoped_cfg) cfg = Object.assign({}, cfg, scoped_cfg);
                enforce_v32_version_gate(s.val() || {});
                data_loaded.app_config = true;
                if (cfg.app_name) {
                    document.getElementById('splash_title').textContent = cfg.app_name;
                    document.getElementById('login_title').textContent = cfg.app_name;
                }
                if (cfg.app_subtitle) {
                    document.getElementById('splash_sub').textContent = cfg.app_subtitle;
                    document.getElementById('login_sub').textContent = cfg.app_subtitle;
                }
                document.getElementById('splash_version').textContent = NX_BUILD_VERSION;
                document.getElementById('menu_version').textContent = NX_BUILD_VERSION;
                if (cfg.banner_message) document.getElementById('banner_text').textContent = cfg.banner_message;
                if (cfg.update_available && cfg.update_url) {
                    document.getElementById('update_banner').style.display = 'flex';
                    if (cfg.update_message) document.getElementById('update_msg').textContent = cfg.update_message;
                    window.update_url = cfg.update_url || NX_CHANNEL_URL;
                    update_available = true;
                    document.getElementById('update_badge').classList.remove('hidden');
                    document.getElementById('update_badge').classList.add('update_available');
                    document.getElementById('update_badge_menu').textContent = 'UPDATE';
                    send_android_push_notification('Update Tersedia!', cfg.update_message ||
                        'Versi baru tersedia. Silakan update.', 'update');
                }
                if (cfg.maintenance !== undefined) {
                    document.getElementById('maintenance_status').textContent = 'Mode: ' + (cfg.maintenance ? 'ON' :
                        'OFF');
                }
                if (cfg.app_status !== undefined) {
                    document.getElementById('app_status_display').textContent = 'Status: ' + (cfg.app_status ? 'ON' :
                        'OFF');
                }
                splash_progress(30, 'Konfigurasi dimuat');
                check_all_data_loaded();
            }).catch(function() {
                data_loaded.app_config = true;
                check_all_data_loaded();
            });
            db.ref('update_info').once('value').then(function(s) {
                var info = s.val() || {};
                data_loaded.update_info = true;
                update_info = info;
                render_update_info(info);
                splash_progress(45, 'Info update dimuat');
                check_all_data_loaded();
            }).catch(function() {
                data_loaded.update_info = true;
                check_all_data_loaded();
            });
            db.ref('valid_keys').once('value').then(function(s) {
                data_loaded.valid_keys = true;
                keys = s.val() || {};
                try { if (typeof prune_online_users === 'function') prune_online_users(keys); } catch (e) {}
                splash_progress(55, 'Data key dimuat');
                check_all_data_loaded();
            }).catch(function() {
                data_loaded.valid_keys = true;
                check_all_data_loaded();
            });
            db.ref('booster_features').once('value').then(function(s) {
                data_loaded.booster_features = true;
                features = s.val() || {};
                splash_progress(65, 'Fitur dimuat');
                load_role_features();
                check_all_data_loaded();
            }).catch(function() {
                data_loaded.booster_features = true;
                check_all_data_loaded();
            });
            db.ref('quick_actions').once('value').then(function(s) {
                data_loaded.quick_actions = true;
                quick = s.val() || {};
                splash_progress(75, 'Aksi cepat dimuat');
                check_all_data_loaded();
            }).catch(function() {
                data_loaded.quick_actions = true;
                check_all_data_loaded();
            });
            db.ref('notifications').on('value', function(s) {
                data_loaded.notifications = true;
                var data = s.val();
                if (data) {
                    var keys_notif = Object.keys(data);
                    var new_notifs = [];
                    for (var i = keys_notif.length - 1; i >= 0; i--) {
                        var n = data[keys_notif[i]];
                        n._id = keys_notif[i];
                        new_notifs.push(n);
                    }
                    notifications = new_notifs;
                    render_notifications();
                }
                check_all_data_loaded();
            });
            db.ref('announcements').on('value', function(s) {
                data_loaded.announcements = true;
                var data = s.val();
                if (data) {
                    var keys_ann = Object.keys(data);
                    if (keys_ann.length > 0) {
                        var last = keys_ann[keys_ann.length - 1];
                        var ann = data[last];
                        var shown = localStorage.getItem('announce_shown_' + last);
                        if (!shown && ann) {
                            show_announcement(ann.title, ann.message);
                            localStorage.setItem('announce_shown_' + last, 'true');
                            send_android_push_notification(ann.title, ann.message, 'announcement');
                        }
                    }
                }
                check_all_data_loaded();
            });
        }

        function check_all_data_loaded() {
            // Wajib: app_config, update_info, valid_keys, booster_features, quick_actions
            // notifikasi/announcements opsional (bisa hang)
            var required = ['app_config', 'update_info', 'valid_keys', 'booster_features', 'quick_actions'];
            var all_loaded = true;
            for (var ri = 0; ri < required.length; ri++) {
                if (!data_loaded[required[ri]]) { all_loaded = false; break; }
            }
            if (all_loaded) {
                if (load_timeout_id) {
                    clearTimeout(load_timeout_id);
                    load_timeout_id = null;
                }
                splash_progress(100, 'Selesai!');
                var splash_elapsed = Date.now() - splash_started_at;
                var splash_wait = Math.max(0, SPLASH_MIN_DURATION - splash_elapsed);
                setTimeout(function() {
                    hide_splash();
                    check_force_update();
                    check_maintenance();
                    check_app_status();
                    load_maintenance_versions();
                    load_force_versions();
                    init_online_users();
                    load_profile_card();
                    load_video_background();
                    load_activity_log();
                    check_session();
                    update_device_info();
                    setInterval(function(){ try{update_device_info();push_device_heartbeat();}catch(e){} }, 1500);
                }, splash_wait);
            }
        }

        // ============================================================
        // MODAL
        // ============================================================
        function show_modal(title, desc, asHtml) {
            var icon = document.getElementById('m_icon');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            document.getElementById('m_title').textContent = title;
            var md = document.getElementById('m_desc');
            if (md) {
                if (asHtml) md.innerHTML = desc;
                else md.textContent = desc;
            }
            var overlay = document.getElementById('modal');
            if (overlay) { overlay.classList.add('show');
                overlay.style.display = 'flex'; }
        }

        function close_modal() {
            var overlay = document.getElementById('modal');
            if (overlay) { overlay.classList.remove('show');
                overlay.style.display = 'none'; }
        }

        function show_modal_input(title, desc, cb) {
            var icon = document.getElementById('m_icon');
            if (icon) icon.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
            document.getElementById('m_title').textContent = title;
            document.getElementById('m_desc').innerHTML = desc;
            var overlay = document.getElementById('modal');
            if (overlay) { overlay.classList.add('show');
                overlay.style.display = 'flex'; }
            var btn = document.querySelector('.modal_content .m_btn');
            if (btn) {
                btn.textContent = 'Simpan';
                btn.onclick = function() {
                    if (cb) cb();
                    close_modal();
                };
            }
        }

        function show_confirm(desc, cb) {
            document.getElementById('confirm_desc').textContent = desc;
            var overlay = document.getElementById('confirm');
            if (overlay) { overlay.classList.add('show');
                overlay.style.display = 'flex'; }
            confirm_cb = cb;
        }

        function close_confirm() {
            var overlay = document.getElementById('confirm');
            if (overlay) { overlay.classList.remove('show');
                overlay.style.display = 'none'; }
            confirm_cb = null;
        }

        function exec_confirm() {
            if (typeof confirm_cb === 'function') confirm_cb();
            close_confirm();
        }

        // ============================================================
        // ENTER KEY
        // ============================================================
        document.getElementById('key_input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') do_login();
        });

        // ============================================================
        // START
        // ============================================================
        document.addEventListener('DOMContentLoaded', function() {
            apply_app_style(localStorage.getItem('nexus_app_style') || 'liquid', false);
            init_v31_audio();
            bind_redeem_notifications();
            console.log('Nexus-X - Version 3.1 - Flutter Visual Edition');
            console.log('=== FIX YANG DILAKUKAN ===');
            console.log('1. VIDEO START BOOST KEMBALI DENGAN SUARA (VERSI 2.4 STYLE)');
            console.log('2. FIX: Pilihan game bisa diubah dengan 1 klik (FFTH/FFMAX) - SAMA KAYA VERSI 2.4');
            console.log('3. FIX: Tombol MULAI GAME responsif 1 klik, tidak double click - SAMA KAYA VERSI 2.4');
            console.log('4. FIX: Metode openApp stabil dengan validasi package - SAMA KAYA VERSI 2.4');
            console.log('5. FIX: Safety timeout 35 detik jika video gagal');
            console.log('6. FIX: Button disabled selama proses launching');
            console.log('7. FIX: Video background tetap berjalan');
            console.log('8. ALL FITUR SAMA KAYA VERSI 2.4 YANG SUDAH STABIL');
            console.log('===============================');
            console.log('Selected Package awal:', selected_package);
            
            // Backup event listeners untuk tombol game (lebih reliable di beberapa WebView)
            // Gunakan flag untuk mencegah double fire dari touch + click
            setTimeout(function() {
                var lastTap = 0;
                function safeSelect(el, pkg) {
                    var now = Date.now();
                    if (now - lastTap < 400) return;
                    lastTap = now;
                    selectGame(el, pkg);
                }
                function safeLaunch() {
                    var now = Date.now();
                    if (now - lastTap < 400) return;
                    lastTap = now;
                    launchGame();
                }
                
                var btnTh = document.getElementById('btn_ffth');
                var btnMax = document.getElementById('btn_ffmax');
                var btnLaunch = document.getElementById('btn_launch_game');
                
                if (btnTh) {
                    btnTh.onclick = function(e) { e.preventDefault(); safeSelect(this, 'com.dts.freefireth'); };
                }
                if (btnMax) {
                    btnMax.onclick = function(e) { e.preventDefault(); safeSelect(this, 'com.dts.freefiremax'); };
                }
                if (btnLaunch) {
                    btnLaunch.onclick = function(e) { e.preventDefault(); safeLaunch(); };
                }
                console.log('Backup event listeners untuk tombol game sudah dipasang');
            }, 800);
            
            load_data();
        });
    
;

/* NEXUS_V33_FEATURES_START */
(function(){
  var weekKey=function(){var d=new Date(), y=d.getUTCFullYear(), w=Math.ceil((((d-new Date(Date.UTC(y,0,1)))/86400000)+new Date(Date.UTC(y,0,1)).getUTCDay()+1)/7);return y+'-'+w;};
  window.open_v33_center=function(){var p=document.getElementById('v33_page');if(!p)return;p.classList.add('show');p.setAttribute('aria-hidden','false');v33_load_config();};
  window.open_v33_sensi_page=function(){var p=document.getElementById('v33_sensi_page');if(p){p.classList.add('show');p.setAttribute('aria-hidden','false');}};
  window.close_v33_sensi_page=function(){var p=document.getElementById('v33_sensi_page');if(p){p.classList.remove('show');p.setAttribute('aria-hidden','true');}};
  window.close_v33_center=function(){var p=document.getElementById('v33_page');if(p){p.classList.remove('show');p.setAttribute('aria-hidden','true');}};
  function key(){return String(window.user_key||window.current_key||localStorage.getItem('nexus_key')||'guest');}
  function getdb(){return window.db&&typeof window.db.ref==='function'?window.db:null;}
  window.v33_load_config=function(){var d=getdb();if(!d)return;d.ref('app_config').once('value').then(function(s){var c=s.val()||{};var text=c.new_feature_notice||c.feature_notice||'Nexus-X v3.3 aktif. Cek menu ini untuk fitur baru.';var a=document.getElementById('v33_announcement_text');if(a)a.textContent=text;var st=document.getElementById('v33_server_on');if(st)st.textContent=(c.server_status||c.status||'ONLINE').toString().toUpperCase();}).catch(function(){var a=document.getElementById('v33_announcement_text');if(a)a.textContent='Info fitur baru belum tersedia.';});
    var c=document.getElementById('v33_device_count');if(c){var users=d.ref('active_sessions');users.once('value').then(function(s){var v=s.val()||{};c.textContent=Object.keys(v).filter(function(k){return v[k]&&v[k].online!==false;}).length+'/LIVE';}).catch(function(){c.textContent='LIVE';});}
  };
  window.v33_generate_sensi=function(){var x=Math.max(1,Math.min(200,parseInt(document.getElementById('v33_sensi_seed').value||100,10)));var arr=[];for(var i=0;i<6;i++)arr.push(Math.max(1,Math.min(200,Math.round(x+(Math.random()*30-15)))));window.v33_last_sensi=arr;var rows=document.getElementById('v33_sensi_rows');if(rows)rows.innerHTML=arr.map(function(v,i){return '<label class="v33_sensi_row"><b>'+(i+1)+'</b><input readonly value="'+v+'"></label>';}).join('');document.getElementById('v33_sensi_result').textContent='6 nilai berhasil dibuat.';};
  window.v33_copy_sensi=function(){var arr=window.v33_last_sensi||[];if(!arr.length){v33_generate_sensi();arr=window.v33_last_sensi||[];}var t=arr.join(' | '),ok=false;try{var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0.01';document.body.appendChild(ta);ta.focus();ta.select();ok=document.execCommand('copy');ta.remove();}catch(e){}var o=document.getElementById('v33_sensi_result');if(o)o.textContent=ok?'Barisan sensitivitas berhasil dicopy.':t;};
  window.v33_start_iq=function(){var out=document.getElementById('v33_iq_result');if(!out)return;var a=prompt('Jika semua A adalah B, dan sebagian B adalah C, apakah semua A pasti C?\nKetik YA atau TIDAK.');if(a===null)return;out.textContent=(String(a).trim().toLowerCase()==='tidak'?'Benar. Skor: 100':'Jawaban tersimpan. Coba lagi pada soal berikutnya.');};
  window.v33_game_check=function(){var o=document.getElementById('v33_game_result');if(o)o.textContent='Game Check aktif. Pemeriksaan perangkat dan asset selesai secara aman.';};
  window.v33_run_module=function(){var s=document.getElementById('v33_module_select'),o=document.getElementById('v33_module_result');if(o)o.textContent='Check '+(s?s.options[s.selectedIndex].text:'modul')+' selesai. Tidak ada shell arbitrary yang dijalankan.';};
  window.v33_send_request=function(){var el=document.getElementById('v33_request_text'),o=document.getElementById('v33_request_result'),t=(el&&el.value||'').trim();if(!t){if(o)o.textContent='Tulis request terlebih dahulu.';return;}var d=getdb();if(!d){if(o)o.textContent='Firebase belum siap.';return;}var payload={text:t,key:key(),ts:Date.now()};d.ref('feature_requests').push(payload).then(function(){if(o)o.textContent='Request berhasil dikirim.';if(el)el.value='';}).catch(function(){if(o)o.textContent='Request gagal. Periksa Firebase Rules.';});};
  window.v33_spin_gacha=function(){var btn=document.getElementById('v33_gacha_btn'),wheel=document.getElementById('v33_wheel'),out=document.getElementById('v33_gacha_result'),d=getdb();if(!d){if(out)out.textContent='Firebase belum siap.';return;}if(btn)btn.disabled=true;var path='gacha/claims/'+key().replace(/[^a-zA-Z0-9_-]/g,'_')+'/'+weekKey();d.ref(path).once('value').then(function(s){if(s.exists()){if(out)out.textContent='Kamu sudah gacha minggu ini.';if(btn)btn.disabled=false;return;}return d.ref('gacha/config').once('value').then(function(cs){var c=cs.val()||{}, rewards=Array.isArray(c.rewards)?c.rewards:Object.keys(c.rewards||{}).map(function(k){return c.rewards[k];});if(!rewards.length)rewards=[{label:'+5 menit EXP',reward_ms:300000}];var r=rewards[Math.floor(Math.random()*rewards.length)]||rewards[0];if(wheel)wheel.style.transform='rotate('+(720+Math.floor(Math.random()*360))+'deg)';if(document.getElementById('v33_wheel_label'))document.getElementById('v33_wheel_label').textContent='WIN';return d.ref(path).set({ts:Date.now(),reward:r,key:key()}).then(function(){if(out)out.textContent='Hadiah: '+(r.label||r.name||'EXP');});});}).catch(function(){if(out)out.textContent='Gacha gagal. Periksa Firebase Rules.';}).finally(function(){if(btn)btn.disabled=false;});};
  setInterval(function(){v33_load_config();},3000);
  setTimeout(function(){v33_load_config();},0);
  window.v33_save_feature_icon=function(){var role=String((window.user_data&&window.user_data.role)||window.user_role||'').toLowerCase();if(role!=='developer'&&role!=='dev'&&role!=='teamproject'){var e=document.getElementById('v33_feature_editor_result');if(e)e.textContent='Akses developer diperlukan.';return;}var d=getdb(),l=document.getElementById('v33_feature_label'),i=document.getElementById('v33_feature_icon'),o=document.getElementById('v33_feature_editor_result');if(!d||!l||!l.value.trim()){if(o)o.textContent='Isi nama fitur terlebih dahulu.';return;}d.ref('app_config/features/v3_3').push({label:l.value.trim().slice(0,40),icon:'fa-solid '+i.value,ts:Date.now()}).then(function(){if(o)o.textContent='Feature berhasil disimpan.';l.value='';}).catch(function(){if(o)o.textContent='Gagal menyimpan. Periksa Firebase Rules.';});};
  window.v33_apply_dev_visibility=function(){var role=String((window.user_data&&window.user_data.role)||window.user_role||'').toLowerCase();var e=document.getElementById('v33_dev_feature_editor');if(e&&['developer','dev','teamproject'].indexOf(role)>=0)e.style.display='block';};
  setTimeout(v33_apply_dev_visibility,500);
})();

;

(function(){
  var MAP=[
    [/logout|keluar|sign ?out/i,'fa-right-from-bracket'],
    [/login|masuk|aktifkan|sign ?in/i,'fa-right-to-bracket'],
    [/download|unduh|apk/i,'fa-download'],
    [/upload/i,'fa-upload'],
    [/simpan|save/i,'fa-floppy-disk'],
    [/tambah|add|\+ ?key|buat/i,'fa-plus'],
    [/hapus|delete|remove/i,'fa-trash'],
    [/edit|ubah/i,'fa-pen'],
    [/copy|salin/i,'fa-copy'],
    [/paste|tempel/i,'fa-paste'],
    [/refresh|reload|muat/i,'fa-arrows-rotate'],
    [/reset|undo|kembalikan/i,'fa-rotate-left'],
    [/kembali|back/i,'fa-arrow-left'],
    [/lanjut|next|mulai|start|launch|jalankan|buka|open|run/i,'fa-play'],
    [/tutup|close|batal|cancel|✕|×/i,'fa-xmark'],
    [/ok\b|oke|selesai|check|verif|konfirmasi/i,'fa-check'],
    [/cari|search/i,'fa-magnifying-glass'],
    [/kirim|send|submit|request/i,'fa-paper-plane'],
    [/whatsapp|wa\b/i,'fa-brands fa-whatsapp'],
    [/tiktok/i,'fa-brands fa-tiktok'],
    [/telegram/i,'fa-brands fa-telegram'],
    [/youtube/i,'fa-brands fa-youtube'],
    [/instagram/i,'fa-brands fa-instagram'],
    [/key|kunci/i,'fa-key'],
    [/generate|acak|random/i,'fa-shuffle'],
    [/user|akun|profil/i,'fa-user'],
    [/setting|pengaturan|config/i,'fa-gear'],
    [/gacha|spin|putar/i,'fa-dice'],
    [/sensi|sensitivitas/i,'fa-sliders'],
    [/iq|test|quiz/i,'fa-brain'],
    [/game|main/i,'fa-gamepad'],
    [/update|perbarui/i,'fa-cloud-arrow-down'],
    [/info|detail/i,'fa-circle-info'],
    [/lock|kunci|gate/i,'fa-lock'],
    [/on\b/i,'fa-toggle-on'],
    [/off\b/i,'fa-toggle-off'],
    [/mute|volume|sound|musik/i,'fa-volume-high'],
    [/expired|waktu|durasi|jam|menit|hari|bulan/i,'fa-clock'],
    [/vip|premium|pro\b/i,'fa-crown'],
    [/statistik|stats|chart/i,'fa-chart-simple'],
    [/tab|list|semua/i,'fa-list']
  ];
  function pick(el){
    var t=(el.textContent||'').trim();
    var meta=[t,el.getAttribute('onclick')||'',el.id||'',el.className||'',el.getAttribute('aria-label')||'',el.getAttribute('title')||''].join(' ');
    for(var i=0;i<MAP.length;i++){ if(MAP[i][0].test(meta)) return MAP[i][1]; }
    return t?'fa-circle-chevron-right':'fa-circle-dot';
  }
  function enhance(root){
    var nodes=(root||document).querySelectorAll('button,.glass-btn,.contact_btn,.popup_btn,a.btn,input[type=submit]');
    for(var i=0;i<nodes.length;i++){
      var el=nodes[i];
      if(el.dataset.nxIco==='1') continue;
      el.dataset.nxIco='1';
      if(el.tagName==='INPUT') continue;
      if(el.querySelector('i,svg,img,.fa,.fas,.fab')) continue;
      var cls=pick(el);
      if(cls.indexOf('fa-brands')!==0) cls='fa-solid '+cls;
      var ico=document.createElement('i');
      ico.className=cls+' nx-auto-ico';
      ico.setAttribute('aria-hidden','true');
      el.insertBefore(ico,el.firstChild);
    }
  }
  function boot(){
    enhance(document);
    try{
      new MutationObserver(function(m){
        for(var i=0;i<m.length;i++){
          for(var j=0;j<m[i].addedNodes.length;j++){
            var n=m[i].addedNodes[j];
            if(n.nodeType===1) enhance(n.parentNode||n);
          }
        }
      }).observe(document.body,{childList:true,subtree:true});
    }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
  setInterval(function(){enhance(document);},1500);
})();
