import { FormEvent, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { askGemini, ChatResponse } from './api'

export default function App() {
  const [message, setMessage] = useState('')
  const [answer, setAnswer] = useState<ChatResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) {
      setError('質問を入力してください。')
      return
    }

    setLoading(true)
    setError('')
    setAnswer(null)
    try {
      setAnswer(await askGemini(trimmed))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '回答の取得に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-shell">
      <header>
        <p className="eyebrow">Discussion with AI</p>
        <h1>Geminiに質問する</h1>
        <p className="intro">質問を入力すると、Cloudflare Worker経由でGeminiから回答を取得します。</p>
      </header>

      <form className="question-card" onSubmit={handleSubmit}>
        <label htmlFor="question">質問</label>
        <textarea
          id="question"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="例：クラウドコンピューティングを初心者向けに説明してください。"
          rows={6}
          disabled={loading}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.currentTarget.form?.requestSubmit()
            }
          }}
        />
        <div className="form-footer">
          <span className="hint">Enterでは送信されません。Ctrl / ⌘ + Enterでも送信できます。</span>
          <button type="submit" disabled={loading}>
            {loading ? '回答を取得中…' : '質問する'}
          </button>
        </div>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      <section className="answer-card" aria-live="polite">
        <div className="section-heading">
          <h2>回答</h2>
          {answer && <span className="model">{answer.model}</span>}
        </div>
        {loading && <p className="status">Geminiに問い合わせています…</p>}
        {!loading && !answer && !error && <p className="placeholder">ここに回答が表示されます。</p>}
        {answer && <div className="markdown"><ReactMarkdown>{answer.answer}</ReactMarkdown></div>}
      </section>
    </main>
  )
}
