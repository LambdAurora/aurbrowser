// Initialize LambdaStyle.
LambdaStyle.init();
LambdaStyle.enable_auto_referesh();

// Initialize service worker.
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => {
      console.log('Service Worker Registered');
    });
}
