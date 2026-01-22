document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const welcomeScreen = document.getElementById('welcome-screen');

    // 状态锁，防止重复发送
    let isGenerating = false;

    // 监听发送按钮点击
    sendBtn.addEventListener('click', () => handleSend());

    // 监听回车键
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !isGenerating) {
            handleSend();
        }
    });

    // 主发送处理逻辑
    function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // 1. 隐藏欢迎屏
        if (welcomeScreen) welcomeScreen.style.display = 'none';

        // 2. 显示用户消息
        appendMessage('user', text);
        userInput.value = '';
        isGenerating = true;
        updateUIState(true); // 禁用输入框

        // 3. 核心逻辑：发送并获取响应
        sendMessage(text);
    }

    /**
     * 核心发送函数 (包含 Mock 逻辑和 fetch 预留)
     */
    async function sendMessage(userText) {
        // A. 模拟 "正在输入..." 的占位符 ID
        const loadingId = 'loading-' + Date.now();
        appendLoadingIndicator(loadingId);

        try {
            // ============================================
            // TODO: 后端 API 连接位置
            // const response = await fetch('YOUR_API_ENDPOINT', {
            //     method: 'POST',
            //     body: JSON.stringify({ prompt: userText }),
            //     headers: { 'Content-Type': 'application/json' }
            // });
            // const data = await response.json();
            // ============================================

            // B. Mock 延迟 (模拟 AI 思考 1.5秒)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // C. 移除 loading 状态
            removeMessage(loadingId);

            // D. Mock 温馨回复
            const mockResponses = [
                "我听到了你的心声。这听起来确实不容易，但你处理得很好。",
                "你能告诉我更多关于这种感觉的细节吗？我就在这里陪着你。",
                "有时候，深呼吸一下会好很多。你现在感觉身体哪里比较紧绷吗？",
                "这是一个非常深刻的洞察。谢谢你愿意信任我并分享这些。",
                "你是gay吧"
            ];
            const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

            // E. 显示 AI 回复
            appendMessage('ai', randomResponse);

        } catch (error) {
            console.error('Error:', error);
            removeMessage(loadingId);
            appendMessage('ai', '抱歉，我好像稍微走神了，请再试一次。');
        } finally {
            isGenerating = false;
            updateUIState(false); // 恢复输入框
        }
    }

    // --- 辅助函数：渲染消息 ---
    function appendMessage(role, text) {
        const div = document.createElement('div');
        div.className = `flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'} message-animate`;

        // 根据角色设置不同的气泡样式
        const bubbleClass = role === 'user' 
            ? 'bg-gray-100 text-gray-800 rounded-2xl rounded-tr-none' // 用户样式
            : 'bg-transparent text-gray-800'; // AI 样式 (类似 Gemini 也是无背景或透明背景)

        // 如果是 AI，添加一个小图标
        const avatar = role === 'ai' 
            ? `<div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-teal-300 flex-shrink-0 mr-3 flex items-center justify-center text-white text-xs font-bold">G</div>` 
            : '';

        div.innerHTML = `
            <div class="flex max-w-[80%] md:max-w-[70%] items-start">
                ${avatar}
                <div class="${bubbleClass} px-5 py-3 text-base leading-7">
                    ${text}
                </div>
            </div>
        `;

        chatContainer.appendChild(div);
        scrollToBottom();
    }

    // --- 辅助函数：显示加载动画 ---
    function appendLoadingIndicator(id) {
        const div = document.createElement('div');
        div.id = id;
        div.className = `flex w-full justify-start message-animate`;
        div.innerHTML = `
            <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-teal-300 flex-shrink-0 mr-3 flex items-center justify-center text-white text-xs font-bold">G</div>
                <div class="px-5 py-4">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatContainer.appendChild(div);
        scrollToBottom();
    }

    // --- 辅助函数：移除消息 (用于替换 loading) ---
    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // --- 辅助函数：滚动到底部 ---
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // --- 辅助函数：UI 状态切换 ---
    function updateUIState(isLoading) {
        sendBtn.disabled = isLoading;
        userInput.disabled = isLoading;
        if (!isLoading) {
            userInput.focus();
        }
    }
});