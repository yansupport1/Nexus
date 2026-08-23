# Nexus-X v4.0 — GitHub Remote Source

Build ini memindahkan source HTML dan media ke repository GitHub. Di asset Sketchware, file lokal yang diperlukan hanya `file.json`. Activity WebView membaca `file.json`, mengambil `source_url`, lalu memuat aplikasi dari GitHub.

## Konfigurasi GitHub

Ganti `USERNAME/REPOSITORY` pada `file.json` dengan repository Anda. Struktur repository yang disarankan adalah:

```text
index.html
file.json
assets/card.mp4
assets/box.mp4
assets/start.mp4
assets/background.mp4
assets/start.mp3
assets/musik.mp3
assets/fon.ttf
assets/logo.png
api/telegram.php
```

`file.json` dapat diletakkan di root repository dan disalin sebagai satu-satunya file ke asset Sketchware. Jangan memasukkan token bot Telegram ke `file.json`, HTML, atau repository publik.

## Sketchware

Tempel `sketchware_asset/WebViewGatewaySource.txt` ke event `onCreate` setelah `setContentView`. Asset lokal cukup:

```text
file.json
```

Pastikan `source_url` pada gateway mengarah ke raw URL GitHub `index.html`. Source remote sudah memiliki loader radar startup, Firebase, login, dashboard, media remote, dan navigasi lama.

## Telegram

Deploy `api/telegram.php` ke hosting PHP yang mendukung cURL. Atur environment variable server:

```text
TELEGRAM_BOT_TOKEN=token_bot_anda
TELEGRAM_CHAT_ID=id_grup_atau_komunitas
```

Set URL endpoint itu pada `telegram_api_url` di `file.json`. Client hanya mengirim event `new_user` dan `new_key`; token tetap berada di server. Endpoint menerima POST JSON dan meneruskan pesan ke Bot API Telegram.

Website Get Key yang akan diberikan kemudian dapat memakai endpoint yang sama dengan payload `event: new_key` setelah key berhasil dibuat.

## Perubahan aplikasi

Loader awal menggunakan radar CSS yang Anda berikan. Random code sekarang menggunakan transaksi Firebase untuk mengunci pemakaian berdasarkan `uses` dan `max_uses`, menambah durasi ke `valid_keys/{key}`, serta menyimpan `redeem_history`. Kuis memberikan **5 menit EXP setiap satu kemenangan**, dengan satu klaim per user untuk setiap kuis melalui `quiz/claims/{quizId}/{key}`.

## Catatan media

Media tidak disalin ke asset Sketchware. Ganti file di folder `assets/` repository GitHub dengan file asli, tanpa mengubah nama file. Pastikan GitHub mengizinkan akses raw dan file video/audio tidak memakai Git LFS pointer jika ingin diputar langsung oleh WebView.
