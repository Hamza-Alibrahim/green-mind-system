import { useState, useEffect } from 'react'
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [showOverrideModal, setShowOverrideModal] = useState(null)
    const [overrideDate, setOverrideDate] = useState('')

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const [schedules, setSchedules] = useState([
        {
            id: 1, plantName: 'حقل طماطم 1', cropType: 'طماطم',
            irrigationDate: '2026-06-15', baseInterval: 'كل 3 أيام',
            currentInterval: 'كل 3 أيام', status: 'scheduled',
            isManualOverride: false, healthStatus: 'سليم'
        },
        {
            id: 2, plantName: 'بستان تفاح', cropType: 'تفاح',
            irrigationDate: '2026-06-18', baseInterval: 'كل 5 أيام',
            currentInterval: 'كل 4 أيام', status: 'pending_approval',
            proposedChange: { from: 'كل 5 أيام', to: 'كل 4 أيام', reason: 'تم اكتشاف لفحة متأخرة - يُنصح بزيادة وتيرة الري' },
            isManualOverride: false, healthStatus: 'مصاب'
        },
        {
            id: 3, plantName: 'حقل بطاطا', cropType: 'بطاطا',
            irrigationDate: '2026-06-20', baseInterval: 'كل 4 أيام',
            currentInterval: 'كل 3 أيام', status: 'approved',
            isManualOverride: true, healthStatus: 'تحت المراقبة',
            overrideReason: 'تعديل يدوي - زيادة الري بسبب موجة حر'
        }
    ])

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
        const days = []
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true })
        }
        const remainingDays = 42 - days.length
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
        }
        return days
    }

    const days = getDaysInMonth(currentMonth)
    const weekDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

    const getDaySchedules = (date) => schedules.filter(s => isSameDay(parseISO(s.irrigationDate), date))

    const getScheduleColor = (schedule) => {
        if (schedule.isManualOverride) return '#ED6C02'
        if (schedule.healthStatus === 'مصاب') return 'var(--md-sys-color-error)'
        if (schedule.status === 'pending_approval') return '#ED6C02'
        return 'var(--md-sys-color-primary)'
    }

    const getScheduleBg = (schedule) => {
        if (schedule.isManualOverride) return '#FFF3E0'
        if (schedule.healthStatus === 'مصاب') return 'var(--md-sys-color-error-container)'
        if (schedule.status === 'pending_approval') return '#FFF3E0'
        return 'var(--md-sys-color-primary-container)'
    }

    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

    const handleApprove = (scheduleId) => {
        setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status: 'approved', currentInterval: s.proposedChange.to } : s))
        toast.success('تمت الموافقة على التغيير')
    }

    const handleReject = (scheduleId) => {
        setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status: 'rejected' } : s))
        toast.error('تم رفض التغيير')
    }

    const handleManualOverride = (schedule) => {
        setShowOverrideModal(schedule)
        setOverrideDate(schedule.irrigationDate)
    }

    const saveOverride = () => {
        if (!overrideDate) return
        setSchedules(prev => prev.map(s => s.id === showOverrideModal.id ? { ...s, irrigationDate: overrideDate, isManualOverride: true, status: 'approved', overrideReason: 'تعديل يدوي' } : s))
        setShowOverrideModal(null)
        toast.success('تم تعديل موعد الري')
    }

    const upcomingIrrigations = schedules
        .filter(s => parseISO(s.irrigationDate) >= new Date())
        .sort((a, b) => parseISO(a.irrigationDate) - parseISO(b.irrigationDate))

    const tomorrowIrrigations = upcomingIrrigations.filter(s => isSameDay(parseISO(s.irrigationDate), addDays(new Date(), 1)))

    return (
        <div>
            <div className="page-header">
                <h1>💧 جدولة الري التكيفي</h1>
                <p>إدارة مواعيد الري مع التعديلات التلقائية واليدوية</p>
            </div>

            {/* Notifications */}
            <AnimatePresence>
                {tomorrowIrrigations.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#FFF3E0', color: '#ED6C02', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ED6C02' }}>
                        <MdWarning /> <span>تنبيه: لديك ري مجدول غداً!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Grid - stacks on mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px', gap: '20px' }}>
                {/* Calendar */}
                <div className="card" style={{ padding: isMobile ? '12px' : '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevMonth} style={navButtonStyle}>
                            <MdChevronRight size={isMobile ? 20 : 24} />
                        </motion.button>
                        <h3 style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '18px' }}>
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextMonth} style={navButtonStyle}>
                            <MdChevronLeft size={isMobile ? 20 : 24} />
                        </motion.button>
                    </div>

                    {/* Day names */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '2px' }}>
                        {weekDays.map(day => (
                            <div key={day} style={{ textAlign: 'center', padding: '6px 2px', fontSize: isMobile ? '10px' : '13px', fontWeight: 700, color: 'var(--md-sys-color-on-surface-variant)' }}>
                                {isMobile ? day.charAt(0) : day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? '2px' : '4px' }}>
                        {days.map(({ date, isCurrentMonth }, index) => {
                            const daySchedules = getDaySchedules(date)
                            const isToday = isSameDay(date, new Date())
                            const isSelected = isSameDay(date, selectedDate)
                            return (
                                <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDate(date)}
                                    style={{
                                        aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', borderRadius: isMobile ? '8px' : '12px',
                                        fontSize: isMobile ? '11px' : '14px', fontWeight: isToday ? 700 : 400,
                                        opacity: isCurrentMonth ? 1 : 0.3,
                                        background: isSelected ? 'var(--md-sys-color-primary-container)' : isToday ? 'var(--md-sys-color-surface-variant)' : 'transparent',
                                        color: isSelected ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                                        border: isToday && !isSelected ? '2px solid var(--md-sys-color-primary)' : '2px solid transparent',
                                        transition: 'all 0.2s'
                                    }}>
                                    <span>{date.getDate()}</span>
                                    {daySchedules.length > 0 && (
                                        <div style={{ display: 'flex', gap: '2px', marginTop: '1px' }}>
                                            {daySchedules.map(schedule => (
                                                <div key={schedule.id} style={{ width: isMobile ? '4px' : '6px', height: isMobile ? '4px' : '6px', borderRadius: '50%', background: getScheduleColor(schedule) }} />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: isMobile ? '8px' : '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--md-sys-color-outline-variant)', flexWrap: 'wrap' }}>
                        <LegendItem color="var(--md-sys-color-primary)" label="ري عادي" isMobile={isMobile} />
                        <LegendItem color="var(--md-sys-color-error)" label="نبات مصاب" isMobile={isMobile} />
                        <LegendItem color="#ED6C02" label="تعديل يدوي" isMobile={isMobile} />
                        <LegendItem color="#ED6C02" label="بانتظار الموافقة" isMobile={isMobile} />
                    </div>
                </div>

                {/* Schedule List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MdCalendarToday /> جدول الري القادم
                    </h3>

                    <AnimatePresence>
                        {upcomingIrrigations.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                                <MdWaterDrop style={{ fontSize: '48px', color: 'var(--md-sys-color-outline)', marginBottom: '12px' }} />
                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>لا يوجد ري مجدول قادم</p>
                            </div>
                        ) : (
                            upcomingIrrigations.map((schedule, index) => (
                                <motion.div key={schedule.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                    className="card" style={{ padding: '14px', borderRight: `4px solid ${getScheduleColor(schedule)}` }}>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                        <div>
                                            <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>{schedule.plantName}</h4>
                                            <p style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>{schedule.cropType} • {schedule.currentInterval}</p>
                                        </div>
                                        {schedule.isManualOverride && (
                                            <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: '#FFF3E0', color: '#ED6C02', whiteSpace: 'nowrap' }}>تعديل يدوي</span>
                                        )}
                                    </div>

                                    <div style={{ padding: '8px 12px', borderRadius: '8px', background: getScheduleBg(schedule), color: getScheduleColor(schedule), fontSize: '13px', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MdWaterDrop /> {format(parseISO(schedule.irrigationDate), 'yyyy/MM/dd')}
                                    </div>

                                    {schedule.status === 'pending_approval' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            style={{ padding: '10px', borderRadius: '8px', background: '#FFF3E0', marginBottom: '8px' }}>
                                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#ED6C02', marginBottom: '4px' }}>⚠️ تغيير مقترح</p>
                                            <p style={{ fontSize: '11px', marginBottom: '2px' }}>من: {schedule.proposedChange.from} → إلى: {schedule.proposedChange.to}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--md-sys-color-error)', marginBottom: '8px' }}>{schedule.proposedChange.reason}</p>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleApprove(schedule.id)}
                                                    style={approveBtnStyle}><MdCheckCircle size={14} /> موافق</motion.button>
                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleReject(schedule.id)}
                                                    style={rejectBtnStyle}><MdCancel size={14} /> رفض</motion.button>
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleManualOverride(schedule)}
                                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--md-sys-color-outline-variant)', background: 'transparent', color: 'var(--md-sys-color-on-surface)', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <MdEdit size={14} /> تعديل يدوي
                                    </motion.button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Manual Override Modal */}
            <AnimatePresence>
                {showOverrideModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowOverrideModal(null)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: 'var(--md-sys-color-surface)', borderRadius: '16px', maxWidth: '400px', width: '100%', overflow: 'hidden', border: '1px solid var(--md-sys-color-outline-variant)' }}>

                            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontWeight: 700, margin: 0, fontSize: '16px' }}>تعديل موعد الري</h3>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowOverrideModal(null)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--md-sys-color-on-surface-variant)' }}><MdClose /></motion.button>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <p style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    {showOverrideModal.plantName} - {showOverrideModal.cropType}
                                </p>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>تاريخ الري الجديد</label>
                                <input type="date" value={overrideDate} onChange={(e) => setOverrideDate(e.target.value)}
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--md-sys-color-outline-variant)', background: 'var(--md-sys-color-surface-container-low)', color: 'var(--md-sys-color-on-surface)', fontSize: '14px', outline: 'none', fontFamily: 'Cairo, sans-serif', marginBottom: '20px' }} />

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowOverrideModal(null)}
                                        style={cancelBtnStyle}>إلغاء</motion.button>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveOverride}
                                        className="btn btn-primary" style={{ flex: 1, padding: '10px', justifyContent: 'center', fontSize: '14px', border: 'none' }}>حفظ التعديل</motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function LegendItem({ color, label, isMobile }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: isMobile ? '10px' : '12px' }}>
            <div style={{ width: isMobile ? '8px' : '10px', height: isMobile ? '8px' : '10px', borderRadius: '50%', background: color }} />
            <span style={{ color: 'var(--md-sys-color-on-surface-variant)', whiteSpace: 'nowrap' }}>{label}</span>
        </div>
    )
}

const navButtonStyle = { width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: 'var(--md-sys-color-surface-variant)', color: 'var(--md-sys-color-on-surface)', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const approveBtnStyle = { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--md-sys-color-primary)', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }
const rejectBtnStyle = { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--md-sys-color-error)', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }
const cancelBtnStyle = { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--md-sys-color-outline-variant)', background: 'transparent', color: 'var(--md-sys-color-on-surface)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'Cairo, sans-serif' }

export default Irrigation