# homebridge-nature-remo-light-my-signal-id

[![npm version](https://badge.fury.io/js/%40nu50218%2Fhomebridge-nature-remo-light-my-signal-id.svg)](https://badge.fury.io/js/%40nu50218%2Fhomebridge-nature-remo-light-my-signal-id)

On/Offのsignal_idを指定して照明にします。

最後に送信されたOn/Offの値を保存しておくので、他のリモコンで操作すると同期がとれなくなります。

## 設定例

```json
{
  "accessory": "homebridge-nature-remo-light-my-signal-id",
  "name": "my-light",
  "access_token": "access-token-xxxxxxxxxx",
  "signal_id_on": "signal-xxxxxxxxxx",
  "signal_id_off": "signal-xxxxxxxxxx"
}
```
