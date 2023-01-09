// ===============================================
// fetcher 

export const fetcher =  async (method: string, url: string, token: string|null, args: any) => {
  const res = await fetcheTo(`${process.env.NEXT_PUBLIC_BIBLYSM_API_URL}`, method, url, token, args)
  return res
}

export const fetcherAccounts =  async (method: string, url: string, token: string|null, args: any) => {
  const res = await fetcheTo(`${process.env.NEXT_PUBLIC_ACCOUNTS_API_URL}`, method, url, token, args)
  return res
}

const fetcheTo =  async(server: string, method: string, url: string, token: string|null, args: any) => {
  const headers = new Headers();
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  headers.append('Access-Control-Allow-Origin', '*')
  if (token !== null) {
    headers.append('Authorization', `Bearer ${token}`)
  }
  let query = ""
  const obj = {
    method: method,
    headers: headers
  }
  if (args) {
    if (method == 'get') {
      query = args.join('&')
    } else {
      obj['body'] = JSON.stringify(args)
    }
  }

  const response = await fetch(`${server}/${url}?${query}`, obj)
  .catch(function(error) {
    console.log(error)
    return null
  })
  //const res = await response.json(); //は失敗することがあるので以下の方法 参考:https://stackoverflow.com/questions/45696999/fetch-unexpected-end-of-input
  // と上に書いたが、 response.text() でもエラーになると判明。その場合、response.json()にもどしたら通った。どうする？
  // const string = await response.text()
  // const res = string === "" ? {} : JSON.parse(string)
  let res = null
  // console.log(response)
  //if (response && Object.keys(response).length > 0) {
    res = await response.json()
  //}
  return res;
}
