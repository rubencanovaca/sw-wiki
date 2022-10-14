import http from './http-common'

import DataType from '../types/DataType'

class Service {
  async getAll (type: DataType, page: number = 0): Promise<any> {
    return await http
      .get(`/${type}/?page=${page}`)
      .then(response => response.data)
  }

  async get (type: DataType, id: string = ''): Promise<any> {
    return await http
      .get(`/${type}/${id}/`)
      .then(response => response.data)
  }

  async findByName (type: DataType, name: string = ''): Promise<any> {
    return await http
      .get(`/${type}/?search=${name}`)
      .then(response => response.data)
  }
}

export default new Service()
