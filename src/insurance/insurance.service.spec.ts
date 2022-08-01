import { InsuranceService } from './insurance.service'

describe('InsuranceService', () => {
  let service: InsuranceService

  beforeEach(async () => {
    service = module.get<InsuranceService>(InsuranceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
