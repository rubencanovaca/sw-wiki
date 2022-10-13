import http from '../http-common'

class PeopleService {
  async getPeople (page: number = 0): Promise<any> {
    return await http
      .get(`/people/?page=${page}`)
      .then(response => response.data)
  }

  async get (id: string = ''): Promise<any> {
    return await http
      .get(`/people/${id}/`)
      .then(response => response.data)
  }

  async findByName (name: string = ''): Promise<any> {
    return await http
      .get(`/people/?search=${name}`)
      .then(response => response.data)
  }
}

export default new PeopleService()
