import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
    MdDownload,
    MdLocalFlorist,
    MdCheckCircle,
    MdError,
    MdWarning,
    MdWaterDrop,
    MdCalendarToday,
    MdTrendingUp
} from 'react-icons/md'
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts'

function Dashboard() {
    const [dateRange, setDateRange] = useState('week')

    // Mock statistics
    const stats = {
        totalPlants: 1700,
        healthyPlants: 1200,
        diseasedPlants: 350,
        monitoredPlants: 150,
        totalDiagnoses: 89,
        avgConfidence: 91.5
    }

    // Disease distribution data
    const diseaseData = [
        { name: 'لفحة متأخرة', value: 35, color: '#D32F2F' },
        { name: 'تبقع الأوراق', value: 25, color: '#ED6C02' },
        { name: 'صدأ الأوراق', value: 15, color: '#FFA000' },
        { name: 'عفن رمادي', value: 12, color: '#7B8D6F' },
        { name: 'بياض دقيقي', value: 8, color: '#4CAF50' },
        { name: 'أخرى', value: 5, color: '#90A4AE' }
    ]

    // Confidence distribution
    const confidenceData = [
        { range: '90-100%', count: 45, fill: '#4CAF50' },
        { range: '80-89%', count: 25, fill: '#8BC34A' },
        { range: '70-79%', count: 12, fill: '#FFA000' },
        { range: '60-69%', count: 5, fill: '#ED6C02' },
        { range: '< 60%', count: 2, fill: '#D32F2F' }
    ]

    // Weekly diagnoses trend
    const weeklyTrend = [
        { day: 'السبت', diagnoses: 12 },
        { day: 'الأحد', diagnoses: 8 },
        { day: 'الإثنين', diagnoses: 15 },
        { day: 'الثلاثاء', diagnoses: 10 },
        { day: 'الأربعاء', diagnoses: 18 },
        { day: 'الخميس', diagnoses: 14 },
        { day: 'الجمعة', diagnoses: 12 }
    ]

    // Upcoming irrigations
    const upcomingIrrigations = [
        { date: '2026-06-15', plant: 'حقل طماطم 1', type: 'طماطم', status: 'مجدد' },
        { date: '2026-06-16', plant: 'بستان تفاح', type: 'تفاح', status: 'بانتظار الموافقة' },
        { date: '2026-06-17', plant: 'حقل بطاطا', type: 'بطاطا', status: 'تعديل يدوي' }
    ]

    // Recent diagnoses
    const recentDiagnoses = [
        { date: '2026-06-14', plant: 'طماطم', disease: 'لفحة متأخرة', confidence: 94 },
        { date: '2026-06-14', plant: 'تفاح', disease: 'تبقع الأوراق', confidence: 88 },
        { date: '2026-06-13', plant: 'بطاطا', disease: 'لفحة متأخرة', confidence: 91 },
        { date: '2026-06-13', plant: 'طماطم', disease: 'سليم', confidence: 97 },
        { date: '2026-06-12', plant: 'تفاح', disease: 'صدأ الأوراق', confidence: 76 }
    ]

    // Handle PDF export
    const handleExportPDF = () => {
        toast.success('جاري تجهيز التقرير...')
        // Will implement actual PDF export later
        setTimeout(() => {
            toast.success('تم تصدير التقرير بنجاح')
        }, 1500)
    }

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>📊 لوحة التحكم</h1>
                    <p>إحصائيات وتقارير النظام</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportPDF}
                    className="btn btn-primary"
                >
                    <MdDownload /> تصدير التقرير PDF
                </motion.button>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <StatsCard
                    icon={<MdLocalFlorist />}
                    label="إجمالي النباتات"
                    value={stats.totalPlants.toLocaleString()}
                    color="var(--md-sys-color-primary)"
                    bg="var(--md-sys-color-primary-container)"
                    delay={0}
                />
                <StatsCard
                    icon={<MdCheckCircle />}
                    label="نباتات سليمة"
                    value={stats.healthyPlants.toLocaleString()}
                    color="#4CAF50"
                    bg="#E8F5E9"
                    delay={0.1}
                />
                <StatsCard
                    icon={<MdError />}
                    label="نباتات مصابة"
                    value={stats.diseasedPlants.toLocaleString()}
                    color="var(--md-sys-color-error)"
                    bg="var(--md-sys-color-error-container)"
                    delay={0.2}
                />
                <StatsCard
                    icon={<MdWarning />}
                    label="تحت المراقبة"
                    value={stats.monitoredPlants.toLocaleString()}
                    color="#ED6C02"
                    bg="#FFF3E0"
                    delay={0.3}
                />
            </div>

            {/* Second row stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <StatsCard
                    icon={<MdTrendingUp />}
                    label="إجمالي التشخيصات"
                    value={stats.totalDiagnoses}
                    color="var(--md-sys-color-secondary)"
                    bg="var(--md-sys-color-secondary-container)"
                    delay={0.4}
                />
                <StatsCard
                    icon={<MdCheckCircle />}
                    label="متوسط الدقة"
                    value={`${stats.avgConfidence}%`}
                    color="var(--md-sys-color-primary)"
                    bg="var(--md-sys-color-primary-container)"
                    delay={0.5}
                />
            </div>

            {/* Charts Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
            }}>
                {/* Disease Distribution Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card"
                >
                    <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '16px' }}>
                        🦠 توزيع الأمراض
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={diseaseData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {diseaseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--md-sys-color-surface)',
                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                    borderRadius: '8px',
                                    fontFamily: 'Cairo, sans-serif',
                                    fontSize: '13px'
                                }}
                            />
                            <Legend
                                wrapperStyle={{
                                    fontFamily: 'Cairo, sans-serif',
                                    fontSize: '12px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Confidence Distribution Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                >
                    <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '16px' }}>
                        📈 توزيع نسبة الثقة
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={confidenceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                            <XAxis
                                dataKey="range"
                                tick={{ fontFamily: 'Cairo', fontSize: 12 }}
                                stroke="var(--md-sys-color-on-surface-variant)"
                            />
                            <YAxis
                                tick={{ fontFamily: 'Cairo', fontSize: 12 }}
                                stroke="var(--md-sys-color-on-surface-variant)"
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--md-sys-color-surface)',
                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                    borderRadius: '8px',
                                    fontFamily: 'Cairo, sans-serif',
                                    fontSize: '13px'
                                }}
                            />
                            <Bar dataKey="count" name="عدد التشخيصات" radius={[8, 8, 0, 0]}>
                                {confidenceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Third Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
            }}>
                {/* Weekly Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                >
                    <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '16px' }}>
                        📅 التشخيصات الأسبوعية
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontFamily: 'Cairo', fontSize: 12 }}
                                stroke="var(--md-sys-color-on-surface-variant)"
                            />
                            <YAxis
                                tick={{ fontFamily: 'Cairo', fontSize: 12 }}
                                stroke="var(--md-sys-color-on-surface-variant)"
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--md-sys-color-surface)',
                                    border: '1px solid var(--md-sys-color-outline-variant)',
                                    borderRadius: '8px',
                                    fontFamily: 'Cairo, sans-serif',
                                    fontSize: '13px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="diagnoses"
                                stroke="var(--md-sys-color-primary)"
                                strokeWidth={3}
                                dot={{ fill: 'var(--md-sys-color-primary)', r: 6 }}
                                activeDot={{ r: 8 }}
                                name="تشخيص"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Recent Diagnoses Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card"
                >
                    <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '16px' }}>
                        🔍 آخر التشخيصات
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--md-sys-color-outline-variant)' }}>
                                    <th style={thStyle}>التاريخ</th>
                                    <th style={thStyle}>النبات</th>
                                    <th style={thStyle}>المرض</th>
                                    <th style={thStyle}>الدقة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentDiagnoses.map((diagnosis, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}
                                    >
                                        <td style={tdStyle}>{diagnosis.date}</td>
                                        <td style={tdStyle}>{diagnosis.plant}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '2px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                background: diagnosis.disease === 'سليم' ? '#E8F5E9' : 'var(--md-sys-color-error-container)',
                                                color: diagnosis.disease === 'سليم' ? '#4CAF50' : 'var(--md-sys-color-on-error-container)'
                                            }}>
                                                {diagnosis.disease}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    flex: 1,
                                                    height: '6px',
                                                    background: 'var(--md-sys-color-surface-variant)',
                                                    borderRadius: '3px',
                                                    overflow: 'hidden',
                                                    maxWidth: '80px'
                                                }}>
                                                    <div style={{
                                                        width: `${diagnosis.confidence}%`,
                                                        height: '100%',
                                                        background: diagnosis.confidence >= 90 ? '#4CAF50' : diagnosis.confidence >= 70 ? '#ED6C02' : '#D32F2F',
                                                        borderRadius: '3px'
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                                                    {diagnosis.confidence}%
                                                </span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Upcoming Irrigation */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="card"
            >
                <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '16px' }}>
                    <MdWaterDrop style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
                    الري القادم
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    {upcomingIrrigations.map((irrigation, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            style={{
                                padding: '16px',
                                borderRadius: '12px',
                                background: 'var(--md-sys-color-surface-container-low)',
                                border: '1px solid var(--md-sys-color-outline-variant)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>{irrigation.plant}</span>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: irrigation.status === 'مجدد' ? '#E8F5E9' : '#FFF3E0',
                                    color: irrigation.status === 'مجدد' ? '#4CAF50' : '#ED6C02'
                                }}>
                                    {irrigation.status}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '13px' }}>
                                <MdCalendarToday />
                                <span>{irrigation.date}</span>
                                <span>•</span>
                                <span>{irrigation.type}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

// Stats Card Component
function StatsCard({ icon, label, value, color, bg, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -4 }}
            className="card"
            style={{ cursor: 'default' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: bg,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                }}>
                    {icon}
                </div>
            </div>
            <p style={{
                fontSize: '14px',
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: '4px'
            }}>
                {label}
            </p>
            <h2 style={{
                fontSize: '28px',
                fontWeight: 800,
                color: color
            }}>
                {value}
            </h2>
        </motion.div>
    )
}

// Table styles
const thStyle = {
    padding: '12px 16px',
    textAlign: 'right',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--md-sys-color-on-surface-variant)'
}

const tdStyle = {
    padding: '12px 16px',
    fontSize: '13px',
    color: 'var(--md-sys-color-on-surface)'
}

export default Dashboard