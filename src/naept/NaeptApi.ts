// import AuthStore from './AuthStore'

const NaeptApi = {

    fetchNaeptApi(url: string, options: object = {}) : Promise<any> {
        return fetch('http://localhost/api/' + url, {
            headers: {
                'Accept'            : 'application/json',
                'Content-Type'      : 'application/json',
                // 'Authorization'     : 'Bearer ' + AuthStore.getAuthToken,
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
    }
}

export default NaeptApi
