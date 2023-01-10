export enum TransactionType {
  CONNECT_POINT = 'CONNECT_POINT',
}

export enum UserMessage {
  RECIEVED_POINT = 'Quà tặng kết nối với',
}

export function caculatePercentageRecievePointByLevel(
  refs: number,
  actions: number,
) {
  if (refs >= 0 && refs < 3) {
    return 1;
  } else if (refs >= 3 && refs < 10 && actions >= 1 && actions < 3) {
    return 1.1;
  } else if (refs >= 10 && refs < 30 && actions >= 3 && actions < 10) {
    return 1.2;
  } else if (refs >= 30 && refs < 50 && actions >= 10 && actions < 30) {
    return 1.3;
  } else if (refs >= 50 && refs < 100 && actions >= 30 && actions < 100) {
    return 1.4;
  } else {
    return 1.5;
  }
}
