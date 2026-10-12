import { WORKER_API_URL } from './config'

export type ChatResponse = {
  model: string
  answer: string
}

export async function askGemini(message: string): Promise<ChatResponse> {
  const response = await fetch(`${WORKER_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  let payload: unknown = null
  try {
    payload = await response.json()
  } catch {
    // Keep the status-based error below when the Worker returns non-JSON.
  }

  if (!response.ok) {
    const detail = typeof payload === 'object' && payload !== null && 'error' in payload
      ? String(payload.error)
      : `HTTP ${response.status}`
    throw new Error(`APIエラー: ${detail}`)
  }

  if (!isChatResponse(payload)) {
    throw new Error('APIレスポンスの形式が正しくありません。')
  }

  return payload
}

function isChatResponse(value: unknown): value is ChatResponse {
  return typeof value === 'object' && value !== null
    && typeof (value as ChatResponse).model === 'string'
    && typeof (value as ChatResponse).answer === 'string'
}
