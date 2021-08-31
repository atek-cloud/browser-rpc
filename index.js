import * as jsonrpc from 'jsonrpc-lite'

let _id = 1
export class RpcClient {
  constructor (url) {
    this.$url = url
  }

  $setEndpoint (url) {
    this.$url = url
  }

  async $rpc (methodName, params) {
    const responseBody = await (await fetch(this.$url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(jsonrpc.request(_id++, methodName, removeUndefinedsAtEndOfArray(params)))
    })).json()
    const parsed = jsonrpc.parseObject(responseBody)
    if (parsed.type === 'error') {
      const err = new Error(parsed.payload.error.message)
      err.code = parsed.payload.error.code
      throw err
    } else if (parsed.type === 'success') {
      return parsed.payload.result
    }
  }
}

const rpcProxyHandler = {
  get (client, name) {
    if (name in client) {
      return client[name]
    } else {
      return (...params) => client.$rpc(name, params)
    }
  },
};

export function create (url) {
  const client = url instanceof RpcClient ? url : new RpcClient(url)
  return new Proxy(client, rpcProxyHandler)
}


function removeUndefinedsAtEndOfArray (arr) {
  let len = arr.length
  for (let i = len - 1; i >= 0; i--) {
    if (typeof arr[i] === 'undefined') len--
    else break
  }
  return arr.slice(0, len)
}