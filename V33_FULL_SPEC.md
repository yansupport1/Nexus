# Nexus-X v3.3 — Manifest Update Lengkap

## Struktur dan distribusi

`index.html` adalah source lengkap di repository GitHub `yansupport1/Nexus`. Asset Sketchware hanya `file.json` sebagai gateway yang memuat source dari GitHub. Media, font, background, dan musik berada di repository/asset path yang dikonfigurasi.

## Fitur lama yang wajib dipertahankan

Login key Firebase scoped `v3_2`, mode style, dashboard, profile/user card, valid key, redeem, quiz, tools, media, game launcher, audio mute/unmute, notification, chat, report, terminal visual, crosshair, developer panel, device status, Get Key, floating tools/features, bottom navigation, dan seluruh navigasi lama.

## Tema dan UI

Mode Comic harus benar-benar Comic 3D: outline tebal, bevel, depth, shadow keras, halftone/comic pattern, splash, tombol 3D, badge, dan animasi comic. Mode biasa harus premium dengan gradasi neon. Tersedia mode Liquid Glass putih dan hitam. Liquid Glass harus transparan seperti kaca, blur, reflection, highlight, border sedikit tebal, depth, dan animasi iPhone-like. Semua mode memiliki background partikel kecil abstrak seperti mikroorganisme/virus dengan warna rainbow yang bergerak ringan. Semua button memakai Liquid Button; Burger Menu memakai neumorphism pillow hamburger; Bottom Nav memakai glass pill reference user. Layout harus responsive Android, laptop, dan WebView.

## Auto-refresh dan status

Auto-refresh wajib aktif untuk semua user setiap 3 detik tanpa tombol ON/OFF dan tanpa reload halaman penuh. Developer Panel menampilkan device online real-time sebagai `jumlah aktif/limit`, contohnya `1/1`, bukan `Unverified/1`, dan teks terlihat di semua tema. Info versi APK selalu tersedia.

## Fitur baru user

1. Info jika ada fitur baru.
2. Generator Sensitivitas FF pada halaman aplikasi terpisah, dengan barisan 6 nilai, rentang maksimal 1–200, tombol generate, dan copy.
3. Tombol rainbow untuk Game Check aman sebelum membuka game; bukan bypass proteksi perangkat.
4. Gacha EXP dengan roda custom dari config developer, role Free/Member/VIP/VVIP/Reseller/TEAMPROJECT, satu claim per key per minggu, dan hadiah berasal dari konfigurasi.
5. Modul game berbasis allowlist aman; tidak mengeksekusi file `.sh` arbitrary di device user.
6. Feature icon memakai pilihan Font Awesome, bukan mengetik class manual.
7. Animasi terminal visual saat proses persiapan game.
8. Quiz dapat dikustomisasi developer untuk soal dan jawaban.
9. Status server berbasis data Firebase nyata; tidak menampilkan kapasitas VPS palsu sebagai fakta.
10. Tes IQ pada Tools.
11. Login page lebih hidup dan menyala.
12. Request fitur dari user.
13. Background custom foto/MP4 dari asset/repository GitHub, bukan Firebase.
14. Iklan tidak auto-close secara salah; close manual atau durasi konfigurasi yang benar.

## Catatan keamanan

Tidak ada bypass sungguhan, exploit, root action, shell arbitrary, atau klaim kapasitas VPS yang tidak didukung data nyata. Implementasi aman memakai pemeriksaan lokal, allowlist, status server valid, dan data Firebase.

## Firebase

Runtime tetap memakai root `v3_2`. Data lengkap export lama disimpan di bawah node `v3_2`. Rules harus mengizinkan path yang memang ditulis oleh client; client tidak dapat melewati Firebase Rules.
