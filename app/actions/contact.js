/* app/actions/contact.js */
"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  try {
    const data = await resend.emails.send({
      from: 'Jewelism Market Form <onboarding@resend.dev>', // 最初はテスト用ドメインでOK
      to: [process.env.CONTACT_EMAIL], // 管理者のアドレスへ送る
      subject: `【お問い合わせ】${name}様より`,
      reply_to: email, // 返信ボタンを押すとユーザーのアドレスになる
      text: `
名前: ${name}
メール: ${email}

お問い合わせ内容:
${message}
      `,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}