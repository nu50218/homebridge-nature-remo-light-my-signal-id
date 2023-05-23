# homebridge-nature-remo-light-my-signal-id

[![npm version](https://badge.fury.io/js/%40nu50218%2Fhomebridge-nature-remo-light-my-signal-id.svg)](https://badge.fury.io/js/%40nu50218%2Fhomebridge-nature-remo-light-my-signal-id)

On/Offのsignal_idを指定して照明にします。

Nature RemoアプリとHomekit(Home.appやSiriの操作)の両方で状態を同期しますが、
他のリモコンで操作すると同期がとれなくなります。

## 設定例

以下を実行することで、Nature RemoのAPIを使って設定に必要な情報を取得できます。

```console
$ TOKEN=<Nature Remo Cloud APIのTOKEN>
$ curl -s -X 'GET' \
    -H 'accept: application/json' \
    -H "Authorization: Bearer $TOKEN" \
    'https://api.nature.global/1/appliances' \
    | jq '.[] | select(.type == "LIGHT") | {id, nickname, signals}'
```
実行すると以下のようにNature remoに設定した家電の名前, ID, Signal IDが出力されるので、
操作したい照明のIDをhomebridgeの設定のappliance_idに指定します。
```
{
  "id": "appliance-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "nickname": "Light_1",
  "signals": [
    {
      "id": "signal-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "off",
      "image": "ico_off"
    },
    {
      "id": "signal-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
      "name": "on",
      "image": "ico_on"
    },
  ]
}
$
```

以下のようにHomebridgeのWebUI上で設定します。

```json
{
  "accessory": "homebridge-nature-remo-light-my-signal-id",
  "name": "my-light",
  "access_token":   "access-token-xxxxxxxxxx",
  "signal_id_on":   "signal-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
  "signal_id_off":  "signal-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "appliance_id":   "appliance-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

## テストの実行

```console
$ npm ci
$ npm test
```