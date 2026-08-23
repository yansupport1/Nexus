<?php
/**
 * Nexus-X Telegram notification endpoint.
 * Deploy this file on PHP hosting. Set secrets as environment variables:
 * TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'POST only']); exit; }

$token = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$chatId = getenv('TELEGRAM_CHAT_ID') ?: '';
if ($token === '' || $chatId === '') { http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Telegram secrets are not configured']); exit; }

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '{}', true);
if (!is_array($data)) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Invalid JSON']); exit; }
$event = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($data['event'] ?? 'event'));
$app = trim((string)($data['app'] ?? 'Nexus-X'));
$version = trim((string)($data['version'] ?? '4.0.0'));
$lines = ["<b>" . htmlspecialchars($app, ENT_QUOTES, 'UTF-8') . "</b> <code>" . htmlspecialchars($version, ENT_QUOTES, 'UTF-8') . "</code>"];
if ($event === 'new_user') {
    $lines[] = '🟢 <b>User baru login</b>';
    $lines[] = 'Key: <code>' . htmlspecialchars((string)($data['key'] ?? '-'), ENT_QUOTES, 'UTF-8') . '</code>';
    $lines[] = 'Nama: ' . htmlspecialchars((string)($data['name'] ?? '-'), ENT_QUOTES, 'UTF-8');
    $lines[] = 'Role: ' . htmlspecialchars((string)($data['role'] ?? '-'), ENT_QUOTES, 'UTF-8');
    $lines[] = 'Device: ' . htmlspecialchars((string)($data['device'] ?? '-'), ENT_QUOTES, 'UTF-8');
} elseif ($event === 'new_key') {
    $lines[] = '🔑 <b>Key/redeem baru dibuat</b>';
    $lines[] = 'Kode: <code>' . htmlspecialchars((string)($data['code'] ?? '-'), ENT_QUOTES, 'UTF-8') . '</code>';
    $lines[] = 'Bonus: ' . htmlspecialchars((string)($data['bonus'] ?? '-'), ENT_QUOTES, 'UTF-8');
    $lines[] = 'Dibuat oleh: <code>' . htmlspecialchars((string)($data['created_by'] ?? '-'), ENT_QUOTES, 'UTF-8') . '</code>';
} else {
    $lines[] = 'Event: <code>' . htmlspecialchars($event, ENT_QUOTES, 'UTF-8') . '</code>';
}
$text = implode("\n", $lines);
$url = 'https://api.telegram.org/bot' . rawurlencode($token) . '/sendMessage';
$payload = http_build_query(['chat_id'=>$chatId, 'text'=>$text, 'parse_mode'=>'HTML', 'disable_web_page_preview'=>'true']);
$ch = curl_init($url);
curl_setopt_array($ch, [CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>$payload, CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>12]);
$result = curl_exec($ch);
$error = curl_error($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($error !== '' || $status < 200 || $status >= 300) { http_response_code(502); echo json_encode(['ok'=>false,'error'=>'Telegram request failed']); exit; }
echo json_encode(['ok'=>true]);
