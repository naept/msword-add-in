const NaeptApi = {

    fetchNaeptApi(url: string, options: object = {}) : Promise<any> {
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

    getSelection() {
      Word.run((context) => {
        let selection = context.document.getSelection().getHtml()

        return context.sync().then(() => {
          return selection
        })
      })
    }
}

export default NaeptApi
