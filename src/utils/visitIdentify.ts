import { identifyVisitUser } from '../api/module/web/visitTrack';

const shouldIdentifyVisit = (path: string) => {
  if (path.startsWith('/system')) return false;
  if (path === '/login') return false;
  return true;
};

export const setupVisitIdentify = (router: { afterEach: (fn: (to: { path: string }) => void) => void }) => {
  const runIdentify = () => {
    if (!shouldIdentifyVisit(window.location.pathname)) return;
    identifyVisitUser().catch((error) => {
      console.warn('identify visit failed:', error);
    });
  };

  router.afterEach((to) => {
    if (shouldIdentifyVisit(to.path)) {
      window.setTimeout(runIdentify, 300);
    }
  });

  window.setTimeout(runIdentify, 800);
  window.setTimeout(runIdentify, 2500);
};
