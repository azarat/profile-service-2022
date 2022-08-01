import { RefuelingHistoryDocument } from 'src/service-history/schemas/refueling-history.schema'
import { WashHistoryDocument } from 'src/service-history/schemas/wash-history.schema'
import { MaintenanceHistoryDocument } from 'src/service-history/schemas/maintenance-history.schema'

export interface IHistoryDocuments {
  refuelingHistoryRecords: RefuelingHistoryDocument[]
  washHistoryRecords: WashHistoryDocument[]
  maintenanceHistoryRecords: MaintenanceHistoryDocument[]
}
