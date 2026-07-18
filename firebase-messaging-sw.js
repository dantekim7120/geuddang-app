importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAMQp0hYqy-jeUfDdcRTDiSIbB0HgmehUo",
  authDomain: "geuddang-monitor.firebaseapp.com",
  projectId: "geuddang-monitor",
  storageBucket: "geuddang-monitor.firebasestorage.app",
  messagingSenderId: "248172557002",
  appId: "1:248172557002:web:b6c159a3eae5ecae43fa33"
});

const messaging = firebase.messaging();

// SVG 인라인 아이콘 (icon-192.png 부재 시에도 안전)
const FALLBACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIiB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiI+PHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIHJ4PSI0MCIgZmlsbD0iIzFhMWYzNSIvPjxjaXJjbGUgY3g9Ijk2IiBjeT0iOTYiIHI9IjYyIiBmaWxsPSIjMjIyODQwIiBzdHJva2U9IiM0ZjdmZmYiIHN0cm9rZS13aWR0aD0iNiIvPjxwb2x5Z29uIHBvaW50cz0iOTYsNDYgODgsOTggMTA0LDk4IiBmaWxsPSIjZWY0NDQ0Ii8+PHBvbHlnb24gcG9pbnRzPSI5NiwxNDYgODgsOTQgMTA0LDk0IiBmaWxsPSIjZThlY2Y0Ii8+PGNpcmNsZSBjeD0iOTYiIGN5PSI5NiIgcj0iMTAiIGZpbGw9IiM0ZjdmZmYiLz48L3N2Zz4=';

const APP_URL = 'https://dantekim7120-ui.github.io/geuddang-app/';

messaging.onBackgroundMessage(payload => {
  const n = payload.notification || {};
  const data = payload.data || {};

  const title = n.title || '그 땅 내꺼';
  const body = n.body || '';

  // 태그: 물건 알림은 물건별로, 관리 알림은 시각별로 분리 (덮어쓰기 방지)
  const tag = data.itemId
    ? `item-${data.itemId}-${data.type || 'msg'}`
    : `sys-${data.type || 'msg'}-${Date.now()}`;

  self.registration.showNotification(title, {
    body,
    icon: FALLBACK_ICON,
    badge: FALLBACK_ICON,
    tag,
    renotify: true,
    requireInteraction: data.isWatch === 'true',
    data
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.indexOf('geuddang-app') !== -1 && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(APP_URL);
    })
  );
});

// 새 버전 배포 시 즉시 활성화
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(clients.claim()));
