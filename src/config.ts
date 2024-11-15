import type { db } from './db/index.js'
import { DidResolver } from '@atproto/identity'

export type AppContext = {
  db: typeof db
  didResolver: DidResolver
  cfg: Config
}

export type Config = {
  port: number
  listenhost: string
  hostname: string
  sqliteLocation: string
  subscriptionEndpoint: string
  serviceDid: string
  publisherDid: string
  subscriptionReconnectDelay: number
}
