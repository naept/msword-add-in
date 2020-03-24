
const NaeptApi = {

    fetchNaeptApi(url: string, options: object = {}) : Promise<any> {
        // return fetch('https://app.stage.naept.com/api/' + url, {
        return fetch('http://localhost/api/' + url, {
            headers: {
                'Accept'            : 'application/json',
                'Content-Type'      : 'application/json',
                'Authorization'     : 'Bearer ' + localStorage.getItem('API_Key'),
            },
            ...options
        })
        .then(response => {
          let json = response.json()
          if (response.ok) {
            return json
          } else {
            return json.then(err => {throw err})
          }
        })
    },
}

export default NaeptApi
