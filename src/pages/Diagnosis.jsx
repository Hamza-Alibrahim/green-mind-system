import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
    MdCloudUpload,
    MdDelete,
    MdSearch,
    MdChat,
    MdCheckCircle,
    MdWarning,
    MdError,
    MdImage
} from 'react-icons/md'

function Diagnosis() {
    const navigate = useNavigate()
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [file, setFile] = useState(null)

    // Handle drop
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        setError(null)
        setResult(null)

        // Handle rejected files
        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0]
            if (rejection.errors[0]?.code === 'file-invalid-type') {
                setError('صيغة الملف غير مدعومة. يرجى استخدام PNG أو JPG')
                toast.error('صيغة الملف غير مدعومة')
            } else if (rejection.errors[0]?.code === 'file-too-large') {
                setError('حجم الملف كبير جداً. الحد الأقصى 10 ميغابايت')
                toast.error('حجم الملف كبير جداً')
            }
            return
        }

        // Handle accepted file
        if (acceptedFiles.length > 0) {
            const acceptedFile = acceptedFiles[0]
            setFile(acceptedFile)

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(acceptedFile)

            toast.success('تم تحميل الصورة بنجاح')
        }
    }, [])

    // Dropzone configuration
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
        noClick: !!imagePreview, // Disable click when image is loaded
        noKeyboard: !!imagePreview
    })

    // Remove uploaded image
    const handleRemoveImage = () => {
        setFile(null)
        setImagePreview(null)
        setResult(null)
        setError(null)
    }

    // Handle diagnosis
    const handleDiagnose = async () => {
        if (!file) {
            setError('يرجى تحميل صورة أولاً')
            return
        }

        setLoading(true)
        setError(null)

        // Simulate API call (replace with real API later)
        setTimeout(() => {
            const mockResult = {
                disease_arabic: 'لفحة متأخرة',
                disease_english: 'Late Blight',
                confidence: 92.5,
                treatment: [
                    'إزالة الأوراق المصابة فوراً والتخلص منها',
                    'رش النباتات بمبيد فطري يحتوي على مانكوزيب',
                    'تحسين التهوية بين النباتات',
                    'تجنب الري العلوي للحد من انتشار المرض',
                    'مراقبة النباتات يومياً للكشف المبكر عن الإصابات الجديدة'
                ],
                gradcam_description: 'النموذج ركز على منطقة البقع البنية في الجزء العلوي الأيسر من الورقة'
            }

            setResult(mockResult)
            setLoading(false)
            toast.success('تم التشخيص بنجاح')
        }, 1500)
    }

    // Get confidence color
    const getConfidenceColor = (confidence) => {
        if (confidence >= 90) return { color: 'var(--md-sys-color-primary)', bg: 'var(--md-sys-color-primary-container)', icon: <MdCheckCircle />, label: 'دقة عالية' }
        if (confidence >= 70) return { color: '#ED6C02', bg: '#FFF3E0', icon: <MdWarning />, label: 'دقة متوسطة' }
        return { color: 'var(--md-sys-color-error)', bg: 'var(--md-sys-color-error-container)', icon: <MdError />, label: 'دقة منخفضة' }
    }

    // Navigate to chat with context
    const handleAskExpert = () => {
        navigate('/chat', {
            state: {
                context: `أريد معرفة المزيد عن ${result.disease_arabic} وطرق العلاج`,
                disease: result.disease_arabic
            }
        })
    }

    const confidenceStyle = result ? getConfidenceColor(result.confidence) : null

    return (
        <div>
            <div className="page-header">
                <h1>🔍 تشخيص أمراض النباتات</h1>
                <p>قم بتحميل صورة لورقة النبات لتشخيص المرض والحصول على توصيات العلاج</p>
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
                <MdWarning /> التشخيص الذكي استشاري فقط ولا يغني عن استشارة الخبير الزراعي المختص
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            background: 'var(--md-sys-color-error-container)',
                            color: 'var(--md-sys-color-on-error-container)',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px'
            }}>
                {/* Left Column - Upload */}
                <div>
                    <div className="card">
                        <h3 style={{ marginBottom: '20px', fontWeight: 600 }}>تحميل الصورة</h3>

                        {/* Upload Area - Now with proper drag & drop */}
                        {!imagePreview ? (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        border: `2px dashed ${isDragAccept ? 'var(--md-sys-color-primary)' :
                                            isDragReject ? 'var(--md-sys-color-error)' :
                                                isDragActive ? 'var(--md-sys-color-secondary)' :
                                                    'var(--md-sys-color-outline)'
                                            }`,
                                        borderRadius: '16px',
                                        padding: '60px 20px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: isDragActive ?
                                            (isDragAccept ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-error-container)') :
                                            'var(--md-sys-color-surface-container-low)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <motion.div
                                        animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        {isDragReject ? (
                                            <MdError style={{ fontSize: '48px', color: 'var(--md-sys-color-error)', marginBottom: '16px' }} />
                                        ) : (
                                            <MdCloudUpload style={{
                                                fontSize: '48px',
                                                color: isDragAccept ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                                                marginBottom: '16px'
                                            }} />
                                        )}
                                    </motion.div>

                                    {isDragReject ? (
                                        <>
                                            <h3 style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--md-sys-color-error)' }}>
                                                نوع الملف غير مدعوم
                                            </h3>
                                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px' }}>
                                                يرجى استخدام صورة PNG أو JPG فقط
                                            </p>
                                        </>
                                    ) : isDragAccept ? (
                                        <>
                                            <h3 style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--md-sys-color-primary)' }}>
                                                أفلت الصورة هنا
                                            </h3>
                                            <p style={{ color: 'var(--md-sys-color-primary)', fontSize: '14px' }}>
                                                سيتم تحميل الصورة تلقائياً
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>
                                                اسحب وأفلت الصورة هنا
                                            </h3>
                                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px' }}>
                                                أو انقر للاختيار - PNG أو JPG (الحد الأقصى 10 ميغابايت)
                                            </p>
                                        </>
                                    )}
                                </motion.div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ position: 'relative' }}
                            >
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        maxHeight: '400px',
                                        objectFit: 'contain',
                                        background: 'var(--md-sys-color-surface-container-low)'
                                    }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleRemoveImage}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'var(--md-sys-color-error)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}
                                >
                                    <MdDelete />
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Diagnose Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDiagnose}
                            disabled={!file || loading}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                padding: '16px',
                                fontSize: '16px',
                                justifyContent: 'center',
                                opacity: !file || loading ? 0.5 : 1,
                                cursor: !file || loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        ⏳
                                    </motion.span>
                                    جاري التشخيص...
                                </>
                            ) : (
                                <>
                                    <MdSearch /> تشخيص المرض
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div>
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="card">
                                    <h3 style={{ marginBottom: '20px', fontWeight: 600 }}>نتيجة التشخيص</h3>

                                    {/* Disease Name */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', marginBottom: '4px' }}>
                                            المرض المكتشف:
                                        </p>
                                        <h2 style={{ color: 'var(--md-sys-color-primary)', fontWeight: 800, marginBottom: '4px' }}>
                                            {result.disease_arabic}
                                        </h2>
                                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px' }}>
                                            ({result.disease_english})
                                        </p>
                                    </div>

                                    {/* Confidence Bar */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                                نسبة الثقة:
                                            </span>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                color: confidenceStyle.color,
                                                fontWeight: 700,
                                                fontSize: '18px'
                                            }}>
                                                {confidenceStyle.icon}
                                                {result.confidence}%
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div style={{
                                            width: '100%',
                                            height: '12px',
                                            background: 'var(--md-sys-color-surface-variant)',
                                            borderRadius: '6px',
                                            overflow: 'hidden'
                                        }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${result.confidence}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                style={{
                                                    height: '100%',
                                                    background: confidenceStyle.color,
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        </div>

                                        <div style={{
                                            marginTop: '8px',
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            background: confidenceStyle.bg,
                                            color: confidenceStyle.color,
                                            fontSize: '12px',
                                            fontWeight: 600
                                        }}>
                                            {confidenceStyle.label}
                                        </div>
                                    </div>

                                    {/* Grad-CAM Description */}
                                    <div style={{
                                        marginBottom: '20px',
                                        padding: '12px',
                                        background: 'var(--md-sys-color-surface-container-low)',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: 'var(--md-sys-color-on-surface-variant)'
                                    }}>
                                        💡 {result.gradcam_description}
                                    </div>

                                    {/* Treatment Recommendations */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>توصيات العلاج:</h4>
                                        <div style={{
                                            background: 'var(--md-sys-color-primary-container)',
                                            color: 'var(--md-sys-color-on-primary-container)',
                                            padding: '16px',
                                            borderRadius: '12px'
                                        }}>
                                            {result.treatment.map((step, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 + index * 0.1 }}
                                                    style={{
                                                        display: 'flex',
                                                        gap: '8px',
                                                        marginBottom: index < result.treatment.length - 1 ? '8px' : 0,
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 700 }}>{index + 1}.</span>
                                                    <span>{step}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ask Expert Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAskExpert}
                                        className="btn btn-outline"
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            fontSize: '15px',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <MdChat /> استشر الخبير الزراعي للمزيد
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty State */}
                    {!result && !loading && (
                        <div className="card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '300px',
                            textAlign: 'center'
                        }}>
                            <MdSearch style={{ fontSize: '64px', color: 'var(--md-sys-color-outline)', marginBottom: '16px' }} />
                            <h3 style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '8px' }}>
                                النتائج ستظهر هنا
                            </h3>
                            <p style={{ color: 'var(--md-sys-color-outline)', fontSize: '14px' }}>
                                قم بتحميل صورة واضحة لورقة النبات واضغط على "تشخيص المرض"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Diagnosis