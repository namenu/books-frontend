import { useEffect, useState } from 'react';
import { DeviceType, Tracker } from '@ridi/event-tracker';
import { FB_KEYS, GA_KEY, GTM_KEY } from 'src/constants/eventTracking';

const initTracker = (userId: string) => {
  if (typeof window !== 'undefined') {
    const tracker = new Tracker({
      userId: userId || null,
      // Todo device 판단  User-Agent ?
      deviceType: window.innerWidth > 999 ? DeviceType.PC : DeviceType.Mobile, // user agent 판단? 아니면?
      beaconOptions: {
        use: true, // Todo CSP Check
      },
      // eslint-disable-next-line no-process-env
      debug: process.env.NODE_ENV !== 'production',
      gaOptions: {
        trackingId: GA_KEY,
        pathPrefix: window.location.pathname,
        fields: {
          campaignName: 'RENEWAL',
        },
      },
      pixelOptions: {
        pixelId: FB_KEYS, // Multiple Keys?
      },
      tagManagerOptions: {
        trackingId: GTM_KEY,
      },
      // eslint-disable-next-line no-process-env
      development: process.env.NODE_ENV !== 'production',
    });

    tracker.initialize();
    return tracker;
  }
  return null;
};

const useEventTracker = (loggedUser): [Tracker] => {
  // @ts-ignore
  const [tracker, setTracker] = useState(initTracker(loggedUser?.id));
  useEffect(() => {}, [loggedUser]);

  return [tracker];
};

export default useEventTracker;