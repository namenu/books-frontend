import { all } from 'redux-saga/effects';
import { accountRootSaga } from 'src/services/accounts';
import { booksRootSaga } from 'src/services/books';
import { categoriesRootSaga } from 'src/services/category';
import { notificationRootSaga } from 'src/services/notification';

export default function* rootSaga() {
  yield all([
    accountRootSaga(),
    booksRootSaga(),
    categoriesRootSaga(),
    notificationRootSaga(),
  ]);
}
