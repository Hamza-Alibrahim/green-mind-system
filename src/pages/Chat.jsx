import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
    MdSend,
    MdRefresh,
    MdWarning,
    MdAgriculture,
    MdPerson
} from 'react-icons/md'

function Chat() {
    const location = useLocation()
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sessionTurns, setSessionTurns] = useState(0)
    const messagesEndRef = useRef(null)

    const MAX_TURNS = 5

    // Handle context from diagnosis page
    useEffect(() => {
        if (location.state?.context) {
            const contextMessage = {
                id: Date.now(),
                text: location.state.context,
                sender: 'user',
                timestamp: new Date().toISOString(),
                isContext: true
            }

            setMessages([contextMessage])
            setSessionTurns(1)

            // Auto-send to bot
            handleBotResponse(location.state.context)

            // Clear the state so it doesn't repeat on refresh
            window.history.replaceState({}, document.title)
        }
    }, [location.state])

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleBotResponse = async (userMessage) => {
        setIsLoading(true)

        // Simulate API call (replace with real Ollama API later)
        setTimeout(() => {
            const botResponse = {
                id: Date.now(),
                text: generateMockResponse(userMessage),
                sender: 'bot',
                timestamp: new Date().toISOString(),
                source: 'نشرة وزارة الزراعة السورية - إدارة وقاية النباتات 2024'
            }

            setMessages(prev => [...prev, botResponse])
            setIsLoading(false)
        }, 2000)
    }

    // Mock response generator (replace with real AI)
    const generateMockResponse = (question) => {
        if (question.includes('لفحة') || question.includes('متأخرة')) {
            return 'مرض اللفحة المتأخرة من أخطر الأمراض التي تصيب الطماطم والبطاطا. ينتشر في الظروف الرطبة ودرجات الحرارة المعتدلة. تشمل طرق المكافحة: استخدام أصناف مقاومة، تجنب الري العلوي، وتطبيق المبيدات الفطرية الوقائية كل 7-10 أيام.'
        }
        if (question.includes('علاج') || question.includes('مبيد')) {
            return 'توصي وزارة الزراعة السورية باستخدام المبيدات الفطرية المحتوية على مانكوزيب أو كلوروثالونيل للوقاية من الأمراض الفطرية. يجب اتباع التعليمات الموجودة على العبوة ومراعاة فترة الأمان قبل الحصاد.'
        }
        if (question.includes('ري') || question.includes('ماء')) {
            return 'يعتمد جدول الري على نوع المحصول ومرحلة النمو والظروف الجوية. الطماطم تحتاج للري كل 3-4 أيام، البطاطا كل 4-5 أيام، والتفاح كل 5-7 أيام. يجب تعديل الجدول حسب رطوبة التربة ودرجة الحرارة.'
        }
        return 'بناءً على المعلومات المتوفرة في قاعدة المعرفة، يُنصح بمراقبة النباتات بانتظام والكشف المبكر عن أي أعراض غير طبيعية. للمزيد من المعلومات المحددة، يرجى تحديد نوع المحصول والأعراض التي تلاحظها.'
    }

    const handleSendMessage = (e) => {
        e.preventDefault()

        if (!inputMessage.trim() || isLoading || sessionTurns >= MAX_TURNS) return

        const newMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, newMessage])
        setInputMessage('')
        setSessionTurns(prev => prev + 1)

        handleBotResponse(inputMessage)
    }

    const handleNewSession = () => {
        setMessages([])
        setSessionTurns(0)
        setInputMessage('')
        toast.success('تم بدء محادثة جديدة')
    }

    const suggestedQuestions = [
        'ما هي أمراض الطماطم الشائعة؟',
        'كيف أعالج اللفحة المتأخرة؟',
        'ما هو جدول الري المناسب للبطاطا؟',
        'ما هي أعراض مرض تبقع الأوراق؟'
    ]

    return (
        <div>
            <div className="page-header">
                <h1>💬 الخبير الزراعي الذكي</h1>
                <p>اسأل عن أمراض النباتات وطرق علاجها - مدعوم بقاعدة معرفة وزارة الزراعة السورية</p>
            </div>

            {/* Disclaimer */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'var(--md-sys-color-error-container)',
                    color: 'var(--md-sys-color-on-error-container)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <MdWarning /> الردود هي لأغراض استشارية فقط - لا تغني عن استشارة الخبير المختص
            </motion.div>

            {/* Chat Container */}
            <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 300px)' }}>
                {/* Chat Header */}
                <div style={{
                    padding: '16px 20px',
                    background: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--md-sys-color-outline-variant)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--md-sys-color-primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            <MdAgriculture />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>الخبير الزراعي</h3>
                            <p style={{ fontSize: '12px', opacity: 0.8 }}>
                                {sessionTurns >= MAX_TURNS ? 'انتهت الجلسة' : `متاح - ${MAX_TURNS - sessionTurns} رسائل متبقية`}
                            </p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNewSession}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--md-sys-color-on-primary-container)',
                            cursor: 'pointer',
                            fontSize: '24px',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="محادثة جديدة"
                    >
                        <MdRefresh />
                    </motion.button>
                </div>

                {/* Messages Area */}
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '20px',
                    background: 'var(--md-sys-color-surface-container-low)'
                }}>
                    <AnimatePresence>
                        {messages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <MdAgriculture style={{ fontSize: '64px', color: 'var(--md-sys-color-outline)', marginBottom: '16px' }} />
                                <h3 style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '8px' }}>
                                    مرحباً بك في الخبير الزراعي
                                </h3>
                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', marginBottom: '24px' }}>
                                    اطرح سؤالك حول أمراض النباتات وطرق علاجها
                                </p>

                                {/* Suggested Questions */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxWidth: '500px' }}>
                                    {suggestedQuestions.map((question, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setInputMessage(question)
                                                // Auto submit
                                                setTimeout(() => {
                                                    const fakeEvent = { preventDefault: () => { } }
                                                    handleSendMessage(fakeEvent)
                                                }, 100)
                                            }}
                                            style={{
                                                padding: '10px',
                                                background: 'var(--md-sys-color-surface)',
                                                border: '1px solid var(--md-sys-color-outline-variant)',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                color: 'var(--md-sys-color-on-surface)',
                                                textAlign: 'center',
                                                fontFamily: 'Cairo, sans-serif'
                                            }}
                                        >
                                            {question}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                        marginBottom: '16px'
                                    }}
                                >
                                    {message.sender === 'bot' && (
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'var(--md-sys-color-primary)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginLeft: '8px',
                                            flexShrink: 0
                                        }}>
                                            <MdAgriculture size={18} />
                                        </div>
                                    )}

                                    <div style={{ maxWidth: '70%' }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderRadius: message.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                                            background: message.sender === 'user'
                                                ? 'var(--md-sys-color-primary)'
                                                : 'var(--md-sys-color-surface-container-high)',
                                            color: message.sender === 'user'
                                                ? 'white'
                                                : 'var(--md-sys-color-on-surface)',
                                            fontSize: '14px',
                                            lineHeight: '1.6'
                                        }}>
                                            {message.text}
                                        </div>

                                        {/* Source Reference */}
                                        {message.sender === 'bot' && message.source && (
                                            <p style={{
                                                fontSize: '11px',
                                                color: 'var(--md-sys-color-on-surface-variant)',
                                                marginTop: '4px',
                                                paddingRight: '8px'
                                            }}>
                                                📚 {message.source}
                                            </p>
                                        )}

                                        {/* Timestamp */}
                                        <p style={{
                                            fontSize: '11px',
                                            color: 'var(--md-sys-color-outline)',
                                            marginTop: '2px',
                                            textAlign: message.sender === 'user' ? 'left' : 'right'
                                        }}>
                                            {new Date(message.timestamp).toLocaleTimeString('ar-SY', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    {message.sender === 'user' && (
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'var(--md-sys-color-tertiary)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '8px',
                                            flexShrink: 0
                                        }}>
                                            <MdPerson size={18} />
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>

                    {/* Loading Indicator */}
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    marginBottom: '16px',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'var(--md-sys-color-primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MdAgriculture size={18} />
                                </div>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '4px 16px 16px 16px',
                                    background: 'var(--md-sys-color-surface-container-high)',
                                    display: 'flex',
                                    gap: '4px'
                                }}>
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: 'var(--md-sys-color-on-surface-variant)',
                                                display: 'inline-block'
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form
                    onSubmit={handleSendMessage}
                    style={{
                        padding: '16px 20px',
                        background: 'var(--md-sys-color-surface)',
                        borderTop: '1px solid var(--md-sys-color-outline-variant)',
                        display: 'flex',
                        gap: '12px'
                    }}
                >
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={
                            sessionTurns >= MAX_TURNS
                                ? 'انتهت الجلسة - ابدأ محادثة جديدة'
                                : 'اكتب سؤالك هنا...'
                        }
                        disabled={isLoading || sessionTurns >= MAX_TURNS}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '24px',
                            border: '1px solid var(--md-sys-color-outline-variant)',
                            background: 'var(--md-sys-color-surface-container-low)',
                            color: 'var(--md-sys-color-on-surface)',
                            fontSize: '14px',
                            outline: 'none',
                            fontFamily: 'Cairo, sans-serif'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--md-sys-color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--md-sys-color-outline-variant)'}
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading || sessionTurns >= MAX_TURNS}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: inputMessage.trim() && !isLoading && sessionTurns < MAX_TURNS
                                ? 'var(--md-sys-color-primary)'
                                : 'var(--md-sys-color-outline-variant)',
                            color: 'white',
                            border: 'none',
                            cursor: inputMessage.trim() && !isLoading && sessionTurns < MAX_TURNS
                                ? 'pointer'
                                : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}
                    >
                        <MdSend />
                    </motion.button>
                </form>
            </div>

            {/* Session Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    marginTop: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 4px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Turn counter pill */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: sessionTurns >= MAX_TURNS
                            ? 'var(--md-sys-color-error-container)'
                            : 'var(--md-sys-color-primary-container)',
                        color: sessionTurns >= MAX_TURNS
                            ? 'var(--md-sys-color-on-error-container)'
                            : 'var(--md-sys-color-on-primary-container)',
                        fontSize: '13px',
                        fontWeight: 600
                    }}>
                        <span>💬</span>
                        <span>{sessionTurns} / {MAX_TURNS}</span>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                        width: '120px',
                        height: '6px',
                        background: 'var(--md-sys-color-surface-variant)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            animate={{
                                width: `${(sessionTurns / MAX_TURNS) * 100}%`,
                                background: sessionTurns >= MAX_TURNS
                                    ? 'var(--md-sys-color-error)'
                                    : 'var(--md-sys-color-primary)'
                            }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            style={{
                                height: '100%',
                                borderRadius: '3px'
                            }}
                        />
                    </div>
                </div>

                {/* Status text */}
                <span style={{
                    fontSize: '12px',
                    color: sessionTurns >= MAX_TURNS
                        ? 'var(--md-sys-color-error)'
                        : 'var(--md-sys-color-on-surface-variant)',
                    fontWeight: 500
                }}>
                    {sessionTurns === 0 && 'ابدأ بطرح سؤالك'}
                    {sessionTurns > 0 && sessionTurns < MAX_TURNS && `${MAX_TURNS - sessionTurns} رسائل متبقية`}
                    {sessionTurns >= MAX_TURNS && 'انتهت الجلسة'}
                </span>
            </motion.div>
        </div>
    )
}

export default Chat