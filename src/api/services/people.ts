import http from '../http-common'

class PeopleService {
  async getPeople (page: number = 0): Promise<any> {
    return await http
      .get(`https://swapi.dev/api/people/?page=${page}`)
      .then(response => response.data)
  }

  /*
  async get (id: string) {
    return http.get<IPeopleData>(`/people/${id}/`)
  }

  async findByName (name: string) {
    return http.get<IPeopleData[]>(`/people/?search=${name}`)
  }
  */
}

export default new PeopleService()
