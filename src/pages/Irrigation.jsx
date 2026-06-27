import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, isSameDay, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import {
    MdWaterDrop,
    MdEdit,
    MdCheckCircle,
    MdCancel,
    MdWarning,
    MdCalendarToday,
    MdClose,
    MdChevronRight,
    MdChevronLeft
} from 'react-icons/md'

function Irrigation() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [showOverrideModal, setShowOverrideModal] = useState(null)
    const [overrideDate, setOverrideDate] = useState('')

    // Mock irrigation schedules
    const [schedules, setSchedules] = useState([
        {
            id: 1,
            plantName: 'حقل طماطم 1',
            cropType: 'طماطم',
            irrigationDate: '2026-06-15',
            baseInterval: 'كل 3 أيام',
            currentInterval: 'كل 3 أيام',
            status: 'scheduled',
            isManualOverride: false,
            healthStatus: 'سليم'
        },
        {
            id: 2,
            plantName: 'بستان تفاح',
            cropType: 'تفاح',
            irrigationDate: '2026-06-18',
            baseInterval: 'كل 5 أيام',
            currentInterval: 'كل 4 أيام',
            status: 'pending_approval',
            proposedChange: {
                from: 'كل 5 أيام',
                to: 'كل 4 أيام',
                reason: 'تم اكتشاف لفحة متأخرة - يُنصح بزيادة وتيرة الري'
            },
            isManualOverride: false,
            healthStatus: 'مصاب'
        },
        {
            id: 3,
            plantName: 'حقل بطاطا',
            cropType: 'بطاطا',
            irrigationDate: '2026-06-20',
            baseInterval: 'كل 4 أيام',
            currentInterval: 'كل 3 أيام',
            status: 'approved',
            isManualOverride: true,
            healthStatus: 'تحت المراقبة',
            overrideReason: 'تعديل يدوي - زيادة الري بسبب موجة حر'
        }
    ])

    // Calendar helpers
    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstDayOfMonth = new Date(year, month, 1).getDay()

        // Adjust for Arabic week (starts Sunday)
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

        const days = []

        // Previous month padding
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const prevDate = new Date(year, month, -i)
            days.push({ date: prevDate, isCurrentMonth: false })
        }

        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true })
        }

        // Next month padding
        const remainingDays = 42 - days.length
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
        }

        return days
    }

    const days = getDaysInMonth(currentMonth)
    const weekDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

    // Get schedules for a specific day
    const getDaySchedules = (date) => {
        return schedules.filter(s => {
            const scheduleDate = parseISO(s.irrigationDate)
            return isSameDay(scheduleDate, date)
        })
    }

    // Get schedule color
    const getScheduleColor = (schedule) => {
        if (schedule.isManualOverride) return '#ED6C02' // Orange
        if (schedule.healthStatus === 'مصاب') return 'var(--md-sys-color-error)' // Red
        if (schedule.status === 'pending_approval') return '#ED6C02' // Warning
        return 'var(--md-sys-color-primary)' // Green
    }

    const getScheduleBg = (schedule) => {
        if (schedule.isManualOverride) return '#FFF3E0'
        if (schedule.healthStatus === 'مصاب') return 'var(--md-sys-color-error-container)'
        if (schedule.status === 'pending_approval') return '#FFF3E0'
        return 'var(--md-sys-color-primary-container)'
    }

    // Navigate months
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    // Handle approve/reject
    const handleApprove = (scheduleId) => {
        setSchedules(prev => prev.map(s =>
            s.id === scheduleId
                ? { ...s, status: 'approved', currentInterval: s.proposedChange.to }
                : s
        ))
        toast.success('تمت الموافقة على التغيير')
    }

    const handleReject = (scheduleId) => {
        setSchedules(prev => prev.map(s =>
            s.id === scheduleId
                ? { ...s, status: 'rejected' }
                : s
        ))
        toast.error('تم رفض التغيير')
    }

    // Handle manual override
    const handleManualOverride = (schedule) => {
        setShowOverrideModal(schedule)
        setOverrideDate(schedule.irrigationDate)
    }

    const saveOverride = () => {
        if (!overrideDate) return

        setSchedules(prev => prev.map(s =>
            s.id === showOverrideModal.id
                ? {
                    ...s,
                    irrigationDate: overrideDate,
                    isManualOverride: true,
                    status: 'approved',
                    overrideReason: 'تعديل يدوي'
                }
                : s
        ))
        setShowOverrideModal(null)
        toast.success('تم تعديل موعد الري')
    }

    // Get upcoming irrigations
    const upcomingIrrigations = schedules
        .filter(s => {
            const date = parseISO(s.irrigationDate)
            return date >= new Date()
        })
        .sort((a, b) => parseISO(a.irrigationDate) - parseISO(b.irrigationDate))

    return (
        <div>
            <div className="page-header">
                <h1>💧 جدولة الري التكيفي</h1>
                <p>إدارة مواعيد الري مع التعديلات التلقائية واليدوية</p>
            </div>

            {/* Notifications for tomorrow */}
            <AnimatePresence>
                {upcomingIrrigations.filter(s => {
                    const tomorrow = addDays(new Date(), 1)
                    return isSameDay(parseISO(s.irrigationDate), tomorrow)
                }).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: '#FFF3E0',
                                color: '#ED6C02',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                fontSize: '14px',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '1px solid #ED6C02'
                            }}
                        >
                            <MdWarning />
                            <span>تنبيه: لديك ري مجدول غداً!</span>
                        </motion.div>
                    )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px' }}>
                {/* Calendar */}
                <div className="card" style={{ padding: '20px' }}>
                    {/* Calendar Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevMonth}
                            style={navButtonStyle}
                        >
                            <MdChevronRight size={24} />
                        </motion.button>

                        <h3 style={{ fontWeight: 700, fontSize: '18px' }}>
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextMonth}
                            style={navButtonStyle}
                        >
                            <MdChevronLeft size={24} />
                        </motion.button>
                    </div>

                    {/* Day names */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px',
                        marginBottom: '4px'
                    }}>
                        {weekDays.map(day => (
                            <div key={day} style={{
                                textAlign: 'center',
                                padding: '8px',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: 'var(--md-sys-color-on-surface-variant)'
                            }}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px'
                    }}>
                        {days.map(({ date, isCurrentMonth }, index) => {
                            const daySchedules = getDaySchedules(date)
                            const isToday = isSameDay(date, new Date())
                            const isSelected = isSameDay(date, selectedDate)

                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDate(date)}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        fontWeight: isToday ? 700 : 400,
                                        opacity: isCurrentMonth ? 1 : 0.3,
                                        background: isSelected
                                            ? 'var(--md-sys-color-primary-container)'
                                            : isToday
                                                ? 'var(--md-sys-color-surface-variant)'
                                                : 'transparent',
                                        color: isSelected
                                            ? 'var(--md-sys-color-on-primary-container)'
                                            : 'var(--md-sys-color-on-surface)',
                                        border: isToday && !isSelected
                                            ? '2px solid var(--md-sys-color-primary)'
                                            : '2px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span>{date.getDate()}</span>

                                    {/* Schedule dots */}
                                    {daySchedules.length > 0 && (
                                        <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                                            {daySchedules.map(schedule => (
                                                <div
                                                    key={schedule.id}
                                                    style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: getScheduleColor(schedule)
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--md-sys-color-outline-variant)',
                        flexWrap: 'wrap'
                    }}>
                        <LegendItem color="var(--md-sys-color-primary)" label="ري عادي" />
                        <LegendItem color="var(--md-sys-color-error)" label="نبات مصاب" />
                        <LegendItem color="#ED6C02" label="تعديل يدوي" />
                        <LegendItem color="#ED6C02" label="بانتظار الموافقة" bg="#FFF3E0" />
                    </div>
                </div>

                {/* Schedule List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MdCalendarToday /> جدول الري القادم
                    </h3>

                    <AnimatePresence>
                        {upcomingIrrigations.map((schedule, index) => (
                            <motion.div
                                key={schedule.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card"
                                style={{
                                    padding: '16px',
                                    borderRight: `4px solid ${getScheduleColor(schedule)}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                                            {schedule.plantName}
                                        </h4>
                                        <p style={{ fontSize: '13px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                            {schedule.cropType} • {schedule.currentInterval}
                                        </p>
                                    </div>

                                    {schedule.isManualOverride && (
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            background: '#FFF3E0',
                                            color: '#ED6C02'
                                        }}>
                                            تعديل يدوي
                                        </span>
                                    )}
                                </div>

                                <div style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    background: getScheduleBg(schedule),
                                    color: getScheduleColor(schedule),
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <MdWaterDrop />
                                    {format(parseISO(schedule.irrigationDate), 'yyyy/MM/dd')}
                                </div>

                                {/* Pending Approval Actions */}
                                {schedule.status === 'pending_approval' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            background: '#FFF3E0',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#ED6C02', marginBottom: '4px' }}>
                                            ⚠️ تغيير مقترح
                                        </p>
                                        <p style={{ fontSize: '12px', marginBottom: '4px' }}>
                                            من: {schedule.proposedChange.from} → إلى: {schedule.proposedChange.to}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--md-sys-color-error)', marginBottom: '8px' }}>
                                            {schedule.proposedChange.reason}
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleApprove(schedule.id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'var(--md-sys-color-primary)',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    fontFamily: 'Cairo, sans-serif',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <MdCheckCircle size={16} /> موافق
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleReject(schedule.id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'var(--md-sys-color-error)',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    fontFamily: 'Cairo, sans-serif',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <MdCancel size={16} /> رفض
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Manual Override Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleManualOverride(schedule)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--md-sys-color-outline-variant)',
                                        background: 'transparent',
                                        color: 'var(--md-sys-color-on-surface)',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        fontFamily: 'Cairo, sans-serif',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <MdEdit size={16} /> تعديل يدوي
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {upcomingIrrigations.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                            <MdWaterDrop style={{ fontSize: '48px', color: 'var(--md-sys-color-outline)', marginBottom: '12px' }} />
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                                لا يوجد ري مجدول قادم
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Override Modal */}
            <AnimatePresence>
                {showOverrideModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowOverrideModal(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'var(--md-sys-color-surface)',
                                borderRadius: '16px',
                                maxWidth: '400px',
                                width: '100%',
                                overflow: 'hidden',
                                border: '1px solid var(--md-sys-color-outline-variant)'
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '16px 20px',
                                borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3 style={{ fontWeight: 700, margin: 0 }}>تعديل موعد الري</h3>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowOverrideModal(null)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        color: 'var(--md-sys-color-on-surface-variant)'
                                    }}
                                >
                                    <MdClose />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '20px' }}>
                                <p style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    {showOverrideModal.plantName} - {showOverrideModal.cropType}
                                </p>

                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}>
                                    تاريخ الري الجديد
                                </label>
                                <input
                                    type="date"
                                    value={overrideDate}
                                    onChange={(e) => setOverrideDate(e.target.value)}
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--md-sys-color-outline-variant)',
                                        background: 'var(--md-sys-color-surface-container-low)',
                                        color: 'var(--md-sys-color-on-surface)',
                                        fontSize: '14px',
                                        outline: 'none',
                                        fontFamily: 'Cairo, sans-serif',
                                        marginBottom: '20px'
                                    }}
                                />

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowOverrideModal(null)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--md-sys-color-outline-variant)',
                                            background: 'transparent',
                                            color: 'var(--md-sys-color-on-surface)',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            fontFamily: 'Cairo, sans-serif'
                                        }}
                                    >
                                        إلغاء
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={saveOverride}
                                        className="btn btn-primary"
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            border: 'none'
                                        }}
                                    >
                                        حفظ التعديل
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Legend Item Component
function LegendItem({ color, label, bg }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: color
            }} />
            <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {label}
            </span>
        </div>
    )
}

const navButtonStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'var(--md-sys-color-surface-variant)',
    color: 'var(--md-sys-color-on-surface)',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Cairo, sans-serif'
}

export default Irrigation