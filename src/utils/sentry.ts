import { captureException, withScope, init } from '@sentry/node';
import { AxiosError } from 'axios';
import { ConnectedInitializeProps } from 'src/types/common';
import { ValidationError } from 'runtypes';

const sentryOptions = {
  dsn: process.env.SENTRY_DSN,
  release: process.env.BUILD_ID,
  maxBreadcrumbs: 30,
  environment: process.env.STAGE,
  attachStacktrace: true,
  ignoreErrors: [
    'ERR_BLOCKED_BY_CLIENT',
    'fb_xd_fragment',
    'Failed to fetch',
    'NetworkError when attempting to fetch resource',
    '__naverapp__',
    '__gCrWeb.autofill.extractForms',
    'There is no clipping info for given tab', // Evernote extension error
    "Unexpected token 'else'",
    'Let/Const 다시 선언',
    'ReferenceError: Let/Const 다시 선언',
    `TypeError: 특정 호스트 이름을 가진
    서버를 찾을 수 없습니다.`,
    'Unexpected identifier',
    'Unexpected end of input',
    'TypeError: WebKit에 내부 오류 발생',
    'Software caused connection abort',
    '소프트웨어에 의한 연결 중단',
    'No identifiers allowed directly after numeric literal',
    '특정 호스트 이름을 가진 서버를 찾을 수 없습니다',
    'TypeError: cancelled',
    'TypeError: 취소됨',
    'TypeError: 서버에 연결할 수 없습니다.',
    'TypeError: undefined is not an object (evaluating \'whale.pip.setup\')',
    'TypeError: annulé',
    'The Internet connection appears to be offline.',
    '서버에 안전하게 연결할 수 없습니다',
    'SSL',
    'A server with the specified hostname could not be found.',
    'The network connection was lost.',
    'kCFErrorDomainCFNetwork',
    '网络连接已中断。',
    '错误的 URL',
    '已取消',
    '未能找到使用指定主机名的服务器。',
    '指定されたホスト名のサーバが見つかりませんでした。',
    '未能完成该操作。软件导致连接中止',
    '找不到使用指定主机名的服务器。', // 지정된 호스트 이름으로 서버를 찾을 수 없습니다.
    'TypeError: 似乎已断开与互联网的连接。', // 인터넷 연결이 끊어진 것 같습니다.
    'TypeError: 无法连接到服务器。', // 서버에 연결할 수 없습니다.
    'TypeError: 错误的URL', // 잘못된 URL
    'TypeError: 操作を完了できませんでした。ソフトウェアにより接続が中止されました', // 소프트웨어에 의한 연결 중단
    'TypeError: Es besteht anscheinend keine Verbindung zum Internet.',
    'TypeError: 中止', // 중
    'TypeError: скасовано', // 취소
    'TypeError: Der Vorgang konnte nicht abgeschlossen werden. Die Software hat einen Verbindungsabbruch verursacht', // 소프트웨어 연결이 끊어졌습니다.
    'Type error',
    'キャンセルしました',
    'TypeError: ネットワーク接続が切れました。', // 네트워크 연결이 끊어졌습니다.
    'TypeError: サーバに接続できませんでした。', // 서버에 연결할 수 없습니다.
    'TypeError: đã huỷ',
    'TypeError: ถูกยกเลิก',
    'TypeError: отменено',
    'supported-color-schemes',
    '请求超时。',
    'Abgebrochen',
    'Non-error was thrown: "Cancel". You should only throw errors.',
    'TypeError: Non-error was thrown: "Cancel". You should only throw errors.',
    'TypeError: anulowane',
    'Error: Request aborted',
    'cancelado',
    'AdBlock',
    'mttLongPressVar',
    'Blocked a frame with origin',
    "has no method 'checkDomStatus'",
    '이 서버에 대한 인증서가 유효하지 않습니다',
    'TypeError: null is not an object (evaluating \'document.querySelector(\'meta[name="twitter:description"]\').content\')',
    'TypeError: Object [object Object] has no method \'checkLanguage\'',
    'ReferenceError: Can\'t find variable: _sess_',
    'TypeError: a[b].target.className.indexOf is not a function.',
  ],
  sampleRate: 0.3,
  whitelistUrls: [
    /https?:\/\/(.+\.)?ridibooks\.com/,
    /https?:\/\/(.+\.)?ridi\.io/,
    /https?:\/\/s3.ap-northeast-2.amazonaws.com\/beacon-ridibooks(-test)*/,
  ],
};

// 서버이거나, 클라이언트에서 partials가 아닌 경우 초기화
if (process.env.IS_SERVER || !window.isPartials) {
  init(sentryOptions);
}

const Sentry = {
  captureException(error: AxiosError | Error, ctx: ConnectedInitializeProps | null = null) {
    if (!process.env.IS_PRODUCTION) {
      console.error('Captured exception:', error);
    }
    let eventId;

    withScope((scope) => {
      // isAxiosError
      if ((error as AxiosError).config) {
        if ((error as AxiosError).response) {
          scope.setExtra('Axios Response Url', (error as AxiosError).config.url);
          scope.setTag(
            'AXIOS_RESPONSE_CODE',
            (error as AxiosError).response?.status.toString() ?? 'UNKNOWN',
          );
          scope.setTag('API_URL', (error as AxiosError).config?.url ?? 'UNKNOWN');
          scope.setFingerprint([
            (error as AxiosError).config.url ?? '',
            (error as AxiosError).response?.status.toString() ?? '',
            error.message,
          ]);
        }
      }
      if (error instanceof ValidationError) {
        scope.setExtra('name', error.name);
        if (error.key) {
          scope.setExtra('key', error.key);
        }
      }
      if (ctx) {
        const {
          req, res, err, asPath, query,
        } = ctx;
        scope.setTag('isServer', String(Boolean(req)));
        scope.setTag('path', asPath ?? 'undefined');
        scope.setExtra('NEXT_JS_ERROR', String(err));
        scope.setExtra('query', query);

        if (req && res) {
          scope.setExtra('NEXT_JS_RES_STATUS_CODE', res.statusCode);
        }
      }
      eventId = captureException(error);
    });
    return eventId;
  },
};
export default Sentry;
