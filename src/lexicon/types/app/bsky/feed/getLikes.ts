/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons.js'
import { isObj, hasProp } from '../../../../util.js'
import { CID } from 'multiformats/cid'
import { HandlerAuth } from '@atproto/xrpc-server'
import * as AppBskyActorDefs from '../actor/defs.js'

export interface QueryParams {
  uri: string
  cid?: string
  limit: number
  cursor?: string
}

export type InputSchema = undefined

export interface OutputSchema {
  uri: string
  cid?: string
  cursor?: string
  likes: Like[]
  [k: string]: unknown
}

export type HandlerInput = undefined

export interface HandlerSuccess {
  encoding: 'application/json'
  body: OutputSchema
  headers?: { [key: string]: string }
}

export interface HandlerError {
  status: number
  message?: string
}

export type HandlerOutput = HandlerError | HandlerSuccess
export type HandlerReqCtx<HA extends HandlerAuth = never> = {
  auth: HA
  params: QueryParams
  input: HandlerInput
  req: express.Request
  res: express.Response
}
export type Handler<HA extends HandlerAuth = never> = (
  ctx: HandlerReqCtx<HA>,
) => Promise<HandlerOutput> | HandlerOutput

export interface Like {
  indexedAt: string
  createdAt: string
  actor: AppBskyActorDefs.ProfileView
  [k: string]: unknown
}

export function isLike(v: unknown): v is Like {
  return (
    isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.feed.getLikes#like'
  )
}

export function validateLike(v: unknown): ValidationResult {
  return lexicons.validate('app.bsky.feed.getLikes#like', v)
}
