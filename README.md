# Atek Browser RPC

A simple JSON-RPC lib for browser client-side code. Uses a proxy object for convenience.

```js
import { create } from '/vendor/atek-browser-rpc.build.js'

const api = create('/_api')
await api.someCall('param1', 'param2') // transplates to json-rpc call with method of `someCall`
```

## Build

```
npm i
npm run build
```

Produces index.build.js.