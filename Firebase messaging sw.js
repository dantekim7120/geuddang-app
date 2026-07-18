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

messaging.onBackgroundMessage(payload => {
  const title = (payload.notification && payload.notification.title) || '그 땅 내꺼';
  const body = (payload.notification && payload.notification.body) || '';
  const data = payload.data || {};
  self.registration.showNotification(title, {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: (data.itemId || 'geuddang') + '-' + (data.type || 'msg'),
    renotify: true,
    data
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = 'https://dantekim7120-ui.github.io/geuddang-app/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.indexOf('geuddang-app') !== -1 && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
