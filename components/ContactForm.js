/* components/ContactForm.js */
"use client";

import { useState } from 'react';
import { sendContactEmail } from '@/app/actions/contact';

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  async function handleSubmit(formData) {
    setStatus('submitting');
    const result = await sendContactEmail(formData);
    
    if (result.success) {
      setStatus('success');
    } else {
      console.error(result.error);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success">
        <p>お問い合わせありがとうございます。<br/>メッセージは正常に送信されました。</p>
        <button onClick={() => setStatus('idle')} className="text-link">
          戻る
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">お名前</label>
        <input type="text" name="name" id="name" required placeholder="山田 太郎" />
      </div>

      <div className="form-group">
        <label htmlFor="email">メールアドレス</label>
        <input type="email" name="email" id="email" required placeholder="email@example.com" />
      </div>

      <div className="form-group">
        <label htmlFor="message">お問い合わせ内容</label>
        <textarea name="message" id="message" rows="5" required placeholder="ご質問などをご記入ください"></textarea>
      </div>

      <button type="submit" className="embed-btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? '送信中...' : '送信する'}
      </button>

      {status === 'error' && (
        <p className="error-msg">送信に失敗しました。時間をおいて再度お試しください。</p>
      )}
    </form>
  );
}