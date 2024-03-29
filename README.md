# 功能说明

说明：

* 请求使用协议: http
* 主机：40.114.70.112
* 端口：2019
* API接口：http://40.114.70.112:2019	

## API

### 获取ETM当前币价

***(GET)API接口/api/okex/ticker*** **[depracated]**

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其它字段              |
| data    | object  | 币价的详细信息，详细信息参见(**Websocket[event"okex_ticker]**") |

### 获取当前汇率(USD/CNY)

***(GET)API接口/api/okex/rate*** **[depracated]**

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其它字段              |
| data    | object  | 当前USD/CNY汇率，详细信息参见(**Websocket[event"okex_rate"]**) |

### 获取当前汇率(USD/BTC)

***(GET)API接口/api/okex/rate/btc*** **[depracated]**

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其他字段              |
| data    | object  | 当前USD/BTC汇率，详细信息参见(**Websocket[event"okex_btc_rate"]**) |

### 获取当前汇率(USD/ETH)

***(GET)API接口/api/okex/rate/eth*** **[depracated]**

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其他字段              |
| data    | object  | 当前USD/ETH汇率，详细信息参见(**Websocket[event"okex_eth_rate"]**) |

### 获取币价

***(GET)API接口/api/okex/getTicker***

参数

| 字段         | 类型   | 说明                                                         |
| ------------ | ------ | ------------------------------------------------------------ |
| instrumentId | string | 币对，不填则默认使用"ETM-USDT", 支持["ETM-USDT","BTC-USDT","ETH-USDT"] |

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其它字段              |
| data    | object  | 指定币对的币价详情，详细信息参见(**Websocket[event"/okex/ticker"]**) |

### 获取汇率

***(GET)API接口/api/okex/getRate***

参数

| 字段         | 类型   | 说明                                               |
| ------------ | ------ | -------------------------------------------------- |
| currencyName | string | 币种，不填则默认使用"CNY", 支持["CNY","BTC","ETH"] |

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其它字段              |
| data    | object  | 指定币种汇率，详细信息参见(**Websocket[event"/okex/rate"]**) |

### 获取发行量

***(GET)API接口/api/token/count***

返回值

| 字段    | 类型   | 说明                                                         |
| ------- | ------ | ------------------------------------------------------------ |
| success | string | 请求是否成功；True:成功;False:失败                           |
| error   | string | success=False时返回，success=True时返回其它字段              |
| data    | object | 获取ETM总发行量(暂定为210000000)，格式参见**"TokenCount"**说明 |

*"TokenCount"说明：*

```javascript
{
    "tokenName": "ETM",						// Token名称
    "tokenCount": 210000000				// Token总发行量
}
```

### 获取区块链节点

***(GET)API接口/api/blockchain/servers***

返回值

| 字段    | 类型    | 说明                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| success | boolean | 请求是否成功；True:成功;False:失败                           |
| error   | string  | success=False时返回，success=True时返回其它字段              |
| data    | object  | 获取当前服务器相关的entanmo节点服务器列表，格式参见**"NodeServers"**说明 |

*"NodeServers"说明:*

```javascript
{
  	"servers": [
      	"https://api.entanmo.com",					// entanmo区块链相关的节点服务器信息
    ]
}
```



## Websocket

***(Event)"okex_ticker"*** **[depracated]**

数据

```javascript
{
    "best_ask": "0.2338",
    "best_bid": "0.233",
    "instrument_id": "ETM-USDT",		// 币对信息 ["ETM-USDT","BTC-USDT","ETH-USDT"]
    "product_id": "ETM-USDT",				// 币对信息 ["ETM-USDT","BTC-USDT","ETH-USDT"]
    "last": "0.2334",								// 最新币价
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

***(Event)"okex_rate"*** **[depracated]**

数据

```javascript
{
    "rate": "6.958"			// USD/CNY汇率
}
```

***(Event)"okex_btc_rate"*** **[depracated]**

数据

```javascript
{
    "rate": "0.0001017356094980365"		// USD/BTC汇率
}
```

**(Event)"okex_eth_rate"** **[depracated]**

数据

```javascript
{
    "rate": "0.00557724484104852203"		// USD/ETH汇率
}
```

***(Event)"/okex/ticker"***

数据

```javascript
{
    "best_ask": "0.2338",
    "best_bid": "0.233",
    "instrument_id": "ETM-USDT",		// 币对信息 ["ETM-USDT","BTC-USDT","ETH-USDT"]
    "product_id": "ETM-USDT",				// 币对信息 ["ETM-USDT","BTC-USDT","ETH-USDT"]
    "last": "0.2334",								// 最新币价
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

***(Event)"/okex/rate"***

数据

```javascript
{
    "currencyName": "CNY",			// currencyName, ["CNY","BTC","ETH"]
    "data": {
        "rate": "6.958"
    }
}
```

***(Event)"/blocks/change"***

数据

```javascript
{
  	"height": 4733095				// current height of the block of entanmo blockchain
}
```

***(Event)"/rounds/change"***

数据

```javascript
{
  "number": 10				// current round number
}
```

