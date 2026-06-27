import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdSearch,
    MdAgriculture,
    MdClose,
    MdCheckCircle,
    MdWarning,
    MdError
} from 'react-icons/md'
import Select from '../components/common/Select'

function Management() {
    // Mock data - replace with API later
    const [plants, setPlants] = useState([
        {
            id: 1,
            name: 'حقل طماطم 1',
            type: 'طماطم',
            planting_date: '2026-05-15',
            quantity: 500,
            health_status: 'سليم',
            notes: 'زراعة ربيعية - نمو جيد'
        },
        {
            id: 2,
            name: 'بستان تفاح',
            type: 'تفاح',
            planting_date: '2026-03-20',
            quantity: 200,
            health_status: 'مصاب',
            notes: 'ظهور بقع بنية على الأوراق'
        },
        {
            id: 3,
            name: 'حقل بطاطا',
            type: 'بطاطا',
            planting_date: '2026-06-01',
            quantity: 1000,
            health_status: 'تحت المراقبة',
            notes: 'مراقبة بعد هطول أمطار غزيرة'
        }
    ])

    const [showForm, setShowForm] = useState(false)
    const [editingPlant, setEditingPlant] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        planting_date: '',
        quantity: '',
        health_status: 'سليم',
        notes: ''
    })
    const [errors, setErrors] = useState({})

    const cropTypes = ['طماطم', 'بطاطا', 'تفاح']
    const healthStatuses = ['سليم', 'مصاب', 'تحت المراقبة']

    // Filter plants by search
    const filteredPlants = plants.filter(plant =>
        plant.name.includes(searchTerm) ||
        plant.type.includes(searchTerm) ||
        plant.health_status.includes(searchTerm)
    )

    // Open form for adding
    const handleAdd = () => {
        setEditingPlant(null)
        setFormData({
            name: '',
            type: '',
            planting_date: '',
            quantity: '',
            health_status: 'سليم',
            notes: ''
        })
        setErrors({})
        setShowForm(true)
    }

    // Open form for editing
    const handleEdit = (plant) => {
        setEditingPlant(plant)
        setFormData({
            name: plant.name,
            type: plant.type,
            planting_date: plant.planting_date,
            quantity: plant.quantity.toString(),
            health_status: plant.health_status,
            notes: plant.notes
        })
        setErrors({})
        setShowForm(true)
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'اسم الدفعة مطلوب'
        }

        if (!formData.type) {
            newErrors.type = 'نوع المحصول مطلوب'
        }

        if (!formData.planting_date) {
            newErrors.planting_date = 'تاريخ الزراعة مطلوب'
        } else {
            const selectedDate = new Date(formData.planting_date)
            const today = new Date()
            today.setHours(23, 59, 59, 999)
            if (selectedDate > today) {
                newErrors.planting_date = 'لا يمكن تحديد تاريخ في المستقبل'
            }
        }

        if (!formData.quantity || parseInt(formData.quantity) < 1) {
            newErrors.quantity = 'الكمية يجب أن تكون أكبر من صفر'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) return

        if (editingPlant) {
            // Update existing plant
            setPlants(prev => prev.map(plant =>
                plant.id === editingPlant.id
                    ? { ...plant, ...formData, quantity: parseInt(formData.quantity) }
                    : plant
            ))
            toast.success('تم تحديث الدفعة بنجاح')
        } else {
            // Add new plant
            const newPlant = {
                id: Date.now(),
                ...formData,
                quantity: parseInt(formData.quantity)
            }
            setPlants(prev => [...prev, newPlant])
            toast.success('تم إضافة الدفعة بنجاح')
        }

        setShowForm(false)
        setEditingPlant(null)
    }

    // Handle delete
    const handleDelete = (plant) => {
        setPlants(prev => prev.filter(p => p.id !== plant.id))
        setDeleteConfirm(null)
        toast.success('تم حذف الدفعة بنجاح')
    }

    // Get health status style
    const getHealthStyle = (status) => {
        switch (status) {
            case 'سليم':
                return {
                    bg: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)',
                    icon: <MdCheckCircle size={14} />
                }
            case 'مصاب':
                return {
                    bg: 'var(--md-sys-color-error-container)',
                    color: 'var(--md-sys-color-on-error-container)',
                    icon: <MdError size={14} />
                }
            case 'تحت المراقبة':
                return {
                    bg: '#FFF3E0',
                    color: '#ED6C02',
                    icon: <MdWarning size={14} />
                }
            default:
                return {
                    bg: 'var(--md-sys-color-surface-variant)',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    icon: <MdCheckCircle size={14} />
                }
        }
    }

    return (
        <div>
            <div className="page-header">
                <h1>🌾 إدارة دفعات النباتات</h1>
                <p>إدارة سجلات النباتات والدفعات الزراعية - إضافة، تعديل، وحذف</p>
            </div>

            {/* Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    gap: '16px',
                    flexWrap: 'wrap'
                }}
            >
                {/* Search */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flex: 1,
                    maxWidth: '400px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: 'var(--md-sys-color-surface)',
                    border: '1px solid var(--md-sys-color-outline-variant)'
                }}>
                    <MdSearch style={{ color: 'var(--md-sys-color-outline)', fontSize: '20px' }} />
                    <input
                        type="text"
                        placeholder="بحث عن دفعة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            flex: 1,
                            fontSize: '14px',
                            fontFamily: 'Cairo, sans-serif',
                            color: 'var(--md-sys-color-on-surface)'
                        }}
                    />
                    {searchTerm && (
                        <MdClose
                            onClick={() => setSearchTerm('')}
                            style={{ cursor: 'pointer', color: 'var(--md-sys-color-outline)' }}
                        />
                    )}
                </div>

                {/* Add Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px' }}
                >
                    <MdAdd /> إضافة دفعة جديدة
                </motion.button>
            </motion.div>

            {/* Plants Table */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{
                                background: 'var(--md-sys-color-primary-container)',
                                color: 'var(--md-sys-color-on-primary-container)'
                            }}>
                                <th style={thStyle}>اسم الدفعة</th>
                                <th style={thStyle}>نوع المحصول</th>
                                <th style={thStyle}>تاريخ الزراعة</th>
                                <th style={thStyle}>الكمية</th>
                                <th style={thStyle}>الحالة الصحية</th>
                                <th style={thStyle}>ملاحظات</th>
                                <th style={thStyle}>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredPlants.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ padding: '60px', textAlign: 'center' }}>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <MdAgriculture style={{ fontSize: '48px', color: 'var(--md-sys-color-outline)', marginBottom: '12px' }} />
                                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '16px', fontWeight: 500 }}>
                                                    {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد دفعات مسجلة'}
                                                </p>
                                                <p style={{ color: 'var(--md-sys-color-outline)', fontSize: '14px', marginTop: '4px' }}>
                                                    {searchTerm ? 'جرب كلمة بحث مختلفة' : 'قم بإضافة دفعة جديدة للبدء'}
                                                </p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPlants.map((plant, index) => (
                                        <motion.tr
                                            key={plant.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            style={{
                                                borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                                                background: index % 2 === 0 ? 'transparent' : 'var(--md-sys-color-surface-container-low)'
                                            }}
                                            whileHover={{
                                                background: 'var(--md-sys-color-surface-variant)'
                                            }}
                                        >
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 600 }}>{plant.name}</span>
                                            </td>
                                            <td style={tdStyle}>{plant.type}</td>
                                            <td style={tdStyle}>{plant.planting_date}</td>
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 600 }}>
                                                    {plant.quantity.toLocaleString()}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    background: getHealthStyle(plant.health_status).bg,
                                                    color: getHealthStyle(plant.health_status).color
                                                }}>
                                                    {getHealthStyle(plant.health_status).icon}
                                                    {plant.health_status}
                                                </span>
                                            </td>
                                            <td style={{
                                                ...tdStyle,
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {plant.notes || '-'}
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(plant)}
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            background: 'var(--md-sys-color-secondary-container)',
                                                            color: 'var(--md-sys-color-on-secondary-container)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '16px'
                                                        }}
                                                        title="تعديل"
                                                    >
                                                        <MdEdit />
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setDeleteConfirm(plant)}
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            background: 'var(--md-sys-color-error-container)',
                                                            color: 'var(--md-sys-color-on-error-container)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '16px'
                                                        }}
                                                        title="حذف"
                                                    >
                                                        <MdDelete />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '20px'
            }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', marginBottom: '8px' }}>
                        إجمالي الدفعات
                    </p>
                    <h3 style={{ color: 'var(--md-sys-color-primary)', fontSize: '28px' }}>
                        {plants.length}
                    </h3>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', marginBottom: '8px' }}>
                        نباتات سليمة
                    </p>
                    <h3 style={{ color: 'var(--md-sys-color-primary)', fontSize: '28px' }}>
                        {plants.filter(p => p.health_status === 'سليم').length}
                    </h3>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', marginBottom: '8px' }}>
                        نباتات مصابة
                    </p>
                    <h3 style={{ color: 'var(--md-sys-color-error)', fontSize: '28px' }}>
                        {plants.filter(p => p.health_status === 'مصاب').length}
                    </h3>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', marginBottom: '8px' }}>
                        إجمالي النباتات
                    </p>
                    <h3 style={{ color: 'var(--md-sys-color-primary)', fontSize: '28px' }}>
                        {plants.reduce((sum, p) => sum + p.quantity, 0).toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowForm(false)}
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
                                maxWidth: '500px',
                                width: '100%',
                                maxHeight: '80vh',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                border: '1px solid var(--md-sys-color-outline-variant)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }}
                        >
                            {/* Fixed Header */}
                            <div style={{
                                padding: '20px 24px',
                                borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexShrink: 0,
                                background: 'var(--md-sys-color-surface)'
                            }}>
                                <h3 style={{ fontWeight: 700, margin: 0 }}>
                                    {editingPlant ? 'تعديل بيانات الدفعة' : 'إضافة دفعة جديدة'}
                                </h3>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '24px',
                                        color: 'var(--md-sys-color-on-surface-variant)',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <MdClose />
                                </motion.button>
                            </div>

                            {/* Scrollable Form Fields */}
                            <div style={{
                                padding: '24px',
                                overflowY: 'auto',
                                flex: 1
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {/* Name */}
                                    <div>
                                        <label style={labelStyle}>اسم الدفعة *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={{
                                                ...inputStyle,
                                                borderColor: errors.name ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline-variant)'
                                            }}
                                            placeholder="مثال: حقل طماطم 1"
                                        />
                                        {errors.name && <span style={errorStyle}>{errors.name}</span>}
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <Select
                                            label="نوع المحصول *"
                                            value={formData.type}
                                            onChange={(value) => setFormData({ ...formData, type: value })}
                                            options={cropTypes.map(type => ({ value: type, label: type }))}
                                            placeholder="اختر نوع المحصول"
                                            error={!!errors.type}
                                        />
                                        {errors.type && <span style={errorStyle}>{errors.type}</span>}
                                    </div>

                                    {/* Planting Date */}
                                    <div>
                                        <label style={labelStyle}>تاريخ الزراعة *</label>
                                        <input
                                            type="date"
                                            value={formData.planting_date}
                                            onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
                                            max={new Date().toISOString().split('T')[0]}
                                            style={{
                                                ...inputStyle,
                                                borderColor: errors.planting_date ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline-variant)'
                                            }}
                                        />
                                        {errors.planting_date && <span style={errorStyle}>{errors.planting_date}</span>}
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label style={labelStyle}>الكمية *</label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            min="1"
                                            style={{
                                                ...inputStyle,
                                                borderColor: errors.quantity ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-outline-variant)'
                                            }}
                                            placeholder="عدد النباتات"
                                        />
                                        {errors.quantity && <span style={errorStyle}>{errors.quantity}</span>}
                                    </div>

                                    {/* Health Status */}
                                    <div>
                                        <Select
                                            label="الحالة الصحية"
                                            value={formData.health_status}
                                            onChange={(value) => setFormData({ ...formData, health_status: value })}
                                            options={healthStatuses.map(status => ({ value: status, label: status }))}
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label style={labelStyle}>ملاحظات</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            rows={3}
                                            style={{ ...inputStyle, resize: 'vertical' }}
                                            placeholder="أي ملاحظات إضافية..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fixed Footer with Buttons */}
                            <div style={{
                                padding: '16px 24px',
                                borderTop: '1px solid var(--md-sys-color-outline-variant)',
                                display: 'flex',
                                gap: '12px',
                                flexShrink: 0,
                                background: 'var(--md-sys-color-surface)'
                            }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
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
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="btn btn-primary"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        border: 'none'
                                    }}
                                >
                                    {editingPlant ? 'تحديث' : 'إضافة'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDeleteConfirm(null)}
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
                            className="card"
                            style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}
                        >
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'var(--md-sys-color-error-container)',
                                color: 'var(--md-sys-color-on-error-container)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                fontSize: '32px'
                            }}>
                                <MdDelete />
                            </div>

                            <h3 style={{ marginBottom: '8px', fontWeight: 700 }}>تأكيد الحذف</h3>
                            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', marginBottom: '24px' }}>
                                هل أنت متأكد من حذف دفعة "{deleteConfirm.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                            </p>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setDeleteConfirm(null)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
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
                                    onClick={() => handleDelete(deleteConfirm)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'var(--md-sys-color-error)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        fontFamily: 'Cairo, sans-serif'
                                    }}
                                >
                                    تأكيد الحذف
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Styles
const thStyle = {
    padding: '16px',
    textAlign: 'right',
    fontSize: '14px',
    fontWeight: 700,
    whiteSpace: 'nowrap'
}

const tdStyle = {
    padding: '14px 16px',
    fontSize: '14px',
    color: 'var(--md-sys-color-on-surface)'
}

const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--md-sys-color-on-surface)'
}

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--md-sys-color-outline-variant)',
    background: 'var(--md-sys-color-surface-container-low)',
    color: 'var(--md-sys-color-on-surface)',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Cairo, sans-serif',
    transition: 'all 0.3s',
}

const errorStyle = {
    color: 'var(--md-sys-color-error)',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
}

export default Management