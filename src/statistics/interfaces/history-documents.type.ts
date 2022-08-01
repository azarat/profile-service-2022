import { MaintenanceHistoryDocument } from 'src/service-history/schemas/maintenance-history.schema'
import { RefuelingHistoryDocument } from 'src/service-history/schemas/refueling-history.schema'
import { WashHistoryDocument } from 'src/service-history/schemas/wash-history.schema'

export type HistoryDocuments = (
  | RefuelingHistoryDocument
  | WashHistoryDocument
  | MaintenanceHistoryDocument
)[]
