import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdKeyboardArrowDown } from 'react-icons/md'

function Select({
    value,
    onChange,
    options,
    placeholder = 'اختر...',
    error = false,
    label = ''
}) {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef(null)

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(opt => opt.value === value)

    const handleSelect = (optionValue) => {
        onChange(optionValue)
        setIsOpen(false)
    }

    return (
        <div ref={selectRef} style={{ position: 'relative' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--md-sys-color-on-surface)'
                }}>
                    {label}
                </label>
            )}

            {/* Select Button */}
            <motion.button
                type="button"
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${error ? 'var(--md-sys-color-error)' : isOpen ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'}`,
                    background: 'var(--md-sys-color-surface-container-low)',
                    color: selectedOption ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-outline)',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Cairo, sans-serif',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.2s',
                    textAlign: 'right'
                }}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', color: 'var(--md-sys-color-outline)' }}
                >
                    <MdKeyboardArrowDown size={20} />
                </motion.span>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            right: 0,
                            background: 'var(--md-sys-color-surface)',
                            border: '1px solid var(--md-sys-color-primary)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            zIndex: 100,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            maxHeight: '250px',
                            overflowY: 'auto'
                        }}
                    >
                        {options.map((option) => {
                            const isSelected = option.value === value

                            return (
                                <motion.div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    style={{
                                        padding: '10px 14px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontFamily: 'Cairo, sans-serif',
                                        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                                        transition: 'all 0.15s',
                                        // Selected state - darker
                                        background: isSelected
                                            ? 'var(--md-sys-color-primary-container)'
                                            : 'transparent',
                                        color: isSelected
                                            ? 'var(--md-sys-color-on-primary-container)'
                                            : 'var(--md-sys-color-on-surface)',
                                        fontWeight: isSelected ? 600 : 400,
                                    }}
                                    whileHover={{
                                        // Hover state - lighter
                                        backgroundColor: isSelected
                                            ? 'var(--md-sys-color-primary-container)'  // Keep selected color
                                            : 'rgba(51, 105, 64, 0.1)',  // Very light green
                                        color: isSelected
                                            ? 'var(--md-sys-color-on-primary-container)'
                                            : 'var(--md-sys-color-on-surface)',
                                    }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {option.label}
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Select