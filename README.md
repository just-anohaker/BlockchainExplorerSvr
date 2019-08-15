# 功能说明

说明：

* 请求使用协议: http
* 主机：40.114.70.112
* 端口：2019
* API接口：http://40.114.70.112:2019	

## API

### 获取ETM当前币价

***(GET)API接口/api/okex/ticker***

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其它字段              |
| data    | object  | 币价的详细信息，详细信息参见(**Websocket[event"okex_ticker]**") |

### 获取当前汇率(USD/CNY)

***(GET)API接口/api/okex/rate***

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其它字段              |
| data    | object  | 当前USD/CNY汇率，详细信息参见(**Websocket[event"okex_rate"]**) |



## Websocket

***(Event)"okex_ticker"***

数据

```javascript
{
    "best_ask": "0.2338",
    "best_bid": "0.233",
    "instrument_id": "ETM-USDT",
    "product_id": "ETM-USDT",
    "last": "0.2334",														// 最新币价
    "ask": "0.2338",
    "bid": "0.233",
    "open_24h": "0.2332",
    "high_24h": "0.2337",
    "low_24h": "0.2225",
    "base_volume_24h": "38615188.0353",
    "timestamp": "2019-08-13T08:02:01.998Z",
    "quote_volume_24h": "8807101.6266"
}
```

***(Event)"okex_rate"***

数据

```javascript
{
    "rate": "6.958"			// USD/CNY汇率
}
```

