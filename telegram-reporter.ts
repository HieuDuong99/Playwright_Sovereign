import { Reporter, FullResult } from '@playwright/test/reporter';

class TelegramReporter implements Reporter {
  async onEnd(result: FullResult) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.log('\n⚠️ Bỏ qua gửi Telegram: Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID');
      return;
    }

    const statusEmoji = result.status === 'passed' ? '✅ PASSED' : '❌ FAILED';
    const duration = (result.duration / 1000).toFixed(1);

    const message = `${statusEmoji} *Playwright Local Test Report*\n\n` +
                    `• *Status:* \`${result.status.toUpperCase()}\`\n` +
                    `• *Duration:* \`${duration}s\`\n` +
                    `• *Run Context:* \`Local Machine\``;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (response.ok) {
        console.log('\n📱 Gửi thông báo Telegram thành công!');
      } else {
        console.error('\n⚠️ Lỗi gửi Telegram:', await response.text());
      }
    } catch (error) {
      console.error('\n⚠️ Lỗi kết nối Telegram:', error);
    }
  }
}

export default TelegramReporter;