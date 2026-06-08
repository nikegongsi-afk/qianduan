import { trackRealVisit } from '../api/module/web/visitTrack';

const TRACK_SESSION_KEY = 'visit_tracked_paths';

const shouldTrackVisit = (path: string) => {
  if (path.startsWith('/system')) return false;
  if (path === '/login' || path === '/userlogin') return false;
  if (path.startsWith('/assets')) return false;
  return true;
};

const hasTrackedInSession = (path: string) => {
  try {
    const raw = sessionStorage.getItem(TRACK_SESSION_KEY);
    const tracked = raw ? (JSON.parse(raw) as string[]) : [];
    return tracked.includes(path);
  } catch {
    return false;
  }
};

const markTrackedInSession = (path: string) => {
  try {
    const raw = sessionStorage.getItem(TRACK_SESSION_KEY);
    const tracked = raw ? (JSON.parse(raw) as string[]) : [];
    if (!tracked.includes(path)) {
      tracked.push(path);
      sessionStorage.setItem(TRACK_SESSION_KEY, JSON.stringify(tracked));
    }
  } catch {
    // ignore
  }
};

const runTrack = (path: string) => {
  if (!shouldTrackVisit(path)) return;
  if (hasTrackedInSession(path)) return;

  trackRealVisit()
    .then((res) => {
      if (res?.success && !res?.skipped) {
        markTrackedInSession(path);
      }
    })
    .catch(() => {
      // 静默失败，不影响页面使用
    });
};

export const setupVisitIdentify = (router: { afterEach: (fn: (to: { path: string }) => void) => void }) => {
  router.afterEach((to) => {
    window.setTimeout(() => runTrack(to.path), 400);
  });

  window.setTimeout(() => runTrack(window.location.pathname), 1000);
};
